import { GoogleGenerativeAI } from '@google/generative-ai';
import { Document } from '@langchain/core/documents';

// Check that the API key is set
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing! Please set it in your .env file");
} else {
    console.log("✅ GEMINI_API_KEY is set");
}

// Create the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash'
});

export const aiSummariseCommit = async (diff: string) => {
    console.log("📦 Summarising commit diff...");

    try {
        if (!diff || diff.trim().length === 0) {
            console.warn("⚠️ Provided diff is empty!");
            return '';
        }

        const response = await model.generateContent([
            `You are an expert programmer, and you are trying to summarize a git diff.
Reminders about the git diff format:
For every file, there are a few metadata lines, like (for example):
\`\`\`
diff --git a/lib/index.js b/lib/index.js
index aadf691..bfef603 100644
--- a/lib/index.js
+++ b/lib/index.js
\`\`\`
This means that \`lib/index.js\` was modified in this commit. Note that this is only an example.
Then there is a specifier of the lines that were modified.
A line starting with \`+\` means it was added.
A line starting with \`-\` means that line was deleted.
A line that starts with neither \`+\` nor \`-\` is context and not part of the diff.

EXAMPLE SUMMARY COMMENTS:
\`\`\`
* Raised the amount of returned recordings from \`10\` to \`100\` [packages/server/recordings_api.ts], [packages/server/constants.ts]
* Fixed a typo in the github action name [.github/workflows/gpt-commit-summarizer.yml]
* Moved the \`octokit\` initialization to a separate file [src/octokit.ts], [src/index.ts]
* Added an OpenAI API for completions [packages/utils/opis/openai.ts]
* Lowered numeric tolerance for test files
\`\`\`

Do not include parts of the example in your summary.
It is given only as an example of appropriate summary comments.`,
            `Please summarise the following diff file:\n\n${diff}`
        ]);

        console.log("✅ Gemini commit summary response:", response);
        const text = response.response.text();
        console.log("✅ Summary text:", text);
        return text;
    } catch (error) {
        console.error("❌ aiSummariseCommit failed:", error);
        return '';
    }
};

export async function summariseCode(doc: Document) {
    console.log("📄 Summarising code for:", doc.metadata.source);

    try {
        if (!doc.pageContent || doc.pageContent.trim().length === 0) {
            console.warn("⚠️ doc.pageContent is empty!");
            return '';
        }

        const code = doc.pageContent.slice(0, 10000); // limit size

        const response = await model.generateContent([
            `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
Your task is to provide a concise, clear summary of the following code file to help a new team member quickly understand its purpose, structure, and any important implementation details.
Avoid repeating code verbatim. Focus on explaining what the code does, its main components, and any noteworthy patterns or logic.
If relevant, mention the file's role in the overall project.`,
            `Here is the code to summarise:
---
${code}
---
Give a summary no more than 100 words of the code above.`
        ]);

        console.log("✅ Gemini code summary response:", response);
        const text = response.response.text();
        console.log("✅ Summary text:", text);
        return text;
    } catch (error) {
        console.error("❌ summariseCode failed:", error);
        return '';
    }
}

export async function generateEmbedding(summary: string) {
    console.log("⚙️ Generating embedding...");

    try {
        if (!summary || summary.trim().length === 0) {
            console.warn("⚠️ Summary is empty!");
            return [];
        }

        const embeddingModel = genAI.getGenerativeModel({
            model: "text-embedding-004"
        });

        const result = await embeddingModel.embedContent(summary);
        console.log("✅ Embedding result:", result);
        return result.embedding.values;
    } catch (error) {
        console.error("❌ generateEmbedding failed:", error);
        return [];
    }
}
