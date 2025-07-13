import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from '@langchain/core/documents';
import { generateEmbedding, summariseCode } from './ollama';
import db from "@/lib/db";
import pLimit from 'p-limit';

export const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || '',
    branch: 'main',
    ignoreFiles: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
    recursive: true,
    unknown: 'warn',
    maxConcurrency: 5
  });
  return await loader.load();
};

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);

  // Limit concurrency for LLM calls (summarise + embed)
  const limit = pLimit(5);

  // Step 1: Generate summaries & embeddings
  const allEmbeddings = await Promise.all(
    docs.map(doc =>
      limit(async () => {
        const summary = await summariseCode(doc);
        const embedding = await generateEmbedding(summary);
        return {
          summary,
          embedding,
          sourceCode: doc.pageContent,
          fileName: doc.metadata.source
        };
      })
    )
  );

  console.log(`✅ Generated embeddings for ${allEmbeddings.length} docs`);

  // Step 2: Write to DB (in parallel, but not too many at once)
  const dbLimit = pLimit(10);
  await Promise.allSettled(
    allEmbeddings.map(embedding =>
      dbLimit(async () => {
        if (!embedding) return;

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
          data: {
            summary: embedding.summary,
            sourceCode: embedding.sourceCode,
            fileName: embedding.fileName,
            projectId
          }
        });

        await db.$executeRaw`
          UPDATE "SourceCodeEmbedding"
          SET "summaryEmbedding" = ${embedding.embedding}::vector
          WHERE "id" = ${sourceCodeEmbedding.id}
        `;
      })
    )
  );

  console.log('✅ Finished indexing all embeddings to DB');
};

const generateEmbeddings = async (docs: Document[]) => {
    return await Promise.all(docs.map(async doc => {
        const summary = await summariseCode(doc)
        const embedding = await generateEmbedding(summary)
        return{
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
            fileName: doc.metadata.source,
        }
    }))
}

