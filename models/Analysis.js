import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  // Reference to user who created this analysis
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for fast queries
  },

  // Resume content (extracted text)
  resumeText: {
    type: String,
    required: true,
  },

  // Job description
  jobDescription: {
    type: String,
    required: true,
  },

  // Match score (0-100)
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },

  // Skills found in resume
  resumeSkills: [{
    type: String,
    lowercase: true,
  }],

  // Skills required in job
  jobSkills: [{
    type: String,
    lowercase: true,
  }],

  // Missing skills (in job but not in resume)
  missingSkills: [{
    type: String,
    lowercase: true,
  }],

  // Matching skills (in both resume and job)
  matchingSkills: [{
    type: String,
    lowercase: true,
  }],

  // Resume improvement suggestions
  suggestions: [{
    type: {
      type: String,
      enum: ['skill', 'keyword', 'formatting', 'experience', 'ats'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
  }],

  // ATS optimization score (0-100)
  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },

  // ATS issues found
  atsIssues: [{
    type: String,
  }],

  // Analysis metadata
  metadata: {
    resumeWordCount: Number,
    jobDescriptionWordCount: Number,
    processingTime: Number, // in milliseconds
    version: {
      type: String,
      default: '1.0',
    },
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Index for date-based queries
  },
}, {
  timestamps: true,
});

// Index for efficient queries
analysisSchema.index({ userId: 1, createdAt: -1 });

// Virtual for match category
analysisSchema.virtual('matchCategory').get(function() {
  if (this.matchScore >= 80) return 'Excellent';
  if (this.matchScore >= 60) return 'Good';
  if (this.matchScore >= 40) return 'Fair';
  return 'Poor';
});

// Method to get summary
analysisSchema.methods.getSummary = function() {
  return {
    id: this._id,
    matchScore: this.matchScore,
    atsScore: this.atsScore,
    missingSkillsCount: this.missingSkills.length,
    suggestionsCount: this.suggestions.length,
    createdAt: this.createdAt,
    matchCategory: this.matchCategory,
  };
};

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;