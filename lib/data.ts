export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image?: string
  status: "Planning" | "In Progress" | "Completed" | "On Hold"
  progress: number
  startDate: string
  endDate?: string
  categories: string[]
  tools: string[]
  githubUrl?: string
  liveUrl?: string
  takeaways: string[]
  updates: {
    title: string
    date: string
    description: string
  }[]
}

export const projects: Project[] = [
  {
    id: "splitr",
    title: "Splitr",
    description: "A modern bill splitting app that makes it easy to divide expenses among friends and track shared costs.",
    longDescription: "Splitr is a user-friendly bill splitting application designed to simplify the process of managing shared expenses. With features like receipt scanning, real-time expense tracking, and automated payment calculations, it takes the hassle out of splitting bills with friends, roommates, or travel companions.",
    image: "/splitr.png",
    status: "Completed",
    progress: 100,
    startDate: "2024-01-15",
    endDate: "2024-02-28",
    categories: ["Mobile App", "Finance", "Utilities"],
    tools: ["React Native", "TypeScript", "Firebase", "Stripe"],
    githubUrl: "https://github.com/username/splitr",
    liveUrl: "https://splitr-demo.vercel.app",
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
    description: "A real-time emergency response system that helps coordinate disaster relief efforts and track critical resources.",
    longDescription: "Crisis Compass is an innovative platform designed to streamline emergency response coordination during natural disasters and crisis situations. It provides real-time mapping, resource tracking, and communication tools for first responders and emergency management teams.",
    image: "/crisis_compass.png",
    status: "In Progress",
    progress: 75,
    startDate: "2023-11-01",
    categories: ["Web App", "Emergency Response", "Maps"],
    tools: ["React", "Node.js", "MongoDB", "MapBox"],
    githubUrl: "https://github.com/username/crisis-compass",
    liveUrl: "https://crisis-compass-demo.vercel.app",
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
    id: "sei-skin",
    title: "SeiSkinSolutions",
    description: "A modern e-commerce platform for natural and organic skincare products with personalized recommendations.",
    longDescription: "SeiSkinSolutions is a comprehensive e-commerce platform that combines beautiful design with powerful functionality to deliver a premium shopping experience for skincare enthusiasts. The platform features personalized product recommendations, detailed ingredient analysis, and a subscription service for regular skincare routines.",
    image: "/sei.png",
    status: "Completed",
    progress: 100,
    startDate: "2023-09-01",
    endDate: "2023-12-15",
    categories: ["E-commerce", "Web Design", "Healthcare"],
    tools: ["Next.js", "Tailwind CSS", "Shopify", "PostgreSQL"],
    githubUrl: "https://github.com/username/sei-skin",
    liveUrl: "https://sei-skin-demo.vercel.app",
    takeaways: [
      "Built a custom Shopify integration for seamless e-commerce",
      "Implemented an AI-powered skincare recommendation system",
      "Created a responsive and accessible design system",
      "Developed a custom CMS for content management",
    ],
    updates: [
      {
        title: "Launch",
        date: "2023-12-15",
        description: "Successfully launched the platform with full e-commerce capabilities.",
      },
      {
        title: "Recommendation Engine",
        date: "2023-11-01",
        description: "Completed the AI-powered product recommendation system.",
      },
      {
        title: "E-commerce Integration",
        date: "2023-10-01",
        description: "Integrated Shopify and implemented core shopping features.",
      },
    ],
  },
]
