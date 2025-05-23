// netlify.js
module.exports = {
  plugins: [],
  // Disable Next.js plugin
  onPreBuild: ({ utils }) => {
    utils.status.show({
      title: 'Disabling Next.js plugin',
      summary: 'This is a React Vite app, not a Next.js app',
      text: 'Skipping Next.js build process'
    })
  }
}
