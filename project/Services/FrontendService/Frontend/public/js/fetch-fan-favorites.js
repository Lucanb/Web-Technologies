document.addEventListener('DOMContentLoaded', function() {
    fetch('/luca-app/main/topFavorites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    })
        .then(data => {
            if (data.success) {

            } else {
                if (data && Array.isArray(data)) {
                    const actorElement = document.querySelector('.fan-favourites .actor-element');
                    data.forEach(item => {
                        if (item && item.posterUrl) {
                            const imgElement = document.createElement('img');
                            imgElement.src = item.posterUrl;
                            imgElement.id = item.id;
                            imgElement.alt = item.full_name;
                            imgElement.addEventListener('click', () => redirectToActor(item.id));
                            actorElement.appendChild(imgElement);
                        }
                    });
                    // alert('Id not sent. Check if id exists ');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        });

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
