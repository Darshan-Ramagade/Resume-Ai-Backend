/**
 * Validation Utility Functions
 * Common validation helpers
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result
   */
  const validatePassword = (password) => {
    const errors = [];
  
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
  
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
  
    // Optional: Add more strength requirements
    // if (!/[A-Z]/.test(password)) {
    //   errors.push('Password must contain at least one uppercase letter');
    // }
  
    // if (!/[a-z]/.test(password)) {
    //   errors.push('Password must contain at least one lowercase letter');
    // }
  
    // if (!/[0-9]/.test(password)) {
    //   errors.push('Password must contain at least one number');
    // }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  /**
   * Validate MongoDB ObjectId
   * @param {string} id - ID to validate
   * @returns {boolean} - Is valid ObjectId
   */
  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };
  
  /**
   * Sanitize string (remove HTML tags, trim)
   * @param {string} str - String to sanitize
   * @returns {string} - Sanitized string
   */
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return '';
    
    return str
      .replace(/<[^>]*>/g, '')  // Remove HTML tags
      .trim();
  };
  
  /**
   * Validate file size
   * @param {number} size - File size in bytes
   * @param {number} maxSize - Max allowed size in bytes
   * @returns {boolean} - Is valid size
   */
  const isValidFileSize = (size, maxSize = 5 * 1024 * 1024) => {
    return size <= maxSize;
  };
  
  /**
   * Validate file type
   * @param {string} mimetype - File MIME type
   * @param {Array<string>} allowedTypes - Allowed MIME types
   * @returns {boolean} - Is valid type
   */
  const isValidFileType = (mimetype, allowedTypes = ['application/pdf']) => {
    return allowedTypes.includes(mimetype);
  };
  
  /**
   * Validate URL
   * @param {string} url - URL to validate
   * @returns {boolean} - Is valid URL
   */
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  };
  
  /**
   * Validate phone number (basic)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} - Is valid phone
   */
  const isValidPhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };
  
  export default {
    isValidEmail,
    validatePassword,
    isValidObjectId,
    sanitizeString,
    isValidFileSize,
    isValidFileType,
    isValidURL,
    isValidPhone,
  };