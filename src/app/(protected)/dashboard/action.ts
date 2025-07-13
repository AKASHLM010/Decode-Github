// 'use server'

// import {Output, streamText} from 'ai'
// import { createStreamableValue } from 'ai/rsc'
// import { createGoogleGenerativeAI } from '@ai-sdk/google'
// import { generateEmbedding } from '@/lib/gemini'
// import db from '@/lib/db'

// const google = createGoogleGenerativeAI({
//     apiKey: process.env.GEMINI_API_KEY,
// })

// export async function askQuestion(question: string, projectId: string){
//     const stream = createStreamableValue()

//     const queryVector = await generateEmbedding(question)
//     const vectorQuery = `[${queryVector.join(',')}]`

//     const result = await db.$queryRaw`
//         SELECT "fileName" , "sourceCode" , "summary",
//         1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
//         FROM "SourceCodeEmbedding"
//         WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
//         AND "projectId" = ${projectId}
//         ORDER BY similarity DESC 
//         LIMIT 10
//     ` as { fileName:string; sourceCode: string; summary: string }[]

// let context = ''

// for (const doc of result){
//     context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
// }

// (async()=>{
//     const {textStream} = await streamText({
//         model: google('gemini-1.5-flash'),
//         prompt:`

//         `,
//     });
//     for await (const delta of textStream){
//         stream.update(delta)
//     }

//     stream.done()
// })()

// return {
//     output : stream,
//     filesReferences : result
// }

// };




// ////////////////////////////////


// 'use server'

// import { createStreamableValue } from 'ai/rsc'
// import ollama from 'ollama'
// import { generateEmbedding } from '@/lib/ollama' // note: change import to your local file
// import db from '@/lib/db'

// export async function askQuestion(question: string, projectId: string) {
//   const stream = createStreamableValue()

//   // 1️⃣ Create vector from question
//   const queryVector = await generateEmbedding(question)
//   const vectorQuery = `[${queryVector.join(',')}]`

//   // 2️⃣ Find most similar files in DB
//   const result = await db.$queryRaw`
//     SELECT "fileName", "sourceCode", "summary",
//     1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
//     FROM "SourceCodeEmbedding"
//     WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
//     AND "projectId" = ${projectId}
//     ORDER BY similarity DESC
//     LIMIT 10
//   ` as { fileName: string; sourceCode: string; summary: string }[]

//   // 3️⃣ Build context for the model
//   let context = ''
//   for (const doc of result) {
//     context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
//   }

//   // 4️⃣ Start streaming answer from Ollama
//   ;(async () => {
//     try {
//       const response = await ollama.chat({
//         model: 'qwen2.5-coder:1.5b',
//         messages: [
//           {
//             role: 'user',
//             content: `
// You are an expert programmer answering questions based on the following context.

// ## Context:
// ${context}

// ## Question:
// ${question}

// Answer as clearly as possible. If the answer is not in the context, say so.
//             `.trim()
//           }
//         ],
//         stream: true,
//       })

//       // 5️⃣ Stream tokens to the client
//       for await (const part of response) {
//         stream.update(part.message.content)
//       }

//       stream.done()
//     } catch (error) {
//       console.error('❌ ollama.chat failed:', error)
//       stream.done() // always complete stream
//     }
//   })()

//   // 6️⃣ Return stream + references to frontend
//   return {
//     output: stream,
//     filesReferences: result
//   }
// }
