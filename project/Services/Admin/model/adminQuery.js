const adminSQL = {
    getNominatedActors: 'SELECT id , year, category, show, won, full_name FROM guildawards where won = true AND full_name IS NOT NULL',
    addAnnounces: `INSERT INTO announces(start_date, end_date, topic, title, author, picture, content) 
                    VALUES ($1,$2,$3,$4,$5,$6,$7)`
}
module.exports = adminSQL;