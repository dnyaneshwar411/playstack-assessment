export const resolveMongoServerErrorMessage = (errorInput: any): string => {
  const errorMessage = typeof errorInput === 'string' ? errorInput : errorInput?.message || '';

  if (errorMessage.includes("E11000") || errorMessage.includes("duplicate key error")) {
    const duplicateRegex = /dup key:\s*\{\s*(\w+):\s*["']?(.*?)["']?\s*\}/;
    const match = errorMessage.match(duplicateRegex);

    if (match && match.length === 3) {
      const field = match[1].charAt(0).toUpperCase() + match[1].slice(1);
      const value = match[2].replace(/["']/g, "");
      return `${field} '${value}' already exists.`;
    }
    return "A record with these details already exists.";
  }

  if (errorMessage.includes("BSONObj size") || errorMessage.includes("maximum BSON size")) {
    return "The data payload is too large to save to the database (max 16MB limit exceeded).";
  }

  if (errorMessage.includes("WriteConflict")) {
    return "The operation failed due to a database conflict. Please try again.";
  }

  if (errorMessage.includes("ns not found")) {
    return "The requested database collection could not be located.";
  }

  if (errorMessage.includes("MaxTimeMSExpired") || errorMessage.includes("operation exceeded time limit")) {
    return "The database operation timed out. Please try your request again later.";
  }

  const cleanFallback = errorMessage.replace(/^MongoServerError:\s*/i, "");
  return cleanFallback || "A database error occurred.";
};