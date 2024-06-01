function showAddUserForm() {
    document.getElementById('userForm').style.display = 'block';
    document.getElementById('announceForm').style.display = 'none';
}

function showAddAnnounceForm() {
    document.getElementById('announceForm').style.display = 'block';
    document.getElementById('userForm').style.display = 'none';
}

function handleLogout() {
    fetch('/luca-app/admin/logout', {
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

function submitUser(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const url = `http://localhost:5000/luca-app/admin/user?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    fetch(url, {
        method: 'POST',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit user');
            }
            return response.json();
        })
        .then(data => {
            alert('User added successfully');
            document.getElementById('userForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the user: ' + error.message);
        });
}

function submitAnnounce(event) {
    event.preventDefault();

    const start_date = document.getElementById('startdate').value;
    const end_date = document.getElementById('enddate').value;
    const topic = document.getElementById('topic').value;
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const picture = document.getElementById('picture').value;
    const content = document.getElementById('content').value;

    const url = `/luca-app/admin/addAnnounce`;

    const data = {
        start_date,
        end_date,
        topic,
        title,
        author,
        picture,
        content
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit announcement');
            }
            return response.json();
        })
        .then(data => {
            alert('Announcement added successfully');
            document.getElementById('announceForm').reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the announcement: ' + error.message);
        });
}
