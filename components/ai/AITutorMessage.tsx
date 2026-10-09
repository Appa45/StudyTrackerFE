
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AITutorMessageProps {
  role: "user" | "assistant";
  content: string;
  time?: string;
}

export default function AITutorMessage({
  role,
  content,
  time,
}: AITutorMessageProps) {
  // User message: compact bubble on the right
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[88%] sm:max-w-[75%]">
          <div className="whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-indigo-600 px-4 py-3 text-sm leading-6 text-white shadow-sm">
            {content}
          </div>

          {time && (
            <p className="mt-1.5 text-right text-[11px] text-slate-400">
              {time}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Assistant message: white card on the left
  return (
    <div className="flex items-start gap-3">
      {/* AI avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg text-indigo-700 ring-1 ring-indigo-200/60">
        ✦
      </div>

      <div className="min-w-0 flex-1">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
          {/* Card header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-slate-900">
                  StudyTrack AI
                </h3>

                <p className="mt-0.5 text-xs text-slate-500">
                  Your learning assistant
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold text-indigo-600">
              AI RESPONSE
            </span>
          </div>

          {/* Formatted AI content */}
          <div className="px-4 py-4 text-sm leading-7 text-slate-700 sm:px-5 sm:py-5 [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1:first-child]:mt-0 [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-slate-900 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-300 [&_blockquote]:bg-indigo-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:text-slate-700 [&_hr]:my-4 [&_hr]:border-slate-200 [&_a]:font-medium [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => (
                  <pre className="my-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs leading-6 text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
                    {children}
                  </pre>
                ),
                code: ({ children }) => (
                  <code className="break-words rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-indigo-700">
                    {children}
                  </code>
                ),
                table: ({ children }) => (
                  <div className="my-4 overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full border-collapse text-left text-sm">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-800">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border-b border-slate-100 px-3 py-2">
                    {children}
                  </td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        {time && (
          <p className="ml-1 mt-2 text-[11px] text-slate-400">
            {time}
          </p>
        )}
      </div>
    </div>
  );
}
