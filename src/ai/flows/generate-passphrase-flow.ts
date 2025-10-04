
'use server';
/**
 * @fileOverview A flow for generating secure, memorable passphrases.
 * 
 * - generatePassphrase - A function that returns a creative passphrase.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This flow doesn't require an input schema from the client.
const PassphraseOutputSchema = z.string().describe('A secure, multi-word passphrase, formatted as Title-Case-Words-Separated-By-Hyphens.');

export async function generatePassphrase(): Promise<string> {
    return generatePassphraseFlow();
}

const generatePassphrasePrompt = ai.definePrompt({
    name: 'generatePassphrasePrompt',
    output: { schema: PassphraseOutputSchema },
    prompt: `You are an expert in creating secure, memorable passphrases.
Generate a single passphrase that consists of 4 random, title-cased words separated by hyphens.
The passphrase should be creative and uncommon. Do not include numbers or special characters.
Your output must be only the passphrase string.

Example: "Fuzzy-Lantern-Sleeps-Gently"
`,
});

const generatePassphraseFlow = ai.defineFlow(
    {
        name: 'generatePassphraseFlow',
        outputSchema: PassphraseOutputSchema,
    },
    async () => {
        const { output } = await generatePassphrasePrompt();
        if (!output) {
            throw new Error('AI failed to generate a passphrase.');
        }
        // Ensure the output doesn't have leading/trailing spaces or quotes
        return output.trim().replace(/"/g, '');
    }
);
