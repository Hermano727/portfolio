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
  updates: {
    title: string;
    date: string;
    description: string;
  }[];
}

export const projects: Project[] = [
  {
    id: "splitr",
    title: "Splitr",
    description: "React Native app that automates receipt parsing and expense splitting with 92% OCR accuracy using Google Vision API.",
longDescription: `Inspiration\nThe day before the hackathon, our team went out to eat, and we realized it was inconvenient to split the bill... That's when the idea for Splitr was born — a simple tool to take the stress out of bill‑splitting forever.\n\nWhat it does\nSplitr lets users upload or take a picture of a receipt. It uses OCR to extract item names and prices, then users assign items to members and Splitr automatically calculates what each person owes, handling tax and tip fairly.\n\nHow we built it\nReact Native + Expo Go for rapid iteration; Firebase Auth for phone‑based sign‑in and future history; Google Vision OCR -> parsed by MistralAI -> Python backend -> app components.\n\nChallenges\nOCR accuracy on messy receipts; parsing inconsistent layouts; wiring image -> backend -> app under time pressure.\n\nAccomplishments\nReliable OCR pipeline; smooth user flow from image upload to final bill; shipped a functional, useful MVP fast.\n\nWhat we learned\nIntegrating OCR with LLMs; the value of clean UX; teamwork/iteration; keeping a navigable codebase; we should really learn Docker!\n\nWhat’s next\nImprove OCR with better pre‑processing and prompts; editable receipt step; Firestore history; Venmo/CashApp integration; advanced splitting options; polish UI and accessibility.`,
    image: "/assets/splitr.png",
    status: "Completed",
    progress: 100,
    startDate: "2025-04-01",
    // No endDate -> renders as Apr 2025
    categories: ["Mobile App", "Finance", "Utilities"],
    tools: ["React Native", "TypeScript", "Firebase", "Stripe"],
    githubUrl: "https://github.com/Hermano727/diamondhacks25",
    liveUrl: "https://devpost.com/software/splitr-wa2frd?_gl=1*1s9zx5g*_gcl_au*MTk4MDQwNjk1LjE3NTc0NzI2MzM.*_ga*OTI5NTQzMjY3LjE3NTc0NzI2MzM.*_ga_0YHJK3Y10M*czE3NTc0NzI2MzMkbzEkZzEkdDE3NTc0NzI4NDEkajMwJGwwJGgw",
    takeaways: [
      "Implemented OCR for receipt scanning and data extraction",
      "Integrated real-time updates using Firebase",
      "Built a secure payment processing system with Stripe",
      "Designed an intuitive mobile-first user interface",
    ],
    updates: [
      {
        title: "Initial Release",
        date: "2024-02-28",
        description: "Successfully launched the app with core bill splitting features.",
      },
      {
        title: "Payment Integration",
        date: "2024-02-15",
        description: "Completed Stripe integration for secure payment processing.",
      },
      {
        title: "Receipt Scanner",
        date: "2024-02-01",
        description: "Implemented OCR functionality for automated receipt processing.",
      },
    ],
  },
  {
    id: "crisis-compass",
    title: "Crisis Compass",
    description: "Full-stack React web app connecting disaster victims with 100+ critical local resources using location-based filtering.",
longDescription: `Inspiration\nAfter witnessing recent wildfires in Los Angeles affecting friends and family, we wanted a tool that simplifies finding nearby resources during crisis.\n\nWhat it does\nCrisisCompass connects victims with vital resources via an interactive map to locate hospitals, shelters, and food banks by current location. It includes Live Chat for community support and a resource page aggregating important links.\n\nHow we built it\nReact front‑end for pages, filters, and chat UI. Google Maps + React Google Maps Library for map, autocomplete, and search. Supabase stores and filters chat messages by city for real‑time communication. Deployed on AWS Amplify.\n\nChallenges\nFirst hackathon; organizing roles and integrating skills; limited docs for React Google Maps; adapting codebase to React.\n\nAccomplishments\nDelivered and deployed from scratch under time; strong communication and management; exceeded expectations.\n\nWhat we learned\nEnd‑to‑end software development under pressure; planning/roadmapping; team communication; adopting new tech (AWS).\n\nWhat’s next\nAdd a danger‑zone API with live notifications, evacuation routes, and highlighted zones; ship a mobile app with the same functionality.`,
    image: "/assets/crisis_compass.png",
    status: "In Progress",
    progress: 75,
    startDate: "2025-01-01",
    categories: ["Web App", "Emergency Response", "Maps"],
    tools: ["React", "Node.js", "MongoDB", "MapBox"],
    githubUrl: "https://github.com/Hermano727/irvinehacks25",
    liveUrl: "https://main.d1iyj3i7bqep4e.amplifyapp.com/",
    takeaways: [
      "Developed real-time mapping and location tracking features",
      "Implemented secure communication channels for emergency responders",
      "Created an offline-first architecture for reliable operation",
      "Designed intuitive interfaces for high-stress situations",
    ],
    updates: [
      {
        title: "Resource Tracking",
        date: "2024-02-15",
        description: "Implemented real-time resource tracking and allocation system.",
      },
      {
        title: "Mapping System",
        date: "2024-01-20",
        description: "Completed integration of interactive maps and location services.",
      },
      {
        title: "Initial Setup",
        date: "2023-11-01",
        description: "Project kickoff and core architecture implementation.",
      },
    ],
  },
  {
    id: "torrentia",
    title: "Torrentia - BitTorrent Client",
    description: "Building a Go-based BitTorrent client with concurrent goroutines and gRPC messaging for efficient peer discovery.",
    longDescription: "Developing a high-performance BitTorrent client in Go featuring concurrent goroutines for improved throughput, gRPC messaging with distributed hash table (DHT) integration for efficient peer discovery, and a pluggable storage layer with asynchronous disk I/O and checksum validation for reliable data integrity. The project focuses on distributed systems principles and network optimization.",
    image: "/assets/torrentia.jpg",
    status: "In Progress",
    progress: 60,
    startDate: "2025-08-01",
    categories: ["Distributed Systems", "Networking", "P2P", "Backend"],
    tools: ["Go", "gRPC", "DHT", "Concurrent Programming", "BitTorrent Protocol"],
    githubUrl: undefined,
    liveUrl: undefined,
    takeaways: [
      "Achieved 40% throughput improvement over baseline with concurrent goroutines",
      "Architected gRPC messaging with DHT integration for efficient peer discovery",
      "Implemented pluggable storage layer with asynchronous disk I/O",
      "Built checksum validation system for reliable data integrity",
    ],
    updates: [
      {
        title: "Core Protocol Implementation",
        date: "2025-08-15",
        description: "Completed basic BitTorrent protocol implementation with concurrent goroutines.",
      },
      {
        title: "gRPC Integration",
        date: "2025-08-10",
        description: "Implemented gRPC messaging with DHT integration for peer discovery.",
      },
      {
        title: "Storage Layer",
        date: "2025-08-05",
        description: "Developed pluggable storage layer with asynchronous I/O and checksum validation.",
      },
    ],
  },
];
