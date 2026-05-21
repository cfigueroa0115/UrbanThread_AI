// Vercel Serverless Function - Backend Entry Point
// Imports from compiled dist/ directory to resolve @shared path aliases

export default async function handler(req, res) {
  const { default: app } = await import('../dist/backend/src/app.js');
  return app(req, res);
}
