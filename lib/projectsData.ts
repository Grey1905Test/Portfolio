export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  duration: string;
  type: string;
  description: string[];
  technologies: string[];
  metrics?: string[];
  features?: string[];
  links?: {
    github?: string;
    demo?: string;
    url?: string;
  };
}

export const projects: ProjectItem[] = [
  {
    id: "hacksync",
    title: "HackSync",
    tagline: "AI-Powered Hackathon Coordination Platform",
    duration: "2024",
    type: "Full-Stack Web Application",
    description: [
      "Real-time collaboration platform that transforms PRDs into actionable task workflows, reducing coordination overhead by 20-25%",
      "AI-driven task generation using Google Gemini Flash 2.0, automatically categorizing 10-50 tasks with dependency detection",
      "Integration contract system with side-by-side views showing exact API requirements between frontend and backend",
      "Real-time dependency notifications across team members with Firebase sub-second synchronization"
    ],
    technologies: ["Next.js 14", "TypeScript", "Firebase", "Google Gemini AI", "Tailwind CSS", "Vercel"],
    metrics: ["20-25% reduced coordination time", "Sub-second real-time sync", "10-50 auto-generated tasks", "Zero-config deployment"],
    features: [
      "AI task generation from PRDs",
      "Integration contract system",
      "Real-time dependency tracking",
      "Kanban board interface",
      "Live team collaboration"
    ]
  },
  {
    id: "capsule",
    title: "Capsule",
    tagline: "Digital Time Capsule Mobile App",
    duration: "2024-Present",
    type: "Full-Stack Mobile Application",
    description: [
      "Flutter mobile app enabling users to create digital time capsules locked until reveal dates, featuring physics-based interactions",
      "Built with clean architecture using BLoC pattern across 86 Dart files and 15,680+ lines of code",
      "Laravel API backend with 60+ endpoints, 21 database tables, and PostgreSQL with UUID keys",
      "Instagram-inspired multi-layer caching (5-min TTL) with sophisticated state management across 5 BLoCs"
    ],
    technologies: ["Flutter", "BLoC Pattern", "Laravel API", "PostgreSQL", "Docker", "Firebase", "Laravel Sanctum"],
    metrics: ["75% MVP complete", "15,680+ lines of code", "60+ API endpoints", "45 FPS physics simulation"],
    features: [
      "Physics-based interactions",
      "Glassmorphism UI design",
      "Collaborative sharing",
      "Media upload system",
      "Role-based permissions",
      "Export to PDF/Photobook"
    ]
  },
  {
    id: "flowcus",
    title: "Flowcus",
    tagline: "Voice-First Task Management Desktop App",
    duration: "2024",
    type: "Desktop Application",
    description: [
      "Cross-platform desktop application with dual-mode voice recognition processing 500+ commands with 95% accuracy",
      "Designed SQLite database with indexed queries managing 10,000+ tasks with sub-50ms response times",
      "Integrated Gemini AI API for natural language processing of 1,000+ daily requests with 98% success rate",
      "Created FullCalendar visualization dashboard rendering 500+ tasks in under 100ms"
    ],
    technologies: ["Electron", "Vue 3", "TypeScript", "SQLite", "Google Gemini AI", "Pinia", "FullCalendar"],
    metrics: ["100% voice command reliability", "95% task creation accuracy", "Sub-50ms query response", "10,000+ tasks managed"],
    features: [
      "Voice command interface",
      "Kanban board view",
      "Pomodoro timer",
      "Task dependencies",
      "Focus mode",
      "Gamification system"
    ]
  },
  {
    id: "medical-ml",
    title: "Medical Expenditure Prediction",
    tagline: "Healthcare Cost Forecasting ML Pipeline",
    duration: "2024",
    type: "Machine Learning Project",
    description: [
      "Constructed end-to-end ML pipeline for healthcare cost forecasting using ensemble methods on 100,000+ patient records",
      "Achieved 92% prediction accuracy with XGBoost and Random Forest models through extensive feature engineering",
      "Performed data preprocessing on 50+ features handling 15% missing values and 500+ outliers",
      "Generated 20+ derived features through statistical analysis, improving model R² from 0.75 to 0.92"
    ],
    technologies: ["Python", "XGBoost", "Pandas", "NumPy", "Scikit-learn", "Random Forest"],
    metrics: ["92% prediction accuracy", "100,000+ patient records", "25% reduced prediction error", "R² improved to 0.92"],
    features: [
      "Ensemble ML models",
      "Feature engineering",
      "10-fold cross-validation",
      "Statistical analysis",
      "Data preprocessing pipeline"
    ]
  },
  {
    id: "image-colorization",
    title: "Image Colorization",
    tagline: "Deep Learning Color Restoration",
    duration: "2024",
    type: "Deep Learning Project",
    description: [
      "Designed 12-layer CNN architecture with residual connections for grayscale-to-color conversion on 50,000+ training images",
      "Achieved 85% color accuracy using LAB color space processing with custom loss functions",
      "Preprocessed datasets with normalization and augmentation using batch processing of 64 images",
      "Implemented PSNR and SSIM quality metrics through hyperparameter tuning across 100+ experiments"
    ],
    technologies: ["Python", "TensorFlow", "Keras", "CNN", "OpenCV", "LAB Color Space"],
    metrics: ["85% color accuracy", "50,000+ training images", "40% reduced training time", "100+ experiments"],
    features: [
      "12-layer CNN architecture",
      "Residual connections",
      "LAB color space processing",
      "Batch normalization",
      "Quality metrics (PSNR/SSIM)"
    ]
  }
];