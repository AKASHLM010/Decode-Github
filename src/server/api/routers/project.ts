import z from "zod";
import { createTRPCRouter , protectedProcedure ,publicProcedure} from "../trpc";
import db from "@/lib/db";
import { pollCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";
import { get } from "http";

export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional(),
        })
    ).mutation(async ({ ctx , input }) => {
           const project = await ctx.db.project.create({
            data: {
                name: input.name,
                githubUrl: input.githubUrl,
                userToProjects: {
                    create: {
                        userId: ctx.user.userId!,
                    },
                },
            },
        });
        await indexGithubRepo(project.id , input.githubUrl , input.githubToken)
        await pollCommits(project.id);
        return project;
    }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.project.findMany({
            where: {
                userToProjects: {
                    some: { 
                        userId: ctx.user.userId! 
                    },
                },
                deletedAt: null
            },
            
        })
    }),
    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx,input })=>{
        pollCommits(input.projectId).then().catch(console.error)
        return await ctx.db.commit.findMany({where: {projectId: input.projectId } })
    }),
    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        filesReferences: z.any()
    })).mutation(async ({ ctx, input }) => {
        return await ctx.db.question.create({
            data: {
                answer: input.answer,
                filesReferences: input.filesReferences,
                projectId: input.projectId,
                question: input.question,
                userId: ctx.user.userId!,
            },
        });
    }),
    getQuestions: protectedProcedure.input(z.object({
        projectId:z.string()})).query(async ({ ctx, input }) => {
            return await ctx.db.question.findMany({
                where: {
                    projectId: input.projectId,
                },
                include:{
                    user: true,
                },
                orderBy: {
                    createdAt: 'desc',
                }
            });
        })
    });
