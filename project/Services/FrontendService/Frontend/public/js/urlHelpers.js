function getCategoryFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category'); // Assume the URL parameter is named 'category'
}

function getActorFromPath() {
    const pathArray = window.location.pathname.split('/:');
    return decodeURIComponent(pathArray[pathArray.length - 1]);
}
