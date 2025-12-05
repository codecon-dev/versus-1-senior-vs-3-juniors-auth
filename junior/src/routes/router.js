import  url  from 'url'
import { authController} from '../controllers/authController.js'
import { authenticate} from '../middleware/auth.js'
import { parseBody, getTokenFromHeader, sendJSON } from '../utils/http.js'

export async function handleRoute(req,res) {

    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname;
    const method = req.method;

    try {
            // ===== ROTA: REGISTRO =====
        if (path === '/api/register' && method === 'POST') {
        const body = await parseBody(req);
        const result = await authController.register(req, res, body);
        return sendJSON(res, result.status, result.data);
        }

        // ===== ROTA: LOGIN =====
        if (path === '/api/login' && method === 'POST') {
        const body = await parseBody(req);
        const result = await authController.login(req, res, body);
        return sendJSON(res, result.status, result.data);
        }

        // ===== ROTA: LOGOUT =====
        if (path === '/api/logout' && method === 'POST') {
        const token = getTokenFromHeader(req);
        const result = await authController.logout(req, res, token);
        return sendJSON(res, result.status, result.data);
        }

        // ===== ROTA: PERFIL (PROTEGIDA) =====
        if (path === '/api/refresh' && method === 'POST') {
        return authenticate(req, res, async () => {
            const result = await authController.refresh(req, res);
            sendJSON(res, result.status, result.data);
        });
        }

        // ===== ROTA: PERFIL (PROTEGIDA) =====
        if (path === '/api/me' && method === 'GET') {
        return authenticate(req, res, async () => {
            const result = await authController.getProfile(req, res);
            sendJSON(res, result.status, result.data);
        });
        }

        // ===== ROTA NÃO ENCONTRADA =====
        sendJSON(res, 404, { error: 'Rota não encontrada' });
    } catch (error){
          console.error('❌ Erro no roteamento:', error);
          sendJSON(res, 500, { error: 'Erro interno do servidor' });
    }

}