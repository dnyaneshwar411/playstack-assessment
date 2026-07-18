export const secureRegexInput = function (userInput: string) {
  if (typeof userInput !== 'string' || !userInput) {
    return '';
  }
  return userInput.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}