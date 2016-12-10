import {
    SphereGeometry, Mesh, MeshBasicMaterial, TextureLoader,
    CubicBezierCurve3, Vector3,
    Geometry, LineBasicMaterial, Line
} from 'three';

// textures
import map_indexed from '../../public/images/map_indexed.png';

function renderGlobe(object3D) {
    let texture = new TextureLoader().load(map_indexed);
    let geometry = new SphereGeometry(15, 32, 32);

    let material = new MeshBasicMaterial({
        color: 0xffff,
        map: texture
    });

    let sphere = new Mesh(geometry, material);

    object3D.add(sphere);
}

function drawCurve(start, end) {
    let curve = createSphereArc(start, end);

    var lineGeometry = new Geometry();
    lineGeometry.vertices = curve.getPoints(100);
    lineGeometry.computeLineDistances();

    let lineMaterial = new LineBasicMaterial({
        color: 0xff0000,
        linewidth: 2
    });

    return new Line(lineGeometry, lineMaterial);
}

/**
 *
 * @param start {Vector3}
 * @param end {Vector3}
 * @returns {CubicBezierCurve3}
 */
function createSphereArc(start, end) {
    let distanceBetweenCountryCenter = start.distanceTo(end),
        distanceHalf = distanceBetweenCountryCenter * 0.5;

    //	midpoint for the curve
    let midPoint = start.clone().lerp(end, 0.5);
    midPoint.normalize();
    midPoint.multiplyScalar(30);

    //	the normal from start to end
    let normal = new Vector3().subVectors(start, end);
    normal.normalize();

    let midStartAnchor = midPoint.clone().add(normal.clone().multiplyScalar(distanceHalf));
    let midEndAnchor = midPoint.clone().add(normal.clone().multiplyScalar(-distanceHalf));

    //	now make a bezier curve out of the above like so in the diagram
    let splineCurveC = new CubicBezierCurve3(start, midStartAnchor, midEndAnchor, end);

    return splineCurveC;
}

export default {
    renderGlobe,
    drawCurve
};