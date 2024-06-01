function deleteActor(id) {
    if (confirm('Are you sure you want to delete this actor from your favorites?')) {
        console.log('Deleting actor with ID:', id);
        fetch(`/luca-app/main/delete-actor`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'id': id
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete the actor');
                }
                alert('Actor deleted successfully');
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error: ' + error.message);
            });
    }
}
