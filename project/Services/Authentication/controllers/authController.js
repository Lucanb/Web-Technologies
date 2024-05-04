const userService = require('../services/authentificationService')
class authController {
    async login(req, res, next){
        try {
            const loginService = new userService();
            const result = await loginService.loginUser(req, res);
            if (result) {
                const accessToken = result[0];
                const refreshToken = result[1];
                const role = result[2]

                // Setează cookie-uri sau header-uri necesare aici dacă este necesar
                // De exemplu, setarea unui cookie pentru token-ul de acces
                // res.setHeader('Set-Cookie', `accessToken=${accessToken}; HttpOnly`);
                // res.setHeader('Set-Cookie', [
                //     `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict`,
                //     `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict`
                // ]);
                res.setHeader('Set-Cookie', [
                    `accessToken=${accessToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`,
                    `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Strict; Domain=localhost`
                ]);
                    res.writeHead(200, {
                        'Content-Type': 'application/json',
                    });
                    let redirectUrl = ''
                    if (role === true){
                        redirectUrl = 'http://localhost:3001/admin'
                    }else {
                        redirectUrl = 'http://localhost:3001/home'
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
                res.end(JSON.stringify({ success: false, message: 'Authentication failed', redirectUrl: '/login' }));
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.toString()  // Este mai sigur să trimiți doar mesajul erorii
            }));
        }
    }

    async register(req, res, next){
        try {
            const registerService = new userService();
            const registered = await registerService.registerUser(req, res);
            if(registered) {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({
                    success: true,
                    message: 'Successfully registered',
                    redirectUrl: '/login'
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
            const registerService = new userService();
            const registered = await registerService.userNameEmailExists(req, res);
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

    async changePassword(req, res) {
        try {
            const changePass = new userService();
            const newpass = await changePass.updatePassword(req, res);
            if (newpass) {
                console.log('Schimbat parola cu succes!');
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true, message: 'Parola schimbata cu succes!'}));
            } else {
                console.log('Parola nu a fost schimbata cu succes!');
                res.writeHead(200, {'Content-Type': 'application/json'}); // Using 400 for client-side logical errors
                res.end(JSON.stringify({success: false, message: 'Parola nu a fost schimbata'}));
            }
        } catch (error) {
            console.error('Error in changePassword:', error);
            res.writeHead(500, {'Content-Type': 'application/json'}); // Ensure the error status code is set properly
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
            console.log('Parola nu a fost schimbata cu succes!');
        }
    }


     async sendEmail(req, res){
        try {
            const sendEmail = new userService();
            const verify = await sendEmail.verifyEmail(req, res)
            if (verify.success) {
              try {
                    const emailSent = await sendEmail.sendResetPasswordEmail(verify.email)
                    if (emailSent.success) {
                        console.log('S-a trimis cu succes')
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        });
                        res.end(JSON.stringify({success: true, message: 'Enter email link for change password'}));
                    }else {
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                        });
                        res.end(JSON.stringify({success: false, message: 'Email not sended '}));
                    }
              }catch (error){
                  console.error('Error forgot email sending:', error);
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                      success: false,
                      message: 'Error forgot email sending:',
                      error: error.toString()
                  }));
              }
            } else {
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                });
                res.end(JSON.stringify({success: false, message: 'email not found'}));
            }
        }catch (error){
            console.error('Error at forgot:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error.toString()
            }));
        }

    }

     refreshToken(){

     }
}
module.exports = {authController}