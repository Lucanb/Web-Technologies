const favoritesQuery= {
    add: "INSERT INTO favorites (id_user,id_actor,full_name) VALUES ($1,$2,$3)",
    delete: "DELETE FROM favorites WHERE id_actor = $1",
    valid: "SELECT * FROM favorites WHERE id_user = $1 and id_actor = $2",
    getAll: "SELECT id_actor FROM favorites WHERE id_user = $1",
    topPickWeek: `SELECT id_actor, full_name, COUNT(id_user) AS numar_utilizatori 
        FROM favorites WHERE date >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY id_actor, full_name
        ORDER BY numar_utilizatori DESC
        LIMIT 7`,
    topFavourites : `SELECT id_actor, full_name, COUNT(id_user) AS numar_utilizatori
        FROM favorites
        GROUP BY id_actor, full_name
        ORDER BY COUNT(id_user) DESC
        LIMIT 7`
}

module.exports=favoritesQuery;