document.addEventListener('DOMContentLoaded', function() {
    fetch('/luca-app/main/exploreActors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Selected-Genre': getCookie('selectedGenre')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the JSON data. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data)) {
                const actorElement = document.querySelector('.explore-actors .actor-element');
                data.forEach(item => {
                    if (item && item.profilePath) {
                        const imgElement = document.createElement('img');
                        imgElement.src = item.profilePath;
                        imgElement.id = item.actorId;
                        imgElement.alt = item.actorName;
                        imgElement.addEventListener('click', () => redirectToActor(item.actorId));
                        actorElement.appendChild(imgElement);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });

    function getCookie(name) {
        let cookieArray = document.cookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i].trim();
            if (cookie.indexOf(name + '=') == 0)
                return cookie.substring(name.length + 1);
        }
        return "";
    }
});
