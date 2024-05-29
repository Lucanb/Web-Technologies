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
    async registerUser(data) {
        try {

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
            return false;
        }
    }

    async userNameEmailExists(data)
    {
        try {
            console.log('Datele de înregistrare:', data);
            this.userModel = new userModel(data.username, 'encryptedPassword', data.email);
            const usernameExists = await this.userModel.usernameExists();
            console.log(usernameExists)
            const emailExists = await this.userModel.emailExists();
            console.log(emailExists)
            return [usernameExists,emailExists]
        }catch (error){
            console.error('Eroare la înregistrarea utilizatorului:', error);
            return [false,false];
        }
    }


    async loginUser(data,body) {
        try {

            const keys = Object.keys(data);

            if (keys.length > 0) {
                const loginInfo = querystring.parse(body);
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
                    const role = vector[2];
                    console.log('role : ',role)
                    const passwordMatch = vector[1];
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
                                role: role,
                                username: this.userModel.username,
                                fresh: true,
                                type: 'access'
                            }, {
                                expiresIn: '1h'
                            })
                            console.log( accessToken)
                            const refreshToken = await Token.generateKey({
                                userId: userId,
                                role : role,
                                username: this.userModel.username,
                                type: 'refresh',
                            }, {
                                expiresIn: '24h'
                            })

                            this.userModel = new userModel(username, password, 'email');
                            const addToken = await this.userModel.addToken(accessToken,refreshToken,userId);
                            return [accessToken, refreshToken, role];
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

    async updateUsername() {
        try {
            this.userModel = new userModel();
            await this.userModel.updateUsername();
            console.log('Numele de utilizator a fost actualizat cu succes.');
        } catch (error) {
            console.error('Eroare la actualizarea numelui de utilizator:', error);
            throw error;
        }
    }

    async updatePassword(userEmail,data) {
        try {
            console.log(data.password)
            const encryptedPassword = await Password.crypt(data.password)
            console.log('in model vine : ', userEmail)
            this.userModel = new userModel('username', encryptedPassword, userEmail);
            const verif = await this.userModel.updatePassword();
            if (verif) {
                console.log('Parola a fost actualizata cu succes.');
                return true
            } else {
                console.log('Parola nu a fost actualizata cu succes.');
                return false
            }
        } catch (error) {
            console.error('Eroare la actualizarea parolei:', error);
            throw error;
        }
        return false
    }

    async verifyEmail(data){
            try{
                this.userModel = new userModel('default', 'default', data.email);
                const exist = await this.userModel.emailExists()
                return {success:exist,email:data.email};
            }catch (error){
                console.error('Eroare la actualizarea parolei:', error);
                throw error;
            }
    }

    async sendResetPasswordEmail(emailAddress) {
        try {
            const emailDomain = emailAddress.split('@')[1];
            let smtpServer = 'smtp.gmail.com';

            if (emailDomain.includes('yahoo')) {
                smtpServer = 'smtp.mail.yahoo.com';
            } else if (emailDomain.includes('gmail')) {
                smtpServer = 'smtp.gmail.com';
            } else {
                console.log('Unsupported email provider. Defaulting to Gmail.');
            }

            const emailToken = await Token.generateKey({
                email : emailAddress,
                fresh: true,
                type: 'update'
            }, {
                expiresIn: '1h'
            })
            console.log( emailToken)

            const transporter = nodemailer.createTransport({
                host: smtpServer,
                port: 465,
                secure: true,
                auth: {
                    user: config.EMAIL,
                    pass: config.APP_PASSWORD
                }
            });

            const resetLink = `http://luca-app:5000/luca-app/front/update-password/${emailToken}`;
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
