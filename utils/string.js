export function isValidEmail(email) {
  // Define the regular expression for valid email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Test the provided email address against the regex
  return emailRegex.test(email)
}
