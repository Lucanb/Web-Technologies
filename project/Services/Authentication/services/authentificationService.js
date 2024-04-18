userModel = require('../model/authentificationModel')
reqParser = require('../../../modules/middlewares/reqParser')
const querystring = require('querystring');
const Token = require('../modules/token');
// const StatusCodeException = require('shared').exceptions.StatusCodeException;
const Password = require('../modules/password');
class UserService {
    constructor() {
    }
    async registerUser(req, res) {
        try {
            let body= '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            const data = await new Promise((resolve, reject) => {
                req.on('end', () => {
                    try {
                        resolve(querystring.parse(body));
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            //trebuie validare de date ca altfel da serverul crush
            console.log('Datele de înregistrare:', data);
            const encryptedPassword = await Password.crypt(data.password)
            console.log(encryptedPassword)
            this.userModel = new userModel(data.username, encryptedPassword, data.email);
            const usernameExists = await this.userModel.usernameExists();
            console.log(usernameExists)
            const emailExists = await this.userModel.emailExists();
            console.log(emailExists)

            if (usernameExists || emailExists) {
                console.log('Username or Email already exists!');
                return false;
            } else {
                const newUser = await this.userModel.registerUser();
                console.log('New user registered:', newUser);
                return true;
            }
        } catch (error) {
            console.error('Eroare la înregistrarea utilizatorului:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({
                success: false,
                message: 'Eroare la înregistrarea utilizatorului.'
            }));
            return false;
        }
    }


    async loginUser(req,res) {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            const data = await new Promise((resolve, reject) => {
                req.on('end', () => {
                    try {
                        resolve(querystring.parse(body));
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            const keys = Object.keys(data);

            if (keys.length > 0) {
                // Parsarea primei chei pentru a obține datele de conectare
                const loginInfo = querystring.parse(body);  ///vezi ca asta trebuie implementata
                const username = loginInfo.username;
                const password = loginInfo.password;

                console.log("Username:", username);
                console.log("Password:", password);
                this.userModel = new userModel(username, password, '');
                const usernameExists = await this.userModel.usernameExists();
                console.log('username : ',usernameExists)
                if(usernameExists) {
                    const vector = await this.userModel.passwordMatch();
                    console.log('vector : ',vector);
                    const userId = vector[0];
                    const passwordMatch = vector[1]
                    console.log('parola', passwordMatch)

                    if (!(usernameExists && passwordMatch)) {

                        console.log('Try again!');
                        return null;

                    } else {
                        const verifyPass = await Password.verify(password, passwordMatch)
                        console.log(verifyPass)
                        if (verifyPass) {
                            console.log('User logged successfully!'); // ,newUser);
                            const accessToken = await Token.generateKey({
                                userId: userId,
                                username: this.userModel.username,
                                fresh: true,
                                type: 'access'
                            }, {
                                expiresIn: '1h'
                            })
                            console.log( accessToken)
                            const refreshToken = await Token.generateKey({
                                userId: userId,
                                username: this.userModel.username,
                                type: 'refresh',
                            }, {
                                expiresIn: '24h'
                            })
                            return [accessToken, refreshToken];
                        } else {
                            console.log('Try again!');
                            return null;
                        }
                    }
                }else {
                    console.error("Nu s-au găsit date de conectare valide.");
                }
            } else {
                console.error("Nu s-au găsit date de conectare valide.");
            }
        } catch (error) {
            console.error('Eroare la logarea utilizatorului', error);
            throw error;
        }
    }


    async updateUsername(id, newUsername) {
        try {
            this.userModel = new userModel();
            await this.userModel.updateUsername(id, newUsername);
            console.log('Numele de utilizator a fost actualizat cu succes.');
        } catch (error) {
            console.error('Eroare la actualizarea numelui de utilizator:', error);
            throw error;
        }
    }

    async updatePassword(id, newPassword) {
        try {
            this.userModel = new userModel();
            await this.userModel.updatePassword(id, newPassword);
            console.log('Parola a fost actualizată cu succes.');
        } catch (error) {
            console.error('Eroare la actualizarea parolei:', error);
            throw error;
        }
    }
}

module.exports = UserService;
