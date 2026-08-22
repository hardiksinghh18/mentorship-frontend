export const DEFAULT_FILTERS = {
  role: "",
  name: "",
  skills: "",
  minExperience: "",
  connectionStatus: "all",
};

export const ROLE_OPTIONS = [
  { value: "", label: "All Members" },
  { value: "mentor", label: "Mentors" },
  { value: "mentee", label: "Mentees" },
];

export const EXPERIENCE_OPTIONS = [
  { value: "", label: "Any" },
  { value: "0", label: "Entry Level" },
  { value: "2", label: "2+ Years" },
  { value: "5", label: "5+ Years" },
  { value: "10", label: "10+ Years" },
];

export const CONNECTION_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "connected", label: "Connected" },
  { value: "pending", label: "Pending" },
  { value: "not_connected", label: "Not Connected" },
];

export const PREDEFINED_SKILLS = [
  "React", "Next.js", "Vue.js", "Angular", "Svelte",
  "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS",
  "Node.js", "Express.js", "NestJS", "Django", "Flask",
  "Python", "Java", "C++", "C#", "Go", "Rust", "Ruby",
  "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes",
  "GraphQL", "REST API", "gRPC",
  "React Native", "Flutter", "Swift", "Kotlin",
  "Git", "CI/CD", "Linux", "Terraform",
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
  "Data Science", "Data Engineering", "Data Analytics",
  "Figma", "UI/UX Design", "Product Management",
  "System Design", "DSA", "Blockchain", "Web3",
];
