/**
 * @desc    Asynchronous Error Handler Interceptor Wrapper
 * Eliminates the need for writing redundant try-catch blocks across controllers
 * @param   {Function} executionFunction - The async express route handler module
 * @returns {Function} - Wrapped express middleware function capturing unhandled rejections
 */
const asyncErrorHandler = (executionFunction) => {
    return (req, res, next) => {
      // Standard Javascript Promise resolve pipeline structure
      Promise.resolve(executionFunction(req, res, next))
        .catch(next); // 🚀 Caught rejections are safely routed straight to your errorHandler.js
    };
  };
  
  export default asyncErrorHandler;