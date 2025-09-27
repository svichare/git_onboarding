import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/server/auth";

const mockRepos = [
  {
    name: "platform-core",
    provider: "GitHub",
    owner: "acme-inc",
    url: "https://github.com/acme-inc/platform-core",
    status: "Synced 2 minutes ago",
    pullRequests: 12,
  },
  {
    name: "mobile-client",
    provider: "GitLab",
    owner: "acme-mobile",
    url: "https://gitlab.com/acme-mobile/mobile-client",
    status: "Sync queued",
    pullRequests: 5,
  },
  {
    name: "observability",
    provider: "GitHub",
    owner: "platform-team",
    url: "https://github.com/platform-team/observability",
    status: "Synced 1 hour ago",
    pullRequests: 19,
  },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-purple-600/30 blur-3xl" />
        <div className="absolute right-[-15%] bottom-[-25%] h-[28rem] w-[28rem] rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.25),_transparent_55%)]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-12 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-sky-300">
              AI
            </span>
            <div>
              <p className="text-lg font-semibold">Git Onboarding Copilot</p>
              <p className="text-sm text-slate-400">Your personalized onboarding control center.</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-300">
            <Link className="transition hover:text-white" href="/">
              Home
            </Link>
            <a className="transition hover:text-white" href="#repos">
              Repos
            </a>
          </nav>
          <Link
            href="/api/auth/signout?callbackUrl=/"
            className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
          >
            Sign out
          </Link>
        </header>

        <section id="welcome" className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-slate-900/40">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Welcome back, {session.user.name ?? "Engineer"}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-slate-300">
              Keep your onboarding copilot up to date by connecting the repos that matter most to your team.
            </p>
          </div>
        </section>

        <section
          id="repos"
          className="grid gap-12 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-xl shadow-slate-900/50 lg:grid-cols-[0.9fr_1.1fr]"
        >
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Add a new repository</h2>
              <p className="text-sm text-slate-300">
                Connect a Git provider to unlock AI-guided code tours and contextual answers for every commit history.
              </p>
            </div>

            <form className="space-y-4">
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
                    defaultValue="GitHub"
                  >
                    <option>GitHub</option>
                    <option>GitLab</option>
                    <option>Bitbucket</option>
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
                />
                <p className="text-xs text-slate-500">Stored encrypted. Rotate tokens any time.</p>
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
              >
                Connect repository
                <span aria-hidden className="text-base">-&gt;</span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Connected repos</h3>
                <p className="text-sm text-slate-400">Synced sources powering your onboarding insights.</p>
              </div>
              <button className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white">
                Refresh syncs
              </button>
            </div>

            <ul className="space-y-4">
              {mockRepos.map((repo) => (
                <li
                  key={repo.url}
                  className="group flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-900/70 p-6 transition hover:border-sky-400/40 hover:shadow-lg hover:shadow-sky-500/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{repo.owner}/{repo.name}</p>
                    <p className="text-xs text-slate-400">{repo.provider} - {repo.status}</p>
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
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-xs text-slate-300">
                    <p>AI-suggested PRs</p>
                    <p className="pt-1 text-2xl font-semibold text-white">{repo.pullRequests}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-10 text-sm text-slate-400 sm:flex-row">
          <p>(c) {new Date().getFullYear()} Git Onboarding Copilot. Stay productive.</p>
          <div className="flex gap-4">
            <Link className="transition hover:text-white" href="/">
              Home
            </Link>
            <a className="transition hover:text-white" href="#">
              Support
            </a>
            <a className="transition hover:text-white" href="#">
              Changelog
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
