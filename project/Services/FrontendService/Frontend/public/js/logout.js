function handleLogout() {
    fetch('/luca-app/main/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'logout-message': 'LogOut'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to log out');
            }
            window.location.href = '/luca-app/front/login';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during logout: ' + error.message);
        });
}
