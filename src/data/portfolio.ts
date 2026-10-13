export interface Project {
  id: string;
  title: string;
  category: "Tools" | "Playable Games";
  tags: string[];
  description: string;
  metrics?: string;
  githubUrl: string;
  liveUrl: string;
  featured?: boolean;
  isPlayable?: boolean;
}

export interface SkillItem {
  name: string;
  category: "Computer Engineering & Systems" | "Programming" | "Frontend" | "Core Competencies";
  percentage: number;
  color: string;
}

export const PROFILE_INFO = {
  name: "Justine Jay",
  fullName: "Justine Jay Arteche",
  role: "Junior Web Developer & Computer Engineering Student",
  location: "San Juan City, Metro Manila, Philippines",
  address: "#89 2nd West Crame, San Juan City",
  phone: "09617131209",
  email: "jstnexc@gmail.com",
  education: "BS in Computer Engineering",
  school: "ICCT College (Sta. Lucia, Cainta)",
  shs: "Arellano University - Juan Sumulong Campus",
  careerObjective: "To be given a chance where I can maximize my technical and developmental abilities, build high-impact applications, and aid in the expansion and success of the workplace.",
  github: "https://github.com/jstnexc",
  linkedin: "https://www.linkedin.com/in/justine-jay-arteche-b50255443",
  quoteHero: "Build · Learn · Adapt · Expand",
  quoteAbout: "“Maximizing potential through relentless curiosity, computer engineering foundations, and software development.”",
  quoteFooter: "“Let's build something remarkable together.”",
  tagline: "I build solutions for a better tomorrow.",
  bio: "A disciplined and fast-learning developer and Computer Engineering undergraduate with real-world teamwork, adaptability, and modern software development skills. Driven to engineer performant web applications and hardware-software integrations.",
};

export const WORK_EXPERIENCE = [
  {
    role: "Service Crew & Operations",
    company: "Jollibee",
    period: "2024",
    highlights: [
      "Demonstrated peak adaptability, rapid task execution, and high-standard customer service in high-volume rush environments.",
      "Collaborated seamlessly across kitchen and counter teams with meticulous operational discipline."
    ]
  },
  {
    role: "Back-up Waiter",
    company: "Rico's Lechon",
    period: "2024",
    highlights: [
      "Delivered reliable client-facing service, inventory handling, and fast problem resolution under tight schedules.",
      "Honed strong interpersonal communication, work ethic, and situational awareness."
    ]
  },
  {
    role: "Kitchen Staff",
    company: "Giligan's",
    period: "2023",
    highlights: [
      "Maintained food safety compliance, fast-paced workflow synchronization, and organizational precision.",
      "Developed endurance, attention to detail, and rapid learning under demanding operational pressure."
    ]
  }
];

export const EDUCATION_TIMELINE = [
  {
    level: "College Undergraduate",
    course: "BS in Computer Engineering",
    institution: "ICCT College (Sta. Lucia, Cainta)",
    period: "2023 - Present",
    desc: "Computer architecture, digital systems design, microprocessors, software engineering, and network infrastructures."
  },
  {
    level: "Senior High School",
    course: "Secondary Education",
    institution: "Arellano University - Juan Sumulong Campus (Sampaloc, Manila)",
    period: "2021 - 2023",
    desc: "Foundation in STEM principles, research methodologies, and collaborative projects."
  },
  {
    level: "Junior High School",
    course: "Secondary High School",
    institution: "Camp Crame High School (Bagong Lipunan, Quezon City)",
    period: "2017 - 2021",
    desc: "Academic excellence and foundational leadership."
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: "flappy-frost-seahorse",
    title: "Flappy Frost Seahorse (Arcade)",
    category: "Playable Games",
    tags: ["HTML5 Canvas", "Web Audio API", "TypeScript", "Game Dev"],
    description: "Retro arcade recreation of #Proj3ctAdam's Flappy Frost Seahorse. Navigate icy crystal stalactites, chain combo multipliers, and trigger Deep Freeze slow-mo mode.",
    metrics: "Playable In-Browser · 60 FPS · Deep Freeze Mode",
    githubUrl: "https://github.com/jstnexc",
    liveUrl: "#play-flappy-frost",
    featured: true,
    isPlayable: true,
  },
  {
    id: "timeguard-system",
    title: "TimeGuard · Screen Time & Digital Addiction Control",
    category: "Tools",
    tags: ["Next.js", "TypeScript", "UsageStats API", "Digital Wellness"],
    description: "Smart App Usage Tracker, Screen Time Manager, and Digital Addiction Control System with automatic app restrictions, focus presets, and mindful habit analytics.",
    metrics: "Functional Tab · Real-Time Shield · 100% Local Privacy",
    githubUrl: "https://github.com/jstnexc",
    liveUrl: "#timeguard",
    featured: true,
    isPlayable: true,
  }
];

export const SKILLS_DATA: SkillItem[] = [
  // Programming & Web
  { name: "TypeScript & JavaScript", category: "Programming", percentage: 88, color: "#3178c6" },
  { name: "React & Next.js", category: "Frontend", percentage: 90, color: "#61dafb" },
  { name: "Tailwind CSS & Modern UI", category: "Frontend", percentage: 94, color: "#38bdf8" },
  { name: "HTML5 / CSS3 / Web Standards", category: "Frontend", percentage: 95, color: "#e34f26" },
  { name: "Node.js & REST APIs", category: "Programming", percentage: 82, color: "#339933" },
  { name: "Git & Version Control", category: "Programming", percentage: 88, color: "#f05032" },
  
  // Computer Engineering & Systems
  { name: "Computer Engineering Architecture", category: "Computer Engineering & Systems", percentage: 88, color: "#a855f7" },
  { name: "Microprocessor & Hardware Logic", category: "Computer Engineering & Systems", percentage: 84, color: "#06b6d4" },
  { name: "Computer Literacy & Systems", category: "Computer Engineering & Systems", percentage: 95, color: "#10b981" },

  // Core Competencies from resume
  { name: "Fast Learner & Adaptability", category: "Core Competencies", percentage: 98, color: "#8b5cf6" },
  { name: "Teamwork & Communication", category: "Core Competencies", percentage: 96, color: "#ec4899" },
  { name: "Creative Problem Solving", category: "Core Competencies", percentage: 92, color: "#f59e0b" },
  { name: "Workplace Expansion & Execution", category: "Core Competencies", percentage: 94, color: "#14b8a6" }
];
