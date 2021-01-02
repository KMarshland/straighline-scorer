import { Component } from 'preact';

export default class PathViewer extends Component {

    componentDidMount() {
        this.viewer = new window.Cesium.Viewer('path-viewer', {
            terrainProvider: window.Cesium.createWorldTerrain(),
            timeline: false,
            animation: false
        });

        const dataSource = new Cesium.CzmlDataSource();

        dataSource.process([
            {
                id: "document",
                version: "1.0",
            },
            {
                id: "target-line",
                name: "Target Line",
                polyline: {
                    positions: {
                        cartographicDegrees: [
                            this.props.targetLine.start.longitude, this.props.targetLine.start.latitude, 0,
                            this.props.targetLine.end.longitude, this.props.targetLine.end.latitude, 0
                        ],
                    },
                    material: {
                        solidColor: {
                            color: {
                                rgba: [255, 255, 0, 255],
                            },
                        },
                    },
                    width: 3,
                    clampToGround: true,
                },
            },
            {
                id: "smoothed-gps-track-line",
                name: "Smoothed GPS Track",
                polyline: {
                    positions: {
                        cartographicDegrees: this.props.smoothedGPSTrack.map(({ latitude, longitude }) =>
                            [longitude, latitude, 0]
                        ).flat(),
                    },
                    material: {
                        solidColor: {
                            color: {
                                rgba: [103, 58, 183, 255],
                            },
                        },
                    },
                    width: 3,
                    clampToGround: true,
                },
            },
            {
                id: "gps-track-line",
                name: "GPS Track",
                polyline: {
                    positions: {
                        cartographicDegrees: this.props.gpsTrack.map(({ latitude, longitude }) =>
                            [longitude, latitude, 0]
                        ).flat(),
                    },
                    material: {
                        solidColor: {
                            color: {
                                rgba: [255, 0, 255, 255],
                            },
                        },
                    },
                    width: 3,
                    clampToGround: true,
                },
            }
        ]);

        this.dataSource = dataSource;
        this.viewer.dataSources.add(dataSource);
        this.viewer.zoomTo(dataSource);
    }

    componentDidUpdate(prevProps) {
        let czml = [];

        const checkAndAddCoords = (cartographicDegrees, id) => {
            let valid = true;

            for (let coord of cartographicDegrees) {
                if (isNaN(coord)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                czml.push({
                    id,
                    polyline: {
                        positions: {
                            cartographicDegrees
                        }
                    },
                })
            }
        }

        if (prevProps.targetLine !== this.props.targetLine) {
            const cartographicDegrees = [
                parseFloat(this.props.targetLine.start.longitude), parseFloat(this.props.targetLine.start.latitude), 0,
                parseFloat(this.props.targetLine.end.longitude), parseFloat(this.props.targetLine.end.latitude), 0
            ];

            checkAndAddCoords(cartographicDegrees, 'target-line');
        }

        if (prevProps.gpsTrack !== this.props.gpsTrack) {
            const cartographicDegrees = this.props.gpsTrack.map(({ latitude, longitude }) =>
                [longitude, latitude, 0]
            ).flat();

            checkAndAddCoords(cartographicDegrees, 'gps-track-line');
        }

        if (prevProps.smoothedGPSTrack !== this.props.smoothedGPSTrack) {
            const cartographicDegrees = this.props.smoothedGPSTrack.map(({ latitude, longitude }) =>
                [longitude, latitude, 0]
            ).flat();

            checkAndAddCoords(cartographicDegrees, 'smoothed-gps-track-line');
        }

        if (czml.length) {
            this.viewer.zoomTo(this.dataSource);
            this.dataSource.process(czml);
        }
    }

    componentWillUnmount() {
        this.viewer.destroy();
    }

    render() {
        return (
            <div className="cesium-viewer-container" id="path-viewer" />
        );
    }

}
