document.addEventListener('DOMContentLoaded', function() {
    const actor = getActorFromPath();
    console.log(actor);
    fetch(`/luca-app/admin/get-news/:${actor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('news-container');
            if (container) {
                data.forEach(item => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'new-details';
                    newsItem.innerHTML = `
                    <div class="Title"><h2>${item.title}</h2></div>
                    <div class="Topic"><h2 class="topic-element">${item.category}</h2></div>
                    <div class="Author"><h2 class="author-element">${item.source}</h2></div>
                    <div class="Date"><h2 class="date-element">${item.pubDate}</h2></div>
                    <div class="movie-picture"><img src="${item.imageUrl}" alt="News Image"></div>
                    <div class="news-content"><h3>${item.contentSnippet}</h3></div>
                `;
                    container.appendChild(newsItem);
                });
            } else {
                console.error('The news container was not found.');
            }
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            const container = document.getElementById('news-container');
            if (container) {
                container.innerHTML = '<p>Error loading news.</p>'; // Provide feedback in case of failure
            }
        });
});
