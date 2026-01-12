import Analysis from '../models/Analysis.js';
import { AppError } from '../middleware/errorHandler.js';
import pdfService from '../services/pdfService.js';
import nlpService from '../services/nlpService.js';
import skillsService from '../services/skillsService.js';
import atsService from '../services/atsService.js';

/**
 * Create new resume analysis
 * POST /api/analyze
 */
export const createAnalysis = async (req, res, next) => {
  const startTime = Date.now();

  try {
    const { jobDescription } = req.body;
    const userId = req.user._id;

    // Validate inputs
    if (!req.file) {
      return next(new AppError('Please upload a resume PDF', 400));
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      return next(new AppError('Job description must be at least 50 characters', 400));
    }

    console.log('📄 Extracting text from PDF...');
    // Extract text from PDF
    const resumeText = await pdfService.extractTextFromPDF(req.file.buffer);

    if (!resumeText || resumeText.length < 100) {
      return next(new AppError('Resume text is too short or could not be extracted', 400));
    }

    console.log('🔍 Analyzing resume...');
    // Preprocess texts
    const cleanResumeText = nlpService.preprocessText(resumeText);
    const cleanJobDescription = nlpService.preprocessText(jobDescription);

    // Extract skills
    const resumeSkills = skillsService.extractSkills(cleanResumeText);
    const jobSkills = skillsService.extractSkills(cleanJobDescription);

    // Calculate match score
    const matchScore = nlpService.calculateMatchScore(cleanResumeText, cleanJobDescription);

    // Find missing and matching skills
    const missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
    const matchingSkills = jobSkills.filter(skill => resumeSkills.includes(skill));

    console.log('✅ Generating suggestions...');
    // Generate suggestions
    const suggestions = atsService.generateSuggestions({
      resumeText: cleanResumeText,
      jobDescription: cleanJobDescription,
      missingSkills,
      resumeSkills,
      jobSkills,
    });

    // ATS optimization analysis
    const atsAnalysis = atsService.analyzeATSCompliance(resumeText);

    // Calculate processing time
    const processingTime = Date.now() - startTime;

    // Save analysis to database
    const analysis = await Analysis.create({
      userId,
      resumeText,
      jobDescription,
      matchScore,
      resumeSkills,
      jobSkills,
      missingSkills,
      matchingSkills,
      suggestions,
      atsScore: atsAnalysis.score,
      atsIssues: atsAnalysis.issues,
      metadata: {
        resumeWordCount: resumeText.split(/\s+/).length,
        jobDescriptionWordCount: jobDescription.split(/\s+/).length,
        processingTime,
      },
    });

    console.log(`✅ Analysis completed in ${processingTime}ms`);

    // Send response
    res.status(201).json({
      success: true,
      message: 'Analysis completed successfully',
      data: {
        analysisId: analysis._id,
        matchScore: analysis.matchScore,
        matchCategory: analysis.matchCategory,
        resumeSkills: analysis.resumeSkills,
        jobSkills: analysis.jobSkills,
        missingSkills: analysis.missingSkills,
        matchingSkills: analysis.matchingSkills,
        suggestions: analysis.suggestions,
        atsScore: analysis.atsScore,
        atsIssues: analysis.atsIssues,
        processingTime,
      },
    });

  } catch (error) {
    console.error('❌ Analysis error:', error);
    next(error);
  }
};

/**
 * Get user's analysis history
 * GET /api/analyze/history
 */
export const getAnalysisHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Get analyses with pagination
    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-resumeText -jobDescription'); // Exclude large text fields

    // Get total count
    const total = await Analysis.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        analyses: analyses.map(a => a.getSummary()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get single analysis by ID
 * GET /api/analyze/:id
 */
export const getAnalysisById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const analysis = await Analysis.findOne({ _id: id, userId });

    if (!analysis) {
      return next(new AppError('Analysis not found', 404));
    }

    res.status(200).json({
      success: true,
      data: analysis,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Delete analysis
 * DELETE /api/analyze/:id
 */
export const deleteAnalysis = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const analysis = await Analysis.findOneAndDelete({ _id: id, userId });

    if (!analysis) {
      return next(new AppError('Analysis not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Analysis deleted successfully',
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get analysis statistics
 * GET /api/analyze/stats
 */
export const getAnalysisStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await Analysis.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalAnalyses: { $sum: 1 },
          averageMatchScore: { $avg: '$matchScore' },
          averageAtsScore: { $avg: '$atsScore' },
          highestMatchScore: { $max: '$matchScore' },
          lowestMatchScore: { $min: '$matchScore' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalAnalyses: 0,
        averageMatchScore: 0,
        averageAtsScore: 0,
        highestMatchScore: 0,
        lowestMatchScore: 0,
      },
    });

  } catch (error) {
    next(error);
  }
};