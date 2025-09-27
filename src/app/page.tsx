import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  const features = [
    {
      title: "Guided code tours",
      description:
        "AI generated walkthroughs spotlight the files, pull requests, and architecture decisions that matter on day one.",
    },
    {
      title: "Context-rich answers",
      description:
        "Your onboarding copilot answers questions in line, citing code, docs, and tribal knowledge without leaving the IDE.",
    },
    {
      title: "Adaptive learning paths",
      description:
        "Personalized onboarding roadmaps adjust to every engineer's background and learning velocity in real time.",
    },
    {
      title: "Team readiness analytics",
      description:
        "Visibility into sentiment, blockers, and progress keeps leads ahead of risk and accelerates time to first PR.",
    },
  ];

  const workflows = [
    {
      title: "Sync your repos",
      description:
        "Connect GitHub or GitLab and let us map critical services, domains, and workflows in minutes.",
    },
    {
      title: "Train the copilot",
      description:
        "Blend architecture docs, ADRs, and historical pull requests so every answer comes with project-specific context.",
    },
    {
      title: "Launch guided onboarding",
      description:
        "Invite new joiners, assign milestones, and watch AI adapt the learning plan as they ship their first commits.",
    },
  ];

  const stats = [
    { label: "Faster ramp-ups", value: "5x" },
    { label: "Time saved per hire", value: "38h" },
    { label: "Knowledge captured", value: "100%" },
  ];

  const primaryCtaHref = session?.user ? "/dashboard" : "/api/auth/signin?callbackUrl=/dashboard";
  const primaryCtaLabel = session?.user ? "Open dashboard" : "Get started";

  return (
    <HydrateClient>
      <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-purple-600/30 blur-3xl" />
          <div className="absolute right-[-15%] bottom-[-25%] h-[34rem] w-[34rem] rounded-full bg-sky-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(120,119,198,0.3),_transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-24 pt-12 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-sky-300">
                AI
              </span>
              <div>
                <p className="text-lg font-semibold">Git Onboarding Copilot</p>
                <p className="text-sm text-slate-400">
                  Accelerate productivity for every new engineer.
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-300">
              <a className="transition hover:text-white" href="#features">
                Features
              </a>
              <a className="transition hover:text-white" href="#workflow">
                Workflow
              </a>
              <a className="transition hover:text-white" href="#teams">
                For teams
              </a>
            </nav>
            <Link
              href={session ? "/api/auth/signout?callbackUrl=/" : "/api/auth/signin?callbackUrl=/dashboard"}
              className="inline-flex items-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              {session ? "Sign out" : "Log in"}
            </Link>
          </header>

          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sky-200">
                <span className="inline-block h-2 w-2 rounded-full bg-sky-400" />
                {hello ? hello.greeting : "AI that already knows your codebase"}
              </span>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
                AI onboarding engine tuned to your Git Repo.
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Git Onboarding Copilot distills your architecture, rituals, and tribal knowledge into an adaptive onboarding
                experience. New joiners ramp faster, ask better questions, and ship value without the hand-holding.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={primaryCtaHref}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-400"
                >
                  {primaryCtaLabel}
                  <span aria-hidden className="text-base">-&gt;</span>
                </Link>
                <Link
                  href="#workflow"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Explore the product
                </Link>
              </div>
              <div className="grid gap-4 pt-6 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center shadow-inner shadow-white/5"
                  >
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 backdrop-blur">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_65%)]" />
              <div className="space-y-6">
                <div className="rounded-2xl bg-slate-900/80 p-6 shadow-lg shadow-slate-900/40">
                  <p className="text-sm font-semibold text-slate-200">AI onboarding brief</p>
                  <p className="mt-3 text-sm text-slate-300">
                    "Your next step is the payments service. Review the recent refactor PR #482 for context on the new
                    event-driven flow."
                  </p>
                  <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-200">
                      QA
                    </span>
                    <span>Queued for Alice - Personalized by contribution history</span>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                  <p className="text-sm font-semibold text-slate-200">Live feed</p>
                  <ul className="mt-4 space-y-3 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Mentor pairing scheduled for Thursday at 10am.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-sky-400" />
                      Two knowledge gaps identified in observability stack.
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-400" />
                      Suggested reading: ADR-214 Service boundaries.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="space-y-10">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                Everything your onboarding playbook needs - automated.
              </h2>
              <p className="text-base text-slate-300">
                Pair tribal knowledge with code-aware AI so every engineer understands the why behind every service, PR, and
                decision that shapes your product.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/40 transition hover:border-sky-400/40 hover:shadow-sky-500/30"
                >
                  <div className="pointer-events-none absolute right-[-25%] top-[-35%] h-40 w-40 rounded-full bg-sky-500/10 blur-2xl transition group-hover:bg-sky-400/20" />
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="workflow" className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">How teams launch in a single afternoon.</h2>
              <p className="text-base text-slate-300">
                Git Onboarding Copilot plugs into existing repos, docs, and rituals. No scripts to maintain. No manual
                playbooks to keep up to date.
              </p>
            </div>
            <div className="space-y-6">
              {workflows.map((step, index) => (
                <div key={step.title} className="flex gap-5 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/20 text-base font-semibold text-sky-200">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="teams" className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 p-10 shadow-xl shadow-slate-900/50">
            <div className="max-w-3xl space-y-4">
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">Built for engineering teams that never stop shipping.</h2>
              <p className="text-base text-slate-300">
                From startups doubling headcount to platform teams mentoring interns, Git Onboarding Copilot keeps knowledge
                alive, onboarding repeatable, and velocity high.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold text-slate-200">Engineering leadership</p>
                <p className="mt-3 text-sm text-slate-300">
                  Forecast readiness, spot risks, and coach mentors with insights drawn from the team's real work.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold text-slate-200">Staff engineers</p>
                <p className="mt-3 text-sm text-slate-300">
                  Capture architecture narratives once. Let AI retell the story with accuracy for every new teammate.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-semibold text-slate-200">New joiners</p>
                <p className="mt-3 text-sm text-slate-300">
                  Ramp with clarity, track progress, and ship value without spending weeks chasing context.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={session ? "/api/auth/signout?callbackUrl=/" : "/api/auth/signin?callbackUrl=/dashboard"}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-slate-200"
              >
                {session ? "Manage session" : "Log in"}
                <span aria-hidden className="text-base">-&gt;</span>
              </Link>
              <Link href="#" className="text-sm font-semibold text-slate-300 transition hover:text-white">
                View security posture
              </Link>
            </div>
          </section>

          {session?.user && (
            <section id="latest" className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-white">Latest from the workspace</h3>
                  <p className="text-sm text-slate-300">
                    Fresh AI-generated insights tuned to your repositories and team rituals.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  Signed in as {session.user?.name}
                </span>
              </div>
              <LatestPost />
            </section>
          )}

          <footer className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-10 text-sm text-slate-400 sm:flex-row">
            <p>(c) {new Date().getFullYear()} Git Onboarding Copilot. Crafted with developers in mind.</p>
            <div className="flex gap-4">
              <a className="transition hover:text-white" href="#">Status</a>
              <a className="transition hover:text-white" href="#">Docs</a>
              <a className="transition hover:text-white" href="#">Privacy</a>
            </div>
          </footer>
        </div>
      </main>
    </HydrateClient>
  );
}
