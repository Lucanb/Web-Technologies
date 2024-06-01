function redirectToRSS() {
    const actor = getActorFromPath(); // Assumes input from a text field
    if (actor) {
        window.location.href = `/luca-app/admin/RSS/:${encodeURIComponent(actor)}`;
    } else {
        alert('Please enter an actor name.');
    }
}
