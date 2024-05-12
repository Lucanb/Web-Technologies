const homeQuerries = {
    anouncesQuerry : `SELECT DISTINCT *,RANDOM() AS rnd
    FROM guildawards
    WHERE SUBSTR(year, 1, 4) != '2020'
    AND full_name IS NOT NULL
    ORDER BY rnd
    LIMIT 9;
    `,
    topPicksQuery : `SELECT full_name
    FROM guildawards
    WHERE year IS NOT NULL
    AND full_name IS NOT NULL
    AND full_name IN (SELECT DISTINCT full_name FROM guildawards ORDER BY full_name ASC)
    AND won = TRUE
    ORDER BY RANDOM()
    LIMIT 9;
    `,
    todayActorsQuery : `SELECT full_name
    FROM guildawards
    WHERE full_name IS NOT NULL
    AND year = (SELECT MAX(year) FROM guildawards)
    GROUP BY full_name
    ORDER BY RANDOM()
    LIMIT 9;
    `,
    commingSoonQuery : `SELECT DISTINCT *,RANDOM() AS rnd
    FROM guildawards
    WHERE SUBSTR(year, 1, 4) = '2020'
    AND full_name IS NOT NULL
    ORDER BY rnd
    LIMIT 9;
    `,
    getAnnounces : `SELECT start_date, end_date, topic, title, author, picture, content
                    FROM announces
                    WHERE CURRENT_DATE BETWEEN start_date AND end_date;
    `,
    addHelp : `INSERT INTO help (content, email) VALUES ($1, $2)  RETURNING *`,
    deleteAnnounce : `DELETE FROM announces WHERE title = $1`,
    updateAnnouncesQuery: `UPDATE announces 
                        SET start_date = $2, 
                            end_date = $3, 
                            topic = $4, 
                            author = $5, 
                            picture = $6, 
                            content = $7 
                        WHERE title = $1`

}
module.exports = homeQuerries;