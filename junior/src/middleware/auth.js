import { sessionStore} from '../storage/sessions.js'
import { database } from '../storage/database.js'
import { getTokenFromHeader, sendJSON } from '../utils/http.js'

export function authenticate(req, res, next) {
    const token = getTokenFromHeader(req);

    if(!token){
        sendJSON(res, 401, { error: 'Token não fornecido'})
    }

    const userId = sessionStore.validate(token)

    const user = database.findById(userId);

    if (!user) {
        sendJSON(res, 401, { error: 'Usuário não encontrado'})
        return
    }

    req.user = user

    next()
}