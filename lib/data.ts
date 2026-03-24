export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image?: string;
  status: "Planning" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  startDate: string;
  endDate?: string;
  categories: string[];
  tools: string[];
  githubUrl?: string;
  liveUrl?: string;
  takeaways: string[];
  imageType?: "portrait" | "landscape";
  workExamples?: string[];
  workExampleTypes?: ("portrait" | "landscape")[];
  workExampleCaptions?: string[];
  /** CSS object-position for compact thumbnail + landscape hero (e.g. "center" to crop to the focal area) */
  thumbnailObjectPosition?: string;
  /** Display range on cards (e.g. "Jan 2026 – Present") */
  timeline?: string;
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
    categories: ["Full-Stack", "AWS Serverless"],
    tools: ["TypeScript", "React", "AWS CDK", "API Gateway", "Lambda", "DynamoDB", "Cognito", "MSW"],
    githubUrl: "https://github.com/Hermano727/echoes-of-pharloom",
    liveUrl: "https://echoesofpharloom.com/",
    timeline: "Aug 2025 – Dec 2025",
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
    id: "swemaxx",
    title: "SWEMaxx",
    description: "Full-stack AI mock-interview platform for company-style technical rounds. Candidates work through a timed session with a real code editor and notes; the product captures what they said and wrote to produce an interviewer-style scorecard at the end.",
    longDescription: "SWEMaxx helps software engineering candidates practice realistic, company-style technical interviews — not generic LeetCode drills. Candidates work through a timed session with notes and a real code editor, while the product captures what they said and wrote to produce an interviewer-style scorecard. Optional modes add live guidance so practice feels closer to a real loop without giving away full solutions.",
    image: "/assets/projects/swemaxx-setup.png",
    thumbnailObjectPosition: "center",
    status: "In Progress",
    progress: 70,
    startDate: "2026-01-01",
    categories: ["Full-Stack", "AI Integration"],
    tools: ["Next.js", "TypeScript", "Firebase", "Firestore", "PostgreSQL", "OpenAI", "Monaco Editor", "WebSockets", "Deepgram", "Web Speech API"],
    githubUrl: "https://github.com/Hermano727/SWEmaxx",
    liveUrl: "https://swe-maxx-git-featur-ac1d2b-hermanhundsberger-gmailcoms-projects.vercel.app/",
    timeline: "Jan 2026 – Present",
    workExamples: ["/assets/projects/swemaxx-interview.png", "/assets/projects/swemaxx-feedback.png"],
    workExampleTypes: ["landscape", "landscape"],
    workExampleCaptions: [
      "Interview workspace — Monaco editor, timers, and phased rubric for company-style rounds",
      "End-of-session AI scorecard — structured feedback tied to what you said and wrote",
    ],
    takeaways: [
      "Built authenticated REST API routes using Firebase ID token verification and Admin SDK with per-resource ownership checks — ensuring users can only read/write their own sessions and transcripts.",
      "Integrated OpenAI chat completions with JSON-only structured outputs, server-side schema validation, and prompt rules that treat all user-supplied content as untrusted — producing injection-safe end-of-session scorecards with hire-style ratings, strengths, and concrete feedback.",
      "Designed a hybrid data layer: Firestore for low-latency session metadata and history; PostgreSQL for ordered transcript chunks and interviewer messages — each store chosen for its access pattern, with APIs to append, merge, and replay content for grading.",
      "Implemented live speech capture (Web Speech API with buffered chunking + POST persistence) and extended with a Node.js WebSocket gateway using Deepgram streaming STT for low-latency transcription aligned to active interview sessions.",
    ],
  },
  {
    id: "splitr",
    title: "Splitr",
    description: "Built in 48 hours at DiamondHacks. Photograph a receipt and Splitr splits the bill automatically across your group, including tax and tip, at roughly 90% OCR accuracy.",
    longDescription: "Splitr lets you photograph a receipt, automatically extracts items and prices via OCR, then splits the bill proportionally across people including tax and tip. Built in 48 hours at DiamondHacks 2025. Owned system design and UI: Google Vision OCR → MistralAI JSON parsing → FastAPI validation → React Native assignment view, with typed contracts between every layer.",
    image: "/assets/splitr.png",
    status: "Completed",
    progress: 100,
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    categories: ["Mobile Dev", "ML Pipeline"],
    tools: ["TypeScript", "React Native", "FastAPI", "Google Vision", "MistralAI", "Firebase", "Expo"],
    githubUrl: "https://github.com/Hermano727/diamondhacks25",
    liveUrl: "https://devpost.com/software/splitr-wa2frd",
    timeline: "March 2025 – April 2025",
    imageType: "portrait",
    takeaways: [
      "Designed a multi-stage ML pipeline: Google Vision OCR → MistralAI JSON parsing → FastAPI validation → React Native render; benchmarked Llama3, OpenAI, and Mistral to optimize cost, latency, and schema reliability — Mistral won.",
      "Owned system design and UI: authored typed JSON contracts between frontend and backend, built resilient loading/error states, and maintained a consistent design system across the app.",
      "Identified a scope trade-off mid-hackathon — led the team to prioritize Profile, History, and polish over marginal OCR gains; shipped a polished, demoed MVP in under 48 hours.",
    ],
  },
];
