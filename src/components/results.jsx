import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from "@clerk/clerk-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "./theme";
export default function Results({ results}) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [resultgenerated, setresultgenerated] = useState(null);
  const [error, setError] = useState(null);
  const resultsJSON = JSON.stringify(results, null, 2);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const cacheKey = `resultgenerated${user.firstName}`;
  const { darkMode } = useTheme();

  ChartJS.register(ArcElement, Tooltip, Legend);

  const prepareChartData = (sectionScores) => {
    const labels = sectionScores.map((section) => section.name);
    const data = sectionScores.map((section) => section.correctAnswers);
    const colors = sectionScores.map((section) => section.color);

    return {
      labels,
      datasets: [
        {
          label: "Correct Answers by Section",
          data,
          backgroundColor: colors,
          hoverOffset: 4,
        },
      ],
    };
  };
  const handleClose = () => {
    navigate("/home"); // Or wherever you want to redirect after closing
  };
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Check cache first
        const cachedResults = localStorage.getItem(cacheKey);
        if (cachedResults) {
          setresultgenerated(JSON.parse(cachedResults));
          setLoading(false);
          return;
        }
        const apiKey = "AIzaSyAkEy3M5lAbZUCCu0hZyCMGcsQmpMgLqQ8";
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
          systemInstruction: `You are an experienced educational assessor and mentor. Your role is to provide detailed, 
          constructive feedback that helps students understand their performance and grow academically.`,
        });

        const generationConfig = {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        };

        const chatSession = model.startChat({
          generationConfig,
        });

        const result = await chatSession.sendMessage(`
          Analyze the following assessment results and provide comprehensive feedback:
          ${resultsJSON}

          Generate a detailed JSON response with the following structure:
          {
            "performance": {
              "overallScore": {
                "percentage": "85%",
                "grade": "A",
                "color": "#4CAF50"  // Color code for visual representation
              },
              "sectionScores": [
                {
                  "name": "Section Name",
                  "score": "90%",
                  "color": "#2196F3",
                  "totalQuestions": 10,
                  "correctAnswers": 9
                }
              ]
            },
            "questionAnalysis": {
              "1": {  // Question ID
                "status": "correct/incorrect/unanswered",
                "questionText": "Original question text",
                "studentAnswer": "Student's response",
                "correctAnswer": "Correct answer",
                "misconceptions": "Common misconceptions for this type of question",
                "correctApproach": "Step-by-step explanation of the correct approach",
                "conceptsToReview": ["Topic 1", "Topic 2"],
                "relatedResources": [
                  {
                    "type": "video/article/practice",
                    "title": "Resource title",
                    "description": "Brief description of the resource"
                  }
                ]
              }
            },
            "skillsAnalysis": {
              "strengths": [
                {
                  "skill": "Skill name",
                  "evidence": "Evidence from the assessment",
                  "recommendations": "How to further improve"
                }
              ],
              "areasForImprovement": [
                {
                  "skill": "Skill name",
                  "gap": "Identified knowledge gap",
                  "actionItems": ["Specific action 1", "Specific action 2"]
                }
              ]
            },
            "timeAnalysis": {
              "totalTime": "Time spent",
              "timePerSection": {
                "sectionName": "time spent",
                "recommendation": "Time management advice"
              },
              "paceAnalysis": "Analysis of time management"
            },
            "careerAlignment": {
              "relevance": "How this performance relates to career goals",
              "keySkills": [
                {
                  "skill": "Required skill",
                  "currentLevel": "Current proficiency",
                  "targetLevel": "Required proficiency",
                  "developmentPlan": "How to reach target level"
                }
              ],
              "nextSteps": [
                "Career-specific recommendation 1",
                "Career-specific recommendation 2"
              ]
            },
  "roadmap": { //roadmap for the student to follow to achieve success
    "studentBasics": {
      "strengths":[""], // ["Problem Solving", "Quick Learning"]
      "improvements":[""], // ["Time Management", "Practice Consistency"]
      "goals":["" ],  //["Master React", "Build Portfolio"]
      "timeline": " " , //"1 year"
      "focus": " " , //"Full Stack Mastery"
      "actions": [""] //["spotify clone", "movie app", "e-commerce app"]
    },
    "learningPlan": {
      "shortTerm": {
        "focus": [""] , // "React Fundamentals"
        "actions":[""] , // ["Complete Basic Tutorials", "Build Small Projects"]
        "timeline":"" , // "1-2 weeks"
        "checkpoints": [""]  //["Component Creation", "State Management", "Props & Events", "Hooks"]
      },
      "longTerm": {
        "focus": "" ,  //"Full Stack Development"
        "actions":[""],  // ["Backend Integration", "Database Design"]
        "timeline":"",     // "2-3 months"
        "checkpoints":[""]  // ["API Development", "Database Schema", "Authentication"]
        }
    }
  },

}

          Guidelines for analysis:
          1. Be specific and actionable in feedback
          2. Focus on patterns in incorrect answers
          3. Provide both tactical and strategic recommendations
          4. Consider the student's career goals in recommendations
          5. Balance constructive criticism with encouragement
          6. Include time-based analysis and recommendations
          7. Provide visual-friendly metrics (include color codes)
          8. Segment feedback into immediate and long-term actions
        `);
        const responseText = result.response.text();
        const jsonStartIndex = responseText.indexOf("{");
        const jsonEndIndex = responseText.lastIndexOf("}");
        const sanitizedJson = responseText.substring(
          jsonStartIndex,
          jsonEndIndex + 1
        );
        const parsedResult = JSON.parse(sanitizedJson);
        localStorage.setItem(cacheKey, JSON.stringify(parsedResult));
        setresultgenerated(parsedResult);
      } catch (error) {
        console.error("Error generating analysis:", error);
        setError("Failed to generate the analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [resultsJSON, user.firstName, cacheKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        <span className="ml-2">Generating your personalized analysis...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }
  if (!resultgenerated) return null;
  return (
    <div className="relative space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
        aria-label="Close"
      >
        <span className="text-gray-500 dark:text-gray-400 text-xl">×</span>
      </button>

      <div className="space-y-6">
        {/* Performance Overview Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">
            Performance Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {/* Overall Score Card */}
            <div className="relative p-4 bg-gray-50 border shadow-md dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2 text-2xl dark:text-white">
                Overall Score
              </h3>
              <div className="flex items-center justify-center h-[70%]">
                <p className="text-4xl font-semibold text-blue-600 dark:text-blue-400">
                  {resultgenerated.performance.overallScore.percentage} (
                  {resultgenerated.performance.overallScore.grade})
                </p>
              </div>
            </div>

            {/* Enhanced Doughnut Chart */}
            <div
              className="relative border items-start p-4 bg-gray-50 dark:bg-gray-700 shadow-md rounded-lg"
              style={{ height: "300px", width: "100%" }}
            >
              <Doughnut
                data={prepareChartData(
                  resultgenerated.performance.sectionScores
                )}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom",
                      align: "start", // Align legend at the bottom
                      labels: {
                        font: {
                          size: 12, // Larger text for better readability
                        },
                        color: darkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)", // Adjust color for dark mode
                        padding: 10, // Add padding for spacing
                      },
                    },
                  },
                  cutout: "70%", // Doughnut chart with a larger cutout for modern look
                  maintainAspectRatio: false, // Ensure responsiveness
                }}
              />
            </div>
          </div>
        </section>

        {/* Question Analysis Section */}
        <section>
          <h2 className="text-xl font-bold mb-3 h-full dark:text-white">
            Detailed Analysis
          </h2>
          <div className="flex flex-wrap gap-4 mt-4 mb-10">
            {Object.entries(resultgenerated.questionAnalysis).map(
              ([questionId, analysis]) => (
                <div
                  key={questionId}
                  className={`p-4 bg-gray-50 dark:bg-gray-700 rounded-lg ${
                    expandedQuestionId === questionId
                      ? "w-full shadow-lg border-2 "
                      : "w-[calc(33%-1rem)]"
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedQuestionId(
                        expandedQuestionId === questionId ? null : questionId
                      )
                    }
                    className={`flex justify-between items-center w-full ${
                      analysis.status === "correct"
                        ? "text-green-400"
                        : analysis.status === "incorrect"
                        ? "text-red-400"
                        : "text-gray-500 dark:text-white "
                    }`}
                  >
                    <span
                      className={`text-left ${
                        expandedQuestionId === questionId
                          ? "font-bold text-xl"
                          : "md:text-sm text-xs lg:text-base"
                      }`}
                    >
                      Question {questionId}
                    </span>
                    <span>{expandedQuestionId === questionId ? "▲" : "▼"}</span>
                  </button>
                  {expandedQuestionId === questionId && (
                    <div className="space-y-2 text-sm mt-4 dark:text-white">
                      <p>
                        <strong>Question Text:</strong> {analysis.questionText}
                      </p>
                      <p>
                        <strong>Student Answer:</strong>{" "}
                        {analysis.studentAnswer}
                      </p>
                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {analysis.correctAnswer}
                      </p>
                      <p
                        className={`${
                          analysis.correctAnswer === "Yes" ? "hidden" : " "
                        }`}
                      >
                        <strong>Explanation:</strong> {analysis.correctApproach}
                      </p>
                      <p
                        className={`${
                          analysis.correctAnswer === "Yes" ? "hidden" : " "
                        }`}
                      >
                        <strong>Concepts to Review: </strong>
                        {analysis.conceptsToReview?.join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        {/* Learning Plan Section */}
        <section>
          <h2 className="text-xl font-bold mb-3 dark:text-white">
            Learning Plan
          </h2>
          <div className="space-y-4">
            <div className="mt-6 mb-10">
              <h3 className="font-semibold mb-2 dark:text-white">
                Immediate Steps
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                <ul className="list-disc ml-6 space-y-2 dark:text-white mt-2">
                  {resultgenerated.skillsAnalysis.areasForImprovement.map(
                    (area, index) => (
                      <li key={index}>{area.actionItems.join(", ")}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Career Alignment Section */}
        <section>
          <h2 className="text-xl font-bold mb-3 dark:text-white">
            Career Alignment
          </h2>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg">
            <p className="mb-3">{resultgenerated.careerAlignment.relevance}</p>
            <ul className="list-disc ml-6 space-y-2">
              {resultgenerated.careerAlignment.nextSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
