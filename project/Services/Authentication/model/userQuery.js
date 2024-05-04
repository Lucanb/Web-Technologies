const userSQL = {
    usernameAndEmailExist : "SELECT * FROM users WHERE username = $1 AND email = $2",
    usernameExists : "SELECT * FROM users WHERE username = $1",
    emailExists : "SELECT * FROM users WHERE email = $1",
    usernameAndPassword : "SELECT id FROM users WHERE username = $1 AND password = $2",
    getHashPassword : "SELECT id,password,roles FROM users WHERE username = $1",
    insertUser : "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
    updateUsername : "UPDATE users SET username = $1 WHERE id = $2",
    updatePassword : "UPDATE users SET password = $1 WHERE id = $2",
    getUserIDAfterEmail : "SELECT id FROM users WHERE email = $1",
    getUserIDAfterUsername : "SELECT id FROM users WHERE username = $1",
    insertToken : "INSERT INTO token (access_token, refresh_token , id_user) VALUES ($1, $2, $3) RETURNING *"
}

module.exports = userSQL;