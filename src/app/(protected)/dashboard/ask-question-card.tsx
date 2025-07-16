"use client";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProject from "@/hooks/use-project";
import Image from "next/image";
import React, { useState } from "react";
import { askQuestion } from "./action";
import { readStreamableValue } from "ai/rsc";
import { se } from "date-fns/locale";
import { Code } from "lucide-react";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";

const AskQuestionCard = () => {
  const { project } = useProject();
  const [open, setOpen] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [filesReferences, setFilesReferences] = React.useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = React.useState("");
  const saveAnswer = api.project.saveAnswer.useMutation();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer("");
    setFilesReferences([]);
    e.preventDefault();
    if (!project?.id) return;
    setLoading(true);

    const { output, filesReferences } = await askQuestion(question, project.id);
    setOpen(true);
    setFilesReferences(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      console.log('💡 Frontend delta:', delta);   // <--- add this
      if (delta) {
        setAnswer((ans) => ans + delta);
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] overflow-auto sm:max-w-[70vw]">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <DialogTitle>
                <Image src="/logo.png" alt="decode" width={40} height={40} />
              </DialogTitle>
              
              <Button
                disabled={saveAnswer.isPending}
                variant="outline"
                onClick={() => {
                  console.log('Saving answer:', answer);
                  saveAnswer.mutate(
                    {
                      projectId: project!.id,
                      question,
                      answer,
                      filesReferences,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Answer saved successfully!");
                      },
                      onError: () => {
                        toast.error(`Failed to save answer`);
                      },
                    },
                  );
                }}
              >
                Save Answer
              </Button>
            </div>
          </DialogHeader>

          <MDEditor.Markdown
                source={answer}
                className="prose bg-background text-foreground"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--muted-foreground)",
                }}
              />

          <div className="h-4"></div>
          <CodeReferences filesReferences={filesReferences} />

          <Button type="button" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="Which file should i edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="h-4"></div>
            <Button type="submit" disabled={loading}>
              Ask Decode!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;
