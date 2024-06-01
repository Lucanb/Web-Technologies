function fetchFavorites() {
    fetch('/luca-app/main/all-favorites', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the JSON data. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const ids = data.map(item => item.id_actor);
            ids.forEach(id => {
                console.log(id);
                let formData = new URLSearchParams();
                formData.append('id', id);
                console.log(formData);
                fetch('/luca-app/main/actor-profile-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData,
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch the JSON data. Status: ' + response.status);
                        }
                        return response.json();
                    })
                    .then(data => {
                        const actorDetailsDiv = document.createElement('div');
                        actorDetailsDiv.classList.add('actor-details');

                        const actorNameDiv = document.createElement('div');
                        actorNameDiv.classList.add('actor-name');
                        const actorNameH2 = document.createElement('h2');
                        actorNameH2.textContent = data.data[0].name;
                        actorNameDiv.appendChild(actorNameH2);
                        actorDetailsDiv.appendChild(actorNameDiv);

                        const actorPictureDiv = document.createElement('div');
                        actorPictureDiv.classList.add('actor-picture');
                        const actorImg = document.createElement('img');
                        actorImg.src = data.data[0].profile_path;
                        actorImg.id = id;
                        actorPictureDiv.appendChild(actorImg);
                        actorDetailsDiv.appendChild(actorPictureDiv);
                        const actorContainer = document.querySelector('.your-favourites-actors');
                        actorContainer.appendChild(actorDetailsDiv);

                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.onclick = () => deleteActor(id);
                        actorDetailsDiv.appendChild(deleteButton);

                        actorImg.addEventListener('click', redirectToActor);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error: ' + error.message);
                    });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });
}

document.addEventListener('DOMContentLoaded', fetchFavorites);
