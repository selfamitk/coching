import { GoogleGenAI } from "@google/genai";
import { ContentType } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateStudyContent = async (
  className: string,
  subjectName: string,
  topicName: string,
  type: ContentType
): Promise<string> => {
  if (!apiKey) {
    return "# API Key Missing\n\nPlease check your environment configuration. The `API_KEY` is missing.";
  }

  let prompt = "";
  const model = "gemini-2.5-flash"; // Excellent for text generation tasks

  if (type === 'notes') {
    prompt = `You are an expert academic tutor. Create comprehensive, structured study notes for:
    **Class:** ${className}
    **Subject:** ${subjectName}
    **Topic:** ${topicName}

    **Structure:**
    1. **Introduction**: Brief overview of the topic.
    2. **Key Concepts & Definitions**: Explain core terms clearly. Use bold text for terms.
    3. **Detailed Explanation**: Break down the topic into easy-to-understand sections with examples.
    4. **Important Formulas / Rules**: (If applicable) List them clearly.
    5. **Common Mistakes**: What should students avoid?
    6. **Key Takeaways**: A quick summary for revision.

    **Formatting Rules:**
    - Use clean Markdown.
    - **Do NOT use tables**. Use bulleted lists instead for compatibility.
    - Use bolding for emphasis.
    - Use code blocks for formulas if needed.`;
  } else if (type === 'pyq') {
    prompt = `You are an expert academic examiner. Generate a set of Previous Year Question (PYQ) style questions for:
    **Class:** ${className}
    **Subject:** ${subjectName}
    **Topic:** ${topicName}

    **Guidelines:**
    1. **Authenticity**: Generate questions that look like they appeared in actual board exams. Tag each question with a likely year in brackets, e.g., **[CBSE 2023]**, **[2019]**, or **[Sample Paper 2021]**.
    2. **Structure**:
       - **Section A: Very Short Answer (1 Mark)**: Provide 2 questions.
       - **Section B: Short Answer (3 Marks)**: Provide 2 questions.
       - **Section C: Long Answer (5 Marks)**: Provide 1 detailed question.
    3. **Solutions**: After the questions, add a horizontal rule "---" and provide **detailed Model Answers** for each question.
    4. **Formatting**: Use clean Markdown. Avoid tables. Use bold for question numbers.`;
  } else if (type === 'summary') {
    prompt = `Provide a quick 1-page revision summary for ${topicName} (${subjectName}, ${className}). Focus on high-yield points for exams. Format in Markdown. Avoid tables.`;
  } else if (type === 'quiz') {
    prompt = `Create a short multiple-choice quiz (5 questions) for ${topicName} (${subjectName}, ${className}). 
    Format:
    Question 1: [Question text]
    A) [Option]
    B) [Option]
    C) [Option]
    D) [Option]
    
    [Separator]
    
    Answer Key:
    1. [Answer] - [Explanation]
    ...
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and knowledgeable academic tutor designed to help students excel.",
        temperature: 0.7, // Balance between creativity and accuracy
      }
    });
    
    return response.text || "No content generated. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `## Error Generating Content\n\nWe encountered an issue connecting to the AI tutor. Please try again later.\n\n*Technical Details: ${error instanceof Error ? error.message : String(error)}*`;
  }
};