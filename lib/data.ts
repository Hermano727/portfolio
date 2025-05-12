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
    description: "A mobile app that automatically splits receipts using OCR and AI-generated JSON parsing, streamlining bill-splitting among groups.",
    longDescription: "Splitr is a hackathon project that revolutionizes the way groups split bills. Using advanced OCR technology through Google Vision API and Mistral AI, the app automatically extracts and processes itemized data from receipt images. The backend, built with FastAPI (Python), parses the AI-generated structured JSON to create dynamic receipt details, while Firebase Authentication ensures secure user management and receipt history tracking.",
    image: "/splitr.png",
    status: "Completed",
    progress: 100,
    startDate: "2024-04-01",
    endDate: "2024-04-02",
    categories: ["Mobile App", "AI/ML", "Finance"],
    tools: ["React Native", "TSX", "Google Vision API", "Mistral AI", "Python", "FastAPI", "Firebase"],
    githubUrl: "https://github.com/Hermano727/diamondhacks25",
    takeaways: [
      "Successfully integrated Google Vision API for accurate receipt OCR",
      "Implemented AI-powered JSON parsing using Mistral AI",
      "Built a robust backend with FastAPI for processing structured data",
      "Created a secure user authentication system with Firebase",
    ],
    updates: [
      {
        title: "Project Completion",
        date: "2024-04-02",
        description: "Successfully completed and presented at DiamondHacks 2025.",
      },
      {
        title: "Feature Implementation",
        date: "2024-04-01",
        description: "Implemented core features including OCR, AI parsing, and user authentication.",
      }
    ],
  },
  {
    id: "crisis-compass",
    title: "CrisisCompass",
    description: "A full-stack web app providing critical resources to those affected by natural disasters, featuring interactive maps and live chat functionality.",
    longDescription: "CrisisCompass is a comprehensive emergency response platform that helps connect people with vital resources during natural disasters. The application features an interactive Google Places API Map that displays nearby resources within a 10km radius, allowing users to filter based on specific needs such as shelter, food banks, and medical care. A live chat feature, powered by PostgreSQL, enables real-time communication about emergency alerts and resource availability.",
    image: "/crisis_compass.png",
    status: "Completed",
    progress: 100,
    startDate: "2024-01-15",
    endDate: "2024-01-16",
    categories: ["Web App", "Emergency Response", "Full Stack"],
    tools: ["AWS Amplify", "PostgreSQL", "Node.js", "React", "HTML/CSS", "Git", "Google Places API"],
    githubUrl: "https://github.com/username/crisis-compass",
    liveUrl: "https://main.d1iyj3i7bqep4e.amplifyapp.com/",
    takeaways: [
      "Successfully deployed full-stack application on AWS Amplify",
      "Integrated Google Places API for resource mapping and filtering",
      "Implemented real-time chat functionality with PostgreSQL",
      "Created an intuitive interface for emergency resource location",
    ],
    updates: [
      {
        title: "Project Launch",
        date: "2024-01-16",
        description: "Successfully deployed the application on AWS Amplify.",
      },
      {
        title: "Core Features",
        date: "2024-01-15",
        description: "Implemented resource mapping and live chat functionality.",
      }
    ],
  },
  {
    id: "sei-skin",
    title: "Sei Skin Solutions",
    description: "An affiliate skincare marketing website featuring dynamic product recommendations, user feedback, and seamless mobile optimization.",
    longDescription: "Sei Skin Solutions is a sophisticated affiliate marketing platform for skincare products. The website features dynamic product recommendations, integrated user feedback systems, and a custom function for transferring product reviews from Amazon. The platform emphasizes clean UI/UX design, mobile optimization, and intuitive horizontal/vertical scrolling, with products organized into categorized containers based on varying skin types.",
    image: "/sei.png",
    status: "Completed",
    progress: 100,
    startDate: "2024-06-01",
    endDate: "2024-07-31",
    categories: ["Web Design", "E-commerce", "Marketing"],
    tools: ["React", "HTML", "CSS", "Node.js"],
    liveUrl: "https://seiskinsolutions.com",
    takeaways: [
      "Developed a dynamic website with integrated product recommendations",
      "Created a custom function for Amazon review integration",
      "Implemented responsive design with optimized mobile experience",
      "Designed intuitive product categorization system",
    ],
    updates: [
      {
        title: "Website Launch",
        date: "2024-07-31",
        description: "Successfully launched the website with all core features.",
      },
      {
        title: "Feature Development",
        date: "2024-06-15",
        description: "Implemented product recommendations and review system.",
      },
      {
        title: "Initial Development",
        date: "2024-06-01",
        description: "Started development with focus on UI/UX and mobile optimization.",
      },
    ],
  },
]
