import { Octokit } from 'octokit';
import db from "@/lib/db";
import axios from 'axios';
import { headers } from 'next/headers';
import { aiSummariseCommit } from './gemini';

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const githubUrl = 'https://github.com/AKASHLM010/Decode-Github'
type Response ={
    commitHash: string;
    commitMessage: string;
    commitDate: string;
    commitAuthorName: string;
    commitAuthorAvatar: string; // corrected the property name
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    //[] Array destructuring to get owner and repo from the GitHub URL slice returns array of strings
    const [owner, repo] = githubUrl.split('/').slice(-2); // corrected the bracket from ']' to ']'
    if (!owner || !repo) {
        throw new Error('Invalid GitHub URL');
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo,
    });
    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[]
    
    return sortedCommits.slice(0, 10).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit.message ?? '',
        commitDate: commit.commit.author.date ?? '',
        commitAuthorName: commit.commit.author.name ?? '',
        commitAuthorAvatar: commit.author?.avatar_url ?? '', // corrected the property name
    }))
};

export const pollCommits = async (projectId: string) => {
    const { project, githubUrl } = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit => {
        return summariseCommits(githubUrl,commit.commitHash)
    }))
    const summaries = summaryResponses.map((response) =>{
        if(response.status === 'fulfilled'){
            return response.value as string
        }
        return ""
    })
    const commits = await db.commit.createMany({
        data: summaries.map((summary ,index)=>{
            console.log(`processing commit ${index}`)
            return {
                projectId : projectId,
                commitHash: unprocessedCommits[index]!.commitHash,
                commitMessage: unprocessedCommits[index]!.commitMessage,
                commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
                commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
                commitDate: unprocessedCommits[index]!.commitDate,
                summary
            }
        })
    })
    return commits;
    
}

async function summariseCommits(githubUrl: string, commitHash: string) {
    // get the diff and then pass to ai
const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
        Accept: 'application/vnd.github.v3.diff'
    }
});
return await aiSummariseCommit(data) || "";
}
    
    


async function fetchProjectGithubUrl(projectId: string){
    const project = await db.project.findUnique({ // corrected the syntax error
        where: {
            id: projectId,
        },
        select: {
            githubUrl: true,
        },
    });
    if (!project?.githubUrl) {
        throw new Error('GitHub URL not found for the project');
    }

    return { project, githubUrl: project?.githubUrl };
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: {
            projectId,
        },
    });

    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash));
    return unprocessedCommits;
}

