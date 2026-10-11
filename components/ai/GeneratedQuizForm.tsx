"use client";

import { useState } from "react";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation: string;
}

export interface GeneratedQuiz {
  title: string;
  questions: QuizQuestion[];
}

interface GeneratedQuizFormProps {
  quiz: GeneratedQuiz;
}

export default function GeneratedQuizForm({
  quiz,
}: GeneratedQuizFormProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = quiz.questions.reduce((total, question, index) => {
    return total + (answers[index] === question.correctAnswer ? 1 : 0);
  }, 0);

  function handleSubmit() {
    if (Object.keys(answers).length !== quiz.questions.length) {
      return;
    }

    setSubmitted(true);
  }

  function resetQuiz() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <div className="mt-4 w-full max-w-2xl rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            AI-generated quiz
          </span>

          <h3 className="mt-3 text-lg font-bold text-slate-900">
            {quiz.title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {quiz.questions.length} questions · Choose one answer per question.
          </p>
        </div>

        {submitted && (
          <div className="rounded-xl bg-emerald-50 px-3 py-2 text-right">
            <p className="text-xs text-emerald-700">Your score</p>
            <p className="text-lg font-bold text-emerald-800">
              {score}/{quiz.questions.length}
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 space-y-5">
        {quiz.questions.map((question, index) => {
          const isCorrect =
            answers[index] === question.correctAnswer;

          return (
            <div
              key={`${index}-${question.question}`}
              className="rounded-xl border border-slate-200 p-4"
            >
              <p className="text-sm font-semibold leading-6 text-slate-900">
                <span className="mr-2 text-indigo-600">
                  Q{index + 1}.
                </span>
                {question.question}
              </p>

              <div className="mt-3 space-y-2">
                {question.options.map((option) => {
                  const selected = answers[index] === option.id;
                  const correctOption =
                    submitted && option.id === question.correctAnswer;
                  const wrongSelected =
                    submitted && selected && !isCorrect;

                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${
                        correctOption
                          ? "border-emerald-300 bg-emerald-50"
                          : wrongSelected
                            ? "border-red-300 bg-red-50"
                            : selected
                              ? "border-indigo-300 bg-indigo-50"
                              : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50"
                      } ${
                        submitted
                          ? "cursor-default"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option.id}
                        checked={selected}
                        disabled={submitted}
                        onChange={() =>
                          setAnswers((previous) => ({
                            ...previous,
                            [index]: option.id,
                          }))
                        }
                        className="mt-0.5 accent-indigo-600"
                      />

                      <span className="min-w-0 flex-1 text-slate-700">
                        <span className="mr-2 font-semibold text-slate-500">
                          {option.id}.
                        </span>
                        {option.text}
                      </span>

                      {correctOption && (
                        <span className="text-xs font-semibold text-emerald-700">
                          Correct
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3">
                  <p
                    className={`text-xs font-semibold ${
                      isCorrect ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {isCorrect
                      ? "Correct answer!"
                      : `Correct answer: ${question.correctAnswer}`}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {question.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== quiz.questions.length}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit answers
        </button>
      ) : (
        <div className="mt-5">
          <p className="mb-3 text-center text-sm font-medium text-slate-700">
            {score === quiz.questions.length
              ? "Excellent work! You answered every question correctly."
              : score >= quiz.questions.length / 2
                ? "Good effort! Review the explanations to improve."
                : "Keep practicing! Review the answers and try again."}
          </p>

          <button
            type="button"
            onClick={resetQuiz}
            className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}