import { Octokit } from 'octokit';
import db from "@/lib/db";
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
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);

  console.log(`✅ Commits to process (new): ${unprocessedCommits.length}`);

  const summaries: string[] = [];

  for (const commit of unprocessedCommits) {
    console.log(`📦 Summarising commit ${commit.commitHash}`);
    try {
      const summary = await summariseCommits(githubUrl, commit.commitHash);
      summaries.push(summary);
    } catch (error) {
      console.error(`❌ Failed to summarise commit ${commit.commitHash}:`, error);
      summaries.push(""); // fallback empty summary
    }
  }

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      console.log(`processing commit ${index}`);
      return {
        projectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary
      };
    })
  });

  return commits;
};



async function summariseCommits(githubUrl: string, commitHash: string) {
  console.log(`🔍 summariseCommits called for commitHash: ${commitHash}`);

  try {
    const [owner, repo] = githubUrl.split('/').slice(-2);

    if (!owner || !repo) {
      throw new Error('Invalid GitHub URL');
    }

    const { data } = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: commitHash
    });

    // Combine patches into a single diff string
    const diff = (data.files ?? [])
      .map(file => file.patch)
      .filter(Boolean)
      .join('\n');

    console.log(`📦 Fetched diff for commit ${commitHash}, length: ${diff.length}`);

    return await aiSummariseCommit(diff) || "";
  } catch (error) {
    console.error(`❌ Failed to fetch diff or summarise for commit ${commitHash}:`, error);
    return ""; // or throw if you want Promise.allSettled to catch
  }
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
    where: { projectId },
  });

  console.log(`🔍 Already processed commits for projectId=${projectId}:`, processedCommits.map(c => c.commitHash));

  const unprocessedCommits = commitHashes.filter((commit) =>
    !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash)
  );

  console.log(`✅ Commits to process (new): ${unprocessedCommits.length}`);
  return unprocessedCommits;
}
