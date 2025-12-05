import {generateToken} from '../utils/auth.js'
import { REFRESH_DURATION, SESSION_DURATION } from '../config/constants.js'

 class SessionStore {
    constructor() {
        this.sessions = new Map()
        this.startCleanupInterval();
    }
    
    create(userId){
        const token = generateToken()
        const expiresAt = Date.now() + REFRESH_DURATION

        this.sessions.set(token, {
            userId,
            expiresAt,
            createdAt: Date.now()
        })

        return token;
    }
    createAccessToken(userId){
        const token = generateToken()
        const expiresAt = Date.now() + SESSION_DURATION

        this.sessions.set(token, {
            userId,
            expiresAt,
            createdAt: Date.now()
        })

        return token;
    }

    validate(token) {
        const session = this.sessions.get(token)

        if (!session) return null

        if (Date.now() > session.expiresAt){
            this.sessions.delete(token)
            return null
        }

        return session.userId
    }

    destroy(token) {
        return this.sessions.delete(token)
    }

    cleanExpired(){
        const now = Date.now();
        let cleaned = 0;

        for (const [token, session] of this.sessions.entries()) {
            if (now > session.expiresAt) {
                this.sessions.delete(token);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`${cleaned} sessões expiradas removidas`)
        }
    }

    startCleanupInterval(){
        setInterval(() => this.cleanExpired(), 60 * 60 * 1000)
    }

    getActiveSessionsCount(){
        return this.sessions.size
    }
}

export const sessionStore = new SessionStore()

