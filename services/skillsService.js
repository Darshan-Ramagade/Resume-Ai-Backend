import { TECHNICAL_SKILLS, SOFT_SKILLS } from '../config/constants.js';

/**
 * Escape special regex characters in skill names
 * @param {string} skill - Skill to escape
 * @returns {string} - Escaped skill
 */
const escapeRegex = (skill) => {
  return skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Extract all skills (technical + soft) from text
 * @param {string} text - Text to analyze
 * @returns {Array<string>} - Array of found skills
 */
const extractSkills = (text) => {
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set();

  // Check for technical skills
  TECHNICAL_SKILLS.forEach(skill => {
    const escapedSkill = escapeRegex(skill);
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  });

  // Check for soft skills
  SOFT_SKILLS.forEach(skill => {
    const escapedSkill = escapeRegex(skill);
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills).sort();
};

/**
 * Extract only technical skills
 * @param {string} text - Text to analyze
 * @returns {Array<string>} - Array of technical skills
 */
const extractTechnicalSkills = (text) => {
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set();

  TECHNICAL_SKILLS.forEach(skill => {
    const escapedSkill = escapeRegex(skill);
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills).sort();
};

/**
 * Extract only soft skills
 * @param {string} text - Text to analyze
 * @returns {Array<string>} - Array of soft skills
 */
const extractSoftSkills = (text) => {
  const normalizedText = text.toLowerCase();
  const foundSkills = new Set();

  SOFT_SKILLS.forEach(skill => {
    const escapedSkill = escapeRegex(skill);
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  });

  return Array.from(foundSkills).sort();
};

/**
 * Calculate skill match percentage
 * @param {Array<string>} resumeSkills - Skills from resume
 * @param {Array<string>} jobSkills - Required skills from job
 * @returns {number} - Match percentage (0-100)
 */
const calculateSkillMatch = (resumeSkills, jobSkills) => {
  if (jobSkills.length === 0) return 100;
  if (resumeSkills.length === 0) return 0;

  const resumeSkillsSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  const matchingSkills = jobSkills.filter(skill => 
    resumeSkillsSet.has(skill.toLowerCase())
  );

  return Math.round((matchingSkills.length / jobSkills.length) * 100);
};

/**
 * Find missing skills (in job but not in resume)
 * @param {Array<string>} resumeSkills - Skills from resume
 * @param {Array<string>} jobSkills - Required skills from job
 * @returns {Array<string>} - Missing skills
 */
const findMissingSkills = (resumeSkills, jobSkills) => {
  const resumeSkillsSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  
  return jobSkills
    .filter(skill => !resumeSkillsSet.has(skill.toLowerCase()))
    .sort();
};

/**
 * Find matching skills (in both resume and job)
 * @param {Array<string>} resumeSkills - Skills from resume
 * @param {Array<string>} jobSkills - Required skills from job
 * @returns {Array<string>} - Matching skills
 */
const findMatchingSkills = (resumeSkills, jobSkills) => {
  const resumeSkillsSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  
  return jobSkills
    .filter(skill => resumeSkillsSet.has(skill.toLowerCase()))
    .sort();
};

/**
 * Get skill recommendations based on missing skills
 * @param {Array<string>} missingSkills - Skills missing from resume
 * @returns {Array<Object>} - Skill recommendations with learning resources
 */
const getSkillRecommendations = (missingSkills) => {
  const recommendations = missingSkills.slice(0, 5).map(skill => ({
    skill,
    priority: determinePriority(skill),
    learningResources: getLearningResources(skill),
  }));

  return recommendations;
};

/**
 * Determine priority of a skill
 * @param {string} skill - Skill name
 * @returns {string} - Priority level (high/medium/low)
 */
const determinePriority = (skill) => {
  const highPrioritySkills = [
    'javascript', 'python', 'java', 'react', 'nodejs', 'angular', 'vue',
    'typescript', 'aws', 'docker', 'kubernetes', 'sql', 'mongodb'
  ];

  const mediumPrioritySkills = [
    'git', 'agile', 'scrum', 'rest', 'graphql', 'redis', 'jenkins',
    'terraform', 'linux', 'webpack', 'sass', 'tailwind'
  ];

  if (highPrioritySkills.includes(skill.toLowerCase())) {
    return 'high';
  } else if (mediumPrioritySkills.includes(skill.toLowerCase())) {
    return 'medium';
  } else {
    return 'low';
  }
};

/**
 * Get learning resources for a skill
 * @param {string} skill - Skill name
 * @returns {Array<string>} - Learning resources
 */
const getLearningResources = (skill) => {
  const capitalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
  
  return [
    `${capitalizedSkill} courses on Coursera`,
    `${capitalizedSkill} tutorials on YouTube`,
    `${capitalizedSkill} documentation and guides`,
    `Practice ${capitalizedSkill} on freeCodeCamp`,
    `${capitalizedSkill} projects on GitHub`,
  ];
};

/**
 * Group skills by category
 * @param {Array<string>} skills - Array of skills
 * @returns {Object} - Skills grouped by category
 */
const groupSkillsByCategory = (skills) => {
  const categories = {
    languages: [],
    frontend: [],
    backend: [],
    databases: [],
    cloud: [],
    tools: [],
    soft: [],
    other: [],
  };

  const categoryMap = {
    languages: ['javascript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'rust', 'typescript'],
    frontend: ['react', 'angular', 'vue', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'nextjs', 'redux', 'webpack'],
    backend: ['nodejs', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'graphql', 'rest'],
    databases: ['mongodb', 'mysql', 'postgresql', 'redis', 'sqlite', 'cassandra', 'dynamodb', 'firebase'],
    cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible'],
    tools: ['git', 'github', 'jira', 'figma', 'postman', 'vscode', 'linux', 'bash'],
    soft: SOFT_SKILLS,
  };

  skills.forEach(skill => {
    const lowerSkill = skill.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(categoryMap)) {
      if (keywords.includes(lowerSkill)) {
        categories[category].push(skill);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      categories.other.push(skill);
    }
  });

  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });

  return categories;
};

/**
 * Calculate skill proficiency level based on context
 * @param {string} text - Resume text
 * @param {string} skill - Skill to analyze
 * @returns {string} - Proficiency level (expert/advanced/intermediate/beginner)
 */
const estimateProficiency = (text, skill) => {
  const normalizedText = text.toLowerCase();
  const skillLower = skill.toLowerCase();
  const escapedSkill = escapeRegex(skillLower);

  // Count mentions
  const mentions = (normalizedText.match(new RegExp(`\\b${escapedSkill}\\b`, 'gi')) || []).length;

  // Check for proficiency indicators
  const expertIndicators = ['expert', 'lead', 'architect', 'senior'];
  const advancedIndicators = ['advanced', 'experienced', 'proficient', 'extensive'];
  const intermediateIndicators = ['intermediate', 'working knowledge', 'familiar'];

  const hasExpertContext = expertIndicators.some(indicator => 
    normalizedText.includes(`${indicator} ${skillLower}`) || 
    normalizedText.includes(`${skillLower} ${indicator}`)
  );

  const hasAdvancedContext = advancedIndicators.some(indicator => 
    normalizedText.includes(`${indicator} ${skillLower}`) || 
    normalizedText.includes(`${skillLower} ${indicator}`)
  );

  const hasIntermediateContext = intermediateIndicators.some(indicator => 
    normalizedText.includes(`${indicator} ${skillLower}`) || 
    normalizedText.includes(`${skillLower} ${indicator}`)
  );

  // Determine proficiency
  if (hasExpertContext || mentions >= 5) {
    return 'expert';
  } else if (hasAdvancedContext || mentions >= 3) {
    return 'advanced';
  } else if (hasIntermediateContext || mentions >= 2) {
    return 'intermediate';
  } else {
    return 'beginner';
  }
};

/**
 * Get detailed skill analysis
 * @param {string} resumeText - Resume text
 * @param {string} jobDescription - Job description text
 * @returns {Object} - Detailed skill analysis
 */
const getDetailedSkillAnalysis = (resumeText, jobDescription) => {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);
  
  const missingSkills = findMissingSkills(resumeSkills, jobSkills);
  const matchingSkills = findMatchingSkills(resumeSkills, jobSkills);
  const matchPercentage = calculateSkillMatch(resumeSkills, jobSkills);

  return {
    resumeSkills: {
      all: resumeSkills,
      technical: extractTechnicalSkills(resumeText),
      soft: extractSoftSkills(resumeText),
      byCategory: groupSkillsByCategory(resumeSkills),
      count: resumeSkills.length,
    },
    jobSkills: {
      all: jobSkills,
      technical: extractTechnicalSkills(jobDescription),
      soft: extractSoftSkills(jobDescription),
      byCategory: groupSkillsByCategory(jobSkills),
      count: jobSkills.length,
    },
    matching: {
      skills: matchingSkills,
      count: matchingSkills.length,
      percentage: matchPercentage,
    },
    missing: {
      skills: missingSkills,
      count: missingSkills.length,
      recommendations: getSkillRecommendations(missingSkills),
    },
  };
};

export default {
  extractSkills,
  extractTechnicalSkills,
  extractSoftSkills,
  calculateSkillMatch,
  findMissingSkills,
  findMatchingSkills,
  getSkillRecommendations,
  groupSkillsByCategory,
  estimateProficiency,
  getDetailedSkillAnalysis,
};