const adminSQL = {
    getNominatedActors : 'SELECT id , year, category, show, won, full_name FROM guildawards where won = true AND full_name IS NOT NULL'
}

module.exports = adminSQL;