"use client";
import useProject from "@/hooks/use-project";
import React from "react";
import { api } from "@/trpc/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AskQuestionCard from "../dashboard/ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";

const QApage = () => {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId });
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const question = questions?.[questionIndex];

  return (
    <Sheet>
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions?.map((question, index) => {
          return (
            <React.Fragment key={question.id}>
              <SheetTrigger onClick={() => setQuestionIndex(index)}>
                <div className="flex items-center gap-4 rounded-lg border bg-white p-4 shadow">
                  <img
                    className="rounded-full"
                    height={30}
                    width={30}
                    src={question.user.imageUrl ?? ""}
                  />
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-2">
                      <p className="line-clamp-1 text-lg font-medium text-gray-700">
                        {question.question}
                      </p>
                      <span className="text-xs whitespace-nowrap text-gray-400">
                        {question.createdAt.toLocaleString()}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-sm text-gray-500">
                      {question.answer}
                    </p>
                  </div>
                </div>
              </SheetTrigger>
            </React.Fragment>
          );
        })}
      </div>

      {question && (
        <SheetContent className="overflow-auto sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold text-gray-800">
              <span className="mr-2 text-indigo-600">Q:</span>{" "}
              {question.question}
            </SheetTitle>

            <div className="overflow-auto rounded-md border bg-white p-4 shadow">
              <MDEditor.Markdown
                source={question.answer}
                className="prose bg-background text-foreground"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--muted-foreground)",
                }}
              />
            </div>

            <CodeReferences
              filesReferences={(question.filesReferences ?? []) as any}
            />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default QApage;
