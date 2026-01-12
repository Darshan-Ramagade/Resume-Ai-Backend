import { ATS_RULES, ATS_KEYWORDS, ATS_SECTION_HEADERS } from '../config/constants.js';

/**
 * ATS Optimization Service
 * Analyzes resume for ATS compliance and generates suggestions
 */

/**
 * Analyze ATS compliance
 * @param {string} resumeText - Resume text
 * @returns {Object} - ATS analysis results
 */
const analyzeATSCompliance = (resumeText) => {
  const issues = [];
  let score = 100;

  // Check for standard section headers
  const hasStandardHeaders = checkStandardHeaders(resumeText);
  if (!hasStandardHeaders) {
    issues.push('Use standard section headers like EXPERIENCE, EDUCATION, SKILLS');
    score -= 15;
  }

  // Check for special characters
  const hasSpecialChars = checkSpecialCharacters(resumeText);
  if (hasSpecialChars) {
    issues.push('Avoid special bullet points (•, →, ★) - use standard hyphens or asterisks');
    score -= 10;
  }

  // Check keyword density
  const keywordDensity = calculateKeywordDensity(resumeText);
  if (keywordDensity < ATS_RULES.MIN_KEYWORD_DENSITY) {
    issues.push('Add more action verbs (developed, managed, implemented, designed)');
    score -= 10;
  }

  // Check for contact information
  const hasContact = checkContactInfo(resumeText);
  if (!hasContact) {
    issues.push('Include clear contact information (email and phone number)');
    score -= 15;
  }

  // Check for quantifiable achievements
  const hasMetrics = checkForMetrics(resumeText);
  if (!hasMetrics) {
    issues.push('Add quantifiable achievements (e.g., "increased sales by 25%", "managed team of 10")');
    score -= 10;
  }

  // Check resume length
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 300) {
    issues.push('Resume is too short - aim for 400-800 words');
    score -= 15;
  } else if (wordCount > 1000) {
    issues.push('Resume is too long - keep it concise (1-2 pages)');
    score -= 5;
  }

  return {
    score: Math.max(0, score),
    issues,
  };
};

/**
 * Check for standard section headers
 * @param {string} text - Resume text
 * @returns {boolean} - Has standard headers
 */
const checkStandardHeaders = (text) => {
  const normalizedText = text.toLowerCase();
  let foundHeaders = 0;

  ATS_SECTION_HEADERS.slice(0, 15).forEach(header => {
    if (normalizedText.includes(header)) {
      foundHeaders++;
    }
  });

  // Should have at least 3 standard headers (Experience, Education, Skills)
  return foundHeaders >= 3;
};

/**
 * Check for special characters that may confuse ATS
 * @param {string} text - Resume text
 * @returns {boolean} - Has problematic special characters
 */
const checkSpecialCharacters = (text) => {
  return ATS_RULES.AVOID_SPECIAL_CHARS.some(char => text.includes(char));
};

/**
 * Calculate keyword density (action verbs)
 * @param {string} text - Resume text
 * @returns {number} - Average keyword mentions
 */
const calculateKeywordDensity = (text) => {
  const normalizedText = text.toLowerCase();
  let totalKeywords = 0;

  ATS_KEYWORDS.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = normalizedText.match(regex);
    if (matches) {
      totalKeywords += matches.length;
    }
  });

  return totalKeywords / ATS_KEYWORDS.length;
};

/**
 * Check for contact information
 * @param {string} text - Resume text
 * @returns {boolean} - Has contact info
 */
const checkContactInfo = (text) => {
  // Check for email pattern
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  // Check for phone pattern
  const phonePattern = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;

  return emailPattern.test(text) && phonePattern.test(text);
};

/**
 * Check for quantifiable metrics
 * @param {string} text - Resume text
 * @returns {boolean} - Has metrics
 */
const checkForMetrics = (text) => {
  // Look for numbers followed by % or common metric indicators
  const metricPatterns = [
    /\d+%/,                          // Percentages: 25%
    /\d+\s*(million|thousand|k)/i,   // Large numbers: 5 million, 10k
    /\$\d+/,                         // Money: $50,000
    /\d+\s*years?/i,                 // Years of experience: 5 years
    /team of \d+/i,                  // Team size: team of 10
    /increased by \d+/i,             // Growth metrics
    /reduced by \d+/i,               // Reduction metrics
  ];

  return metricPatterns.some(pattern => pattern.test(text));
};

/**
 * Generate suggestions based on analysis
 * @param {Object} params - Analysis parameters
 * @returns {Array<Object>} - Array of suggestions
 */
const generateSuggestions = (params) => {
  const {
    resumeText,
    jobDescription,
    missingSkills,
    resumeSkills,
    jobSkills,
  } = params;

  const suggestions = [];

  // Skill-based suggestions
  if (missingSkills.length > 0) {
    missingSkills.slice(0, 5).forEach(skill => {
      suggestions.push({
        type: 'skill',
        message: `Add "${skill}" to your skills section or work experience`,
        priority: 'high',
      });
    });
  }

  // Keyword suggestions
  const resumeKeywords = extractActionVerbs(resumeText);
  const jobKeywords = extractActionVerbs(jobDescription);
  const missingKeywords = jobKeywords.filter(kw => !resumeKeywords.includes(kw));

  if (missingKeywords.length > 0) {
    suggestions.push({
      type: 'keyword',
      message: `Use more action verbs from the job description: ${missingKeywords.slice(0, 5).join(', ')}`,
      priority: 'medium',
    });
  }

  // Formatting suggestions
  if (!checkStandardHeaders(resumeText)) {
    suggestions.push({
      type: 'formatting',
      message: 'Use clear section headers: EXPERIENCE, EDUCATION, SKILLS, PROJECTS',
      priority: 'high',
    });
  }

  if (!checkForMetrics(resumeText)) {
    suggestions.push({
      type: 'experience',
      message: 'Quantify your achievements with numbers (e.g., "Improved performance by 30%")',
      priority: 'high',
    });
  }

  // ATS-specific suggestions
  if (checkSpecialCharacters(resumeText)) {
    suggestions.push({
      type: 'ats',
      message: 'Replace fancy bullet points with simple hyphens (-) or asterisks (*)',
      priority: 'medium',
    });
  }

  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push({
      type: 'ats',
      message: 'Expand your resume with more details about your experience and projects',
      priority: 'medium',
    });
  }

  // If resume has good skill match, suggest emphasis
  const skillMatchPercentage = (jobSkills.length - missingSkills.length) / jobSkills.length * 100;
  if (skillMatchPercentage >= 70) {
    suggestions.push({
      type: 'skill',
      message: 'Great skill match! Emphasize these matching skills in your summary and experience sections',
      priority: 'low',
    });
  }

  return suggestions;
};

/**
 * Extract action verbs from text
 * @param {string} text - Text to analyze
 * @returns {Array<string>} - Array of action verbs found
 */
const extractActionVerbs = (text) => {
  const normalizedText = text.toLowerCase();
  const foundVerbs = [];

  ATS_KEYWORDS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi');
    if (regex.test(normalizedText)) {
      foundVerbs.push(verb);
    }
  });

  return foundVerbs;
};

/**
 * Get ATS optimization tips
 * @returns {Array<string>} - General ATS tips
 */
const getATSTips = () => {
  return [
    'Use standard fonts like Arial, Calibri, or Times New Roman',
    'Avoid headers and footers - ATS may not read them',
    'Save your resume as a .docx or .pdf file',
    'Use standard section headings (EXPERIENCE, EDUCATION, SKILLS)',
    'Include keywords from the job description naturally',
    'Quantify achievements with numbers and percentages',
    'Use simple bullet points (• or -)',
    'Avoid tables, text boxes, and images',
    'Spell out acronyms at least once (e.g., "Search Engine Optimization (SEO)")',
    'Keep formatting simple and consistent',
  ];
};

export default {
  analyzeATSCompliance,
  generateSuggestions,
  checkStandardHeaders,
  checkSpecialCharacters,
  checkContactInfo,
  checkForMetrics,
  extractActionVerbs,
  getATSTips,
};