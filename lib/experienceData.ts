export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    location: string;
    duration: string;
    type: string;
    description: string[];
    technologies: string[];
    metrics?: string[];
  }
  
  export const experiences: ExperienceItem[] = [
    {
      id: "datanimbus",
      company: "Datanimbus",
      role: "Data Engineer Intern",
      location: "Texas (Remote)",
      duration: "June 2025 – December 2025",
      type: "Internship",
      description: [
        "Architected end-to-end ETL pipelines using Apache Spark and Databricks, processing 500GB+ daily datasets with 99.9% reliability across 20+ distributed nodes",
        "Developed scalable data models and transformation logic in Python and SQL for 15+ enterprise clients, implementing star schema and dimensional modeling across 50+ database tables",
        "Established data quality frameworks with automated schema validation and anomaly detection across 100+ data sources",
        "Automated monitoring and alerting systems for 30+ data pipelines, improving reliability by 35% and reducing manual intervention by 70%"
      ],
      technologies: ["Apache Spark", "Databricks", "Python", "SQL", "ETL"],
      metrics: ["500GB+ daily datasets", "99.9% reliability", "40% reduced processing time", "60% reduced pipeline failures"]
    },
    {
      id: "quichub",
      company: "Quichub Innovations",
      role: "Development Intern",
      location: "Bangalore, India",
      duration: "January 2024 – May 2024",
      type: "Internship",
      description: [
        "Integrated 5+ payment gateway APIs (Stripe, Razorpay) and 3 shipping service APIs in Python/Golang, processing 10,000+ monthly transactions",
        "Implemented robust error handling and retry mechanisms across API integrations, achieving 99.5% uptime and reducing failed transactions by 30%"
      ],
      technologies: ["Python", "Golang", "Stripe API", "Razorpay", "REST APIs"],
      metrics: ["10,000+ monthly transactions", "99.5% uptime", "25% error reduction"]
    },
    {
      id: "dataphi",
      company: "Dataphi Labs",
      role: "Web Development Intern",
      location: "Bangalore, India",
      duration: "June 2023 – August 2023",
      type: "Internship",
      description: [
        "Developed contract management platform handling 1,000+ concurrent users with real-time WebSocket synchronization and JWT authentication",
        "Implemented Redis caching layer reducing database queries by 65% and improving page load times by 50% for 5,000+ monthly active users"
      ],
      technologies: ["WebSocket", "Redis", "JWT", "Real-time Systems"],
      metrics: ["1,000+ concurrent users", "Sub-200ms response times", "50% improved load times"]
    }
  ];