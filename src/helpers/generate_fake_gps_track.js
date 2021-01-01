(() => {
    const target = {
        start: {
            latitude: 35.695562,
            longitude: -105.934755
        },
        end: {
            latitude: 36.407109,
            longitude: -105.574308
        }
    };

    const desiredPoints = 200;

    let perpendicularLongitude = target.end.latitude - target.start.latitude ;
    let perpendicularLatitude = target.end.longitude - target.start.longitude;
    const perpendicularMagnitude = Math.sqrt(perpendicularLatitude**2 + perpendicularLongitude**2);
    perpendicularLatitude /= perpendicularMagnitude;
    perpendicularLongitude /= perpendicularMagnitude;

    let latitude = target.start.latitude;
    let longitude = target.start.longitude;

    const coords = [];

    while (latitude < target.end.longitude || longitude < target.end.longitude) {
        coords.push({ latitude, longitude });

        let dlat = target.end.latitude - latitude;
        let dlon = target.end.longitude - longitude;
        const magnitude = Math.sqrt(dlat**2 + dlon**2);
        dlat /= magnitude;
        dlon /= magnitude;


        let randScaleFactor = 1.0 - dlat*perpendicularLatitude + dlon*perpendicularLongitude;
        const randFactor = (Math.random() - 0.5)*randScaleFactor*0.25;

        latitude += (dlat + perpendicularLatitude*randFactor)/perpendicularMagnitude/2/desiredPoints;
        longitude += (dlon + perpendicularLongitude*randFactor)/perpendicularMagnitude/2/desiredPoints;

        if (coords.length % 100 === 0) {
            for (let i = 0; i < 10; i++) {
                coords.push({
                    latitude: latitude + Math.random()/5000,
                    longitude: longitude + Math.random()/5000
                });
            }
        }
    }

    coords.push({ latitude, longitude });

    console.log(coords.length);
    console.log(JSON.stringify(coords));
})();
