
// parameters from https://en.wikipedia.org/wiki/World_Geodetic_System#Defining_Parameters
import store from './store.js';

/**
 * @param {{ latitude: number, longitude: number }|Cesium.Cartographic} coord
 * @return {Cesium.Cartographic}
 */
function toCartographic(coord) {
    if (!(coord instanceof Cesium.Cartographic)) {
        coord = new Cesium.Cartographic.fromDegrees(coord.longitude, coord.latitude, 0);
    }

    return coord;
}

export default class AnalysisInterface {

    /**
     * Run all analyses, getting inputs from the store and pushing results back to the store again
     */
    static analyze() {
        store.dispatch({
            type: 'START_ANALYSIS'
        });

        const { targetLine, gpsTrack } = store.getState();

        const ellipsoid = AnalysisInterface.geodesicEllipsoid(targetLine.start, targetLine.end);
        const lineDistance = ellipsoid.surfaceDistance;

        const deviations = AnalysisInterface.calculateDeviations({ gpsTrack, targetLine }, {
            step: 'Calculate deviations (unsmoothed)'
        });

        const analysis = {
            lineDistance
        };

        analysis.maxDeviation = AnalysisInterface.calculateMaxDeviation(deviations, {
            step: 'Analyze max deviation (unsmoothed)'
        });

        analysis.areaWeightedDeviation = AnalysisInterface.calculateAreaWeightedDeviation(deviations, lineDistance, {
            step: 'Analyze area-weighted deviation (unsmoothed)'
        });

        analysis.trackVsLineDistance = AnalysisInterface.calculateTrackVsLineDistance(gpsTrack, lineDistance, {
            step: 'Analyze track vs line distance (unsmoothed)'
        });

        store.dispatch({
            type: 'SET_ANALYSIS',
            analysis
        });
    }

    /**
     * Find the maximum deviation from the line
     *
     * @param {Array<{ distance: number }>} deviations
     * @param {String} step
     * @return {Number}
     */
    static calculateMaxDeviation(deviations, { step }) {
        AnalysisInterface.updateProgress({
            step,
            numerator: 0,
            denominator: deviations.length
        });

        let maxDeviation = 0;

        for (let i = 0; i < deviations.length; i++) {
            const {distance} = deviations[i];
            if (distance > maxDeviation) {
                maxDeviation = distance;
            }

            AnalysisInterface.updateProgress({
                step,
                numerator: i + 1,
                denominator: deviations.length
            });
        }

        return maxDeviation;
    }

    /**
     * Find the maximum deviation from the line
     *
     * @param {Array<{ distance: number }>} deviations
     * @param {Number} lineDistance
     * @param {String} step
     * @return {{ area: number, weightedDeviation: number }}
     */
    static calculateAreaWeightedDeviation(deviations, lineDistance, { step }) {
        AnalysisInterface.updateProgress({
            step,
            numerator: 0,
            denominator: deviations.length - 1
        });

        let area = 0;

        for (let i = 1; i < deviations.length; i++) {
            const rectangle = Cesium.Rectangle.fromCartographicArray([
                deviations[i - 1].pointOnLine,
                deviations[i - 1].pointOnTrack,
                deviations[i].pointOnLine,
                deviations[i].pointOnTrack
            ].map(toCartographic));

            area += Cesium.Ellipsoid.WGS84.surfaceArea(rectangle);

            AnalysisInterface.updateProgress({
                step,
                numerator: i,
                denominator: deviations.length - 1
            });
        }

        return {
            area,
            weightedDeviation: area/lineDistance
        }
    }

    /**
     * Returns an array of deviations from the target line, in meters
     * At each point on the line between start and end, discretized to 1m by default, it will find the perpendicular
     * line to the target line, then see the distance to the furthest intersection point on the GPS track
     *
     * @param {Array<{ latitude: number, longitude: number }>} gpsTrack
     * @param {{ start: { latitude: number, longitude: number }, end: { latitude: number, longitude: number } }} targetLine
     * @param {String} step
     * @return {Array<{ distance: number, pointOnLine: Object, pointOnTrack: Object }>}
     */
    static calculateDeviations({ gpsTrack, targetLine }, { step }) {
        const ellipsoid = AnalysisInterface.geodesicEllipsoid(targetLine.start, targetLine.end);

        AnalysisInterface.updateProgress({
            step,
            numerator: 0,
            denominator: gpsTrack.length
        });

        const deviations = [];

        const pointsOnLines = new Map();

        const pointOnLineAt = (fraction) => {
            const existing = pointsOnLines.get(fraction);
            if (existing) {
                return existing;
            }

            const point = ellipsoid.interpolateUsingFraction(fraction);
            pointsOnLines.set(fraction, point);

            return point;
        }

        for (let i = 0; i < gpsTrack.length; i++) {
            const pointOnTrack = gpsTrack[i];

            let fractionLeft = 0;
            let fractionRight = 1;

            let pointOnLineLeft, pointOnLineRight, distanceLeft, distanceRight;

            for (let j = 0; j < 100; j++) {
                pointOnLineLeft = pointOnLineAt(fractionLeft);
                distanceLeft = AnalysisInterface.geodesicEllipsoid(pointOnLineLeft, pointOnTrack).surfaceDistance;

                pointOnLineRight = pointOnLineAt(fractionRight);
                distanceRight = AnalysisInterface.geodesicEllipsoid(pointOnLineRight, pointOnTrack).surfaceDistance;

                // check for convergence
                if (Math.abs(distanceLeft - distanceRight) < 0.01) {
                    break;
                }

                // figure out how to narrow the search
                if (distanceLeft < distanceRight) {
                    fractionRight = fractionLeft + 1/(2**(j + 1));
                } else {
                    fractionLeft = fractionRight - 1/(2**(j + 1));
                }
            }

            deviations.push({
                distance: Math.min(distanceLeft, distanceRight),
                pointOnLine: distanceLeft < distanceRight ? pointOnLineLeft : pointOnLineRight,
                pointOnTrack
            })

            AnalysisInterface.updateProgress({
                step,
                numerator: i + 1,
                denominator: gpsTrack.length
            });
        }

        return deviations;
    }

    /**
     * Analyzes how far you went vs how long the line was
     *
     * @param {Array<{ latitude: number, longitude: number }>} gpsTrack
     * @param {Number} lineDistance
     * @param {String} step
     * @return {{lineDistance: number, percent: number, trackDistance: number}}
     */
    static calculateTrackVsLineDistance(gpsTrack, lineDistance, { step }) {
        const denominator = gpsTrack.length - 1

        AnalysisInterface.updateProgress({
            step,
            numerator: 0,
            denominator
        });

        let trackDistance = 0;
        for (let i = 1; i < gpsTrack.length; i++) {
            trackDistance += AnalysisInterface.geodesicEllipsoid(gpsTrack[i], gpsTrack[i - 1]).surfaceDistance;

            AnalysisInterface.updateProgress({
                step,
                numerator: i,
                denominator
            });
        }

        return {
            lineDistance,
            trackDistance,
            percent: 100*lineDistance/trackDistance
        }
    }

    /**
     * Tells the store how far through a given step you are
     *
     * @param {String} step
     * @param {Number} numerator
     * @param {Number} denominator
     */
    static updateProgress({ step, numerator, denominator })  {
        AnalysisInterface._progressTimeouts = AnalysisInterface._progressTimeouts || {};
        AnalysisInterface._progressLogs = AnalysisInterface._progressLogs || {};

        AnalysisInterface._progressLogs[step] = { numerator, denominator };

        const dispatch = () => {
            store.dispatch({
                type: 'ADD_ANALYSIS_PROGRESS',
                step,
                ...AnalysisInterface._progressLogs[step]
            });
        };

        if (numerator === 0) {
            dispatch();
            return;
        }

        if (!AnalysisInterface._progressTimeouts[step]) {
            AnalysisInterface._progressTimeouts[step] = setTimeout(() => {
                dispatch();
                AnalysisInterface._progressTimeouts[step] = null;
            },16);
        }
    }

    /**
     * Creates an ellipsoid arc between two parts, which has the surfaceDistance property available
     * Uses Vincenty's formula under the hood
     *
     * @param {{ latitude: number, longitude: number }|Cesium.Cartographic} coord1
     * @param {{ latitude: number, longitude: number }|Cesium.Cartographic} coord2
     * @return {Cesium.EllipsoidGeodesic}
     */
    static geodesicEllipsoid(coord1, coord2) {
        coord1 = toCartographic(coord1);
        coord2 = toCartographic(coord2);

        return new Cesium.EllipsoidGeodesic(coord1, coord2);
    }
}

