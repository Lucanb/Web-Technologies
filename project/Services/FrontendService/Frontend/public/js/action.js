function deleteUser(username) {
    const url = `http://localhost:5000/luca-app/admin/user?username=${encodeURIComponent(username)}`;

    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.json();
        })
        .then(data => {
            alert('User deleted successfully');
            fetchUsers();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the user: ' + error.message);
        });
}

function updateUser(lastusername) {
    const username = prompt('Enter new username:');
    const email = prompt('Enter new email:');
    const password = prompt('Enter new password:');

    const url = `/luca-app/admin/user?lastusername=${encodeURIComponent(lastusername)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    fetch(url, {
        method: 'PUT',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        })
        .then(data => {
            alert('User updated successfully');
            fetchUsers();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the user: ' + error.message);
        });
}

function deleteAnnouncement(announcementtitle) {
    const url = `/luca-app/admin/announces?title=${encodeURIComponent(announcementtitle)}`;

    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete announcement');
            }
            return response.json();
        })
        .then(data => {
            alert('Announcement deleted successfully');
            fetchAnnouncements();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the announcement: ' + error.message);
        });
}

function updateAnnouncement(announcementtitle) {
    const start_date = prompt('Enter new start date (YYYY-MM-DD):');
    const end_date = prompt('Enter new end date (YYYY-MM-DD):');
    const topic = prompt('Enter new topic:');
    const title = prompt('Enter new title:');
    const author = prompt('Enter new author:');
    const picture = prompt('Enter new picture URL:');
    const content = prompt('Enter new content:');
    const lasttitle = announcementtitle

    const url = `/luca-app/admin/announces?lasttitle=${encodeURIComponent(lasttitle)}&start_date=${encodeURIComponent(start_date)}&end_date=${encodeURIComponent(end_date)}&topic=${encodeURIComponent(topic)}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&picture=${encodeURIComponent(picture)}&content=${encodeURIComponent(content)}`;

    fetch(url, {
        method: 'PUT',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update announcement');
            }
            return response.json();
        })
        .then(data => {
            alert('Announcement updated successfully');
            fetchAnnouncements();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while updating the announcement: ' + error.message);
        });
}

function showCSVImportForm() {
    document.getElementById('csvImportForm').style.display = 'block';
}

function importCSV() {
    const input = document.getElementById('csvFileInput');
    const file = input.files[0];
    if (!file) {
        alert('Please select a CSV file to import.');
        return;
    }

    const formData = new FormData();
    formData.append('csvFile', file);

    fetch('/luca-app/admin/import-csv', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to import CSV');
            }
            return response.json();
        })
        .then(data => {
            alert('CSV imported successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while importing the CSV: ' + error.message);
        });
}
