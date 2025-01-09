import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Results({results}) {
    const generateAssessmentPlan = async (studentProfileJSON) => {
        console.log(studentProfileJSON);
    
        const apiKey = "AIzaSyAkEy3M5lAbZUCCu0hZyCMGcsQmpMgLqQ8";
        const genAI = new GoogleGenerativeAI(apiKey);
    
        try {
          const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            systemInstruction:'You are an examiner your job is to look through all the question and answer and give output of whatever is asked based on those questions and answers'
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
              `
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
}