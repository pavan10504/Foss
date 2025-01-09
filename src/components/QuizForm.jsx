import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "./ui/progress"; 
import { useUser } from "@clerk/clerk-react";
import { BookOpen } from "lucide-react";
import { useTheme } from '../components/theme';
import  Results from "./results";

const QuizForm =({ onComplete }) => {
  const { isSignedIn, user } = useUser();
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);
  

  const QuizLoader =({ userName }) => {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="relative">
          <BookOpen size={48}/>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-gray-200 rounded-full">
            <div className="w-full h-full bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-lg font-medium text-gray-700 animate-pulse dark:text-gray-200">
          Loading your assessment, {userName}...
        </div>
      </div>
    );
  };

 useEffect(() => {
  let mounted = true;

  const loadAssessment = () => {
    try {
      setLoading(true);
      const savedAssessment = localStorage.getItem("assessmentPlan"+user.firstName);
      if (!savedAssessment || !mounted) return;

      const parsedAssessment = JSON.parse(savedAssessment);
      setAssessment(parsedAssessment);
      setTimeLeft(parsedAssessment.assessmentMetadata.totalTime * 60);
    } catch (err) {
      if (mounted) {
        setError("Error loading assessment: " + err.message);
      }
    }
    finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };

  loadAssessment();

  return () => {
    mounted = false;
  };
}, [user]);
  // Timer effect
  useEffect(() => {
    if (timeLeft === null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (value) => {
    const currentQ = getCurrentQuestion();
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: value
    }));
  };

  const getCurrentSection = () => {
    return assessment?.assessmentSections[currentSection];
  };

  const getCurrentQuestion = () => {
    const section = getCurrentSection();
    return section?.questions[currentQuestion];
  };

  const calculateProgress = () => {
    if (!assessment) return 0;
    const totalQuestions = assessment.assessmentSections.reduce(
      (sum, section) => sum + section.questions.length, 0
    );
    const currentTotal = currentSection * getCurrentSection().questions.length + currentQuestion + 1;
    return (currentTotal / totalQuestions) * 100;
  };

  const renderQuestionContent = (question) => {
    switch (question.questionType) {
      case "MCQ":
        return (
          <RadioGroup
            value={answers[question.id]}
            onValueChange={handleAnswer}
            className="space-y-4"
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <label 
                  htmlFor={`option-${index}`} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        );

      case "PRACTICAL":
      case "SCENARIO":
        return (
          <Textarea
            value={answers[question.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="min-h-[100px]"
          />
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    const section = getCurrentSection();
    if (currentQuestion < section.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else if (currentSection < assessment.assessmentSections.length - 1) {
      setCurrentSection(prev => prev + 1);
      setCurrentQuestion(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      const prevSection = assessment.assessmentSections[currentSection - 1];
      setCurrentQuestion(prevSection.questions.length - 1);
    }
  };

  const handleSubmit = () => {
    const results = {
      answers: {}, // Structured question-answer pairs
      metadata: {
        timeSpent: assessment.assessmentMetadata.totalTime * 60 - timeLeft + " seconds",
        careerGoal: assessment.assessmentMetadata.careerGoal,
        targetGrade: assessment.assessmentMetadata.targetGrade,
        sectionsCompleted: assessment.assessmentSections.map((section) => ({
          sectionName: section.sectionName,
          questionsAnswered: section.questions.filter((q) => answers[q.id]).length,
          totalQuestions: section.totalQuestions,
        })),
      },
    };
  

    assessment.assessmentSections.forEach((section) => {
      section.questions.forEach((question) => {
        results.answers[question.id] = {
          question: question.question,
          type: question.questionType,
          answer: answers[question.id] || "Not Answered", // Use the provided answer or default to "Not Answered"
        };
      });
    });
    Results(results);
    console.log(results); // For debugging purposes
  };

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <QuizLoader userName={user.firstName} />;

  const section = getCurrentSection();
  const question = getCurrentQuestion();

  return (
    <div className=" mx-auto px-4 py-8">
    <div className="space-y-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold dark:text-white">{section.sectionName}</h2>
          <div className="text-lg font-medium dark:text-white">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <Progress value={calculateProgress()} className={`relative w-full h-2 border rounded ${darkMode ? "bg-black" : "bg-gray-200"}`} />
        
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Section {currentSection + 1} of {assessment.assessmentSections.length}</span>
          <span>Question {currentQuestion + 1} of {section.questions.length}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <CardTitle>{question.question}</CardTitle>
            <Badge variant={question.difficultyLevel === "BASIC" ? "secondary" : question.difficultyLevel === "INTERMEDIATE" ? "default" : "destructive"}>
              {question.difficultyLevel}
            </Badge>
          </div>
          <CardDescription>
            Related to: {question.relatedToSubject}
            {question.relatedToCareerGoal && " • Relevant to your career goal"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderQuestionContent(question)}
          
          {question.explanation && (
            <p className="text-sm text-gray-500 mt-4 p-4 bg-gray-50 rounded-md dark:bg-gray-700 dark:text-gray-300">
              💡 {question.explanation}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentSection === 0 && currentQuestion === 0}
          variant="outline"
          className="dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Previous
        </Button>
        
        {currentSection === assessment.assessmentSections.length - 1 && 
         currentQuestion === section.questions.length - 1 ? (
          <Button onClick={handleSubmit}>
            Submit Assessment
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next Question
          </Button>
        )}
      </div>
    </div>
    </div>
  );
};

export default QuizForm;