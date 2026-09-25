interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

const questions = [
  "Explain JavaScript Promise in simple terms",
  "What is useEffect in React?",
  "Explain REST API with an example",
  "How does async/await work?",
];

export default function SuggestedQuestions({
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Try asking
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => onSelect(question)}
            className="rounded-xl bg-slate-50 px-3 py-3 text-left text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}