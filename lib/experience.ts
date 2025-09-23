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
    liveUrl: "https://makerspace.ucsd.edu/",
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
  },
];
