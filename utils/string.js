export function isValidEmail(email) {
  // Define the regular expression for valid email addresses
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Test the provided email address against the regex
  return emailRegex.test(email)
}

// TODO remove function if not needed
export default (text) => {
  const lowerCaseText = text.toLowerCase()
  // const changedText = lowerCaseText.replace(/ /g, '')

  return lowerCaseText
}
