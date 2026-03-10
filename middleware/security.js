// ============================================
// SECURITY MIDDLEWARE
// ============================================

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// General API rate limiter
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  'Too many requests from this IP, please try again later.'
);

// Strict rate limiter for authentication
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts per window
  'Too many login attempts, please try again after 15 minutes.'
);

// File upload rate limiter
const uploadLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // 10 uploads per hour
  'Too many file uploads, please try again later.'
);

// Helmet security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// Input sanitization
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS attacks
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Sanitize request body
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

// Sanitize query parameters
const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeInput(req.query[key]);
      }
    });
  }
  next();
};

// SQL injection prevention (additional layer)
const preventSQLInjection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(UNION\s+SELECT)/gi,
    /(--|\#|\/\*|\*\/)/g,
    /(\bOR\b\s+\d+\s*=\s*\d+)/gi,
    /(\bAND\b\s+\d+\s*=\s*\d+)/gi
  ];

  const checkForSQLInjection = (value) => {
    if (typeof value !== 'string') return false;
    return sqlPatterns.some(pattern => pattern.test(value));
  };

  // Check body
  if (req.body) {
    for (const key in req.body) {
      if (checkForSQLInjection(req.body[key])) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input detected'
        });
      }
    }
  }

  // Check query
  if (req.query) {
    for (const key in req.query) {
      if (checkForSQLInjection(req.query[key])) {
        return res.status(400).json({
          success: false,
          message: 'Invalid input detected'
        });
      }
    }
  }

  next();
};

// CSRF token generation and validation
const csrfTokens = new Map();

const generateCSRFToken = (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(userId, token);
  
  // Auto-expire after 1 hour
  setTimeout(() => {
    csrfTokens.delete(userId);
  }, 3600000);
  
  return token;
};

const validateCSRFToken = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const userId = req.user?.id;

  if (!userId || !token || csrfTokens.get(userId) !== token) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }

  next();
};

// IP whitelist (for admin routes)
const ipWhitelist = process.env.ADMIN_IP_WHITELIST?.split(',') || [];

const checkIPWhitelist = (req, res, next) => {
  if (ipWhitelist.length === 0) {
    return next(); // No whitelist configured
  }

  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!ipWhitelist.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied from this IP address'
    });
  }

  next();
};

// Session timeout check
const checkSessionTimeout = (req, res, next) => {
  if (!req.user) {
    return next();
  }

  const sessionTimeout = 30 * 60 * 1000; // 30 minutes
  const lastActivity = req.session?.lastActivity;

  if (lastActivity && Date.now() - lastActivity > sessionTimeout) {
    return res.status(401).json({
      success: false,
      message: 'Session expired. Please login again.'
    });
  }

  if (req.session) {
    req.session.lastActivity = Date.now();
  }

  next();
};

// Prevent brute force attacks
const loginAttempts = new Map();

const preventBruteForce = (req, res, next) => {
  const identifier = req.body.email || req.ip;
  const attempts = loginAttempts.get(identifier) || { count: 0, firstAttempt: Date.now() };

  // Reset after 15 minutes
  if (Date.now() - attempts.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.delete(identifier);
    return next();
  }

  if (attempts.count >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after 15 minutes.'
    });
  }

  // Track attempt
  attempts.count++;
  if (attempts.count === 1) {
    attempts.firstAttempt = Date.now();
  }
  loginAttempts.set(identifier, attempts);

  next();
};

// Clear login attempts on successful login
const clearLoginAttempts = (identifier) => {
  loginAttempts.delete(identifier);
};

// Secure headers for file downloads
const secureFileDownload = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'attachment');
  next();
};

// Validate file upload
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/heic'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid file type. Only JPEG, PNG, GIF, and HEIC are allowed.'
    });
  }

  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds 5MB limit.'
    });
  }

  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  securityHeaders,
  sanitizeInput,
  sanitizeBody,
  sanitizeQuery,
  preventSQLInjection,
  generateCSRFToken,
  validateCSRFToken,
  checkIPWhitelist,
  checkSessionTimeout,
  preventBruteForce,
  clearLoginAttempts,
  secureFileDownload,
  validateFileUpload
};
