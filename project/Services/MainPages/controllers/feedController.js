const homeFeedService = require('../services/homeFeedService')
class feedController {
    async feedAnnounces(req, res) {
        try {
            const feed = new homeFeedService();
            const getFeed = await feed.announces(req,res)
            if (getFeed) {
                console.log('Feed Obtinut cu succes');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getFeed))
                res.end()
            } else {
                console.log('Feed-ul este gol');
                res.end()
            }
        } catch (error) {
            console.error('Error in Announces Feed:', error);
            res.writeHead(500, {'Content-Type': 'application/json'}); // Ensure the error status code is set properly
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
            console.log('Feed-ul nu a fost obtinut cu succes eroare');
        }
    }

    async feedTopPicks(req,res){
        try {
            const feed = new homeFeedService();
            const getFeed = await feed.topPicks(req,res)
            if (getFeed) {
                console.log('Feed Obtinut cu succes');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getFeed))
                res.end()
            } else {
                console.log('Feed-ul este gol');
                res.end()
            }
        } catch (error) {
            console.error('Error in Top picks Feed:', error);
            res.writeHead(500, {'Content-Type': 'application/json'}); // Ensure the error status code is set properly
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
            console.log('Feed-ul nu a fost obtinut cu succes eroare');
        }
    }

    async feedTodayActors(req,res)
    {
        try {
            const feed = new homeFeedService();
            const getFeed = await feed.todayActors(req,res)
            if (getFeed) {
                console.log('Feed Obtinut cu succes');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getFeed))
                res.end()
            } else {
                console.log('Feed-ul este gol');
                res.end()
            }
        } catch (error) {
            console.error('Error in Top picks Feed:', error);
            res.writeHead(500, {'Content-Type': 'application/json'}); // Ensure the error status code is set properly
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
            console.log('Feed-ul nu a fost obtinut cu succes eroare');
        }
    }

    async feedCommingSoon(req, res) {
        try {
            const feed = new homeFeedService();
            const getFeed = await feed.commingSoon(req,res)
            if (getFeed) {
                console.log('Feed Obtinut cu succes');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(getFeed))
                res.end()
            } else {
                console.log('Feed-ul este gol');
                res.end()
            }
        } catch (error) {
            console.error('Error in Comming Feed:', error);
            res.writeHead(500, {'Content-Type': 'application/json'}); // Ensure the error status code is set properly
            res.end(JSON.stringify({success: false, message: 'Internal error'}));
            console.log('Feed-ul nu a fost obtinut cu succes eroare');
        }
    }
}

module.exports = {feedController}

