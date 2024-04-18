const bcrypt = require('bcrypt');

class Password {
    SALT_ROUNDS = 10;

    static async crypt(data){
        const salt = await bcrypt.genSalt(Password.SALT_ROUNDS);
        return await bcrypt.hash(data,salt);
    }
    static async verify(plainText, hash){
        return bcrypt.compare(plainText, hash)
    }
}

module.exports = Password;