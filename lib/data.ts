export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image?: string;
  thumbnailObjectPosition?: string;
  imageType?: "portrait" | "landscape";
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  /** ISO date YYYY-MM-DD — chronological sort key */
  startDate: string;
  /** ISO date YYYY-MM-DD — completed projects only */
  endDate?: string;
  /**
   * Card display — derive from startDate / endDate:
   * - Ongoing: "Jan 2026 – Present"
   * - Finished (one month): "Apr 2025"
   * - Finished (span): "Mar 2025 – Apr 2025"
   */
  timeline?: string;
  categories: string[];
  tools: string[];
  githubUrl?: string;
  liveUrl?: string;
  takeaways: string[];
  workExamples?: string[];
  workExampleTypes?: ("portrait" | "landscape")[];
  workExampleCaptions?: string[];
}

export const projects: Project[] = [
  {
    id: "echoes-of-pharloom",
    title: "Echoes of Pharloom",
    description: "A Silksong-themed study app with a built-in Pomodoro timer, automatic break scheduling, focus-loss detection, and cloud-synced streaks. Built with a full AWS serverless backend from scratch.",
    longDescription: "Echoes of Pharloom is a Silksong-themed study app with automatic break scheduling, focus-loss detection, streak tracking, and session history. Built infrastructure-as-code from scratch: API Gateway, Lambda, DynamoDB, and Cognito all provisioned with AWS CDK. Local-first React/TypeScript state delivers sub-10ms UI refresh while syncing to DynamoDB for cross-device persistence.",
    image: "/assets/projects/eop-home.png",
    status: "In Progress",
    progress: 80,
    startDate: "2025-09-01",
    timeline: "Sep 2025 – Present",
    categories: ["Full-Stack", "AWS Serverless"],
    tools: ["TypeScript", "React", "AWS CDK", "API Gateway", "Lambda", "DynamoDB", "Cognito", "MSW"],
    githubUrl: "https://github.com/Hermano727/echoes-of-pharloom",
    liveUrl: "https://echoesofpharloom.com/",
    takeaways: [
      "Architected a full serverless backend with API Gateway, Lambda, DynamoDB, and Cognito using AWS CDK for repeatable infrastructure-as-code deployment; configured custom domain OAuth and IAM roles for secure cross-service access.",
      "Built a sub-10ms React/TypeScript timer engine with automatic break scheduling, focus-loss tab detection, and local-first state synced to DynamoDB for cross-device session persistence and streak history.",
      "Used MSW (Mock Service Worker) to decouple frontend development from backend iterations; shipped and demoed a live app at echoesofpharloom.com.",
    ],
    workExamples: ["/assets/projects/eop-home.png", "/assets/projects/eop-study.png"],
    workExampleTypes: ["landscape", "landscape"],
    workExampleCaptions: [
      "Home — session config, streak history, and soundtrack area selection",
      "Study — active timer with Silksong soundtrack, break scheduling, and focus-loss detection",
    ],
  },
  {
    id: "type-quest",
    title: "Type Quest — Adaptive Learning Platform",
    description:
      "K–6 typing and grammar mini-games (timed main game, maze treasure hunt, unscramble puzzles) built for UCSD CSE110 with Next.js and Redis—won Best Project for the Fall 2025 cohort.",
    longDescription:
      "Type Quest is a gamified adaptive learning experience for elementary learners, targeting grammar, spelling, and problem-solving through short, replayable modes: a race-the-clock typing game, a maze-based treasure hunt driven by word clues, and an unscramble challenge. The team shipped with an Agile workflow (Jira sprints); the live app runs on Vercel at typequest-legends.vercel.app. Stack highlights include React and TypeScript on Next.js, Redis-backed persistence, immutable state modeled with a finite state machine, and Vitest-backed tests around scoring and input normalization.",
    image: "/assets/projects/typequest-home.png",
    thumbnailObjectPosition: "center",
    status: "Completed",
    progress: 100,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    timeline: "Sep 2025 – Dec 2025",
    categories: ["EdTech", "Full-Stack"],
    tools: ["Next.js", "React", "TypeScript", "Vitest", "Redis", "Jira", "Agile"],
    githubUrl: "https://github.com/RamonsArchive/TypeQuest",
    liveUrl: "https://typequest-legends.vercel.app/",
    takeaways: [
      "Architected immutable state with a finite state machine so UI rendering stays decoupled from core game and lesson logic.",
      "Served as Scrum Master: owned the Jira backlog, facilitated sprints, and kept delivery predictable for a course-based engineering team.",
      "Engineered defensive persistence with schema migration so saved progress and sessions recover cleanly without data loss.",
      "Built input-normalization pipelines for fair scoring and backed them with a Vitest suite to lock down edge cases and regressions.",
    ],
    workExamples: ["/assets/projects/typequest-main.png", "/assets/projects/typequest-th.png"],
    workExampleTypes: ["landscape", "landscape"],
    workExampleCaptions: [
      "Main game — race the clock with grammatically correct words",
      "Treasure Hunt — maze mini-game tied to vocabulary clues",
    ],
  },
  {
    id: "swemaxx",
    title: "SWEMaxx",
    description: "Full-stack AI mock-interview platform for company-style technical rounds. Candidates work through a timed session with a real code editor and notes; the product captures what they said and wrote to produce an interviewer-style scorecard at the end.",
    longDescription: "SWEMaxx helps software engineering candidates practice realistic, company-style technical interviews — not generic LeetCode drills. Candidates work through a timed session with notes and a real code editor, while the product captures what they said and wrote to produce an interviewer-style scorecard. Optional modes add live guidance so practice feels closer to a real loop without giving away full solutions.",
    image: "/assets/projects/swemaxx-setup.png",
    thumbnailObjectPosition: "center",
    status: "In Progress",
    progress: 70,
    startDate: "2026-01-01",
    timeline: "Jan 2026 – Present",
    categories: ["Full-Stack", "AI Integration"],
    tools: ["Next.js", "TypeScript", "Firebase", "Firestore", "PostgreSQL", "OpenAI", "Monaco Editor", "WebSockets", "Deepgram", "Web Speech API"],
    githubUrl: "https://github.com/Hermano727/SWEmaxx",
    liveUrl: "https://swe-maxx-git-featur-ac1d2b-hermanhundsberger-gmailcoms-projects.vercel.app/",
    takeaways: [
      "Built authenticated REST API routes using Firebase ID token verification and Admin SDK with per-resource ownership checks — ensuring users can only read/write their own sessions and transcripts.",
      "Integrated OpenAI chat completions with JSON-only structured outputs, server-side schema validation, and prompt rules that treat all user-supplied content as untrusted — producing injection-safe end-of-session scorecards with hire-style ratings, strengths, and concrete feedback.",
      "Designed a hybrid data layer: Firestore for low-latency session metadata and history; PostgreSQL for ordered transcript chunks and interviewer messages — each store chosen for its access pattern, with APIs to append, merge, and replay content for grading.",
      "Implemented live speech capture (Web Speech API with buffered chunking + POST persistence) and extended with a Node.js WebSocket gateway using Deepgram streaming STT for low-latency transcription aligned to active interview sessions.",
    ],
    workExamples: ["/assets/projects/swemaxx-interview.png", "/assets/projects/swemaxx-feedback.png"],
    workExampleTypes: ["landscape", "landscape"],
    workExampleCaptions: [
      "Interview workspace — Monaco editor, timers, and phased rubric for company-style rounds",
      "End-of-session AI scorecard — structured feedback tied to what you said and wrote",
    ],
  },
  {
    id: "more-than-enough-utils",
    title: "MoreThanEnoughUtils — Hypixel SkyBlock QoL (Fabric, Java 21)",
    description:
      "Fabric client mod for Hypixel SkyBlock: farming macros, pest cleanup, one-click experimentation-table dailies, and bindable shortcut macros—tunable in a YACL GUI with Gson-backed config. Ported and modernized on Java 21 and Gradle (Kotlin DSL).",
    longDescription:
      "MoreThanEnoughUtils is a quality-of-life Fabric mod for Hypixel SkyBlock—think Garden farming, pests, and repetitive dailies—not an abstract “client app” pitch. Under the hood it’s still a structured Java 21 codebase: modular packages (config, macros, pests, pathfinder, SkyBlock helpers, render, util, mixins), Gson JSON persistence, YACL + ModMenu for settings, SLF4J logging, and a Brigadier-style client command (/mteu). Farming automation uses a finite state machine with timers, stuck recovery, and split horizontal/vertical movement so controls stay predictable. Pest workflows fuse scoreboard/tab signals, entity fingerprinting, particle-trail following (mixin on network particles, main-thread only), and pathfinding. Experimentation-table automation drives the real inventory UI on a schedule so the daily puzzle doesn’t eat manual clicks.",
    image: "/assets/projects/mteu-icon.jpg",
    thumbnailObjectPosition: "center",
    status: "In Progress",
    progress: 65,
    startDate: "2026-01-01",
    timeline: "Jan 2026 – Present",
    categories: ["Minecraft / Fabric", "Java"],
    tools: [
      "Java 21",
      "Gradle (Kotlin DSL)",
      "Fabric Loom",
      "Gson",
      "YACL",
      "ModMenu",
      "SLF4J",
      "Mixin",
      "Finite state machines",
    ],
    takeaways: [
      "Quality-of-life Fabric mod for Hypixel SkyBlock—farming, pests, dailies, and shortcuts players actually use every session.",
      "Farming macros: finite-state-machine control loop that reacts to collisions, player velocity, and aim/angle calculations so movement and attacks stay coordinated.",
      "Pest destroyer: follows vacuum particle trails, detects entities, matches them to known farming mobs using fingerprints + heuristics, and pathfinds using fused in-game signals (e.g. scoreboard + tab list).",
      "Automatic experimentation table: completes the in-game puzzle on a schedule for daily rewards—cuts manual intervention on that routine to effectively zero.",
      "Custom keybinds for macro shortcuts plus a YACL-based settings GUI (including drawn/custom config screens) backed by Gson persistence.",
    ],
  },
  {
    id: "splitr",
    title: "Splitr",
    description: "Built in 48 hours at DiamondHacks. Photograph a receipt and Splitr splits the bill automatically across your group, including tax and tip, at roughly 90% OCR accuracy.",
    longDescription: "Splitr lets you photograph a receipt, automatically extracts items and prices via OCR, then splits the bill proportionally across people including tax and tip. Built in 48 hours at DiamondHacks 2025. Owned system design and UI: Google Vision OCR → MistralAI JSON parsing → FastAPI validation → React Native assignment view, with typed contracts between every layer.",
    image: "/assets/splitr.png",
    imageType: "portrait",
    status: "Completed",
    progress: 100,
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    timeline: "Apr 2025",
    categories: ["Mobile Dev", "ML Pipeline"],
    tools: ["TypeScript", "React Native", "FastAPI", "Google Vision", "MistralAI", "Firebase", "Expo"],
    githubUrl: "https://github.com/Hermano727/diamondhacks25",
    liveUrl: "https://devpost.com/software/splitr-wa2frd",
    takeaways: [
      "Designed a multi-stage ML pipeline: Google Vision OCR → MistralAI JSON parsing → FastAPI validation → React Native render; benchmarked Llama3, OpenAI, and Mistral to optimize cost, latency, and schema reliability — Mistral won.",
      "Owned system design and UI: authored typed JSON contracts between frontend and backend, built resilient loading/error states, and maintained a consistent design system across the app.",
      "Identified a scope trade-off mid-hackathon — led the team to prioritize Profile, History, and polish over marginal OCR gains; shipped a polished, demoed MVP in under 48 hours.",
    ],
  },
];
