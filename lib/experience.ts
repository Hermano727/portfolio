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
  status: "Current" | "Completed" | "Upcoming";
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
  workExamples?: string[];
  workExampleTypes?: ("portrait" | "landscape")[];
  workExampleCaptions?: string[];
  showYoutube?: boolean;
  youtubeId?: string;
  youtubeIds?: string[];
  youtubeNote?: string;
  /** Display range on cards (e.g. "Feb 2025 – Present") */
  timeline?: string;
}

export const experiences: Experience[] = [
  {
    id: "mathworks-intern-2026",
    title: "Software Engineering Intern",
    company: "MathWorks [INCOMING]",
    location: "Natick, MA",
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    status: "Upcoming",
    description:
      "Incoming summer internship on the Simulink Component Interfaces team (Simulink Core): unifying block dialog UX for In/Out ports and In/Out Bus Element ports—one of the most-used surfaces in Simulink.",
    longDescription:
      "Joining MathWorks for summer 2026 on Simulink Component Interfaces within the Simulink Core Group. The project targets a consistent user experience across block dialogs for In/Out ports and In/Out Bus Element ports, which modelers interact with constantly. Work will span JavaScript, C++, and MATLAB; the team provides Simulink product ramp-up. Ahead of day one, the focus is on core Simulink familiarity and MathWorks documentation on Bus Element Ports, with deeper project context to follow during onboarding.",
    image: "/assets/experience/mathworks.png",
    categories: ["Simulink", "Desktop / UI", "C++"],
    tools: ["JavaScript", "C++", "MATLAB", "Simulink"],
    achievements: [
      "Offer accepted for Jun–Sep 2026 on Simulink Component Interfaces (Simulink Core Group), working on block dialog UX for In/Out and In/Out Bus Element ports.",
      "Stack: JavaScript, C++, and MATLAB; Simulink product context supported by the team during ramp-up.",
      "Preparing with Simulink fundamentals and Bus Element Ports documentation so onboarding can move quickly into implementation details.",
    ],
    websiteUrl: "https://www.mathworks.com/",
    timeline: "June 2026 – September 2026",
  },
  {
    id: "yonder-dynamics",
    title: "Lead Software Engineer",
    company: "Yonder Dynamics",
    location: "San Diego, CA",
    startDate: "2024-10-01",
    status: "Current",
    description: "Lead Software Engineer on a 15-engineer team building Mars rover mission control software. The team placed 5th nationally at the University Rover Challenge.",
    longDescription: "Technical lead for Yonder Dynamics' University Rover Challenge software team (15 engineers). Drove the mission control platform from legacy tooling to a modern stack: Vite build, WHEP low-latency WebRTC camera streams, Three.js URDF arm visualization, and localized Redux state. Designed a ROS pilot/spectator handshake for safe multi-user rover control and built the workspace Git-metadata scanner for mission-time system visibility.",
    image: "/assets/yonder.png",
    categories: ["Robotics", "ROS", "WebRTC", "Full-Stack"],
    tools: ["TypeScript", "React", "Three.js", "ROS", "Vite", "WHEP", "Python", "Leaflet"],
    achievements: [
      "Architected full frontend overhaul for a 15-engineer team: migrated to Vite, replaced Janus with WHEP for low-latency WebRTC streams, integrated Three.js URDF arm visualization, and refactored Redux toward localized state — team placed 5th nationally at URC.",
      "Designed ROS middleware with pilot/spectator publish handshake for safe real-time multi-user rover control, preventing command conflicts during autonomous and teleoperated missions.",
      "Built Pure Pursuit GPS path tracking with live Leaflet overlays and a workspace Git-metadata scanner that publishes branch/commit hashes over ROS for mission-time system visibility.",
      "Revamped onboarding with a 20+ page workshop and documentation standards, cutting new-member ramp-up time by 33%.",
    ],
    websiteUrl: "https://yonderdynamics.org/",
    workExamples: [
      "/assets/experience/yonder-auton.png",
      "/assets/experience/yonder-drive-mode.png",
      "/assets/experience/yonder-commit-tracker.png",
      "/assets/experience/yonder-science.png",
    ],
    workExampleTypes: ["landscape", "landscape", "landscape", "landscape"],
    workExampleCaptions: [
      "Autonomous Navigation — Pure Pursuit GPS overlays with live rover pose and path tracing",
      "Drive Mode — Revamped mission control UI with WHEP WebRTC camera feeds",
      "Commit Tracker — Git workspace scanner publishing branch/hash metadata over ROS",
      "Science Page — Drill elevator and ODrive motor controllers integrated into the new UI",
    ],
    showYoutube: true,
    youtubeId: "8XUT9da2txI",
    timeline: "September 2024 – Present",
  },
  {
    id: "makerspace-checkin",
    title: "Software Developer",
    company: "Qualcomm Institute Makerspace",
    location: "San Diego, CA",
    startDate: "2025-02-01",
    status: "Current",
    description: "RFID check-in platform for 8,000+ UCSD students at the Qualcomm Institute Makerspace. Local-first Raspberry Pi architecture, 99.9% uptime.",
    longDescription: "Engineered a robust RFID-based check-in system for the UCSD Makerspace serving over 8,000 students. Local-first architecture with async JSON caching, queue-based background threads, and automated failover. Integrates with Google Sheets and Fabman.io for data sync and machine access control.",
    image: "/assets/makerspace.jpg",
    categories: ["Backend", "IoT", "Database", "API Integration"],
    tools: ["Python", "Threading", "Google Sheets API", "Fabman.io API", "JSON"],
    achievements: [
      "Refactored legacy codebase into thread-safe modular services; redesigned check-in for local-first execution, cutting average check-in time by 92%.",
      "Built async queue-based background threads with write-delay invariants, eliminating race conditions and duplicate Google Sheets writes.",
      "Implemented timeout-protected export pipeline with automated failover and verbose logging, sustaining 99.9% uptime across distributed Pi nodes.",
    ],
    githubUrl: "https://github.com/UCSD-Makerspace/Check-In",
    liveUrl: "https://youtube.com/shorts/w_4UTGWlqxE?feature=share",
    workExamples: ["/assets/experience/makerspace-home.jpg", "/assets/experience/makerspace-barcode.jpg"],
    workExampleTypes: ["portrait", "portrait"],
    showYoutube: true,
    youtubeId: "w_4UTGWlqxE",
    timeline: "Feb 2025 – Present",
  },
  {
    id: "bioengineering-research",
    title: "Research Software Engineer",
    company: "Wu Tsai Bioengineering Research",
    location: "San Diego, CA",
    startDate: "2025-02-01",
    status: "Current",
    description: "IoT research platform for rodent behavioral studies at the Wu Tsai Human Performance Alliance. Automates data collection, hardware control, and sensor calibration across distributed Raspberry Pi nodes.",
    longDescription: "Designed and implemented a state machine-driven IoT system for behavioral research in progressive overload training paradigms at the Wu Tsai Human Performance Alliance. Integrates SENT linear induction sensors and beam-break detection to quantify behavioral responses. Features fault-tolerant SQLite buffering, automated rsync from distributed Pi nodes, and automated hardware control for pellet dispensing and sensor calibration.",
    image: "/assets/mice-squat.jpg",
    categories: ["IoT", "Research", "Hardware", "Embedded Systems"],
    tools: ["Python", "SQLite", "Raspberry Pi", "ESP32", "Arduino", "rsync", "SENT Protocol"],
    achievements: [
      "Designed event-driven state machine integrating SENT linear induction sensors and beam-break detection to quantify progressive-overload behavioral responses with reproducible precision.",
      "Achieved 100% data fidelity with local SQLite buffering and automated rsync synchronization across distributed Raspberry Pi research nodes; streamed events as structured JSON for downstream analysis.",
      "Automated pellet dispensing, sensor calibration, and chamber operations via Python event handling and daemon threads, reducing manual intervention by 75%.",
      "Reverse-engineered Microchip LXK3302A SENT serial protocol and built Python tooling for sensor validation; implemented ESP32 + A4988 stepper control for a precision pellet dispenser with 45° step accuracy.",
    ],
    githubUrl: "https://github.com/UCSD-Makerspace/squat-press",
    workExamples: ["/assets/mice-squat.jpg"],
    workExampleTypes: ["landscape"],
    showYoutube: true,
    youtubeIds: ["Tfy9P3L2z1Q", "x2Q3GgaJ1cM"],
    youtubeNote: "Videos show the Jun–Sep 2025 prototype. Iterated versions with PCB layout and live subjects are not yet releasable.",
    timeline: "Feb 2025 – Present",
  },
];
