export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  description: string;
  longDescription: string;
  image?: string;
  status: "Current" | "Completed";
  categories: string[];
  tools: string[];
  achievements: string[];
  githubUrl?: string;
  liveUrl?: string;
  websiteUrl?: string;
  fullDetails?: string[];
  projects?: Array<{
    title: string;
    summary?: string;
    bullets?: string[];
    links?: { label: string; href: string }[];
    videos?: { youtubeId?: string; title?: string }[];
  }>;
  workExamples?: string[]; // up to 2 image URLs
  showYoutube?: boolean;
  youtubeId?: string; // optional if showYoutube is true
}

export const experiences: Experience[] = [
  {
    id: "makerspace-checkin",
    title: "Software Developer",
    company: "Qualcomm Institute Makerspace",
    location: "San Diego, CA",
    startDate: "2025-02-01",
    status: "Current",
    description: "High-availability RFID check-in platform serving 8,000+ UCSD students with 99.9% uptime through microservices architecture.",
    longDescription: "Engineered a robust RFID-based check-in system for the UCSD Makerspace that serves over 8,000 students. The system features a local-first architecture with JSON caching, asynchronous queuing, and automated failover mechanisms. It integrates with Google Sheets for data synchronization and Fabman.io for machine access control, achieving significant performance improvements through modular design and fault-tolerant architecture.",
    image: "/assets/makerspace.jpg",
    categories: ["Backend", "IoT", "Database", "API Integration"],
    tools: ["Python", "Google Sheets API", "Fabman.io API", "JSON", "Threading"],
    achievements: [
      "Achieved 92% check-in speed improvement through local-first architecture",
      "Implemented microservices architecture with automated failover for 99.9% uptime",
      "Built fault-tolerant export pipeline with timeout-protected API integration",
      "Modularized legacy codebase into separate services with thread-safe queue system",
    ],
    githubUrl: "https://github.com/UCSD-Makerspace/Check-In",
    liveUrl: "https://youtube.com/shorts/w_4UTGWlqxE?feature=share",
    projects: [
      {
        title: "RFID Check in platform",
        summary:
          "Engineered a high-availability NFC check-in platform for 8,000+ UCSD students, eliminating manual verification bottlenecks and achieving 99.9% uptime via distributed design and automated failover.",
        bullets: [
          "Refactored legacy codebase into modular, thread-safe components and redesigned check-in logic to prioritize local-first execution across Raspberry Pi nodes.",
          "Improved average check-in speed by 92% through local caching, async queuing, and deferred sync to Google Sheets, enabling real-time LED confirmation.",
          "Built a queue-based background thread system with write-delay invariants to prevent race conditions and duplicate writes.",
          "Implemented secure export pipeline with timeout-protected API calls and verbose logging for fault tolerance.",
        ],
        links: [
          { label: "YouTube", href: "https://youtube.com/shorts/w_4UTGWlqxE?feature=share" },
        ],
        videos: [
          { youtubeId: "w_4UTGWlqxE", title: "RFID Check-in Demo" },
        ],
      },
    ],
    workExamples: ["/assets/experience/makerspace-home.jpg", "/assets/experience/makerspace-barcode.jpg"],
    showYoutube: true,
    youtubeId: "w_4UTGWlqxE",
  },
  {
    id: "yonder-dynamics",
    title: "Lead Software Engineer",
    company: "Yonder Dynamics",
    location: "San Diego, CA",
    startDate: "2024-10-01",
    status: "Current",
    description: "Lead Software Engineer for University Rover Challenge team, placing 5th nationally with integrated ROS ecosystem and GPS navigation.",
    longDescription: "Established technical leadership for the University Rover Challenge team, achieving 5th place nationally out of 100+ teams. Led development of a comprehensive rover system featuring integrated ROS ecosystem, Pure Pursuit GPS algorithm, and centralized camera control. The system includes real-time path tracing, non-ROS camera integration, and structured team onboarding processes that accelerated member integration by 50%.",
    image: "/assets/yonder.png",
    categories: ["Robotics", "ROS", "Computer Vision", "Navigation"],
    tools: ["ROS", "Python", "Flask", "Leaflet", "GPS", "Computer Vision"],
    achievements: [
      "Placed 5th nationally out of 100+ teams in University Rover Challenge",
      "Accelerated team onboarding by 50% through structured workshops and documentation",
      "Integrated non-ROS cameras into unified ROS ecosystem with centralized control",
      "Implemented Pure Pursuit GPS algorithm with real-time path visualization",
    ],
    liveUrl: "https://www.youtube.com/watch?v=8XUT9da2txI",
    websiteUrl: "https://yonderdynamics.org/",
    projects: [
      {
        title: "Pure Pursuit Vectorization",
        summary:
          "Vector-based Leaflet mapping for autonomous path tracing and real-time rover tracking, improving planning efficiency and situational awareness.",
        bullets: [
          "Implemented Pure Pursuit path tracking with live path overlays and rover pose updates.",
          "Optimized map rendering and update cadence for low-latency operator feedback.",
        ],
      },
      {
        title: "Camera Refactor",
        bullets: [
          "Unified distributed rover cameras (Flask API, Janus) into a ROS front-end.",
          "Implemented start/stop/take-photo and driver functions for improved control surface.",
          "Designed fullscreen UI with auto-fade HUD (battery, rover position) for autonomous missions.",
        ],
      },
      {
        title: "Documentation & Onboarding",
        summary: "Established documentation standards and led onboarding workshops/system overviews.",
        links: [
          { label: "Notion", href: "https://www.notion.so/yonderdynamics/Intro-Workshop-Frontend-System-Documentation-2828f2bf79bf8051a5d4fcf502ee1b09" },
        ],
      },
      {
        title: "System Version Tracking",
        summary: "Workspace scanner for repository metadata and mission-time system visibility.",
        bullets: [
          "Developed a workspace scanner that collects commit hashes, branches, and repo metadata for all rover repositories at boot using Git.",
          "Published this collected metadata over a ROS topic to provide mission-time system state visibility.",
          "Integrated the data into a Redux slice and lightweight UI component for real-time system status during missions.",
        ],
      },
      {
        title: "Arm Visualization & Control Pipeline",
        summary: "URDF-based arm modeling with live visualization and joint control integration.",
        bullets: [
          "Authored the rover arm URDF and visualization pipeline using RViz and robot_state_publisher.",
          "Implemented live joint-state publishing and frontend integration to display arm state and provide joint/pose command capabilities.",
          "Built a control interface that allowed operators to send joint commands and visualize expected poses before execution.",
        ],
      },
    ],
    workExamples: ["/assets/projects/ROSLibJS.png", "/assets/projects/Yonder-frontend.png"],
    showYoutube: true,
    youtubeId: "8XUT9da2txI",
  },
  {
    id: "bioengineering-research",
    title: "Research Software Engineer",
    company: "UCSD Bioengineering Research Lab",
    location: "San Diego, CA",
    startDate: "2025-02-01",
    status: "Current",
    description: "Research Software Engineer developing IoT system for behavioral analysis using SENT sensors and automated hardware control.",
    longDescription: "Designed and implemented a state machine-driven IoT system for behavioral research in progressive overload training paradigms. The system integrates SENT linear induction sensors and beam-break detection to quantify behavioral responses. Features include fault-tolerant data architecture with SQLite buffering, automated rsync synchronization from distributed Raspberry Pi nodes, and automated hardware control systems for pellet dispensing and sensor calibration.",
    image: "/assets/mice-squat.jpg",
    categories: ["IoT", "Research", "Hardware", "Data Analysis"],
    tools: ["Python", "SQLite", "Raspberry Pi", "SENT Sensors", "rsync", "State Machines"],
    achievements: [
      "Designed state machine-driven IoT system with SENT linear induction sensors",
      "Achieved 100% data fidelity with SQLite buffering and automated rsync synchronization",
      "Reduced manual intervention by 75% through automated hardware control systems",
      "Implemented fault-tolerant data architecture for distributed Raspberry Pi nodes",
    ],
    githubUrl: "https://github.com/UCSD-Makerspace/squat-press",
    liveUrl: "https://makerspace.ucsd.edu/",
    projects: [
      {
        title: "MSPD",
        summary:
          "Distributed, IoT-driven behavioral research platform integrating multi-sensor inputs, real-time event processing, and automated hardware control.",
        bullets: [
          "Enabled high-throughput, reproducible behavioral studies via fault-tolerant edge data pipelines and automated closed-loop control.",
          "Achieved 100% data fidelity with local SQLite buffering, automated rsync synchronization, and JSON event streaming.",
          "Automated pellet dispensing, sensor calibration, and chamber ops via Python event handling, reducing manual intervention by 75%.",
        ],
      },
      {
        title: "Linear Sensor Unit Test",
        summary:
          "Reverse engineered Microchip LXK3302A serial protocol and implemented Python tooling; integrated NEMA17 motion to map velocities using TMC2209 and Arduino.",
        links: [
          { label: "GitHub (tests)", href: "https://github.com/UCSD-Makerspace/squat-press/tree/dev/tests/tmcarduino" },
        ],
        videos: [
          { youtubeId: "Tfy9P3L2z1Q", title: "Sensor Unit Test" },
        ],
      },
      {
        title: "Pellet Dispenser Unit Test",
        summary:
          "ESP32 + A4988 stepper control to dispense pellets with precise 45° steps; event manager with daemon threads for unit-test orchestration.",
        videos: [
          { youtubeId: "x2Q3GgaJ1cM", title: "Pellet Dispenser Demo" },
        ],
      },
    ],
    workExamples: ["/assets/mice-squat.jpg", "/assets/mice-squat.jpg"],
    showYoutube: false,
  },
];
