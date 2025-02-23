import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from "@clerk/clerk-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
const OnboardingFlow = ({ onComplete }) => {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      grade: "",
      age: "",
    },
    academics: {
      strengths: "",
      weaknesses: "",
      favoriteSubjects: "",
      currentGrades: "",
    },
    careerGoals: {
      primaryGoal: "",
      reasonForChoice: "",
    },
  });

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleStartTest = async () => {
    setIsLoading(true);
    try {
      await startTest();
    } catch (error) {
      console.error("Error starting test:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  const handleSubmit = () => {
    setStep(3);
  };
  const startTest = async () => {
    const studentProfile = {
      name: user.firstName || "Student",
      age: formData.personalInfo.age,
      currentGrade: formData.personalInfo.grade,
      careerGoal: formData.careerGoals.primaryGoal,
      academicProfile: {
        strengths: formData.academics.strengths.split(","),
        weaknesses: formData.academics.weaknesses.split(","),
        favoriteSubjects: formData.academics.favoriteSubjects.split(","),
        currentGrades: formData.academics.currentGrades.split(","),
      },
      careerMotivation: formData.careerGoals.reasonForChoice,
    };
    const studentProfileJSON = JSON.stringify(studentProfile, null, 2);
    const assessmentPlan = await generateAssessmentPlan(studentProfileJSON);
    localStorage.setItem("studentProfile" + studentProfile.name, studentProfileJSON);
    localStorage.setItem("assessmentPlan" + studentProfile.name, JSON.stringify(assessmentPlan));
    onComplete();
  };

  const generateAssessmentPlan = async (studentProfileJSON) => {
    console.log(studentProfileJSON);

    const apiKey = "AIzaSyBXGLRuAfkHwbmFgBxRjTMpAywHOy981jY";
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      };

      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(`
          Using this student profile:
${studentProfileJSON}
Please create a **personalized assessment** that strictly aligns with the student's details and career aspirations. Follow the structure below EXACTLY:
{
  "assessmentSections": [
    {
      "sectionName": string,  // Name of the section tailored to the student's profile (e.g., "Logical Reasoning" or "Mathematical Foundations")
      "sectionDescription": string,  // Description of what this section evaluates and its relevance to the student
      "questions": [
        {
          "id": number,
          "questionType": "MCQ" | "SCENARIO" | "PRACTICAL",
          "question": string,  // Tailored question based on the student's profile
          "options": string[] | null,  // Array of 4 options for MCQ, null for others
          "correctAnswer": string | null,  // For MCQs only
          "explanation": string,  // Explanation of the relevance of this question
          "difficultyLevel": "BASIC" | "INTERMEDIATE" | "ADVANCED",
          "relatedToSubject": string,  // Matches one of their favoriteSubjects
          "relatedToCareerGoal": boolean,  // Relevant to their career goal or not
          "evaluationCriteria": {
            // For SCENARIO questions
            "rubric"?: {
              "mainPoints": string[],  // Key concepts that should be addressed
              "applicationContext": string,  // Real-world application
              "expectedApproach": string[]  // Expected problem-solving steps
            },
            // For CONCEPT_MAP questions
            "conceptConnections"?: {
              "centralConcept": string,
              "relatedConcepts": string[],
              "validRelationships": string[]
            }
          }
        }
      ],
      "totalQuestions": number,  // Between 5-10 questions
      "timeAllocation": number  // Time in minutes, based on question count and difficulty
    }
  ],
  "assessmentMetadata": {
    "Grade/class": "${studentProfileJSON.currentGrade}",
    "careerGoal": "${studentProfileJSON.careerGoal}",
    "Strengths": ${studentProfileJSON.academicProfile?.strengths?.join(", ") || ""},
    "Weaknesses": ${studentProfileJSON.academicProfile?.weaknesses?.join(", ") || ""},
    "currentGrades": ${studentProfileJSON.academicProfile?.currentGrades.join(", ") || ""}
    "careerMotivation": "${studentProfileJSON.careerMotivation}",
    "totalSections": number,  // Number of sections (minimum 3)
    "totalTime": number,  // Sum of all section times
    "difficultyDistribution": {
      "basic": number,
      "intermediate": number,
      "advanced": number
    }
  }
}

### Instructions for Generating the Assessment:
1. Align the **section names** with the student's strengths, weaknesses, and career goal (e.g., "Logical Problem Solving", "Technical Concepts").

2. Create questions that:
   - Are age-appropriate and match their current academic level
   - Progress from foundational concepts to career-specific topics
   - Focus on understanding and application rather than memorization
   - Test areas where they need improvement
   
3. Include these question types:
   - **MCQs** to test conceptual knowledge and understanding
   - **Scenario-based questions** to test problem-solving and analytical thinking
   - **Practical questions** to test application and problem-solving skills.
   
4. For each question type:
   - MCQs should include practical applications and real-world scenarios
   - Scenario questions should focus on problem-solving methodology rather than implementation
   - Concept Map questions should help connect different aspects of the subject matter
   
5. Evaluation criteria should:
   - Focus on understanding and problem-solving approach
   - Consider multiple valid perspectives
   - Reward clear thinking and logical reasoning
   
6. Maintain educational standards by:
   - Aligning with Indian Education System requirements
   - Following NCERT curriculum guidelines where applicable
   - Including questions relevant to competitive exams (JEE/NEET if applicable)
   
7. Each section should be **tailored and meaningful**, with:
   - Clear connection to career goals
   - Balance between theory and application
   - Focus on conceptual clarity
   - 5-10 questions matching the difficultyDistribution

8. Time allocation should consider:
   - Question complexity
   - Reading comprehension time
   - Time for logical thinking and problem-solving
   - Student's grade level and abilities`
      );

      const responseText = result.response.text();


      const jsonStartIndex = responseText.indexOf('{');
      const jsonEndIndex = responseText.lastIndexOf('}');
      const sanitizedJson = responseText.substring(jsonStartIndex, jsonEndIndex + 1);

      const assessmentPlan = JSON.parse(sanitizedJson);

      console.log('Generated Assessment Plan:', assessmentPlan);
      return assessmentPlan;
    } catch (error) {
      console.error('Error generating assessment plan:', error);
      throw error;
    }

  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Welcome, {user?.firstName}! 👋</h2>
            <p className="mb-6">Let's get started by learning more about you and your goals.</p>
            <Button
              onClick={() => setStep(2)}
              className="w-full md:w-auto"
            >
              Begin
            </Button>
          </div>
        );
      case 2:

        return (
          <form
            className="space-y-8 outline-none"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Personal Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-1 bg-blue-500 rounded-full" />
                    <h3 className="text-xl font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Grade/Class</Label>
                      <Input
                        type="text"
                        value={formData.personalInfo.grade}
                        placeholder="e.g., 10th, 1st PUC,Engineering 1st year"
                        onChange={(e) => handleChange("personalInfo", "grade", e.target.value)}
                        className="w-full transition-all hover:border-blue-400 focus:border-blue-500 "
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Age</Label>
                      <Input
                        type="number"
                        value={formData.personalInfo.age}
                        placeholder="Enter your age"
                        onChange={(e) => handleChange("personalInfo", "age", e.target.value)}
                        className="w-fulltransition-all hover:border-blue-400 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-1 bg-green-500 rounded-full" />
                    <h3 className="text-xl font-semibold">Academic Background</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Academic Strengths</Label>
                      <Textarea
                        value={formData.academics.strengths}
                        onChange={(e) => handleChange("academics", "strengths", e.target.value)}
                        className="min-h-24 transition-all hover:border-green-400 focus:border-green-500"
                        placeholder="List your academic strong points...   (seperated by commas)
e.g., Maths , Science, Literature, basic Java ,etc."
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Areas for Improvement</Label>
                      <Textarea
                        value={formData.academics.weaknesses}
                        onChange={(e) => handleChange("academics", "weaknesses", e.target.value)}
                        className="min-h-24 transition-all hover:border-green-400 focus:border-green-500"
                        placeholder="What subjects would you like to improve in?  (seperated by commas)"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Favorite Subjects</Label>
                      <Input
                        type="text"
                        value={formData.academics.favoriteSubjects}
                        onChange={(e) => handleChange("academics", "favoriteSubjects", e.target.value)}
                        className="transition-all hover:border-green-400 focus:border-green-500"
                        placeholder="e.g., Mathematics, Science, Literature"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Current Grades</Label>
                      <Textarea
                        value={formData.academics.currentGrades}
                        onChange={(e) => handleChange("academics", "currentGrades", e.target.value)}
                        className="min-h-24 transition-all hover:border-green-400 focus:border-green-500"
                        placeholder="List your recent grades in key subjects...
e.g., Maths-85 , Science-67, Literature-56, etc."
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-1 bg-purple-500 rounded-full" />
                    <h3 className="text-xl font-semibold">Career Goals</h3>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Primary Career Goal</Label>
                      <Input
                        type="text"
                        value={formData.careerGoals.primaryGoal}
                        onChange={(e) => handleChange("careerGoals", "primaryGoal", e.target.value)}
                        className="transition-all hover:border-purple-400 focus:border-purple-500"
                        placeholder="What career do you aspire to?"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Why This Career?</Label>
                      <Textarea
                        value={formData.careerGoals.reasonForChoice}
                        onChange={(e) => handleChange("careerGoals", "reasonForChoice", e.target.value)}
                        className="min-h-24 transition-all hover:border-purple-400 focus:border-purple-500"
                        placeholder="Tell us what inspires you about this career path..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg text-lg font-medium transition-all duration-200 transform hover:scale-[1.02]"
            >
              Submit Profile
            </Button>
          </form>
        );
      case 3:
        return (
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-4">Ready for Your Assessment!</h2>
            <p className="mb-6">
              Based on your profile, we've prepared a tailored assessment to help guide your journey.
            </p>
            <Button
              onClick={handleStartTest}
              className="w-full md:w-auto "
              disabled={isLoading} 
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "Starting..." : "Start Assessment"}
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Profile Setup</CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};
export default OnboardingFlow;
