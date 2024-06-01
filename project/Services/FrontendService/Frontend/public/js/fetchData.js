function fetchAnnouncements() {
    const limit = 5;
    fetch(`/luca-app/admin/announces?page=${currentPage2}&limit=${limit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch announcements');
            }
            return response.json();
        })
        .then(announcements => {
            const adminColumn = document.querySelector('.admin-container');
            adminColumn.innerHTML = '';

            const announcementList = document.createElement('div');
            announcementList.classList.add('announcementList-list');

            announcements.forEach(announcement => {
                const announcementItem = document.createElement('div');
                announcementItem.classList.add('announcement-item');

                const startDate = document.createElement('p');
                startDate.textContent = `Start Date: ${announcement.start_date}`;
                announcementItem.appendChild(startDate);

                const endDate = document.createElement('p');
                endDate.textContent = `End Date: ${announcement.end_date}`;
                announcementItem.appendChild(endDate);

                const topic = document.createElement('p');
                topic.textContent = `Topic: ${announcement.topic}`;
                announcementItem.appendChild(topic);

                const title = document.createElement('p');
                title.textContent = `Title: ${announcement.title}`;
                announcementItem.appendChild(title);

                const author = document.createElement('p');
                author.textContent = `Author: ${announcement.author}`;
                announcementItem.appendChild(author);

                const picture = document.createElement('p');
                picture.textContent = `Picture: ${announcement.picture}`;
                announcementItem.appendChild(picture);

                const content = document.createElement('p');
                content.textContent = `Content: ${announcement.content}`;
                announcementItem.appendChild(content);

                const actions = document.createElement('div');
                actions.classList.add('actions');

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', function() {
                    deleteAnnouncement(announcement.title);
                });
                actions.appendChild(deleteBtn);

                const updateBtn = document.createElement('button');
                updateBtn.textContent = 'Update';
                updateBtn.addEventListener('click', function() {
                    updateAnnouncement(announcement.title);
                });
                actions.appendChild(updateBtn);
                announcementItem.appendChild(actions);
                announcementList.appendChild(announcementItem);
            });
            adminColumn.appendChild(announcementList);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching announcements: ' + error.message);
        });
}

function fetchUsers() {
    const limit = 5;

    fetch(`/luca-app/admin/users?page=${currentPage}&limit=${limit}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
        .then(users => {
            const adminColumn = document.querySelector('.admin-container');
            adminColumn.innerHTML = '';

            const userList = document.createElement('div');
            userList.classList.add('user-list');

            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.classList.add('user-item');

                const userInfo = document.createElement('div');
                userInfo.classList.add('user-info');

                const username = document.createElement('p');
                username.textContent = `Username: ${user.username}`;
                userInfo.appendChild(username);

                const email = document.createElement('p');
                email.textContent = `Email: ${user.email}`;
                userInfo.appendChild(email);

                const actions = document.createElement('div');
                actions.classList.add('actions');

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', function() {
                    deleteUser(user.username);
                });
                actions.appendChild(deleteBtn);

                const updateBtn = document.createElement('button');
                updateBtn.textContent = 'Update';
                updateBtn.addEventListener('click', function() {
                    updateUser(user.username);
                });
                actions.appendChild(updateBtn);

                userItem.appendChild(userInfo);
                userItem.appendChild(actions);

                userList.appendChild(userItem);
            });

            adminColumn.appendChild(userList);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching users: ' + error.message);
        });
}
