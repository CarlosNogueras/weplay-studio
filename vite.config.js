import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';

function portfolioSavePlugin() {
  return {
    name: 'weplay-portfolio-save',
    configureServer(server) {
      server.middlewares.use('/__save-portfolio', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const parsed = JSON.parse(body);
            if (!Array.isArray(parsed.pinned)) {
              throw new Error('Invalid portfolio payload: pinned must be an array');
            }
            const targetPath = path.resolve(process.cwd(), 'public', 'portfolio.json');
            await fs.writeFile(targetPath, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true }));
          } catch (err) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [portfolioSavePlugin()]
});
