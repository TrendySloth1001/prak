
'use server';
/**
 * @fileOverview A flow for analyzing an image's suitability for steganography.
 * 
 * - analyzeImage - A function that takes an image and returns an analysis.
 * - AnalyzeImageInput - The input type for the analyzeImage function.
 * - AnalyzeImageOutput - The return type for the analyzeImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnalyzeImageInputSchema = z.object({
  image: z.string().describe("A data URI of the image to be analyzed. Must include a MIME type and use Base64 encoding. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AnalyzeImageInput = z.infer<typeof AnalyzeImageInputSchema>;

const AnalyzeImageOutputSchema = z.object({
  suitability: z.enum(['Low', 'Medium', 'High']).describe('The suitability of the image for steganography.'),
  reason: z.string().describe('A brief explanation for the suitability rating.'),
});
export type AnalyzeImageOutput = z.infer<typeof AnalyzeImageOutputSchema>;

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeImageOutput> {
    return analyzeImageFlow(input);
}

const analyzePrompt = ai.definePrompt({
    name: 'analyzeImagePrompt',
    input: { schema: AnalyzeImageInputSchema },
    output: { schema: AnalyzeImageOutputSchema },
    model: 'googleai/gemini-1.5-flash-latest',
    prompt: `You are a steganography expert. Analyze the provided image to determine its suitability for hiding data.

Consider the following factors:
- Texture and detail: High-frequency details are better.
- Color complexity: More varied colors are better.
- Large flat areas: Homogeneous areas (like a clear sky or a plain wall) are worse.

Based on your analysis, provide a suitability rating (Low, Medium, or High) and a concise, one-sentence reason for your rating.

Image to analyze: {{media url=image}}`
});

const analyzeImageFlow = ai.defineFlow(
    {
        name: 'analyzeImageFlow',
        inputSchema: AnalyzeImageInputSchema,
        outputSchema: AnalyzeImageOutputSchema,
    },
    async (input) => {
        const { output } = await analyzePrompt(input);
        if (!output) {
            throw new Error('AI analysis failed to produce a result.');
        }
        return output;
    }
);
