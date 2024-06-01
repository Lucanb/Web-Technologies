async function loadRSSFeed() {
    try {
        const response = await fetch('http://localhost:3002/news/RSS-get');
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");

        const items = xmlDoc.querySelectorAll('item');
        let html = '<ul>';
        items.forEach(item => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            html += `<li><a href="${link}">${title}</a></li>`;
        });
        html += '</ul>';

        document.getElementById('rss-feed').innerHTML = html;
    } catch (error) {
        console.error('Failed to load RSS feed:', error);
        document.getElementById('rss-feed').innerText = 'Failed to load news.';
    }
}

loadRSSFeed();
