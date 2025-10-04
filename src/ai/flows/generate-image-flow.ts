
'use server';
/**
 * @fileOverview A flow for generating images from a text prompt.
 * 
 * - generateImage - A function that takes a prompt and returns an image.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateImageInputSchema = z.object({
    prompt: z.string().describe('A description of the image to be generated.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export const GenerateImageOutputSchema = z.object({
    imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput | null> {
    return generateImageFlow(input);
}

const generateImageFlow = ai.defineFlow(
    {
        name: 'generateImageFlow',
        inputSchema: GenerateImageInputSchema,
        outputSchema: GenerateImageOutputSchema,
    },
    async (input) => {
        const { media } = await ai.generate({
            model: 'googleai/imagen-4.0-fast-generate-001',
            prompt: input.prompt,
        });

        const imageUrl = media.url;
        if (!imageUrl) {
            throw new Error('Image generation failed to produce a result.');
        }

        return { imageUrl };
    }
);
