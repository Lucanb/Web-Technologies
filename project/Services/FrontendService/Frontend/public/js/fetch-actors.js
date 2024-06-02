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

    async function redirectToActor(id) {
        if (!id) return;

        let formData = new URLSearchParams();
        formData.append('id', id);

        try {
            const response = await fetch('/luca-app/main/send-actor-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.href = `/luca-app/front/actor-profile/${id}`;
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        }
    }
});
