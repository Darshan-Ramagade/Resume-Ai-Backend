import pdfParse from 'pdf-parse';

/**
 * PDF Processing Service
 * Extracts text from PDF files
 */

/**
 * Extract text from PDF buffer
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    
    let text = data.text;

    // Clean up extracted text
    text = text
      .replace(/\r\n/g, '\n')           // Normalize line breaks
      .replace(/\n{3,}/g, '\n\n')       // Remove excessive line breaks
      .replace(/\t/g, ' ')              // Replace tabs with spaces
      .replace(/\s{2,}/g, ' ')          // Remove multiple spaces
      .trim();

    return text;

  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Please ensure the file is not corrupted or password-protected.');
  }
};

/**
 * Validate PDF file
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {boolean} - Is valid PDF
 */
const isValidPDF = (pdfBuffer) => {
  // Check PDF magic number (starts with %PDF)
  const header = pdfBuffer.toString('utf8', 0, 4);
  return header === '%PDF';
};

/**
 * Get PDF metadata
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<Object>} - PDF metadata
 */
const getPDFMetadata = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    
    return {
      pages: data.numpages,
      info: data.info,
      metadata: data.metadata,
      version: data.version,
    };

  } catch (error) {
    console.error('PDF metadata extraction error:', error);
    return null;
  }
};

export default {
  extractTextFromPDF,
  isValidPDF,
  getPDFMetadata,
};