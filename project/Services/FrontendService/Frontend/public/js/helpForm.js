document.getElementById('helpForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        content: document.getElementById('content').value
    };

    fetch('/luca-app/main/help', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Cererea de ajutor a fost trimisă cu succes!');
            document.getElementById('helpForm').reset();
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('A apărut o eroare la trimiterea cererii de ajutor.');
        });
});
