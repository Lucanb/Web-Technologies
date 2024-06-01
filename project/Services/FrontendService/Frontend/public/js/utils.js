function saveSource(source) {
    return new Promise((resolve, reject) => {
        document.cookie = `source=${encodeURIComponent(source)}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/`;
        resolve();
    });
}