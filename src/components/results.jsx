import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from "@clerk/clerk-react";

export default function Results({ results, onClose }) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [resultgenerated, setresultgenerated] = useState(null);
  const [error, setError] = useState(null);
  const resultsJSON = JSON.stringify(results, null, 2);

  useEffect(() => {
    const generateAssessmentAnalysis = async (resultsJSON) => {
      const apiKey = "AIzaSyAkEy3M5lAbZUCCu0hZyCMGcsQmpMgLqQ8";
      const genAI = new GoogleGenerativeAI(apiKey);

      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp",
          systemInstruction: `You are an experienced educational assessor and mentor. Your role is to provide detailed, 
          constructive feedback that helps students understand their performance and grow academically.`,
        });

        const generationConfig = {
          temperature: 0.7, // Reduced for more consistent outputs
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        };

        const chatSession = model.startChat({
          generationConfig,
          history: [],
        });

        const result = await chatSession.sendMessage(`
          Analyze the following assessment results and provide comprehensive feedback:
          ${resultsJSON}

          Generate a detailed JSON response with the following structure:
          {
            "performance": {
              "overallScore": "Percentage and grade",
              "sectionScores": {
                /* Breakdown of scores by section */
              },
              "strengthAreas": [
                /* List of topics/concepts where the student performed well */
              ],
              "improvementAreas": [
                /* List of topics/concepts needing improvement */
              ]
            },
            "detailedAnalysis": {
              /* For each incorrectly answered question, provide:
                 - Common misconceptions
                 - Correct approach
                 - Related concepts to review
              */
            },
            "learningPlan": {
              "immediateSteps": [
                /* Specific actions to take in the next week */
              ],
              "resources": [
                /* Recommended study materials and practice exercises */
              ],
              "conceptualGaps": [
                /* Fundamental concepts that need reinforcement */
              ]
            },
            "careerAlignment": {
              "relevance": "How this performance relates to their career goal",
              "recommendations": [
                /* Career-specific learning recommendations */
              ]
            },
            "summary": {
              "overview": "2-3 sentences on overall performance",
              "keyTakeaways": [
                /* Main points for the student to remember */
              ],
              "encouragement": "Personalized motivational message"
            }
          }

          Consider the student's career goals, current grade level, and time spent on each section. 
          Focus on constructive feedback and specific, actionable recommendations.
        `);

        const responseText = result.response.text();
        const jsonStartIndex = responseText.indexOf("{");
        const jsonEndIndex = responseText.lastIndexOf("}");
        const sanitizedJson = responseText.substring(
          jsonStartIndex,
          jsonEndIndex + 1
        );

        const resultf = JSON.parse(sanitizedJson);
        localStorage.setItem("resultgenerated" + user.firstName, JSON.stringify(resultf));
        const savedresult = localStorage.getItem("resultgenerated"+user.firstName);
        const parsedresult = JSON.parse(savedresult);
        setresultgenerated(parsedresult);
      } catch (error) {
        console.error("Error generating analysis:", error);
        setError("Failed to generate the analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    console.log(resultsJSON);
    generateAssessmentAnalysis(resultsJSON);
  }, [results]);

  if (loading) {
    return <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      <span className="ml-2">Generating your personalized analysis...</span>
    </div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="relative space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-4xl mx-auto">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Close"
      >
        <span className="text-gray-500 dark:text-gray-400">×</span>
      </button>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Overall Score</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {resultgenerated.performance.overallScore}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold mb-2">Section Scores</h3>
              {Object.entries(resultgenerated.performance.sectionScores).map(([section, score]) => (
                <div key={section} className="flex justify-between items-center">
                  <span>{section}</span>
                  <span className="font-medium">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 dark:text-white">Detailed Analysis</h2>
          <div className="space-y-4">
            {Object.entries(resultgenerated.detailedAnalysis).map(([questionId, analysis]) => (
              <div key={questionId} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium mb-2">Question {questionId}</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(analysis).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium">{key}: </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 dark:text-white">Learning Plan</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Immediate Steps</h3>
              <ul className="list-disc ml-6 space-y-2">
                {resultgenerated.learningPlan.immediateSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recommended Resources</h3>
              <ul className="list-disc ml-6 space-y-2">
                {resultgenerated.learningPlan.resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 dark:text-white">Career Alignment</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="mb-3">{resultgenerated.careerAlignment.relevance}</p>
            <ul className="list-disc ml-6 space-y-2">
              {resultgenerated.careerAlignment.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3 dark:text-white">Summary</h2>
          <div className="space-y-4">
            <p>{resultgenerated.summary.overview}</p>
            <div>
              <h3 className="font-semibold mb-2">Key Takeaways</h3>
              <ul className="list-disc ml-6 space-y-2">
                {resultgenerated.summary.keyTakeaways.map((takeaway, index) => (
                  <li key={index}>{takeaway}</li>
                ))}
              </ul>
            </div>
            <p className="italic mt-4">{resultgenerated.summary.encouragement}</p>
          </div>
        </section>
      </div>
    </div>
  );
}