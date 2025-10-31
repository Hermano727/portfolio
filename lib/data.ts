import { DecimalsArrowRight } from "lucide-react";

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
}

export const projects: Project[] = [
  {
    id: "torrentia",
    title: "Torrentia - BitTorrent Client",
    description: "Building a Go-based BitTorrent client with concurrent goroutines and gRPC messaging for efficient peer discovery.",
    longDescription: `**Inspiration**

I wanted to build something that combined my interest in distributed systems with a practical use case: streaming movies, anime, and shows directly from torrents. The goal was to create an efficient, fast web app (and eventually a desktop app) that could handle torrent downloads seamlessly in the background while providing a smooth viewing experience.

**What It Does**

Torrentia is a high-performance BitTorrent client built in Go that lets you stream video content directly from torrent files. It handles peer discovery, piece downloading, and playback coordination all in one place. You can start watching almost immediately as pieces download in the background.

**Tech & Architecture**

I built Torrentia using Go with concurrent goroutines to maximize throughput across multiple peer connections. The anacrolix/torrent library handles the core BitTorrent protocol implementation. I implemented gRPC messaging for communication between the backend and frontend, integrated DHT (distributed hash table) for efficient peer discovery without relying on trackers, and designed a pluggable storage layer with asynchronous disk I/O. Checksum validation ensures data integrity as pieces arrive.

**Challenges**

The biggest challenges were managing concurrent goroutine lifecycles without memory leaks, optimizing piece selection strategy for streaming (prioritizing sequential pieces near the playback position), handling flaky peers that drop connections or send corrupted data, and balancing aggressive piece requests with fair bandwidth sharing across the swarm.

**Accomplishments**

I achieved a 40% throughput improvement over my initial baseline implementation by tuning goroutine pools and connection management. The architecture is clean and modular, making it easy to swap storage backends or add new transport protocols. The streaming experience feels responsive, with minimal buffering once the initial pieces are downloaded.

**What's Next**

I want to build out a proper web UI with search, library management, and playback controls. Desktop app support using Electron or Wails is also planned. Longer term, I'd like to experiment with more advanced piece selection algorithms, add support for magnet links with metadata exchange, and implement bandwidth throttling controls for users on limited connections.`,
    image: "/assets/torrentia.jpg",
    status: "In Progress",
    progress: 60,
    startDate: "2025-08-01",
    endDate: "2025-09-30",
    categories: ["Distributed Systems", "Networking", "Backend"],
    tools: ["Go", "gRPC", "DHT", "Concurrent Programming", "BitTorrent Protocol"],
    githubUrl: undefined,
    liveUrl: undefined,
    takeaways: [
      "Achieved 40% throughput improvement over baseline with concurrent goroutines",
      "Architected gRPC messaging with DHT integration for efficient peer discovery",
      "Implemented pluggable storage layer with asynchronous disk I/O",
      "Built checksum validation system for reliable data integrity",
    ],
  },
  {
    id: "echoes-of-pharloom",
    title: "Echoes of Pharloom",
    description: "Silksong-inspired study app with soundtrack selection, automated breaks, and user progress tracking.",
    longDescription: `**Inspiration**

Silksong, the long-anticipated sequel to Hollow Knight, finally came out, and I was completely hooked. The game brought back all the nostalgia from my childhood, and I found myself totally immersed in both the gameplay and the atmosphere. I started finding "study with Hornet" videos on YouTube, these pomodoro-style study sessions set to various Silksong soundtracks, and they were so immersive. That's when I realized I wanted to create my own study app around this. The very first thing I built was the study page that plays the soundtracks while I coded the rest of the project.

**What It Does**

Echoes of Pharloom is a customizable study app with automatic break scheduling, focus-loss detection, and session history. You can choose from different Silksong soundtrack areas to set the background atmosphere while you work. A streak system helps you stay consistent and motivated over time.

**Tech & Architecture**

I wanted to learn infrastructure as code and get hands-on experience with AWS, so I chose to build with services I hadn't used much before. The frontend is React and TypeScript, using local state for instant interactions and smooth timer control. For the backend, I went with a serverless stack: API Gateway, Lambda functions, DynamoDB for storage, and Cognito for user authentication. I also added MSW mocks during development so I could test the frontend rapidly without waiting for backend changes.

**Challenges**

The biggest challenges were hooking up Cognito properly with a custom domain, setting up cloud storage and DynamoDB tables to interact correctly with logged-in users, and implementing the streak logic to sync between local and cloud state. Getting timers to feel reliable and fluid took more iteration than I expected.

**Accomplishments**

I'm really proud of delivering a smooth, responsive study app with sub-10ms refreshes. The soundtrack selection tied to in-game areas turned out great, and I successfully implemented secure user login with cloud persistence. The whole experience taught me a ton about AWS and serverless architecture.

**What's Next**

I want to add more UI polish, introduce social features for sharing streaks with friends, and build a mobile-friendly version for studying on the go.`,
    image: "/assets/projects/eop-home.png", 
    status: "In Progress",
    progress: 80,
    startDate: "2025-09-01",
    endDate: undefined,
    categories: ["Web Development", "Productivity"],
    tools: ["React", "TypeScript", "AWS CDK", "Lambda", "DynamoDB", "Cognito"],
    githubUrl: "https://github.com/Hermano727/echoes-of-pharloom",
    liveUrl: undefined,
    takeaways: [
      "It's really fun building an app you care about and being able to use it as you build!",
      "Learned infrastructure as code with AWS CDK and serverless architecture",
      "Gained hands-on experience with Cognito, Lambda, DynamoDB, and API Gateway",
      "Successfully balanced local-first UX with cloud persistence for reliability",
    ],
  },
  {
    id: "splitr",
    title: "Splitr",
    description: "React Native app that automates receipt parsing and expense splitting with 92% OCR accuracy using Google Vision API.",
longDescription: `**Inspiration**

The day before the hackathon, our team went out to eat and realized how inconvenient it was to split the bill. Everyone had to do math in their heads, figure out who ordered what, and deal with tax and tip calculations. That's when the idea for Splitr was born: a simple tool to take all the stress out of bill splitting forever.

**What It Does**

Splitr lets you upload or take a picture of a receipt. It uses OCR to extract item names and prices, then you assign items to different people and Splitr automatically calculates what each person owes. It handles tax and tip fairly by splitting them proportionally based on what everyone ordered.

**How We Built It**

We used React Native with Expo Go for rapid iteration and on-device testing. Firebase Auth handles phone-based sign-in for future history features. The pipeline works like this: Google Vision OCR extracts text from the receipt, MistralAI converts it to structured JSON, our FastAPI Python backend validates and normalizes the data, and then the React Native app renders everything so users can assign items.

**Challenges**

The biggest challenges were getting good OCR accuracy on messy receipts, parsing inconsistent receipt layouts, and wiring the entire image-to-backend-to-app flow under time pressure during the hackathon. We also had to benchmark different LLMs (Llama3, OpenAI, Mistral) to find the right balance of cost, latency, and JSON reliability.

**Accomplishments**

We're really proud of building a reliable OCR pipeline and delivering a smooth user flow from image upload all the way to the final bill. We shipped a functional, useful MVP quickly, and it actually works well in real situations.

**What We Learned**

Integrating OCR with LLMs was a new challenge for all of us. We learned the value of clean UX, especially under pressure. Teamwork and rapid iteration were crucial, and we got better at keeping our codebase navigable even when moving fast. Also, we really need to learn Docker!

**What's Next**

We want to improve OCR accuracy with better pre-processing and smarter prompts. Adding an editable receipt step would let users quickly fix any misreads. We also plan to add full Firestore history, Venmo and CashApp integrations for easy payments, more advanced splitting options like percentages and shared items, and general UI polish and accessibility improvements.`,
    image: "/assets/splitr.png",
    status: "Completed",
    progress: 100,
    startDate: "2025-04-01",
    endDate: "2025-04-30",
    categories: ["Mobile Development", "Finance"],
    tools: ["React Native", "TypeScript", "Firebase", "Stripe"],
    githubUrl: "https://github.com/Hermano727/diamondhacks25",
    liveUrl: "https://devpost.com/software/splitr-wa2frd?_gl=1*1s9zx5g*_gcl_au*MTk4MDQwNjk1LjE3NTc0NzI2MzM.*_ga*OTI5NTQzMjY3LjE3NTc0NzI2MzM.*_ga_0YHJK3Y10M*czE3NTc0NzI2MzMkbzEkZzEkdDE3NTc0NzI4NDEkajMwJGwwJGgw",
    takeaways: [
      "Implemented OCR for receipt scanning and data extraction",
      "Integrated real-time updates using Firebase",
      "Built a secure payment processing system with Stripe",
      "Designed an intuitive mobile-first user interface",
    ],
  },
  {
    id: "crisis-compass",
    title: "Crisis Compass",
    description: "Full-stack React web app connecting disaster victims with 100+ critical local resources using location-based filtering.",
longDescription: `**Inspiration**

After witnessing the recent wildfires in Los Angeles that affected friends and family, we realized how hard it was to quickly find credible, nearby help during a crisis. We wanted to build a tool that simplifies finding essential resources when you need them most, reducing search time under stress.

**What It Does**

CrisisCompass connects disaster victims with vital resources through an interactive map. You can locate hospitals, shelters, and food banks based on your current location. It also includes live chat for community support, scoped by city so neighbors can share updates, and a resource page that aggregates important official links.

**How We Built It**

We built the frontend in React with a typed component layer for pages, filters, and chat UI. We used Google Maps with the React Google Maps Library for map rendering, autocomplete, and nearby search. Supabase handles lightweight, city-scoped real-time chat so the communication stays relevant to your area. Everything is deployed on AWS Amplify for quick, repeatable releases.

**Challenges**

This was our first hackathon, so organizing roles and integrating everyone's skills was a learning curve. The React Google Maps Library had limited documentation, which made integration harder than expected. We also had to adapt an original HTML and Flask proof-of-concept into idiomatic React components, which took some trial and error.

**Accomplishments**

We're proud that we delivered and deployed a working app from scratch under time pressure. Our team communication and project management were strong, and we ended up exceeding our own expectations for what we could build in a weekend.

**What We Learned**

We learned end-to-end software development under pressure: planning, roadmapping, team communication, and adopting new technologies like AWS on the fly. Splitting work into small, testable slices let us work in parallel without blocking each other.

**What's Next**

We want to add a danger zone API with live notifications, evacuation routes, and highlighted hazard zones overlaid on the map. We also plan to ship a mobile app (probably as a PWA) with the same functionality for offline-first access during outages.`,
    image: "/assets/crisis_compass.png",
    status: "In Progress",
    progress: 75,
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    categories: ["Web Development", "Emergency Response"],
    tools: ["React", "Node.js", "MongoDB", "MapBox"],
    githubUrl: "https://github.com/Hermano727/irvinehacks25",
    liveUrl: "https://main.d1iyj3i7bqep4e.amplifyapp.com/",
    takeaways: [
      "Developed real-time mapping and location tracking features",
      "Implemented secure communication channels for emergency responders",
      "Created an offline-first architecture for reliable operation",
      "Designed intuitive interfaces for high-stress situations",
    ],
  },
];
