document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const lastIndex = path.lastIndexOf("/");
    const id = path.substring(lastIndex + 1);
    let formData = new URLSearchParams();
    formData.append('id', id);

    const addToFavoritesBtn = document.getElementById('add');
    addToFavoritesBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/luca-app/main/add-favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add to favourites.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
