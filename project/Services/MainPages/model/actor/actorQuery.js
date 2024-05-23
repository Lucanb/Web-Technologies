const actorQuery= {
    searchByName: `SELECT DISTINCT full_name FROM guildawards WHERE full_name LIKE '%'||UPPER($1)||'%'`,
    searchAwardsByName: `SELECT year,won,show FROM guildawards WHERE full_name LIKE '%'||UPPER($1)||'%'`,
    getNominatedActors : `SELECT id, year, category, show, won, full_name
                         FROM guildawards
                         WHERE won = true AND full_name IS NOT NULL AND year LIKE '%'||$1||'%'`
}

module.exports=actorQuery;