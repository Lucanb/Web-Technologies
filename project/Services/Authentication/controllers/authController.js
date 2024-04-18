const userService = require('../services/authentificationService')
class authController {
    async login(req, res, next){
        try {
            const loginService = new userService();
            const result = await loginService.loginUser(req, res);
            if (result) {
                const accessToken= result[0];
                const refreshToken = result[1];
                res.statusCode = 302
                // res.write(JSON.stringify({
                //             success: true,
                //             message: 'Login success!.',
                //             data:{
                //                     tokens: {
                //                         accessToken : accessToken,
                //                         refreshToken : refreshToken
                //                     }
                //                 }
                //         }));
                // res.redirect('/home');
                res.writeHead(302, {
                    'Location': '/home'
                });
                res.end()

            } else {
                res.statusCode = 404
                // res.end(JSON.stringify({
                //         success: false,
                //         message: 'Login failed. Please try again.'
                //     }))
                res.writeHead(302, {
                    'Location': '/login'
                });
                res.end();
                //res.redirect('/login')
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.statusCode = 500
            res.end(JSON.stringify({
                    success: false,
                    message: 'Internal server error',
                    error : error
            }))
            console.error('Error during login:', error);
        }
    }
    async register(req, res, next){
        try {
            const registerService = new userService();
            const registered = await registerService.registerUser(req, res);
            if(registered) {
                res.statusCode = 302;
                // res.end(JSON.stringify({
                //     success: true,
                //     message: 'Successfully registered',
                // }));
                // res.redirect('/login')
                res.writeHead(302, {
                    'Location': '/login'
                });
                res.end();
            } else {
                res.statusCode = 401;
                // res.end(JSON.stringify({
                //     success: false,
                //     message: 'Unsuccessfully registered',
                // }));
                // res.redirect('/register')
                res.writeHead(302, {
                    'Location': '/register'
                });
                res.end();
            }
        } catch (error){
            console.error('Error during register:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({
                success: false,
                message: 'Internal server error',
                error: error
            }));
        }
    }
     async changePassword(res){
         try {
             const changePass = new userService()
             const newpass = changePass.updatePassword();
             if (newpass) {
                 return res.statusMessage(200).json({
                     success: true,
                     message: 'Successfully registered',
                     data: {
                         toke: "asda"
                         // tokens: {
                         //     accessToken,
                         //     refreshToken
                         // }
                     }
                 })
             } else {

             }
         }catch (error){
             return res.status(error?.statusCode || 500).json({
                 success: false,
                 message: 'Failed to login user. Error: ' + error?.message || 'Internal server error',
             });
         }
     }
     refreshToken(){

     }
}
module.exports = {authController}