function fetchNotifications() {
    fetch('/luca-app/main/getnotifications')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML = ''; // Clear existing content
            data.forEach(item => {
                const newsItem = document.createElement('div');
                newsItem.className = 'new-details';
                newsItem.innerHTML = `
                <div class="Title"><h2>${item.title}</h2></div>
                <div class="Topic"><h2 class="topic-element">${item.topic}</h2></div>
                <div class="Author"><h2 class="author-element">${item.author}</h2></div>
                <div class="movie-picture"><img src="${item.picture}" alt="News Image"></div>
                <div class="news-content"><h3>${item.content}</h3></div>
            `;
                const dateElement = document.createElement('div');
                dateElement.className = 'today-date';
                dateElement.innerHTML = `<h3>${new Date(item.start_date).toLocaleDateString()}</h3>`;
                newsItem.insertBefore(dateElement, newsItem.firstChild);
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => {
            console.error('Failed to fetch notifications:', error);
        });
}

document.addEventListener('DOMContentLoaded', fetchNotifications);
