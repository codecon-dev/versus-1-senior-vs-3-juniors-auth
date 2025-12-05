import { hashPassword, verifyPassword} from '../utils/auth.js'
import { database } from '../storage/database.js'
import { sessionStore} from '../storage/sessions.js'
import { PASSWORD_MIN_LENGTH } from '../config/constants.js'

class AuthController {
    async register (req, res, body){
        const { email, password} = body;

        if (!email || !password){
            return {
                status: 400,
                data: {error: 'Email e senha são obrigatórios'}
            }
        }

        if (password.length < PASSWORD_MIN_LENGTH){
            return {
                status: 400,
                data: {
                    error: `Senha deve ter no mínimo ${PASSWORD_MIN_LENGTH} caracteres`
                }
            }
        } 


        if (!validateEmail(email)){
            return {
                status: 400,
                data: {error: 'Email inválido'}
            }
        }

        try {
            const {hash, salt} = hashPassword(password)
            const user = database.createUser(email, hash, salt)

             return {
                status: 201,
                data: {
                message: 'Usuário criado com sucesso',
                user: user.toJSON()
                }
            };
        } catch (error) {
            return {
                status: 409,
                data: {error: error.message}
            }
        }
    }

    async login(req,res, body){
        const {email, password} = body

        if(!email || !password){
            return {
                status: 400,
                data: {error: 'Email e senha são obrigatórios'}
            }
        }

        const user = database.findByEmail(email);

        if (!user){
            return {
                status: 401,
                data: {  error: 'Credenciais inválidas'}
            }
        }

        const isValid = verifyPassword(password, user.salt, user.passwordHash);

        if(!isValid){
            return {
                status: 401,
                data: {error: 'Credenciais inválidas'}
            }
        }

        const refreshToken = sessionStore.create(user.id)
        const accessToken = sessionStore.createAccessToken(user.id)

        return {
            status: 200,
            data: {
                message: 'Login realizado com sucesso',
                refreshToken,
                accessToken,
                user: user.toJSON()
            }
        }
    }

    async refresh(req, res){
        const accessToken = sessionStore.createAccessToken(req.user.id)
        return {
            status: 200,
            data: {
                accessToken

            }
        }
    }

    async logout(req, res, token){
        if (token){
            sessionStore.destroy(token);
        }

        return {
            status: 200,
            data: {message: 'Logout realizado com sucesso'}
        }
    }

    async getProfile(req, res){
        return {
            status: 200,
            data: {user: req.user.toJSON()}
        }
    }
}

export const authController = new AuthController()

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};