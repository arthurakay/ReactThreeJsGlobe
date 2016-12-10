import React from 'react';
import {
    Scene, Object3D,
    WebGLRenderer,
    LineBasicMaterial, Geometry, Vector3, Line
} from 'three';

import Globe from './Globe';
import Camera from './Camera';
import Lights from './Lights';
import Events from './Events';

class Map extends React.Component {
    glContainer = null;
    scene = null;
    renderer = null;
    camera = null;
    rotating = null;

    componentDidMount() {
        this.init();
        this.animate();
    }

    initWebGLRenderer() {
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth - 10, window.innerHeight - 10);

        // physically render
        this.glContainer.appendChild(this.renderer.domElement);
    }

    reRenderWebGLRenderer() {
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
    }

    initAxes() {
        let material = new LineBasicMaterial({
            color: 0x0000ff
        });

        let xAxis = new Geometry();
        xAxis.vertices.push(
            new Vector3(-30, 0, 0),
            new Vector3(30, 0, 0)
        );
        this.rotating.add(new Line(xAxis, material));

        let yAxis = new Geometry();
        yAxis.vertices.push(
            new Vector3(0, -30, 0),
            new Vector3(0, 30, 0)
        );
        this.rotating.add(new Line(yAxis, material));
    }

    animate = () => {
        this.controls.update();
        this.reRenderWebGLRenderer();
        requestAnimationFrame(this.animate);
    };

    initCurve() {
        let start = convertLatLonToVec3(40.7, -73.6).multiplyScalar(15);
        let end = convertLatLonToVec3(30, -90).multiplyScalar(15);
        this.rotating.add(
            Globe.drawCurve(start, end)
        );

        let start2 = convertLatLonToVec3(41.40338, 2.17403).multiplyScalar(15);
        let end2 = convertLatLonToVec3(-27.2265015,153.0982721).multiplyScalar(15);
        this.rotating.add(
            Globe.drawCurve(start2, end2)
        );
    }

    init() {
        this.scene = new Scene();
        this.rotating = new Object3D();
        this.scene.add(this.rotating);

        this.camera = Camera.initCamera(this.scene);
        this.scene.add(this.camera);

        this.initWebGLRenderer();
        Lights.initLights(this.scene);


        this.controls = Events.initEvents(this.camera, this.rotating);
        Globe.renderGlobe(this.rotating);


        //this.initAxes();
        this.initCurve();
    }

    render() {
        return (
            <div>
                <div ref={(el) => { this.glContainer = el; }} id="glContainer"></div>
            </div>
        );
    }
}

export default Map;

function convertLatLonToVec3(lat, lon) {
    lat = lat * Math.PI / 180.0;
    lon = -lon * Math.PI / 180.0;

    return new Vector3(
        Math.cos(lat) * Math.cos(lon),
        Math.sin(lat),
        Math.cos(lat) * Math.sin(lon));
}