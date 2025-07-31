
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the API_KEY is available as an environment variable
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `Analyze this video frame meticulously. Provide a detailed description covering these aspects:
1.  **Foreground:** What objects or people are most prominent? Describe their appearance and position.
2.  **Background:** Describe the setting and environment. What can be seen in the distance or surroundings?
3.  **Actions:** What is happening in the scene? Describe any movements, interactions, or events.
4.  **Context:** If possible, infer the overall context, mood, or potential narrative of the scene.

Your response should be a clear, well-structured paragraph.`;

/**
 * Analyzes a single video frame using the Gemini API.
 * @param base64Frame - A base64 encoded string of the video frame (without the data URI prefix).
 * @returns A promise that resolves to the textual description of the frame.
 */
export const analyzeFrame = async (base64Frame: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64Frame,
            },
        };

        const textPart = {
            text: PROMPT,
        };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const text = response.text;
        if (!text) {
            return "No description could be generated for this frame.";
        }
        return text;
    } catch (error) {
        console.error("Error analyzing frame with Gemini:", error);
        throw new Error("Failed to communicate with the Gemini API. Please check your API key and network connection.");
    }
};
