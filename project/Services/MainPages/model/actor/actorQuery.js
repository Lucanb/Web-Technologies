const actorQuery= {
    searchByName: `SELECT DISTINCT full_name FROM guildawards WHERE full_name LIKE '%'||UPPER($1)||'%'`,
    searchAwardsByName: `SELECT year,won,show FROM guildawards WHERE full_name LIKE '%'||UPPER($1)||'%'`
}

module.exports=actorQuery;