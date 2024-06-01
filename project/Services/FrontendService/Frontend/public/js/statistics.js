document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    const lastIndex = path.lastIndexOf("/");
    const id = path.substring(lastIndex + 1);
    let formData = new URLSearchParams();
    formData.append('id', id);

    fetch('/luca-app/main/statisticGenre/:', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the JSON data. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const canvasId = 'genreChart';
            const ctx = document.getElementById(canvasId).getContext('2d');
            const labels = [];
            const values = [];
            const backgroundColors = [];

            function generateRandomColor() {
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                return `rgba(${r}, ${g}, ${b}, 0.2)`;
            }

            for (const genre in data) {
                if (data.hasOwnProperty(genre)) {
                    const genreName = genre.split(':')[0];
                    labels.push(genreName);
                    values.push(data[genre].length);
                    backgroundColors.push(generateRandomColor());
                }
            }

            const config = {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Genre Distribution',
                        data: values,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Genre Distribution Chart'
                        }
                    },
                },
            };

            new Chart(ctx, config);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });

    fetch('/luca-app/main/statisticAwards/:', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the JSON data. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const years = Object.keys(data);
            const wonData = [];
            const showsData = [];

            years.forEach(year => {
                wonData.push(data[year].won);
                showsData.push(data[year].shows.length);
            });

            const ctx = document.getElementById('awardChart').getContext('2d');

            const config = {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [{
                        label: 'Awards Won',
                        data: wonData,
                        borderColor: 'blue',
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Number of Shows',
                        data: showsData,
                        borderColor: 'green',
                        backgroundColor: 'rgba(0, 255, 0, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Awards and Shows Over the Years'
                        }
                    }
                }
            };

            new Chart(ctx, config);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });

    fetch('/luca-app/main/statisticPopularity/:', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch the JSON data. Status: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            const ctx = document.getElementById('popularityYearChart').getContext('2d');

            const labels = Object.keys(data).sort();
            const values = labels.map(year => data[year]);

            const config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Actor Popularity by Year',
                        data: values,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Actor Popularity by Year'
                        }
                    }
                }
            };

            new Chart(ctx, config);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        });
});

function exportChartToWebP(chartId) {
    const canvas = document.getElementById(chartId);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/webp');
    link.download = `${chartId}.webp`;
    link.click();
}

async function exportChartToSVG(chartId) {
    const canvas = document.getElementById(chartId);
    const ctx = canvas.getContext('2d');
    const dataUrl = canvas.toDataURL('image/png');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                    <foreignObject width="100%" height="100%">
                        <img src="${dataUrl}" width="100%" height="100%"/>
                    </foreignObject>
                 </svg>`;
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = `${chartId}.svg`;
    link.click();
    URL.revokeObjectURL(svgUrl);
}

function exportChartToCSV(chartId) {
    const chart = Chart.getChart(chartId);
    const data = chart.data;
    let csvContent = "data:text/csv;charset=utf-8,";
    data.labels.forEach((label, index) => {
        let row = `${label},${data.datasets[0].data[index]}`;
        csvContent += row + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${chartId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
