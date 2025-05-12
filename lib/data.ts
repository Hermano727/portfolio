export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A personal portfolio website built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "React", "Tailwind CSS"],
    imageUrl: "/images/portfolio.jpg",
    githubUrl: "https://github.com/yourusername/portfolio"
  },
  {
    id: 2,
    title: "E-commerce Platform",
    description: "A full-stack e-commerce application with user authentication and payment processing.",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    imageUrl: "/images/ecommerce.jpg",
    githubUrl: "https://github.com/yourusername/ecommerce"
  },
  {
    id: 3,
    title: "Task Management App",
    description: "A productivity app for managing tasks and projects with collaborative features.",
    tags: ["React", "Firebase", "Tailwind CSS"],
    imageUrl: "/images/taskapp.jpg",
    githubUrl: "https://github.com/yourusername/taskapp"
  }
];
