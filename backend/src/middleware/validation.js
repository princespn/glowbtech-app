import Joi from "joi";

/**
 * @desc    Validation Rule Matrix for Fresh User Registration Pipeline
 */
export const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    // ⚡ ADDED: String schema with trim to validate the new Full Name column
    name: Joi.string().min(2).max(50).trim().messages({
      "string.empty": "Identity reference name cannot be blank.",
      "string.min": "Name parameter must be at least 2 characters long."
    }),

    // ⚡ ADDED: Support for older 'fullname' parameter fallback if any old code hits it
    fullname: Joi.string().min(2).max(50).trim(),

    // Core corporate email syntax mapping validation
    email: Joi.string().min(6).max(100).required().email().trim().messages({
      "string.empty": "Corporate email address configuration is mandatory.",
      "string.email": "Invalid routing syntax: Email format not recognized."
    }),

    // ⚡ ADDED: Validation rule to secure Mobile Number input column integrity
    mobile: Joi.string().min(10).max(15).trim().messages({
      "string.empty": "Mobile tracking line parameter cannot be blank."
    }),

    // Secure alphanumeric key structural test
    password: Joi.string().min(8).max(100).required().messages({
      "string.empty": "Access credentials password field is required.",
      "string.min": "Security risk: Password node must contain at least 8 characters."
    })
  });

  // Execute evaluation mapping over incoming request body
  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false,
      message: error.details[0].message 
    });
  }
  
  next(); // 🚀 PASS: Validation successful, dispatch request to AuthController
};

/**
 * @desc    Validation Rule Matrix for Session Login Verification
 */
export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(100).required().email().trim().messages({
      "string.empty": "Login validation failed: Email block cannot be empty.",
      "string.email": "Login tracking dropped: Malformed email syntax captured."
    }),
    password: Joi.string().min(8).max(100).required().messages({
      "string.empty": "Identity verification failed: Password signature missing."
    })
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false,
      message: error.details[0].message 
    });
  }
  
  next(); // 🚀 PASS: Pipeline clear, proceed to signature verification stage
};

/**
 * @desc    Validation Rule Matrix for Federated OAuth Adaptation Node
 */
export const validateOAuth = (req, res, next) => {
  const schema = Joi.object({
    provider: Joi.string().valid("local", "google", "facebook", "twitter", "tiktok").required().messages({
      "any.only": "Target connection drop: Social authentication provider mismatch."
    }),
    socialId: Joi.string().required().messages({
      "string.empty": "OAuth handshake failed: Missing social identifier signature."
    }),
    email: Joi.string().email().trim().allow(null, ""),
    name: Joi.string().trim().allow(null, ""),
    avatar: Joi.string().uri().trim().allow(null, "")
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      success: false,
      message: error.details[0].message 
    });
  }
  
  next(); // 🚀 PASS: Federated
};