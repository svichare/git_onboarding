"use client";

import { type FormEvent, useState } from "react";

import { type TRPCClientErrorLike } from "@trpc/client";

import { type AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";

const providers = ["GitHub", "GitLab", "Bitbucket"] as const;

export function AddRepositoryForm() {
  const providerDefault = providers[0];

  const [url, setUrl] = useState("");
  const [provider, setProvider] = useState<typeof providers[number]>(
    providerDefault,
  );
  const [branch, setBranch] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusVariant, setStatusVariant] = useState<
    "success" | "error" | null
  >(null);

  const utils = api.useContext();

  const mutation = api.repo.add.useMutation({
    onSuccess: () => {
      setStatusMessage("Repository connected successfully.");
      setStatusVariant("success");
      setUrl("");
      setBranch("");
      setAccessToken("");

      void utils.repo.list.invalidate();
    },
    onError: (error: TRPCClientErrorLike<AppRouter>) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to connect repository.";

      setStatusMessage(message);
      setStatusVariant("error");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setStatusMessage(null);
    setStatusVariant(null);

    mutation.mutate({ url });
  };

  const statusClassName =
    statusVariant === "success"
      ? "text-xs text-emerald-400"
      : statusVariant === "error"
        ? "text-xs text-rose-400"
        : "hidden";

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" htmlFor="repo-url">
          Repository URL
        </label>
        <input
          id="repo-url"
          name="repo-url"
          type="url"
          placeholder="https://github.com/org/repo"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" htmlFor="provider">
            Provider
          </label>
          <select
            id="provider"
            name="provider"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            value={provider}
            onChange={(event) => setProvider(event.target.value as typeof providers[number])}
          >
            {providers.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" htmlFor="branch">
            Default branch
          </label>
          <input
            id="branch"
            name="branch"
            type="text"
            placeholder="main"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400" htmlFor="access">
          Access token
        </label>
        <input
          id="access"
          name="access"
          type="password"
          placeholder="Personal access token"
          className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          value={accessToken}
          onChange={(event) => setAccessToken(event.target.value)}
        />
        <p className="text-xs text-slate-500">Stored encrypted. Rotate tokens any time.</p>
      </div>
      <p className={statusClassName}>{statusMessage}</p>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {mutation.isPending ? "Connecting..." : "Connect repository"}
        <span aria-hidden className="text-base">-&gt;</span>
      </button>
    </form>
  );
}
