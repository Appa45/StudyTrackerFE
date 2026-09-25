interface AITutorInputProps {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export default function AITutorInput({
  value,
  isLoading,
  onChange,
  onSubmit,
}: AITutorInputProps) {
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex items-end gap-2">

        <textarea
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Ask me anything about your studies..."
          aria-label="Ask AI Tutor"
          className="min-h-[52px] flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading || !value.trim()}
          className="mb-1 flex h-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "..." : "Ask"}
        </button>

      </div>

      <div className="px-3 pb-1">
        <p className="text-[10px] text-slate-400">
          Press Enter to send • Shift + Enter for a new line
        </p>
      </div>
    </div>
  );
}