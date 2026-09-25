"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import TopicCard, {
  type Topic,
} from "../../../components/topics/TopicCard";

import TopicFilters from "../../../components/topics/TopicFilters";
import TopicEmptyState from "../../../components/topics/TopicEmptyState";
import AddTopicModal from "../../../components/topics/AddTopicModal";
import type { TopicFormValues } from "@/components/topics/TopicForm";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/*
 * Backend topic response.
 *
 * MongoDB/Mongoose returns _id.
 * The UI uses id.
 */
interface ApiTopic {
  _id: string;
  title: string;
  subject: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  progress: number;
  status: "Not Started" | "In Progress" | "Completed";
  targetDate: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TopicsApiResponse {
  success: boolean;
  data?: ApiTopic[];
  message?: string;
}

interface CreateTopicApiResponse {
  success: boolean;
  message?: string;
  topic?: ApiTopic;
}

/*
 * Gives every subject a consistent UI color.
 * This value is only for the frontend and is not
 * stored in MongoDB.
 */
function getTopicColorClass(subject: string) {
  const colors: Record<string, string> = {
    Frontend: "bg-cyan-50 text-cyan-600",
    JavaScript: "bg-yellow-50 text-yellow-600",
    Backend: "bg-green-50 text-green-600",
    Database: "bg-blue-50 text-blue-600",
    React: "bg-indigo-50 text-indigo-600",
    TypeScript: "bg-blue-50 text-blue-600",
    DevOps: "bg-orange-50 text-orange-600",
    Testing: "bg-purple-50 text-purple-600",
  };

  return (
    colors[subject] ||
    "bg-slate-50 text-slate-600"
  );
}

/*
 * Convert MongoDB topic into the UI Topic type.
 */
function mapApiTopicToTopic(topic: ApiTopic): Topic {
  return {
    id: topic._id,
    title: topic.title,
    subject: topic.subject,
    difficulty: topic.difficulty,
    progress: topic.progress,
    status: topic.status,
    targetDate: new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(topic.targetDate)),
    description: topic.description,
    colorClass: getTopicColorClass(topic.subject),
  };
}

export default function TopicsPage() {
  const router = useRouter();

  const [topics, setTopics] = useState<Topic[]>([]);

  const [search, setSearch] = useState("");
  const [subject, setSubject] =
    useState("All Subjects");

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isCreating, setIsCreating] =
    useState(false);

  const [deletingTopicId, setDeletingTopicId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  /*
   * -------------------------------------------------------
   * FETCH TOPICS
   * -------------------------------------------------------
   */
  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      /*
       * We request all topics for the logged-in user.
       * Authentication is handled through the httpOnly JWT
       * cookie set during login.
       */
      const response = await fetch(
        `${API_URL}/topics`,
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data: TopicsApiResponse =
        await response.json().catch(() => ({
          success: false,
        }));

      /*
       * Session expired / user not authenticated.
       */
      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load topics."
        );
      }

      const apiTopics = data.data || [];

      setTopics(
        apiTopics.map(mapApiTopicToTopic)
      );
    } catch (error) {
      console.error(
        "Fetch topics error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load topics."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  /*
   * Load topics when the page opens.
   */
  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  /*
   * -------------------------------------------------------
   * SEARCH + SUBJECT FILTER
   * -------------------------------------------------------
   *
   * We keep these filters on the client because the API has
   * already returned the user's topic list.
   */
  const filteredTopics = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return topics.filter((topic) => {
      const matchesSearch =
        !normalizedSearch ||
        topic.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        topic.subject
          .toLowerCase()
          .includes(normalizedSearch) 

      const matchesSubject =
        subject === "All Subjects" ||
        topic.subject === subject;

      return (
        matchesSearch &&
        matchesSubject
      );
    });
  }, [topics, search, subject]);

  /*
   * -------------------------------------------------------
   * CREATE TOPIC
   * -------------------------------------------------------
   */
  async function handleCreateTopic(
    values: TopicFormValues
  ) {
    try {
      setIsCreating(true);
      setError("");

      const response = await fetch(
        `${API_URL}/topics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: values.title.trim(),
            subject: values.subject.trim(),
            difficulty: values.difficulty,
            description:
              values.description.trim(),
            progress: values.progress,
            targetDate: values.targetDate,
            status: values.status,
          }),
        }
      );

      const data: CreateTopicApiResponse =
        await response.json().catch(() => ({
          success: false,
        }));

      /*
       * Authentication expired.
       */
      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create topic."
        );
      }

      /*
       * Add the newly created topic to the UI
       * immediately without another GET request.
       */
      if (data.topic) {
        const newTopic =
          mapApiTopicToTopic(data.topic);

        setTopics((previous) => [
          newTopic,
          ...previous,
        ]);
      } else {
        /*
         * Fallback if backend doesn't return
         * the created topic.
         */
        await fetchTopics();
      }

      /*
       * Close modal after successful creation.
       */
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(
        "Create topic error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to create topic."
      );
    } finally {
      setIsCreating(false);
    }
  }

  /*
   * -------------------------------------------------------
   * DELETE TOPIC
   * -------------------------------------------------------
   */
  async function handleDelete(id: string) {
    const topic = topics.find(
      (item) => item.id === id
    );

    if (!topic) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${topic.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTopicId(id);
      setError("");

      const response = await fetch(
        `${API_URL}/topics/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response
        .json()
        .catch(() => ({}));

      /*
       * Authentication expired.
       */
      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete topic."
        );
      }

      /*
       * Remove the deleted topic from local UI.
       */
      setTopics((previous) =>
        previous.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete topic error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete topic."
      );
    } finally {
      setDeletingTopicId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">
        {/* =========================================
            HEADER
        ========================================== */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Learning workspace
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Topics
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your study topics and track your
              progress.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            {topics.length}{" "}
            {topics.length === 1
              ? "topic"
              : "topics"}
          </div>
        </section>

        {/* =========================================
            API ERROR
        ========================================== */}
        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={fetchTopics}
              className="w-fit rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* =========================================
            FILTERS
        ========================================== */}
        <TopicFilters
          search={search}
          subject={subject}
          onSearchChange={setSearch}
          onSubjectChange={setSubject}
          onAddTopic={() =>
            setIsAddModalOpen(true)
          }
        />

        {/* =========================================
            TOPICS
        ========================================== */}
        <section>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-40 rounded bg-slate-200" />

                      <div className="mt-2 h-3 w-24 rounded bg-slate-100" />

                      <div className="mt-5 h-2 w-full rounded bg-slate-100" />
                    </div>

                    <div className="h-6 w-20 rounded-full bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTopics.length > 0 ? (
            <div className="space-y-3">
              {filteredTopics.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onDelete={handleDelete}
                  deleting={
                    deletingTopicId === topic.id
                  }
                />
              ))}
            </div>
          ) : (
            <TopicEmptyState
              hasSearch={
                search.length > 0 ||
                subject !== "All Subjects"
              }
            />
          )}
        </section>
      </div>

      {/* =========================================
          ADD TOPIC MODAL
      ========================================== */}
      <AddTopicModal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (!isCreating) {
            setIsAddModalOpen(false);
          }
        }}
        onCreate={handleCreateTopic}
      />
    </>
  );
}