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
    longDescription: "Built a React Native app that automates receipt parsing and expense splitting, eliminating manual calculations. Integrated Google Vision OCR with an OpenAI model to parse receipt images into JSON with 92% accuracy. Designed interactive UI in React Native to allocate receipt items to members, dynamically adjusting tax and tips. Implemented secure user authentication via Firebase and SMS verification, enabling user receipt history tracking.",
    image: "/splitr.png",
    status: "Completed",
    progress: 100,
    startDate: "2024-01-15",
    endDate: "2024-02-28",
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
    longDescription: "Developed and deployed a full-stack React web app to connect disaster victims with 100+ critical local resources. Integrated Google Places API for users to filter nearby shelters, food banks, and hospitals within a 10km radius. Built a location-based live chat with PostgreSQL/Supabase, streaming real-time updates under 200ms latency.",
    image: "/crisis_compass.png",
    status: "In Progress",
    progress: 75,
    startDate: "2023-11-01",
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
    id: "makerspace-checkin",
    title: "UCSD Makerspace Check-In System",
    description: "High-availability RFID check-in platform serving 8,000+ UCSD students with 99.9% uptime through microservices architecture.",
    longDescription: "Engineered a robust RFID-based check-in system for the UCSD Makerspace that serves over 8,000 students. The system features a local-first architecture with JSON caching, asynchronous queuing, and automated failover mechanisms. It integrates with Google Sheets for data synchronization and Fabman.io for machine access control, achieving significant performance improvements through modular design and fault-tolerant architecture.",
    image: "/makerspace.jpg",
    status: "Completed",
    progress: 100,
    startDate: "2025-02-01",
    categories: ["Backend", "IoT", "Database", "API Integration"],
    tools: ["Python", "Google Sheets API", "Fabman.io API", "JSON", "Threading"],
    githubUrl: "https://github.com/UCSD-Makerspace/Check-In",
    liveUrl: "https://makerspace.ucsd.edu/",
    takeaways: [
      "Achieved 92% check-in speed improvement through local-first architecture",
      "Implemented microservices architecture with automated failover for 99.9% uptime",
      "Built fault-tolerant export pipeline with timeout-protected API integration",
      "Modularized legacy codebase into separate services with thread-safe queue system",
    ],
    updates: [
      {
        title: "System Deployment",
        date: "2025-02-15",
        description: "Successfully deployed the check-in system to production environment.",
      },
      {
        title: "Performance Optimization",
        date: "2025-02-10",
        description: "Implemented local-first architecture achieving 92% speed improvement.",
      },
      {
        title: "API Integration",
        date: "2025-02-05",
        description: "Completed integration with Google Sheets and Fabman.io APIs.",
      },
    ],
  },
  {
    id: "yonder-dynamics",
    title: "Yonder Dynamics Rover System",
    description: "Lead Software Engineer for University Rover Challenge team, placing 5th nationally with integrated ROS ecosystem and GPS navigation.",
    longDescription: "Established technical leadership for the University Rover Challenge team, achieving 5th place nationally out of 100+ teams. Led development of a comprehensive rover system featuring integrated ROS ecosystem, Pure Pursuit GPS algorithm, and centralized camera control. The system includes real-time path tracing, non-ROS camera integration, and structured team onboarding processes that accelerated member integration by 50%.",
    image: "/sei.png",
    status: "Completed",
    progress: 100,
    startDate: "2024-10-01",
    categories: ["Robotics", "ROS", "Computer Vision", "Navigation"],
    tools: ["ROS", "Python", "Flask", "Leaflet", "GPS", "Computer Vision"],
    githubUrl: undefined,
    liveUrl: "https://www.youtube.com/watch?v=8XUT9da2txI",
    takeaways: [
      "Placed 5th nationally out of 100+ teams in University Rover Challenge",
      "Accelerated team onboarding by 50% through structured workshops and documentation",
      "Integrated non-ROS cameras into unified ROS ecosystem with centralized control",
      "Implemented Pure Pursuit GPS algorithm with real-time path visualization",
    ],
    updates: [
      {
        title: "URC Competition",
        date: "2025-01-15",
        description: "Competed in University Rover Challenge, placing 5th nationally.",
      },
      {
        title: "Camera Integration",
        date: "2024-12-20",
        description: "Successfully integrated non-ROS cameras into unified ROS ecosystem.",
      },
      {
        title: "GPS Navigation",
        date: "2024-12-01",
        description: "Implemented Pure Pursuit GPS algorithm with Leaflet visualization.",
      },
    ],
  },
  {
    id: "bioengineering-research",
    title: "UCSD Bioengineering Research Lab",
    description: "Research Software Engineer developing IoT system for behavioral analysis using SENT sensors and automated hardware control.",
    longDescription: "Designed and implemented a state machine-driven IoT system for behavioral research in progressive overload training paradigms. The system integrates SENT linear induction sensors and beam-break detection to quantify behavioral responses. Features include fault-tolerant data architecture with SQLite buffering, automated rsync synchronization from distributed Raspberry Pi nodes, and automated hardware control systems for pellet dispensing and sensor calibration.",
    image: "/mice-squat.jpg",
    status: "Completed",
    progress: 100,
    startDate: "2025-02-01",
    categories: ["IoT", "Research", "Hardware", "Data Analysis"],
    tools: ["Python", "SQLite", "Raspberry Pi", "SENT Sensors", "rsync", "State Machines"],
    githubUrl: "https://github.com/UCSD-Makerspace/squat-press",
    liveUrl: "https://makerspace.ucsd.edu/",
    takeaways: [
      "Designed state machine-driven IoT system with SENT linear induction sensors",
      "Achieved 100% data fidelity with SQLite buffering and automated rsync synchronization",
      "Reduced manual intervention by 75% through automated hardware control systems",
      "Implemented fault-tolerant data architecture for distributed Raspberry Pi nodes",
    ],
    updates: [
      {
        title: "System Integration",
        date: "2025-02-20",
        description: "Completed integration of all hardware components and sensors.",
      },
      {
        title: "Data Pipeline",
        date: "2025-02-15",
        description: "Implemented fault-tolerant data architecture with automated synchronization.",
      },
      {
        title: "Hardware Control",
        date: "2025-02-10",
        description: "Developed automated control systems for pellet dispensing and calibration.",
      },
    ],
  },
  {
    id: "torrentia",
    title: "Torrentia - High-Performance BitTorrent Client",
    description: "Building a Go-based BitTorrent client with concurrent goroutines and gRPC messaging for efficient peer discovery.",
    longDescription: "Developing a high-performance BitTorrent client in Go featuring concurrent goroutines for improved throughput, gRPC messaging with distributed hash table (DHT) integration for efficient peer discovery, and a pluggable storage layer with asynchronous disk I/O and checksum validation for reliable data integrity. The project focuses on distributed systems principles and network optimization.",
    image: "/sei.png",
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
