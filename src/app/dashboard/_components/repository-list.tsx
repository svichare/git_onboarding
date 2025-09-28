"use client";

import Link from "next/link";
import { useState } from "react";

import { api } from "@/trpc/react";

export function RepositoryList() {
  const utils = api.useContext();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isPending, isError, error } = api.repo.list.useQuery();
  const deleteMutation = api.repo.delete.useMutation({
    onMutate: ({ id }) => {
      setDeleteError(null);
      setDeletingId(id);
    },
    onSuccess: async () => {
      await utils.repo.list.invalidate();
    },
    onError: (mutationError) => {
      setDeleteError(mutationError.message);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const handleDelete = (id: number, url: string) => {
    const confirmed = window.confirm(
      `Remove ${url}? This will disconnect the repository from your onboarding copilot.`,
    );

    if (!confirmed) return;

    deleteMutation.mutate({ id });
  };

  if (isPending) {
    return (
      <ul className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <li
            key={index}
            className="animate-pulse rounded-3xl border border-white/10 bg-slate-900/70 p-6"
          >
            <div className="h-4 w-1/3 rounded bg-white/10" />
            <div className="mt-3 h-3 w-2/3 rounded bg-white/5" />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6 text-sm text-rose-200">
        Failed to load repositories: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-300">
        No repositories connected yet. Add one to get started.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {deleteError ? (
        <li className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {deleteError}
        </li>
      ) : null}
      {data.map((repo) => (
        <li
          key={repo.id}
          className="group flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/30 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">{repo.url}</p>
            <p className="text-xs text-slate-400">
              Added {repo.createdAt.toLocaleDateString()} at {repo.createdAt.toLocaleTimeString()}
            </p>
            <Link
              className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 transition hover:text-sky-200"
              href={repo.url}
              target="_blank"
              rel="noreferrer"
            >
              View repository
              <span aria-hidden className="text-sm">-&gt;</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-slate-300">
              <p>AI-suggested PRs</p>
              <p className="pt-1 text-2xl font-semibold text-white">--</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(repo.id, repo.url)}
              disabled={deletingId === repo.id}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deletingId === repo.id ? "Removing..." : "Remove"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
