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
    id: "yonder-dynamics",
    title: "Lead Software Engineer",
    company: "Yonder Dynamics",
    location: "San Diego, CA",
    startDate: "2024-10-01",
    status: "Current",
    description: "Lead engineer for University Rover Challenge — built navigation, camera, and arm systems for a team that placed 5th nationally out of 100+ teams.",
    longDescription: "Led development of a comprehensive rover system for the University Rover Challenge, placing 5th nationally out of 100+ teams. Built an integrated ROS ecosystem, Pure Pursuit GPS navigation, unified camera control, and rover arm visualization. Established team onboarding that accelerated member integration by 50%.",
    image: "/assets/yonder.png",
    categories: ["Robotics", "ROS", "Computer Vision", "Navigation"],
    tools: ["ROS", "Python", "Flask", "Leaflet", "GPS", "Computer Vision"],
    achievements: [
      "Implemented Pure Pursuit GPS algorithm with live Leaflet path overlays and real-time rover pose updates for low-latency field operation.",
      "Unified distributed rover cameras (Flask, Janus) into ROS with fullscreen HUD, auto-fade UI, and photo controls for autonomous missions.",
      "Authored rover arm URDF and joint-state visualization; built operator control interface and onboarding workshops that accelerated team integration by 50%.",
    ],
    liveUrl: "https://www.youtube.com/watch?v=8XUT9da2txI",
    websiteUrl: "https://yonderdynamics.org/",
    workExamples: ["/assets/projects/ROSLibJS.png", "/assets/projects/Yonder-frontend.png"],
    showYoutube: true,
    youtubeId: "8XUT9da2txI",
  },
  {
    id: "makerspace-checkin",
    title: "Software Developer",
    company: "Qualcomm Institute Makerspace",
    location: "San Diego, CA",
    startDate: "2025-02-01",
    status: "Current",
    description: "High-availability RFID check-in platform for 8,000+ UCSD students — local-first Raspberry Pi architecture delivering 99.9% uptime.",
    longDescription: "Engineered a robust RFID-based check-in system for the UCSD Makerspace serving over 8,000 students. Local-first architecture with async JSON caching, queue-based background threads, and automated failover. Integrates with Google Sheets and Fabman.io for data sync and machine access control.",
    image: "/assets/makerspace.jpg",
    categories: ["Backend", "IoT", "Database", "API Integration"],
    tools: ["Python", "Google Sheets API", "Fabman.io API", "JSON", "Threading"],
    achievements: [
      "Refactored legacy codebase into thread-safe modular services; redesigned check-in for local-first execution, cutting average check-in time by 92%.",
      "Built async queue-based background threads with write-delay invariants, eliminating race conditions and duplicate Google Sheets writes.",
      "Implemented timeout-protected export pipeline with automated failover and verbose logging, sustaining 99.9% uptime across distributed Pi nodes.",
    ],
    githubUrl: "https://github.com/UCSD-Makerspace/Check-In",
    liveUrl: "https://youtube.com/shorts/w_4UTGWlqxE?feature=share",
    workExamples: ["/assets/experience/makerspace-home.jpg", "/assets/experience/makerspace-barcode.jpg"],
    showYoutube: true,
    youtubeId: "w_4UTGWlqxE",
  },
  {
    id: "bioengineering-research",
    title: "Research Software Engineer",
    company: "UCSD Bioengineering Research Lab",
    location: "San Diego, CA",
    startDate: "2025-02-01",
    status: "Current",
    description: "IoT behavioral-research system for rodent progressive-overload studies — state machine-driven SENT sensors and automated closed-loop hardware control on Raspberry Pi.",
    longDescription: "Designed and implemented a state machine-driven IoT system for behavioral research in progressive overload training paradigms. Integrates SENT linear induction sensors and beam-break detection to quantify behavioral responses. Features fault-tolerant SQLite buffering, automated rsync from distributed Pi nodes, and automated hardware control for pellet dispensing and sensor calibration.",
    image: "/assets/mice-squat.jpg",
    categories: ["IoT", "Research", "Hardware", "Data Analysis"],
    tools: ["Python", "SQLite", "Raspberry Pi", "SENT Sensors", "rsync", "State Machines"],
    achievements: [
      "Designed state machine integrating SENT linear induction sensors and beam-break detection to quantify behavioral responses with reproducible precision.",
      "Achieved 100% data fidelity with SQLite buffering and automated rsync synchronization across distributed Raspberry Pi research nodes.",
      "Automated pellet dispensing, sensor calibration, and chamber operations via Python event handling, reducing manual intervention by 75%.",
    ],
    githubUrl: "https://github.com/UCSD-Makerspace/squat-press",
    workExamples: ["/assets/mice-squat.jpg", "/assets/mice-squat.jpg"],
    showYoutube: false,
  },
];
