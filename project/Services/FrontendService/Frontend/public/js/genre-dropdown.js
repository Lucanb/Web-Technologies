document.addEventListener('DOMContentLoaded', function () {
    var genreButton = document.querySelector('.genre-button');
    var dropdownContent = document.getElementById("myDropdown");

    function setCookie(name, value, daysToLive) {
        const date = new Date();
        date.setTime(date.getTime() + (daysToLive * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    document.querySelectorAll('#myDropdown a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const genre = this.textContent;
            const message = `${genre}`;
            setCookie('selectedGenre', message, 7);
            window.location.reload();
        });
    });

    genreButton.addEventListener('click', function() {
        dropdownContent.classList.toggle("show");
    });

    window.onclick = function(event) {
        if (!event.target.matches('.genre-button')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }
});
