import crypto from 'crypto' // ← corrigido o typo "cryto"
import { HASH_ITERATIONS, SALT_LENGTH, TOKEN_LENGTH, HASH_ALGORITHM, HASH_KEY_LENGTH } from '../config/constants.js'

export function hashPassword(password){
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex')

    const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex')

    return { salt, hash};
}

export function verifyPassword(password, salt, hash){
    const hashVerify = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex')

    return hash == hashVerify
}

export function generateToken(){
    return crypto.randomBytes(TOKEN_LENGTH).toString('hex')
}



// Quando o usuário se registra:
// const { hash, salt } = hashPassword("senha123");
// Guardamos: salt e hash no banco

// Quando o usuário faz login:
// const senhaCorreta = verifyPassword("senha123", salt, hash);
// Retorna: true ou false