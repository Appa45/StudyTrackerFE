"use client";

import { useState } from "react";

import AITutorHeader from "../../../components/ai/AITutorHeader";
import AITutorMessage from "../../../components/ai/AITutorMessage";
import AITutorInput from "../../../components/ai/AITutorInput";
import SuggestedQuestions from "@/components/ai/SuggestedQuestions";
import GeneratedQuizForm, {
  type GeneratedQuiz,
} from "../../../components/ai/GeneratedQuizForm";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time?: string;
  quiz?: GeneratedQuiz;
}

interface ExplainResponse {
  success: boolean;
  message?: string;
  data?: {
    explanation?: string;
  };
}

interface GenerateQuizResponse {
  success: boolean;
  message?: string;
  data?: GeneratedQuiz;
}

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi! I'm your StudyTrack AI Tutor. Ask me about React, JavaScript, Node.js, PostgreSQL, or any topic you're learning. You can also ask me to generate a quiz!",
    time: "Now",
  },
];

function isQuizRequest(text: string) {
  return /\b(quiz|quizzes|mcq|multiple[\s-]?choice questions|practice test|test me)\b/i.test(
    text
  );
}

function getQuestionCount(text: string): number {
  const match = text.match(
    /\b(\d{1,2})\s*[- ]?\s*(?:questions?|qns?|mcqs?)\b/i
  );

  if (!match) return 5;

  return Math.min(20, Math.max(1, Number(match[1])));
}

function getDifficulty(
  text: string
): "Beginner" | "Intermediate" | "Advanced" {
  if (/\b(advanced|hard|difficult|expert)\b/i.test(text)) {
    return "Advanced";
  }

  if (/\b(beginner|easy|basic)\b/i.test(text)) {
    return "Beginner";
  }

  return "Intermediate";
}

export default function AITutorPage() {
  const [messages, setMessages] =
    useState<Message[]>(initialMessages);

  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function askQuestion(selectedQuestion?: string) {
    const text = (selectedQuestion ?? question).trim();

    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
      time: "Now",
    };

    setMessages((previous) => [...previous, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      if (isQuizRequest(text)) {
        // Generate a quiz
        const response = await fetch(
          `${API_URL}/ai/generate-quiz`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              prompt: text,
              questionCount: getQuestionCount(text),
              difficulty: getDifficulty(text),
              questionType: "Multiple choice",
            }),
          }
        );

        const data: GenerateQuizResponse | null =
          await response.json().catch(() => null);

        if (!response.ok || !data?.success || !data.data) {
          throw new Error(
            data?.message || "Unable to generate the quiz."
          );
        }

        const quizMessage: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "Your quiz is ready! Select an answer for each question and submit when you're finished.",
          quiz: data.data,
          time: "Now",
        };

        setMessages((previous) => [
          ...previous,
          quizMessage,
        ]);

        return;
      }

      // Explain a topic
      const response = await fetch(`${API_URL}/ai/explain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          topic: text,
        }),
      });

      const data: ExplainResponse | null =
        await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to get an AI response."
        );
      }

      const explanation = data.data?.explanation;

      if (!explanation) {
        throw new Error("The AI did not return an explanation.");
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: explanation,
          time: "Now",
        },
      ]);
    } catch (error) {
      console.error("AI Tutor request failed:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, I couldn't process that request. Please try again.",
          time: "Now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSuggestedQuestion(selectedQuestion: string) {
    void askQuestion(selectedQuestion);
  }

  function clearChat() {
    setMessages(initialMessages);
    setQuestion("");
  }

  return (
    <div className="space-y-6">
      <AITutorHeader />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_300px]">
        {/* Chat */}
        <div className="flex min-h-[600px] flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                ✦
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  StudyTrack Tutor
                </p>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isLoading
                        ? "animate-pulse bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                  />

                  <span className="text-[10px] text-slate-400">
                    {isLoading ? "Thinking..." : "Ready to help"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              disabled={isLoading}
              className="text-xs font-medium text-slate-400 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear chat
            </button>
          </div>

          {/* Messages and generated quizzes */}
          <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
            {messages.map((message) => (
              <div key={message.id} className="min-w-0">
                <AITutorMessage
                  role={message.role}
                  content={message.content}
                  time={message.time}
                />

                {message.quiz && (
                  <div className="ml-0 mt-3 sm:ml-12">
                    <GeneratedQuizForm quiz={message.quiz} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div
                className="flex items-center gap-3"
                role="status"
                aria-label="AI is generating a response"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  ✦
                </div>

                <div className="rounded-2xl rounded-bl-md bg-slate-50 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions and input */}
          <div className="border-t border-slate-100 p-4 sm:p-5">
            {messages.length === 1 && (
              <div className="mb-5">
                <SuggestedQuestions
                  onSelect={handleSuggestedQuestion}
                />
              </div>
            )}

            <AITutorInput
              value={question}
              isLoading={isLoading}
              onChange={setQuestion}
              onSubmit={() => void askQuestion()}
            />

            <p className="mt-2 text-center text-[11px] text-slate-400">
              Try: “Generate a 5-question beginner React quiz”
            </p>
          </div>
        </div>

        {/* Right information panel */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-indigo-600 p-5 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              ✨
            </div>

            <h2 className="mt-4 text-base font-bold">
              Learn with AI
            </h2>

            <p className="mt-2 text-xs leading-5 text-indigo-100">
              Ask for simple explanations, examples, comparisons,
              or generate interactive quizzes to test your knowledge.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-sm font-bold text-slate-900">
              You can ask
            </h2>

            <div className="mt-4 space-y-3">
              {[
                {
                  title: "Explain simply",
                  example: "Explain useEffect like I'm a beginner.",
                },
                {
                  title: "Give an example",
                  example: "Show me a Promise example.",
                },
                {
                  title: "Generate a quiz",
                  example: "Generate a 5-question beginner React quiz.",
                },
              ].map((item) => (
                <button
                  key={item.title}
                  type="button"
                  disabled={isLoading}
                  onClick={() => void askQuestion(item.example)}
                  className="block w-full rounded-xl bg-slate-50 p-3 text-left transition hover:bg-indigo-50 disabled:opacity-50"
                >
                  <p className="text-xs font-medium text-slate-700">
                    {item.title}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {item.example}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-[11px] leading-5 text-amber-700">
              AI-generated explanations and quizzes may contain
              mistakes. Review the explanations and verify important
              information.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}