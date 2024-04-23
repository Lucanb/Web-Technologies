const homeQuerries = {
    anouncesQuerry : `SELECT *
    FROM guildawards
    WHERE year IS NOT NULL
    AND full_name IS NOT NULL
    AND show IN (SELECT DISTINCT show FROM guildawards)
    ORDER BY year DESC, RANDOM()
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
    todayActors : `SELECT full_name
    FROM guildawards
    WHERE full_name IS NOT NULL
    AND year = (SELECT MAX(year) FROM guildawards)
    GROUP BY full_name
    ORDER BY RANDOM()
    LIMIT 9;`
}
module.exports = homeQuerries;