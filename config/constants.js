/**
 * Application Constants
 * Centralized configuration for skills, ATS rules, etc.
 */

// Technical Skills Database (500+ skills)
export const TECHNICAL_SKILLS = [
    // Programming Languages
    'javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
    'go', 'rust', 'typescript', 'scala', 'perl', 'r', 'matlab', 'dart',
    
    // Frontend Technologies
    'react', 'reactjs', 'angular', 'vue', 'vuejs', 'svelte', 'nextjs', 'next.js',
    'nuxt', 'gatsby', 'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less',
    'tailwind', 'tailwindcss', 'bootstrap', 'materialui', 'mui', 'chakraui',
    'jquery', 'redux', 'mobx', 'recoil', 'webpack', 'vite', 'parcel',
    
    // Backend Technologies
    'nodejs', 'node.js', 'express', 'expressjs', 'nestjs', 'fastify', 'koa',
    'django', 'flask', 'fastapi', 'spring', 'springboot', 'laravel', 'symfony',
    'rails', 'rubyonrails', 'aspnet', 'asp.net', 'graphql', 'rest', 'restapi',
    'grpc', 'websocket', 'microservices',
    
    // Databases
    'mongodb', 'mysql', 'postgresql', 'postgres', 'sqlite', 'redis', 'cassandra',
    'dynamodb', 'couchdb', 'neo4j', 'elasticsearch', 'firebase', 'supabase',
    'oracle', 'sqlserver', 'mariadb', 'prisma', 'sequelize', 'mongoose',
    'typeorm', 'knex',
    
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'googlecloud', 'docker', 'kubernetes', 'k8s',
    'jenkins', 'gitlab', 'github', 'circleci', 'travis', 'terraform', 'ansible',
    'chef', 'puppet', 'vagrant', 'nginx', 'apache', 'linux', 'ubuntu', 'centos',
    'debian', 'bash', 'shell', 'powershell', 'cicd', 'devops',
    
    // Mobile Development
    'android', 'ios', 'reactnative', 'flutter', 'xamarin', 'ionic', 'cordova',
    'nativescript', 'swiftui', 'jetpackcompose',
    
    // Data Science & AI
    'machinelearning', 'deeplearning', 'tensorflow', 'pytorch', 'keras',
    'scikitlearn', 'pandas', 'numpy', 'opencv', 'nlp', 'computervision',
    'dataanalysis', 'datascience', 'ai', 'artificialintelligence', 'jupyter',
    
    // Testing
    'jest', 'mocha', 'chai', 'cypress', 'selenium', 'puppeteer', 'playwright',
    'junit', 'pytest', 'testinglibrary', 'unittest', 'tdd', 'bdd',
    
    // Version Control
    'git', 'github', 'gitlab', 'bitbucket', 'mercurial', 'svn',
    
    // Other Tools
    'figma', 'adobexd', 'sketch', 'photoshop', 'illustrator', 'postman',
    'insomnia', 'jira', 'confluence', 'trello', 'slack', 'notion', 'vscode',
    'intellij', 'eclipse', 'vim', 'emacs',
    
    // Soft Skills
    'agile', 'scrum', 'kanban', 'leadership', 'communication', 'teamwork',
    'problemsolving', 'criticalthinking', 'projectmanagement',
  ];
  
  // Soft Skills
  export const SOFT_SKILLS = [
    'leadership', 'communication', 'teamwork', 'collaboration', 'problemsolving',
    'criticalthinking', 'analytical', 'creativity', 'adaptability', 'timemanagement',
    'organization', 'attention', 'detailoriented', 'multitasking', 'decisionmaking',
    'conflictresolution', 'negotiation', 'presentation', 'interpersonal',
    'emotionalintelligence', 'mentoring', 'coaching', 'strategic', 'innovative',
  ];
  
  // ATS-Friendly Section Headers
  export const ATS_SECTION_HEADERS = [
    'experience', 'work experience', 'professional experience', 'employment',
    'education', 'academic background', 'qualifications',
    'skills', 'technical skills', 'core competencies', 'expertise',
    'projects', 'personal projects', 'portfolio',
    'certifications', 'licenses', 'achievements', 'awards',
    'summary', 'profile', 'objective', 'about',
  ];
  
  // Common ATS Keywords
  export const ATS_KEYWORDS = [
    'developed', 'designed', 'implemented', 'created', 'built', 'led', 'managed',
    'improved', 'increased', 'reduced', 'achieved', 'delivered', 'launched',
    'optimized', 'streamlined', 'automated', 'collaborated', 'coordinated',
    'analyzed', 'researched', 'tested', 'debugged', 'maintained', 'upgraded',
  ];
  
  // File Upload Limits
  export const FILE_LIMITS = {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['application/pdf'],
    ALLOWED_EXTENSIONS: ['.pdf'],
  };
  
  // Analysis Scoring Weights
  export const SCORING_WEIGHTS = {
    SKILLS_MATCH: 0.4,        // 40% weight
    EXPERIENCE_MATCH: 0.3,    // 30% weight
    EDUCATION_MATCH: 0.2,     // 20% weight
    KEYWORD_DENSITY: 0.1,     // 10% weight
  };
  
  // Match Score Thresholds
  export const MATCH_THRESHOLDS = {
    EXCELLENT: 80,   // 80-100%
    GOOD: 60,        // 60-79%
    FAIR: 40,        // 40-59%
    POOR: 0,         // 0-39%
  };
  
  // ATS Optimization Rules
  export const ATS_RULES = {
    MIN_KEYWORD_DENSITY: 2,           // Keywords should appear at least 2 times
    MAX_RESUME_PAGES: 2,              // Keep resume to 2 pages
    MIN_EXPERIENCE_BULLETS: 3,        // At least 3 bullet points per job
    REQUIRED_SECTIONS: ['experience', 'education', 'skills'],
    AVOID_TABLES: true,               // Tables can break ATS parsing
    AVOID_IMAGES: true,               // Images are not ATS-friendly
    AVOID_SPECIAL_CHARS: ['•', '→', '★', '◆', '■'],
    PREFER_STANDARD_FONTS: ['Arial', 'Calibri', 'Times New Roman', 'Georgia'],
  };
  
  export default {
    TECHNICAL_SKILLS,
    SOFT_SKILLS,
    ATS_SECTION_HEADERS,
    ATS_KEYWORDS,
    FILE_LIMITS,
    SCORING_WEIGHTS,
    MATCH_THRESHOLDS,
    ATS_RULES,
  };