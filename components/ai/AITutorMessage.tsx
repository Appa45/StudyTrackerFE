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
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          ✦
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isUser
            ? "rounded-2xl rounded-br-md bg-indigo-600 text-white"
            : "rounded-2xl rounded-bl-md bg-slate-50 text-slate-700"
        } px-4 py-3`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">
          {content}
        </p>

        {time && (
          <p
            className={`mt-2 text-[10px] ${
              isUser
                ? "text-indigo-200"
                : "text-slate-400"
            }`}
          >
            {time}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          A
        </div>
      )}
    </div>
  );
}