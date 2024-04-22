const UserService = require('./authentificationService');
const UserModel = require('../model/authentificationModel');

// Definim o instanță a clasei UserModel cu valorile necesare
const userModel = new UserModel(["nume_utilizator"], ["asdfasdfas"], ["email@example.com"]);

//Am testat sa mearga

// Creăm o instanță a clasei UserService și îi pasăm instanța userModel
const userService = new UserService(userModel);

// Testăm metoda registerUser
// userService.registerUser()
//     .then(newUser => {
//         //console.log('Utilizator înregistrat cu succes:', newUser);
//     })
//     .catch(error => {
//         console.error('Eroare la înregistrarea utilizatorului:', error);
//     });
//
// //Testăm metoda loginUser
// userService.loginUser()
//     .then(isAuthenticated => {
//         console.log('Utilizator autentificat cu succes:', isAuthenticated);
//     })
//     .catch(error => {
//         console.error('Eroare la autentificarea utilizatorului:', error);
//     });

// // Testăm metoda updateUsername
// userService.updateUsername(1, 'newUser123');
//
// // Testăm metoda updatePassword
// userService.updatePassword(1, 'newPassword123');
