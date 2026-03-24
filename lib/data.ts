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
}

// Ordered by display priority: Tier 1 first (Yonder, Echoes of Pharloom), then Tier 2 (Splitr)
export const projects: Project[] = [
  {
    id: "yonder",
    title: "Yonder",
    description: "University Rover Challenge software — Pure Pursuit GPS navigation, unified camera control, and arm visualization for a rover that placed 5th nationally.",
    longDescription: "Yonder is the rover software and operator tooling developed for the University Rover Challenge. The project includes Pure Pursuit navigation, unified ROS camera integration, arm URDF modeling and joint-state visualization, and mission-critical operator tooling for autonomous workflows.",
    image: "/assets/yonder.png",
    status: "In Progress",
    progress: 70,
    startDate: "2024-10-01",
    categories: ["Robotics", "ROS", "Navigation"],
    tools: ["Python", "Flask", "Leaflet", "RViz", "ROS"],
    takeaways: [
      "Implemented Pure Pursuit path tracking with live Leaflet overlays; optimized map rendering for low-latency operator feedback during missions.",
      "Unified distributed rover cameras (Flask API, Janus) into a ROS front-end with start/stop/photo controls and an auto-fade autonomous HUD.",
      "Authored rover arm URDF and live joint-state publishing; built operator interface for pose commands and pre-execution arm visualization.",
    ],
  },
  {
    id: "echoes-of-pharloom",
    title: "Echoes of Pharloom",
    description: "Silksong-inspired study app with automatic break scheduling, focus-loss detection, and cloud-synced streaks — built to learn AWS serverless architecture from scratch.",
    longDescription: "Echoes of Pharloom is a customizable study app with automatic break scheduling, focus-loss detection, and session history. Built as a vehicle for learning AWS serverless infrastructure: API Gateway, Lambda, DynamoDB, and Cognito, all provisioned via AWS CDK. Delivers sub-10ms UI refresh with client-side state and cloud persistence.",
    image: "/assets/projects/eop-home.png",
    status: "In Progress",
    progress: 80,
    startDate: "2025-09-01",
    categories: ["Web Development", "Productivity"],
    tools: ["TypeScript", "React", "Lambda", "DynamoDB", "Cognito", "AWS CDK"],
    githubUrl: "https://github.com/Hermano727/echoes-of-pharloom",
    liveUrl: "https://echoesofpharloom.com/",
    takeaways: [
      "Built real-time timer engine in React/TypeScript with sub-10ms refresh, automatic break scheduling, and client-side state management.",
      "Architected serverless stack with API Gateway, Lambda, DynamoDB, and Cognito using AWS CDK for repeatable infrastructure-as-code deployment.",
      "Implemented secure Cognito auth with custom domain and cloud session persistence; used MSW mocks for rapid frontend-first development.",
    ],
  },
  {
    id: "splitr",
    title: "Splitr",
    description: "Hackathon receipt-splitting app — photo to parsed bill in seconds using a Google Vision → MistralAI pipeline with 92% OCR accuracy.",
    longDescription: "Splitr lets you photograph a receipt, automatically extracts items and prices via OCR, then splits the bill proportionally across people including tax and tip. Built in 48 hours at DiamondHacks 2025 using React Native, Google Vision, MistralAI, FastAPI, and Firebase Auth.",
    image: "/assets/splitr.png",
    status: "Completed",
    progress: 100,
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    categories: ["Mobile Development", "Finance"],
    tools: ["TypeScript", "React Native", "FastAPI", "Google Vision", "MistralAI", "Firebase"],
    githubUrl: "https://github.com/Hermano727/diamondhacks25",
    liveUrl: "https://devpost.com/software/splitr-wa2frd",
    imageType: "portrait",
    takeaways: [
      "Designed multi-stage OCR pipeline: Google Vision extracts text → MistralAI converts to structured JSON → FastAPI validates → React Native renders assignments.",
      "Benchmarked Llama3, OpenAI, and Mistral to find the optimal balance of cost, latency, and JSON reliability for real-world receipt parsing.",
      "Implemented Firebase Auth phone sign-in with proportional tax/tip splitting; shipped a functional, demoed MVP in under 48 hours.",
    ],
  },
];
