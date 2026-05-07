import { GoogleGenAI, Type } from "@google/genai";
import { ExerciseContent, ExerciseType, Question, OralGrade } from "../types";

// Helper to ensure API key exists
const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateExercise = async (type: ExerciseType, difficulty: string): Promise<ExerciseContent> => {
  const ai = getClient();
  const model = "gemini-1.5-flash";

  let prompt = "";
  if (type === ExerciseType.GRAMMAR) {
    prompt = `Create a ${difficulty} level English grammar exercise. 
    Focus on common mistakes or specific grammar rules suitable for this level.
    Provide 3 multiple choice questions.`;
  } else if (type === ExerciseType.READING) {
    prompt = `Write a short, engaging passage (approx 150 words) for a ${difficulty} level English learner.
    Then provide 3 reading comprehension questions based on the text.`;
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING, description: "The reading passage or grammar explanation context." },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                text: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['multiple-choice'] },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate exercise content");
  }

  // Ensure generated questions default to multiple-choice and exist
  const data = JSON.parse(response.text) as ExerciseContent;
  if (!data.questions || !Array.isArray(data.questions)) {
      data.questions = [];
  }
  data.questions = data.questions.map(q => ({...q, type: 'multiple-choice'}));
  return data;
};

export const gradeShortAnswers = async (questions: Question[], answers: Record<number, string>): Promise<Record<number, {correct: boolean, feedback: string}>> => {
    const ai = getClient();
    const model = "gemini-1.5-flash";

    // Filter only short answers that have been answered
    const shortAnswerQuestions = questions.filter(q => q.type === 'short-answer' && answers[q.id]);
    
    if (shortAnswerQuestions.length === 0) return {};

    const promptItems = shortAnswerQuestions.map(q => ({
        id: q.id,
        question: q.text,
        userAnswer: answers[q.id]
    }));

    const prompt = `You are an English teacher. Grade the following student answers.
    For each answer, determine if it is "correct" (boolean) and provide "feedback" (string).
    
    Items to grade:
    ${JSON.stringify(promptItems)}
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    results: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.INTEGER },
                                correct: { type: Type.BOOLEAN },
                                feedback: { type: Type.STRING }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!response.text) return {};

    const result = JSON.parse(response.text);
    const gradingMap: Record<number, {correct: boolean, feedback: string}> = {};
    
    if (result.results && Array.isArray(result.results)) {
        result.results.forEach((item: any) => {
            gradingMap[item.id] = {
                correct: item.correct,
                feedback: item.feedback
            };
        });
    }

    return gradingMap;
};

export const gradeOralSession = async (transcript: {role: string, text: string}[]): Promise<OralGrade> => {
    const ai = getClient();
    const model = "gemini-1.5-flash";

    const prompt = `You are an expert English Language Examiner (like for IELTS or TOEFL). 
    Analyze the following transcript of a student's conversation with an AI tutor.
    
    Transcript:
    ${JSON.stringify(transcript)}
    
    Grade the student's performance (Role: 'user').
    Provide a score out of 100.
    Provide constructive feedback on:
    1. Fluency & Coherence
    2. Grammar & Accuracy
    3. Lexical Resource (Vocabulary)
    
    Also list 3 specific, actionable improvements they can make.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    score: { type: Type.INTEGER },
                    fluency: { type: Type.STRING },
                    grammar: { type: Type.STRING },
                    vocabulary: { type: Type.STRING },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });

    if (!response.text) {
        throw new Error("Failed to generate oral grade");
    }

    return JSON.parse(response.text) as OralGrade;
};

export const getTutorClient = () => getClient();