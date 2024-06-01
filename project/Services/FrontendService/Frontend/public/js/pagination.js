let currentPage = 1;
let currentPage2 = 1;

document.getElementById('seeUsersBtn').addEventListener('click', function() {
    currentPage = 1;
    fetchUsers();
    document.querySelector('.paginationAnnounces').style.display = 'none';
    document.querySelector('.paginationUsers').style.display = 'block';
});

document.getElementById('prevPageBtn').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        fetchUsers();
    }
});

document.getElementById('nextPageBtn').addEventListener('click', function() {
    currentPage++;
    fetchUsers();
});

document.getElementById('prevPageBtn2').addEventListener('click', function() {
    if (currentPage2 > 1) {
        currentPage2--;
        fetchAnnouncements();
    }
});

document.getElementById('nextPageBtn2').addEventListener('click', function() {
    currentPage2++;
    fetchAnnouncements();
});

document.getElementById('seeAnnouncesBtn').addEventListener('click', function() {
    currentPage2 = 1;
    fetchAnnouncements();
    document.querySelector('.paginationUsers').style.display = 'none';
    document.querySelector('.paginationAnnounces').style.display = 'block';
});
