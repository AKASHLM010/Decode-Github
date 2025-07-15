'use server'

import {Output, streamText} from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateEmbedding } from '@/lib/gemini'
import db from '@/lib/db'

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
})

export async function askQuestion(question: string, projectId: string){
    const stream = createStreamableValue()

    const queryVector = await generateEmbedding(question)
    const vectorQuery = `[${queryVector.join(',')}]`

    const result = await db.$queryRaw`
        SELECT "fileName" , "sourceCode" , "summary",
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
        FROM "SourceCodeEmbedding"
        WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
        AND "projectId" = ${projectId}
        ORDER BY similarity DESC 
        LIMIT 10
    ` as { fileName:string; sourceCode: string; summary: string }[]

let context = ''

for (const doc of result){
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\n summary of file: ${doc.summary}\n\n`
}

(async()=>{
    const {textStream} = await streamText({
        model: google('gemini-1.5-flash'),
        prompt:`
            You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.
            AI assistant is a brand new ,powerful, human-like artificial intelligence.The traits of AI assistant include expert knowledge,helpfulness,cleverness, and articulateness.
            AI is a well-behaved and well mannered individual.
            AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
            AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
            If the question is asking about code or a specific file, AI will provide the detailed answer, giving step-by-step instructions including code snippets.
            START CONTEXT BLOCK
            ${context}
            END OF CONTEXT BLOCK

            START QUESTION
            ${question}
            END OF QUESTION
            AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
            If the context does not provide the answer to the question, AI will say, "I'm sorry, I don't know the answer to that."
            AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
            AI assistant will not invent anything that is not drawn directly from the context provided.
            Answer in markdown syntax, with code snippets if needed. Be as detailed as possible when annswering, make sure there is no ambiguity in the answer.
        `,
    });
    for await (const delta of textStream){
        stream.update(delta)
    }

    stream.done()
})()

return {
    output : stream.value,
    filesReferences : result
}

};




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
