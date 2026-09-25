import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import TopicHeader from "../../../../components/topics/TopicHeader";
import TopicStats from "../../../../components/topics/TopicStats";
import TopicProgress from "../../../../components/topics/TopicProgress";
import TopicInformation from "../../../../components/topics/TopicInformation";
import TopicLessons from "../../../../components/topics/TopicLessons";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

type Difficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

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

  resourceType?:
    | "none"
    | "image"
    | "pdf"
    | "external";

  resourceUrl?: string;

  completed: boolean;
  completedAt?: string | null;
  order: number;

  createdAt?: string;
  updatedAt?: string;
}

interface TopicResponse {
  success: boolean;
  data?: ApiTopic;
  topic?: ApiTopic;
  message?: string;
}

interface LessonsResponse {
  success: boolean;
  data?: Lesson[];
  message?: string;
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

interface TopicDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TopicDetailsPage({
  params,
}: TopicDetailsPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  /*
   * =====================================================
   * FETCH TOPIC
   * =====================================================
   */

  let topicResponse: Response;

  try {
    topicResponse = await fetch(
      `${API_URL}/topics/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      }
    );
  } catch (error) {
    console.error(
      "Topic API connection error:",
      error
    );

    throw new Error(
      "Unable to connect to the backend server."
    );
  }

  const topicResult: TopicResponse =
    await topicResponse
      .json()
      .catch(() => ({
        success: false,
      }));

  if (topicResponse.status === 404) {
    notFound();
  }

  if (topicResponse.status === 401) {
    throw new Error(
      "You are not authenticated. Please login again."
    );
  }

  if (!topicResponse.ok) {
    throw new Error(
      topicResult.message ||
        "Unable to load topic."
    );
  }

  const apiTopic =
    topicResult.data ??
    topicResult.topic;

  if (!apiTopic) {
    notFound();
  }

  /*
   * =====================================================
   * FETCH LESSONS
   * =====================================================
   */

  let lessons: Lesson[] = [];

  try {
    const lessonsResponse = await fetch(
      `${API_URL}/topics/${encodeURIComponent(
        id
      )}/lessons`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      }
    );

    const lessonsResult: LessonsResponse =
      await lessonsResponse
        .json()
        .catch(() => ({
          success: false,
        }));

    if (lessonsResponse.ok) {
      lessons =
        lessonsResult.data ?? [];
    } else {
      console.error(
        "Lessons API error:",
        lessonsResponse.status,
        lessonsResult.message
      );
    }
  } catch (error) {
    console.error(
      "Lessons API connection error:",
      error
    );

    lessons = [];
  }

  /*
   * =====================================================
   * CALCULATE LESSON STATS
   * =====================================================
   */

  const totalLessons =
    lessons.length;

  const completedLessons =
    lessons.filter(
      (lesson) => lesson.completed
    ).length;

  const remainingLessons = Math.max(
    totalLessons - completedLessons,
    0
  );

  const progress =
    totalLessons > 0
      ? Math.round(
          (completedLessons /
            totalLessons) *
            100
        )
      : 0;

  /*
   * IMPORTANT:
   * Explicitly type this as TopicStatus.
   *
   * This fixes:
   *
   * Type 'string' is not assignable to
   * type '"Not Started" | "In Progress" | "Completed"'
   */

  const status: TopicStatus =
    progress === 100
      ? "Completed"
      : progress > 0
      ? "In Progress"
      : "Not Started";

  /*
   * =====================================================
   * FORMAT TARGET DATE
   * =====================================================
   */

  const targetDate =
    apiTopic.targetDate
      ? new Intl.DateTimeFormat(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ).format(
          new Date(apiTopic.targetDate)
        )
      : "Not specified";

  /*
   * =====================================================
   * CREATE TYPED TOPIC OBJECT
   * =====================================================
   */

  const topic: TopicDetailsData = {
    id: apiTopic._id,

    title: apiTopic.title,

    subject: apiTopic.subject,

    difficulty:
      apiTopic.difficulty,

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

  /*
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <div className="space-y-6">
      {/* =================================================
          TOPIC HEADER
      ================================================= */}

      <TopicHeader
        topic={topic}
      />

      {/* =================================================
          TOPIC STATS
      ================================================= */}

      <TopicStats
        progress={topic.progress}
        completedLessons={
          topic.completedLessons
        }
        totalLessons={
          topic.totalLessons
        }
        targetDate={
          topic.targetDate
        }
      />

      {/* =================================================
          PROGRESS + INFORMATION
      ================================================= */}

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <TopicProgress
          progress={topic.progress}
          completedLessons={
            topic.completedLessons
          }
          totalLessons={
            topic.totalLessons
          }
        />

        <TopicInformation
          subject={topic.subject}
          difficulty={topic.difficulty}
          targetDate={topic.targetDate}
          estimatedTime={
            topic.estimatedTime
          }
          status={topic.status}
        />
      </section>

      {/* =================================================
          LESSONS
      ================================================= */}

      <TopicLessons
        topicId={topic.id}
        initialLessons={lessons}
      />

      {/* =================================================
          AI TUTOR
      ================================================= */}

      <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
            AI Tutor
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Need help with this topic?
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Ask the AI tutor questions about
            this topic and get personalized
            explanations.
          </p>
        </div>
      </section>
    </div>
  );
}