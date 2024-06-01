document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.search-bar input');

    searchBar.addEventListener('input', async () => {
        const searchText = searchBar.value.trim();
        if (searchText.length === 0) {
            return;
        }

        try {
            let formData = new URLSearchParams();
            formData.append('full_name', searchText);
            const response = await fetch(`/luca-app/main/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }
            const data = await response.json();
            if (data && Array.isArray(data)) {
                clearAutocompleteOptions();
                data.forEach(item => {
                    addAutocompleteOption(item);
                    console.log(item.full_name);
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }
    });

    function clearAutocompleteOptions() {
        var result = document.querySelector('.result');
        if (result) {
            result.innerHTML = '';
        }
    }

    async function addAutocompleteOption(option) {
        const autocompleteContainer = document.querySelector('.result');
        if (autocompleteContainer) {
            const optionElement = document.createElement('div');
            optionElement.textContent = option.full_name;
            optionElement.classList.add('autocomplete-option');
            autocompleteContainer.appendChild(optionElement);

            optionElement.addEventListener('click', async () => {
                searchBar.value = option.full_name;
                clearAutocompleteOptions();
                const id = await searchByName(option.full_name);
                if (id) {
                    redirectToActor(id);
                } else {
                    alert('Actor not found');
                }
            });
        } else {
            console.error('Elementul cu clasa ".result" nu a fost găsit.');
        }
    }

    async function searchByName(optionText) {
        let formData = new URLSearchParams();
        formData.append('full_name', optionText);

        try {
            const response = await fetch('/luca-app/main/searchByName', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.id;
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
            return null;
        }
    }

    async function redirectToActor(id) {
        if (!id) return;

        let formData = new URLSearchParams();
        formData.append('id', id);

        try {
            const response = await fetch('/luca-app/main/send-actor-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            window.location.href = `/luca-app/front/actor-profile/${id}`;
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred: ' + error.message);
        }
    }
});
