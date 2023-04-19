export default {
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
    // Include additional properties here
    properties: ['email', 'name'],
  },
}
