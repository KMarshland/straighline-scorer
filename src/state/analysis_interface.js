
// parameters from https://en.wikipedia.org/wiki/World_Geodetic_System#Defining_Parameters
import store from './store.js';

const WGS84_EQUATORIAL_RADIUS = 6378137;
const WGS84_FLATTENING = 1/298.257223563;
const WGS84_SEMI_MINOR_AXIS = 6356752.3142; // equivalent to WGS84_EQUATORIAL_RADIUS * (1 - WGS84_FLATTENING)

export default class AnalysisInterface {

    static analyze() {
        const { targetLine, gpsTrack } = store.getState();
    }

    /**
     * Calculates the distance between two coordinates in meters with the WGS84 ellipsoid using Vincenty's formula
     * Accurate to ~0.5mm
     *
     * Primary source: Vincenty inverse formula - T Vincenty, "Direct and Inverse Solutions of Geodesics on the
     *  Ellipsoid with application of nested equations", Survey Review, vol XXII no 176, 1975
     *  http://www.ngs.noaa.gov/PUBS_LIB/inverse.pdf
     *
     * Secondary sources:
     *  https://www.cqsrg.org/tools/GCDistance/
     *  https://www.cqsrg.org/tools/GCDistance/ChrisVeness1.js
     *  https://www.cqsrg.org/tools/GCDistance/inverse.pdf
     *
     *
     * @param {{ latitude: number, longitude: number }} coord1
     * @param {{ latitude: number, longitude: number }} coord2
     * @return {Number}
     */
    static distanceBetween(coord1, coord2) {
        const L = (coord2.longitude - coord1.longitude)*Math.PI/180;
        const U1 = Math.atan((1-WGS84_FLATTENING) * Math.tan(coord1.latitude * Math.PI/180));
        const U2 = Math.atan((1-WGS84_FLATTENING) * Math.tan(coord2.latitude * Math.PI/180));

        const sinU1 = Math.sin(U1);
        const cosU1 = Math.cos(U1);
        const sinU2 = Math.sin(U2);
        const cosU2 = Math.cos(U2);

        let lambda = L;
        let lambdaPrevious;
        let cosSqAlpha, sinSigma, cos2SigmaM, sigma, cosSigma;

        for (let i = 0; i < 100; i++) {
            const sinLambda = Math.sin(lambda);
            const cosLambda = Math.cos(lambda);

            sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) +
                (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));

            if (sinSigma === 0) { // co-incident points
                return 0;
            }

            cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
            sigma = Math.atan2(sinSigma, cosSigma);
            const sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;

            cosSqAlpha = 1 - sinAlpha*sinAlpha;
            cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
            if (isNaN(cos2SigmaM)) {  // equatorial line: cosSqAlpha=0 (§6)
                cos2SigmaM = 0;
            }

            const C = WGS84_FLATTENING/16*cosSqAlpha*(4+WGS84_FLATTENING*(4-3*cosSqAlpha));
            lambdaPrevious = lambda;
            lambda = L + (1-C) * WGS84_FLATTENING * sinAlpha *
                (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));

            if (Math.abs(lambda - lambdaPrevious) <= 1e-12) {
                break;
            }
        }

        if (Math.abs(lambda - lambdaPrevious) > 1e-12) { // failed to converge
            return NaN;
        }

        const uSq = cosSqAlpha * (WGS84_EQUATORIAL_RADIUS*WGS84_EQUATORIAL_RADIUS - WGS84_SEMI_MINOR_AXIS*WGS84_SEMI_MINOR_AXIS) / (WGS84_SEMI_MINOR_AXIS*WGS84_SEMI_MINOR_AXIS);
        const A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
        const B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
        const deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
            B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));

        const distance = WGS84_SEMI_MINOR_AXIS*A*(sigma-deltaSigma);

        // initial & final bearings
        // var fwdAz = Math.atan2(cosU2*sinLambda, cosU1*sinU2-sinU1*cosU2*cosLambda);
        // var revAz = Math.atan2(cosU1*sinLambda, -sinU1*cosU2+cosU1*sinU2*cosLambda);

        return distance;
    }

}

