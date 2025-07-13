import ollama from 'ollama';
import { Document } from '@langchain/core/documents';

const SUMMARISER_MODEL = 'qwen2.5-coder:1.5b';
const EMBEDDING_MODEL = 'nomic-embed-text:v1.5';

// summarise a git diff
export const aiSummariseCommit = async (diff: string): Promise<string> => {
  console.log("📦 aiSummariseCommit called, diff length:", diff?.length);

  try {
    if (!diff?.trim()) {
      console.warn("⚠️ Provided diff is empty, skipping summarisation.");
      return '';
    }
    const prompt = `
You are an expert programmer writing concise commit summaries.

Given the following git diff, produce a short bullet-point style summary of the *actual code changes only*.

✅ Focus on what changed (e.g., *Added X*, *Fixed Y*, *Refactored Z*).
🚫 Do NOT describe what the diff "is for", do NOT say "This diff is for...".
🚫 Do NOT explain the whole file or project, only the changes.
🚫 Do NOT copy code.
✅ Write like concise commit messages.
✅ Keep the entire summary under 100 words.

Here is the diff to summarise:

${diff}

Only write the bullet points, nothing else.
`;

    console.log("🧠 Sending prompt to Ollama (summariser model)...");
    const response = await ollama.chat({
  model: SUMMARISER_MODEL,
  messages: [{ role: 'user', content: prompt.trim() }]
  });


    console.log("✅ Ollama response received. Raw:", response);
    const summary = response?.message?.content?.trim() ?? '';

    console.log(`✅ Generated summary (length: ${summary.length}):`);
    console.log(summary);

    return summary;
  } catch (error) {
    console.error("❌ aiSummariseCommit failed:", error);
    return '';
  }
};

// summarise a source code file
export async function summariseCode(doc: Document): Promise<string> {
  console.log("📄 Summarising code for:", doc.metadata?.source);

  try {
    const content = doc.pageContent?.trim();
    if (!content) {
      console.warn("⚠️ doc.pageContent is empty!");
      return '';
    }

    const code = content.slice(0, 10000); // limit size

    const prompt = `
You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
Your task is to provide a concise, clear summary of the following code file to help a new team member quickly understand its purpose, structure, and any important implementation details.
Avoid repeating code verbatim. Focus on explaining what the code does, its main components, and any noteworthy patterns or logic.
If relevant, mention the file's role in the overall project.
Here is the code to summarise:
---
${code}
---
Give a summary no more than 100 words of the code above.
`;

    const response = await ollama.chat({
      model: SUMMARISER_MODEL,
      messages: [{ role: 'user', content: prompt.trim() }]
    });

    console.log("✅ Ollama code summary response:", response);
    return response?.message?.content?.trim() ?? '';
  } catch (error) {
    console.error("❌ summariseCode failed:", error);
    return '';
  }
}

// generate embedding
export async function generateEmbedding(summary: string): Promise<number[]> {
  console.log("⚙️ Generating embedding...");

  try {
    if (!summary?.trim()) {
      console.warn("⚠️ Summary is empty!");
      return [];
    }

    const response = await ollama.embeddings({
      model: EMBEDDING_MODEL,
      prompt: summary.trim(),
    });

    console.log("✅ Embedding result:", response);
    return response?.embedding ?? [];
  } catch (error) {
    console.error("❌ generateEmbedding failed:", error);
    return [];
  }
}
