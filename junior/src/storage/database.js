import { User } from '../models/User.js'

class Database {
    constructor() {
        this.users = new Map()

        this.userIdCounter = 1;
    }

    createUser(email, passwordHash, salt){
        if (this.findByEmail(email)) {
            throw new Error('Usuário ja existe')
        }

         const user = new User(
                this.userIdCounter++,
                email,
                passwordHash,
                salt
        )

        this.users.set(user.id, user);

        return user;
    }

    findByEmail(email) {
       for (const user of this.users.values())  {
        if(user.email == email){
            return user
        }
       }
       return null
    }

    findById(id){
        return this.users.get(id)        
    }

    getAllUsers() {
        return Array.from(this.users.values())
    }
}

export const database = new Database()