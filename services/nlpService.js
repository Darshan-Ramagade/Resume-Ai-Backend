/**
 * NLP Service
 * Handles text processing, TF-IDF, and similarity calculations
 */

/**
 * Preprocess text (lowercase, remove special chars, tokenize)
 * @param {string} text - Raw text
 * @returns {string} - Cleaned text
 */
const preprocessText = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')          // Remove special characters
      .replace(/\s+/g, ' ')              // Remove extra spaces
      .replace(/\d+/g, '')               // Remove numbers
      .trim();
  };
  
  /**
   * Tokenize text into words
   * @param {string} text - Text to tokenize
   * @returns {Array<string>} - Array of tokens
   */
  const tokenize = (text) => {
    return text
      .split(/\s+/)
      .filter(word => word.length > 2);  // Remove very short words
  };
  
  /**
   * Remove stop words (common words like "the", "is", "at")
   * @param {Array<string>} tokens - Array of tokens
   * @returns {Array<string>} - Filtered tokens
   */
  const removeStopWords = (tokens) => {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were',
      'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
      'could', 'should', 'may', 'might', 'must', 'can', 'of', 'for', 'to', 'in',
      'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then',
      'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'both',
      'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
      'only', 'own', 'same', 'so', 'than', 'too', 'very', 'and', 'but', 'or',
      'if', 'because', 'while', 'this', 'that', 'these', 'those', 'i', 'you',
      'he', 'she', 'it', 'we', 'they', 'them', 'their', 'what', 'who',
    ]);
  
    return tokens.filter(token => !stopWords.has(token));
  };
  
  /**
   * Calculate Term Frequency (TF)
   * @param {Array<string>} tokens - Array of tokens
   * @returns {Object} - TF map
   */
  const calculateTF = (tokens) => {
    const tf = {};
    const totalTokens = tokens.length;
  
    tokens.forEach(token => {
      tf[token] = (tf[token] || 0) + 1;
    });
  
    // Normalize by total tokens
    Object.keys(tf).forEach(token => {
      tf[token] = tf[token] / totalTokens;
    });
  
    return tf;
  };
  
  /**
   * Calculate Inverse Document Frequency (IDF)
   * @param {Array<Array<string>>} documents - Array of tokenized documents
   * @returns {Object} - IDF map
   */
  const calculateIDF = (documents) => {
    const idf = {};
    const totalDocs = documents.length;
  
    // Count document frequency for each term
    documents.forEach(doc => {
      const uniqueTokens = new Set(doc);
      uniqueTokens.forEach(token => {
        idf[token] = (idf[token] || 0) + 1;
      });
    });
  
    // Calculate IDF
    Object.keys(idf).forEach(token => {
      idf[token] = Math.log(totalDocs / idf[token]);
    });
  
    return idf;
  };
  
  /**
   * Calculate TF-IDF vector
   * @param {Array<string>} tokens - Array of tokens
   * @param {Object} idf - IDF map
   * @returns {Object} - TF-IDF vector
   */
  const calculateTFIDF = (tokens, idf) => {
    const tf = calculateTF(tokens);
    const tfidf = {};
  
    Object.keys(tf).forEach(token => {
      tfidf[token] = tf[token] * (idf[token] || 0);
    });
  
    return tfidf;
  };
  
  /**
   * Calculate cosine similarity between two vectors
   * @param {Object} vectorA - First TF-IDF vector
   * @param {Object} vectorB - Second TF-IDF vector
   * @returns {number} - Similarity score (0-1)
   */
  const cosineSimilarity = (vectorA, vectorB) => {
    const keysA = Object.keys(vectorA);
    const keysB = Object.keys(vectorB);
    const allKeys = new Set([...keysA, ...keysB]);
  
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
  
    allKeys.forEach(key => {
      const valueA = vectorA[key] || 0;
      const valueB = vectorB[key] || 0;
  
      dotProduct += valueA * valueB;
      magnitudeA += valueA * valueA;
      magnitudeB += valueB * valueB;
    });
  
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
  
    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }
  
    return dotProduct / (magnitudeA * magnitudeB);
  };
  
  /**
 * Calculate match score between resume and job description
 * @param {string} resumeText - Resume text
 * @param {string} jobDescription - Job description text
 * @returns {number} - Match score (0-100)
 */
const calculateMatchScore = (resumeText, jobDescription) => {
  // Tokenize
  const resumeTokens = removeStopWords(tokenize(resumeText));
  const jobTokens = removeStopWords(tokenize(jobDescription));

  // If either is empty, return 0
  if (resumeTokens.length === 0 || jobTokens.length === 0) {
    return 0;
  }

  // Calculate simple word overlap (Jaccard similarity)
  const resumeSet = new Set(resumeTokens);
  const jobSet = new Set(jobTokens);
  
  const intersection = new Set([...resumeSet].filter(x => jobSet.has(x)));
  const union = new Set([...resumeSet, ...jobSet]);
  
  const jaccardScore = (intersection.size / union.size) * 100;

  // Calculate TF-IDF based similarity
  const idf = calculateIDF([resumeTokens, jobTokens]);
  const resumeVector = calculateTFIDF(resumeTokens, idf);
  const jobVector = calculateTFIDF(jobTokens, idf);
  const cosineSim = cosineSimilarity(resumeVector, jobVector) * 100;

  // Weighted average (60% Jaccard, 40% Cosine)
  const finalScore = (jaccardScore * 0.6) + (cosineSim * 0.4);

  // Round and ensure it's between 0-100
  return Math.min(100, Math.max(0, Math.round(finalScore)));
};
  
  /**
   * Extract keywords from text
   * @param {string} text - Text to extract keywords from
   * @param {number} topN - Number of top keywords to return
   * @returns {Array<string>} - Array of keywords
   */
  const extractKeywords = (text, topN = 10) => {
    const tokens = removeStopWords(tokenize(preprocessText(text)));
    const tf = calculateTF(tokens);
  
    // Sort by frequency
    const sorted = Object.entries(tf)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN)
      .map(entry => entry[0]);
  
    return sorted;
  };
  
  export default {
    preprocessText,
    tokenize,
    removeStopWords,
    calculateMatchScore,
    extractKeywords,
    cosineSimilarity,
  };