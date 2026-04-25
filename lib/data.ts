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
  /** Compact grid subtitle under title (defaults to first two categories) */
  gridMeta?: string;
  /** Compact grid bullets only; expanded view still uses takeaways */
  gridPreviewBullets?: string[];
  /** Expanded context block — shown above Highlights */
  contextProblem?: string;
  contextWhen?: string;
  contextWhere?: string;
  contextStack?: string;
}

export const projects: Project[] = [
  {
    id: "reg2schedg",
    title: "Reg2Schedg",
    gridMeta: "Full-Stack · Multimodal AI",
    description:
      "Intelligent UCSD academic planner: upload a WebReg screenshot and get a course-intelligence dashboard with professor ratings, grade distributions, Reddit sentiment, workload fit scores, and calendar-ready planning support.",
    longDescription:
      "Reg2Schedg turns static WebReg screenshots into actionable planning decisions. The product uses multimodal parsing to recover schedule data, then runs a concurrent enrichment pipeline across Reddit, RateMyProfessors, and UCSD catalog sources. Results are fused into typed course intelligence with evidence extraction, relevance scoring, and logistics views for weekly planning. To keep performance and cost under control, the backend combines per-course caches with schedule-signature fast paths and TTL-based invalidation, while the frontend delivers interactive drag-reschedulable calendar planning, undo/redo flows, and campus map navigation.",
    image: "/assets/projects/r2s_icon.png",
    status: "In Progress",
    progress: 85,
    startDate: "2026-02-01",
    timeline: "Feb 2026 – Present",
    categories: ["Full-Stack", "Education"],
    tools: [
      "Gemini",
      "Browser Use",
      "UCSD catalog scraping",
      "Supabase",
      "FastAPI",
      "Pydantic",
      "Next.js 15",
      "React Hooks",
      "Leaflet",
      "JWT",
      "TypeScript",
    ],
    liveUrl: "https://reg2schedg.com/",
    gridPreviewBullets: [
      "Built a UCSD student scheduling hub that consolidates RateMyProf, Reddit, grade distributions,and catalog data.",
      "Architected a concurrent Tier 0/1/2 enrichment pipeline (Reddit, RateMyProfessors, UCSD catalog) with relevance scoring + evidence extraction.",
      "Cut repeat compute and API cost with normalized per-course caches plus a SHA-256 schedule-signature fast path (TTL 14 days).",
      "Shipped v1→v2 payload versioning (reference-based storage + expansion endpoint) to speed reloads and support schema evolution.",
    ],
    contextProblem:
      "Built to help UCSD students move from uncertain registration screenshots to data-backed scheduling decisions with minimal manual research.",
    contextWhen: "Feb 2026 – Present",
    contextWhere: "Personal full-stack project focused on student scheduling workflows.",
    contextStack:
      "Next.js 15 + TypeScript frontend with FastAPI orchestration, Supabase auth/storage/data, and Gemini-based multimodal parsing/synthesis.",
    takeaways: [
      "Engineered a full-stack monorepo (Next.js 15 + FastAPI) that converts WebReg screenshots into actionable course-intelligence dashboards.",
      "Designed a multistage research pipeline that fuses Reddit sentiment, RateMyProfessors data, and UCSD catalog signals, then synthesizes outputs into structured typed insights with Gemini.",
      "Implemented concurrent backend tiers (parallel Tier 0/1/2) with relevance scoring and evidence extraction to improve both speed and answer quality.",
      "Reduced repeat computation and external API cost using normalized per-course cache keys plus SHA-256 schedule-signature fast paths with a 14-day TTL.",
      "Shipped versioned payload evolution (v1 full payload to v2 reference-based payload + expansion endpoint) to support leaner storage and scalable plan reloads.",
      "Delivered interactive planning UX with drag-reschedulable weekly calendar, undo/redo controls, dossier modals, and map-based campus navigation.",
    ],
    workExamples: [
      "/assets/projects/r2s_home.png",
      "/assets/projects/r2s_overview.png",
      "/assets/projects/r2s_quicklinks.png",
    ],
    workExampleTypes: ["landscape", "landscape", "landscape"],
    workExampleCaptions: [
      "Home flow — upload WebReg screenshot and launch schedule intelligence",
      "Overview dashboard — professor, grading, sentiment, and workload synthesis",
      "Quick links panel — actionable planning shortcuts and next-step navigation",
    ],
  },
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
    tools: ["AWS CDK", "Lambda", "DynamoDB", "Cognito", "API Gateway", "React", "TypeScript", "MSW"],
    githubUrl: "https://github.com/Hermano727/echoes-of-pharloom",
    liveUrl: "https://echoesofpharloom.com/",
    gridPreviewBullets: [
      "Study app designed for Silksong fans, featuring Pomodoro, smart breaks, focus detection, synced streaks.",
      "AWS Stack: CDK serverless, API Gateway, Lambda.",
      "Features fast DynamoDB cross-device sync and Cognito auth.",
    ],
    contextProblem:
      "Built to make deep-work sessions feel less repetitive by combining timed focus, breaks, and streak accountability in one themed flow.",
    contextWhen: "Sep 2025 – Present",
    contextWhere: "Personal project, shipped publicly on Vercel.",
    contextStack:
      "React + TypeScript frontend with AWS CDK serverless backend (API Gateway, Lambda, DynamoDB, Cognito).",
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
    title: "Type Quest: Adaptive Learning Platform",
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
    tools: ["Redis", "Vitest", "Finite State Machine", "Next.js", "React", "TypeScript", "Jira", "Agile"],
    githubUrl: "https://github.com/RamonsArchive/TypeQuest",
    liveUrl: "https://typequest-legends.vercel.app/",
    gridPreviewBullets: [
      "Won best project for CSE110: Software Engineering, Fall 2025 Cohort @ UCSD",
      "K-6 typing and grammar mini-games with iterative learning",
      "Served as SCRUM Master, managing Jira backlog and sprints",
    ],
    contextProblem:
      "Designed to make foundational typing and grammar practice more engaging for K-6 learners through short, replayable games.",
    contextWhen: "Sep 2025 – Dec 2025",
    contextWhere: "UCSD CSE110 team project (Fall 2025).",
    contextStack:
      "Next.js + TypeScript app with Redis persistence, FSM-driven game logic, and Vitest coverage.",
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
    tools: ["OpenAI", "Monaco Editor", "Deepgram", "PostgreSQL", "Firestore", "Firebase", "WebSockets", "Web Speech API", "Next.js", "TypeScript"],
    githubUrl: "https://github.com/Hermano727/SWEmaxx",
    liveUrl: "https://swe-maxx-git-featur-ac1d2b-hermanhundsberger-gmailcoms-projects.vercel.app/",
    gridPreviewBullets: [
      "Company-style mock interviews: timed rounds, editor, AI scorecards, optional live hints.",
      "OpenAI grades sessions; Postgres stores transcript chunks.",
      "Firebase-gated REST APIs—users only touch their own data.",
    ],
    contextProblem:
      "Built for SWE candidates who need realistic interview practice with actionable feedback, not just coding drills.",
    contextWhen: "Jan 2026 – Present",
    contextWhere: "Personal full-stack build, developed and deployed on Vercel.",
    contextStack:
      "Next.js + TypeScript app with Firebase auth, Firestore/PostgreSQL data split, OpenAI grading, and live speech pipelines.",
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
    title: "MoreThanEnoughUtils: Hypixel SkyBlock QoL Modifications",
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
    githubUrl: "https://github.com/Hermano727/MoreThanEnoughUtils",
    gridPreviewBullets: [
      "SkyBlock Fabric QoL: farming macros, pest routes, one-click dailies. Utilizes custom GUI and algorithms for automation.",
      "Pathfinding algorithms, entity detection state machines, etc",
      "YACL + Gson settings on Java 21 / Gradle Kotlin DSL.",
    ],
    contextProblem:
      "Built to remove repetitive grind in Hypixel SkyBlock by automating high-frequency tasks players repeat every session.",
    contextWhen: "Jan 2026 – Present",
    contextWhere: "Personal open-source Fabric mod project.",
    contextStack:
      "Java 21 Fabric mod with FSM automation, Mixin hooks, YACL config UI, and Gson-backed persistence.",
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
    gridMeta: "Hackathon · DiamondHacks 2025",
    description:
      "Receipt photo to split check: line items, tax, and tip across your group, with strong OCR in live demos. Built start to finish in 48 hours at DiamondHacks 2025.",
    longDescription:
      "Splitr is a mobile app that reads a receipt photo, extracts items and prices with OCR, and helps a group split the bill fairly—including tax and tip. We shipped it in 48 hours at DiamondHacks 2025. Pipeline: Google Vision for text, Mistral for structured JSON, FastAPI to validate and serve data, and React Native for assignment and balances. Every layer used explicit typed contracts so the UI never had to guess the shape of the payload.",
    image: "/assets/splitr.png",
    imageType: "portrait",
    status: "Completed",
    progress: 100,
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    timeline: "Apr 2025",
    categories: ["Mobile Dev", "ML Pipeline"],
    tools: ["Google Vision", "MistralAI", "React Native", "FastAPI", "Expo", "Firebase", "TypeScript"],
    githubUrl: "https://github.com/Hermano727/diamondhacks25",
    liveUrl: "https://devpost.com/software/splitr-wa2frd",
    gridPreviewBullets: [
      "48hr hackathon project @ UCSD DiamondHacks 2025",
      "Built a OCR receipt splitter: assign items, split tax and tip",
      "Google Vision to Mistral JSON for FastAPI validation",
    ],
    contextProblem:
      "Built to eliminate manual bill-splitting friction by converting receipt photos into clean itemized group balances.",
    contextWhen: "Apr 2025 (48-hour sprint)",
    contextWhere: "DiamondHacks 2025 at UC San Diego.",
    contextStack:
      "React Native + Expo client, FastAPI backend, Google Vision OCR, Mistral JSON parsing, Firebase auth.",
    takeaways: [
      "Built an OCR-to-JSON pipeline (Google Vision, then Mistral) with FastAPI validation and a React Native client; benchmarked Llama 3, OpenAI, and Mistral and chose Mistral for the best balance of speed, cost, and reliable structured output.",
      "Defined typed contracts end to end so parsing, API responses, and the assignment screen stayed in sync; invested in loading, errors, and a consistent visual system under time pressure.",
      "Mid-hackathon scope call: prioritized profile, history, and polish over chasing marginal OCR gains so we shipped something judges could use in the room.",
    ],
  },
];
