function redirectToActor(event){
    event.preventDefault();
    const id = event.target.id;
    let formData = new URLSearchParams();
    formData.append('id', id);
    console.log(formData);

    fetch('/luca-app/main/send-actor-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            window.location.href = `/luca-app/front/actor-profile/${id}`;
            console.log('Raw Response:', response);
            return response;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        });
}
