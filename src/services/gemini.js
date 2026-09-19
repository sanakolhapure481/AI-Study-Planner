import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

export const generateStudyRecommendation = async (tasks) => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  if (!tasks || tasks.length === 0) {
    throw new Error("No study tasks available.");
  }

  const taskData = tasks.map((task) => ({
    title: task.title,
    priority: task.priority,
    studyDate: task.studyDate,
    startTime: task.startTime,
    endTime: task.endTime,
    status: task.status,
  }));

  const prompt = `
You are an AI Study Planner assistant.

Analyze the student's study tasks and create a practical study recommendation.

Student tasks:
${JSON.stringify(taskData, null, 2)}

Requirements:
1. Prioritize high-priority pending tasks.
2. Consider the study dates and available times.
3. Do not ignore pending tasks.
4. Mention completed tasks only when useful.
5. Give a simple and realistic study plan.
6. Include short break suggestions.
7. Do not invent tasks that are not provided.
8. Keep the response easy for a college student to understand.

Return the answer with these sections:

Today's Priority
Study Plan
Tips
`;

  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      lastError = error;

      console.error(`Gemini attempt ${attempt} failed:`, error);

      // Retry if Gemini is temporarily unavailable
      if (attempt < 3 && error?.status === 503) {
        await new Promise((resolve) =>
          setTimeout(resolve, attempt * 2000)
        );
      } else {
        break;
      }
    }
  }

  console.error("Gemini API Error:", lastError);

  throw new Error(
    "Gemini is temporarily unavailable. Please try again."
  );
};