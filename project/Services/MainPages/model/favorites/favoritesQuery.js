const favoritesQuery= {
    add: "INSERT INTO favorites (id_user,id_actor) VALUES ($1,$2)",
    delete: "DELETE FROM favorites WHERE id = $1",
    valid: "SELECT * FROM favorites WHERE id_user = $1 and id_actor = $2",
    getAll: "SELECT id_actor FROM favorites WHERE id_user = $1",
}

module.exports=favoritesQuery;