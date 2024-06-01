fetch('/luca-app/main/commingSoon_unauthenticated', {
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
        console.log('DATA : ', data);
        if (data && Array.isArray(data)) {
            const announceElement = document.querySelector('.Coming-Soon .actor-element');
            data.forEach(item => {
                if (item && item.posterUrl) {
                    const imgElement = document.createElement('img');
                    imgElement.src = item.posterUrl;
                    imgElement.id = item.id;
                    imgElement.alt = item.show;
                    announceElement.appendChild(imgElement);
                }
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error: ' + error.message);
    });
