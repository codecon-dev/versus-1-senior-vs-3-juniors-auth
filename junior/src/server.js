import http from 'http';
import { handleRoute } from './routes/router.js';
import { setCORSHeaders } from './utils/http.js';
import { PORT } from './config/constants.js';

const server = http.createServer(async (req, res) => {
  

  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  await handleRoute(req, res);
});

server.listen(PORT, () => {
  console.log('🚀 Servidor rodando!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('');
  console.log('Rotas disponíveis:');
  console.log('  POST /api/register  → Registrar usuário');
  console.log('  POST /api/login     → Fazer login');
  console.log('  POST /api/logout    → Fazer logout');
  console.log('  GET  /api/me        → Obter perfil (protegida)');
});