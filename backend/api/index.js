// Vercel Serverless Function - Backend Entry Point
// Uses dynamic import to load the ESM Express app

export default async function handler(req, res) {
  const { default: app } = await import('../src/app.js');
  return app(req, res);
}
