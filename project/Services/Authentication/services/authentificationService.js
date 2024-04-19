userModel = require('../model/authentificationModel')
reqParser = require('../../../modules/middlewares/reqParser')
const querystring = require('querystring');
const Token = require('../modules/token');
// const StatusCodeException = require('shared').exceptions.StatusCodeException;
const Password = require('../modules/password');
const nodemailer = require('nodemailer');
const config = require('../configuration/config')
const url = require('url');
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

////aici e pentru un json

    // async loginUser(req, res) {
    //     try {
    //         let body = '';
    //         req.on('data', chunk => {
    //             body += chunk.toString();
    //         });
    //
    //         const data = await new Promise((resolve, reject) => {
    //             req.on('end', () => {
    //                 try {
    //                     resolve(JSON.parse(body)); // Folosește JSON.parse dacă clientul trimite JSON
    //                 } catch (error) {
    //                     reject(error);
    //                 }
    //             });
    //         });
    //
    //         if (!data.username || !data.password) {
    //             console.error("Nu s-au găsit date de conectare valide.");
    //             return null;  // Întoarce null pentru a indica o eroare de autentificare
    //         }
    //
    //         const { username, password } = data;
    //         console.log("Username:", username);
    //         console.log("Password:", password);
    //
    //         this.userModel = new userModel(username, password, '');
    //         const usernameExists = await this.userModel.usernameExists();
    //         console.log('username : ', usernameExists);
    //
    //         if (!usernameExists) {
    //             console.error("Nu s-au găsit date de conectare valide.");
    //             return null;
    //         }
    //
    //         const [userId, storedPassword] = await this.userModel.passwordMatch();
    //
    //         if (!storedPassword) {
    //             console.error('Try again!');
    //             return null;
    //         }
    //
    //         const verifyPass = await Password.verify(password, storedPassword);
    //         console.log('Password verification result:', verifyPass);
    //
    //         if (!verifyPass) {
    //             console.error('Try again!');
    //             return null;
    //         }
    //
    //         console.log('User logged successfully!');
    //         const accessToken = await Token.generateKey({
    //             userId: userId,
    //             username: username,
    //             fresh: true,
    //             type: 'access'
    //         }, { expiresIn: '1h' });
    //
    //         const refreshToken = await Token.generateKey({
    //             userId: userId,
    //             username: username,
    //             type: 'refresh',
    //         }, { expiresIn: '24h' });
    //
    //         return [accessToken, refreshToken];
    //
    //     } catch (error) {
    //         console.error('Error during login:', error);
    //         throw error;  // Propagă eroarea pentru a o putea gestiona mai sus dacă este necesar
    //     }
    // }

    async updateUsername() { /////asta mai tarziu
        try {
            this.userModel = new userModel();
            await this.userModel.updateUsername();
            console.log('Numele de utilizator a fost actualizat cu succes.');
        } catch (error) {
            console.error('Eroare la actualizarea numelui de utilizator:', error);
            throw error;
        }
    }

    async updatePassword(req,res) {
        try {
            // console.log(req.url)
            // console.log(req.params)
            const parsedUrl = url.parse(req.url, true);
            console.log(parsedUrl)
            const path = parsedUrl.pathname;
            console.log(path)
            const segments = path.split('/');
            console.log(segments)
            if (segments.length === 3 && segments[1] === "update-password") {
                var userEmail = segments[2];
                // const userEmail = req.url.split('/')[2];
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

                try {
                    const encryptedPassword = await Password.crypt(data.password)
                    this.userModel = new userModel('username', encryptedPassword, userEmail);
                    const verif = await this.userModel.updatePassword();
                    if (verif) {
                        console.log('Parola a fost actualizata cu succes.');
                        // res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Parola a fost actualizata cu succes.');
                        return true
                    } else {
                        console.log('Parola nu a fost actualizata cu succes.');
                        // res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end('Parola nu a fost actualizata cu succes.');
                        return false
                    }
                } catch (error) {
                    console.error('Eroare la actualizarea parolei:', error);
                    // res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Eroare la actualizarea parolei.');
                    throw error;
                }
            }else{
                console.error('Eroare interna la ruta - ales nasol');
                res.end('Eroare interna la actualizare parolei.');
            }
        } catch (error) {
            console.error('Eroare interna la actualizare parolei:', error);
            // res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Eroare interna la actualizare parolei.');
            throw error;
        }

        return false

    }

    async verifyEmail(req, res){
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
                try{
                    this.userModel = new userModel('default', 'default', data.email);
                    const exist = await this.userModel.emailExists()
                    return {success:exist,email:data.email};
                }catch (error){
                    console.error('Eroare la actualizarea parolei:', error);
                    throw error;
                }
        }
        catch (error)
        {
            console.error('Eroare la verificarea email-ului', error);
            throw error;
        }
    }

    async sendResetPasswordEmail(emailAddress) {
        try {
            const emailDomain = emailAddress.split('@')[1];
            let smtpServer = 'smtp.gmail.com'; // Default to Gmail

            if (emailDomain.includes('yahoo')) {
                smtpServer = 'smtp.mail.yahoo.com';
            } else if (emailDomain.includes('gmail')) {
                smtpServer = 'smtp.gmail.com';
            } else {
                console.log('Unsupported email provider. Defaulting to Gmail.');
            }

            const transporter = nodemailer.createTransport({
                host: smtpServer,
                port: 465,
                secure: true,
                auth: {
                    user: config.EMAIL,
                    pass: config.APP_PASSWORD
                }
            });

            const resetLink = `http://localhost:3000/update-password/${emailAddress}`;
            const mailOptions = {
                from:  config.EMAIL,
                to: emailAddress,
                subject: 'Reset Your Password',
                html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to set a new password.</p>`
            };

            const result = await transporter.sendMail(mailOptions);
            console.log('Email sent:', result);
            return { success: true, message: "Email sent successfully." };
        } catch (error) {
            console.error('Failed to send email:', error);
            return { success: false, message: "Failed to send email.", error: error.toString() };
        }
    }

}

module.exports = UserService;
