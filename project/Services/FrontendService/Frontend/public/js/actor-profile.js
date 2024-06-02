document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const lastIndex = path.lastIndexOf("/");
    const id = path.substring(lastIndex + 1);
    let formData = new URLSearchParams();
    formData.append('id', id);

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
            const movieContainer = document.querySelector('.all-movies .movie-container');
            const actorPicture = document.querySelector('.actor-picture');
            const actorName = document.querySelector('.actress-name h1');
            const profileImg = document.createElement('img');
            actorName.textContent = data.data[0].name;
            profileImg.src = data.data[0].profile_path;
            actorPicture.innerHTML = '';
            actorPicture.appendChild(profileImg);

            data.data.forEach(actor => {
                actor.known_for.forEach(movie => {
                    const movieDetails = document.createElement('div');
                    movieDetails.classList.add('movie-details');

                    const movieName = document.createElement('div');
                    movieName.classList.add('movie-name');
                    movieName.innerHTML = `<h1>${movie.title}</h1>`;

                    const moviePicture = document.createElement('div');
                    moviePicture.classList.add('movie-picture');
                    moviePicture.innerHTML = `<img src="${movie.poster_path}" alt="Poster film">`;

                    movieDetails.appendChild(movieName);
                    movieDetails.appendChild(moviePicture);

                    const score = document.createElement('div');
                    score.classList.add('Score');
                    score.innerHTML = `Score: ${movie.vote_average}`;

                    movieDetails.appendChild(score);

                    movieContainer.appendChild(movieDetails);
                });
            });
            if (data.award) {
                createAwardsTable(data.awards);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });

    function createAwardsTable(awards) {
        const actorAwardsDiv = document.querySelector('.movie-awards');
        const heading = document.createElement('h1');
        heading.textContent = 'Actor Awards';
        actorAwardsDiv.appendChild(heading);
        const awardsTableDiv = document.createElement('div');
        awardsTableDiv.classList.add('awards-table-container');

        const awardsTable = document.createElement('table');
        awardsTable.classList.add('awards-table');

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = ['Year', 'Won', 'Show'];
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        awardsTable.appendChild(thead);

        const tbody = document.createElement('tbody');
        awards.forEach(award => {
            const row = document.createElement('tr');

            const yearCell = document.createElement('td');
            yearCell.textContent = award.year;
            row.appendChild(yearCell);

            const wonCell = document.createElement('td');
            wonCell.textContent = award.won ? 'Yes' : 'No';
            row.appendChild(wonCell);

            const showCell = document.createElement('td');
            showCell.textContent = award.show;
            row.appendChild(showCell);

            tbody.appendChild(row);
        });
        awardsTable.appendChild(tbody);
        awardsTableDiv.appendChild(awardsTable);
        actorAwardsDiv.appendChild(awardsTableDiv);
    }
});

function redirectToSource(sourceUrl) {
    document.cookie = "source=" + encodeURIComponent(sourceUrl) + "; path=/";
    redirectActorPage()
}

function redirectActorPage() {
    return new Promise((resolve, reject) => {
        const actorName = document.querySelector('.actress-name h1');
        const name = actorName ? actorName.textContent.trim() : '';
        if (!name) {
            console.error("Actor name is missing!");
            reject("Actor name is missing!");
            return;
        }
        window.location.href = `/luca-app/front/news/:${name}`;
        resolve();
    });
}
