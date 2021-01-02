import store from './store.js';

export default class FileInterface {

    static readFile(file) {
        const reader = new FileReader();
        const extension = file.name.split('.').pop();

        reader.addEventListener('load', (event) => {
            const text = reader.result;

            if (extension === 'kml' || extension === 'kmz') {
                FileInterface.readKML(text);
            } else if (extension === 'gpx') {
                FileInterface.readGPX(text);
            } else {
                alert('Failed to read gps track file');
            }
        });

        reader.readAsText(file);
    }

    static readKML(text) {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")

        let coordinates = [];

        try {
            const kmlText = xmlDoc.querySelector('LineString coordinates').textContent.trim();
            coordinates = kmlText.split(' ').map((coordinate) => {
                return {
                    longitude: parseFloat(coordinate.split(',')[0]),
                    latitude: parseFloat(coordinate.split(',')[1])
                }
            });
        } catch (e) {
            alert('Failed to parse GPS track');
            throw e;
        }

        FileInterface.loadCoordinates(coordinates);
    }

    static readGPX(text) {
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, "text/xml")

        let coordinates = [];

        try {
            const points = xmlDoc.querySelectorAll('trkseg trkpt');
            for (let point of points) {
                coordinates.push({
                    latitude: parseFloat(point.getAttribute('lat')),
                    longitude: parseFloat(point.getAttribute('lon'))
                });
            }
        } catch (e) {
            alert('Failed to parse GPS track');
            throw e;
        }

        FileInterface.loadCoordinates(coordinates);
    }

    static loadCoordinates(coordinates) {
        if (coordinates.length < 2) {
            alert('Failed to parse GPS track -- fewer than two coordinates found');
            return;
        }

        store.dispatch({
            type: 'SET_GPS_TRACK',
            coordinates
        });
    }
}

