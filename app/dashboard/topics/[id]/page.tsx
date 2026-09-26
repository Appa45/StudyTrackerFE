"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import TopicHeader from "../../../../components/topics/TopicHeader";
import TopicStats from "../../../../components/topics/TopicStats";
import TopicProgress from "../../../../components/topics/TopicProgress";
import TopicInformation from "../../../../components/topics/TopicInformation";
import TopicLessons from "../../../../components/topics/TopicLessons";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type TopicStatus =
  | "Not Started"
  | "In Progress"
  | "Completed";

interface ApiTopic {
  _id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  progress?: number;
  status?: TopicStatus;
  targetDate?: string;
  description?: string;
  estimatedTime?: string;
  completedLessons?: number;
  totalLessons?: number;
}

interface Lesson {
  _id: string;
  topicId: string;
  title: string;
  description?: string;
  content?: string;
  resourceType?: "none" | "image" | "pdf" | "external";
  resourceUrl?: string;
  completed: boolean;
  completedAt?: string | null;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TopicDetailsData {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  progress: number;
  status: TopicStatus;
  targetDate: string;
  description: string;
  estimatedTime: string;
  completedLessons: number;
  totalLessons: number;
  remainingLessons: number;
}

interface TopicResponse {
  success: boolean;
  topic?: ApiTopic;
  data?: ApiTopic;
  message?: string;
}

interface LessonsResponse {
  success: boolean;
  data?: Lesson[];
  message?: string;
}

export default function TopicDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id as string;

  const [topic, setTopic] = useState<TopicDetailsData | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadTopicDetails() {
      try {
        setLoading(true);
        setError("");

        console.log("Topic Details API:", {
          apiUrl: API_URL,
          topicId: id,
        });

        /*
         * 1. Get topic
         */
        const topicResponse = await fetch(
          `${API_URL}/topics/${encodeURIComponent(id)}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        console.log(
          "Topic details response:",
          topicResponse.status
        );

        const topicResult: TopicResponse =
          await topicResponse.json();

        console.log("Topic details result:", topicResult);

        if (topicResponse.status === 401) {
          router.push("/login");
          return;
        }

        if (!topicResponse.ok || !topicResult.success) {
          throw new Error(
            topicResult.message ||
              "Unable to load topic details."
          );
        }

        const apiTopic =
          topicResult.topic ?? topicResult.data;

        if (!apiTopic) {
          throw new Error("Topic data was not returned.");
        }

        /*
         * 2. Get lessons
         */
        let fetchedLessons: Lesson[] = [];

        try {
          const lessonsResponse = await fetch(
            `${API_URL}/topics/${encodeURIComponent(id)}/lessons`,
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

          const lessonsResult: LessonsResponse =
            await lessonsResponse.json();

          if (lessonsResponse.ok && lessonsResult.success) {
            fetchedLessons = lessonsResult.data ?? [];
          }
        } catch (lessonError) {
          console.error(
            "Lessons API error:",
            lessonError
          );
        }

        /*
         * 3. Calculate lesson statistics
         */
        const totalLessons = fetchedLessons.length;

        const completedLessons =
          fetchedLessons.filter(
            (lesson) => lesson.completed
          ).length;

        const remainingLessons = Math.max(
          totalLessons - completedLessons,
          0
        );

        const progress =
          totalLessons > 0
            ? Math.round(
                (completedLessons / totalLessons) * 100
              )
            : Number(apiTopic.progress ?? 0);

        const status: TopicStatus =
          progress >= 100
            ? "Completed"
            : progress > 0
            ? "In Progress"
            : "Not Started";

        /*
         * 4. Format target date
         */
        const targetDate = apiTopic.targetDate
          ? new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }).format(new Date(apiTopic.targetDate))
          : "Not specified";

        /*
         * 5. Build frontend topic object
         */
        const topicData: TopicDetailsData = {
          id: apiTopic._id,
          title: apiTopic.title,
          subject: apiTopic.subject,
          difficulty: apiTopic.difficulty,
          progress,
          status,
          targetDate,
          description:
            apiTopic.description ||
            "No description available.",
          estimatedTime:
            apiTopic.estimatedTime ||
            "Not specified",
          completedLessons,
          totalLessons,
          remainingLessons,
        };

        setTopic(topicData);
        setLessons(fetchedLessons);
      } catch (error) {
        console.error(
          "Topic Details API error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load topic details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTopicDetails();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading topic details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-700">
          Unable to load topic
        </h2>

        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!topic) {
    return null;
  }

  return (
    <div className="space-y-6">
      <TopicHeader topic={topic} />

      <TopicStats
        progress={topic.progress}
        completedLessons={topic.completedLessons}
        totalLessons={topic.totalLessons}
        targetDate={topic.targetDate}
      />

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TopicProgress
          progress={topic.progress}
          completedLessons={topic.completedLessons}
          totalLessons={topic.totalLessons}
        />

        <TopicInformation
          subject={topic.subject}
          difficulty={topic.difficulty}
          targetDate={topic.targetDate}
          estimatedTime={topic.estimatedTime}
          status={topic.status}
        />
      </section>

      <TopicLessons
        topicId={topic.id}
        initialLessons={lessons}
      />

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            AI Tutor
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Need help with this topic?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ask the AI tutor questions about this topic
            and get personalized explanations.
          </p>
        </div>
      </section>
    </div>
  );
}