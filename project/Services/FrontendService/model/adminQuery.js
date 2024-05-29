const adminSQL = {
    getNominatedActors: `SELECT id, year, category, show, won, full_name
                         FROM guildawards
                         WHERE won = true AND full_name IS NOT NULL AND year LIKE '%'||$1||'%'`,
    addAnnounces: `INSERT INTO announces(start_date, end_date, topic, title, author, picture, content) 
                    VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    getUsers : `SELECT username,email FROM users`,
    getUserID : `SELECT username,email,id FROM users WHERE username = $1`,
    deleteUsers: `DELETE FROM users WHERE username = $1`,
    updateUser: `UPDATE users SET username = $1, password = $2, email = $3 WHERE id = $4`,
    addUser: `INSERT INTO users(username, password, email) VALUES ($1,$2,$3)`,
    deleteAnnounce:`DELETE FROM announces WHERE title = $1`,
    getAnnounces:`SELECT start_date, end_date, topic, title, author, picture, content
                    FROM announces
                    WHERE CURRENT_DATE BETWEEN start_date AND end_date;`,
    updateAnnouncesQuery:`UPDATE announces
                          SET start_date = $1, end_date = $2, topic = $3, author = $4, 
                          picture = $5, content = $6, title = $7
                          WHERE title = $8
                          RETURNING *;`,
    insertCsv:`INSERT INTO guildawards (year, category, full_name, show, won) VALUES ($1, $2, $3, $4, $5)`
}
module.exports = adminSQL;