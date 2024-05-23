const userService = require('../services/authentificationService')
const querystring = require("querystring");
const url = require("url");
const Token = require("../modules/token");
class authController {
    async login(req, res, next) {
        try {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    const data = querystring.parse(body);
                    const loginService = new userService();
                    const result = await loginService.loginUser(data,body);

                    if (result) {
                        const accessToken = result[0];
                        const refreshToken = result[1];
                        const role = result[2];

                        res.setHeader('Set-Cookie', [
                            `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=.luca-app`,
                            `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict; Domain=.luca-app`
                        ]);
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        });
                        let redirectUrl = '';
                        if (role === true) {
                            redirectUrl = 'http://luca-app:5000/luca-app/admin/admin';
                        } else {
                            redirectUrl = 'http://luca-app:5000/luca-app/main/home';
                        }
                        res.end(JSON.stringify({
                            success: true,
                            message: 'Login success!',
                            data: {
                                tokens: {
                                    accessToken: accessToken,
                                    refreshToken: refreshToken
                                },
                                redirectUrl: redirectUrl
                            }
                        }));
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        });
                        res.end(JSON.stringify({
                            success: false,
                            message: 'Authentication failed',
                            redirectUrl: '/luca-app/main/login'
                        }));
                    }
                } catch (error) {
                    console.error('Error during login:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        message: 'Internal server error',
                        error: error.toString()
                    }));
                }
            });
        } catch (error) {
            console.error('Error during login:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.toString()
            }));
        }
    }

    async register(req, res, next){
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
            console.log(data)
            const registerService = new userService();
            const registered = await registerService.registerUser(data);
            if(registered) {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Successfully registered',
                    redirectUrl: '/luca-app/auth/login'
                }));

            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Unsuccessfully registered',
                }));
            }
        } catch (error){
            console.error('Error during register:', error);
            res.writeHead(500, {
                'Content-Type': 'application/json',
            });
            res.statusCode = 500;
            res.end(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error
            }));
        }
    }

    async userNameEmailExists(req, res, next){
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
            const registerService = new userService();
            const registered = await registerService.userNameEmailExists(data);
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                    success: true,
                    message: [registered[0],registered[1]],
                }));

        } catch (error){
            console.error('Error during register:', error);
            res.writeHead(500, {
                'Content-Type': 'application/json',
            });
            res.statusCode = 500;
            res.end(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error
            }));
        }
    }

    async changePassword (req, res) {
        try {
            const parsedUrl = url.parse(req.url, true);
            const path = parsedUrl.pathname;
            const segments = path.split('/');

            console.log(segments.length)
            console.log(segments[3])
            if (segments.length >= 4 && segments[3] === "update-password") {
                const userToken = segments[4];
                const decode = await Token.validate(userToken);

                if (!decode || !decode[1]) {
                    console.error('Internal error with route - bad token');
                    res.writeHead(401, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({success: false, message: 'Invalid token'}));
                    return;
                }

                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                req.on('end', async () => {
                    try {
                        const data = querystring.parse(body);
                        console.log(data.password)
                        const changePassService = new userService();
                        const newpass = await changePassService.updatePassword(decode[0].email, data);

                        if (newpass) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({success: true, message: 'Password successfully changed'}));
                        } else {
                            res.writeHead(400, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify({success: false, message: 'Password change failed'}));
                            console.log('a')
                        }
                    } catch (error) {
                        console.error('Error processing the password change:', error);
                        res.writeHead(500, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify({success: false, message: 'Error processing the password change'}));
                    }
                });
            } else {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: false, message: 'Resource not found'}));
            }
        } catch (error) {
            console.error('Error in changePassword:', error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
        }
    };


    async sendEmail(req, res) {
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

            const sendEmailService = new userService();
            const verify = await sendEmailService.verifyEmail(data);

            if (!verify.success) {
                res.status(404).json({ success: false, message: 'Email not found' });
                return;
            }

            try {
                const emailSent = await sendEmailService.sendResetPasswordEmail(verify.email);
                if (!emailSent.success) {
                    throw new Error(emailSent.message);
                }
                res.status(200).json({ success: true, message: 'Enter email link for change password' });
            } catch (error) {
                console.error('Error forgot email sending:', error);
                res.status(500).json({
                    success: false,
                    message: 'Error forgot email sending:',
                    error: error.toString()
                });
            }
        } catch (error) {
            console.error('Error at forgot:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.toString()
            });
        }
    }
}
module.exports = {authController}