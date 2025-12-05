export class User {
    constructor(id, email, passwordHash, salt, refreshToken) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.refreshToken = refreshToken;
        this.salt = salt;
        this.createdAt = new Date();
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            createdAt: this.createdAt
        }
    }
 }

