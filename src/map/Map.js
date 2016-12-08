import React from 'react';
import {
    Scene, SpotLight, PointLight, Object3D,
    SphereGeometry, WebGLRenderer, Mesh, PerspectiveCamera, MeshBasicMaterial, TextureLoader,
    LineBasicMaterial, Geometry, Vector3, Line, CubicBezierCurve3, Path
} from 'three';
import TrackballControls from './TrackballControls';

// textures
import map_indexed from '../../public/images/map_indexed.png';

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

    initCamera() {
        this.camera = new PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.z = 400;
        this.camera.position.y = 0;
        this.camera.lookAt(this.scene.width / 2, this.scene.height / 2);
        this.scene.add(this.camera);
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

    initLights() {
        let light1 = new SpotLight(0xeeeeee, 3);
        light1.position.x = 730;
        light1.position.y = 520;
        light1.position.z = 626;
        light1.castShadow = true;
        this.scene.add(light1);

        let light2 = new PointLight(0x222222, 14.8);
        light2.position.x = -640;
        light2.position.y = -500;
        light2.position.z = -1000;
        this.scene.add(light2);
    }

    initSphere() {
        let texture = new TextureLoader().load(map_indexed);
        let geometry = new SphereGeometry(15, 32, 32, 0, 6.3, 6.3);
        let material = new MeshBasicMaterial({
            color: 0xffff,
            map: texture
        });
        let sphere = new Mesh(geometry, material);

        this.rotating.add(sphere);
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

    resize = (renderer, camera) => {
        let callback = () => {
            let minWidth = 1280,
                w = window.innerWidth;

            if (w < minWidth) {
                w = minWidth;
            }

            // notify the renderer of the size change
            this.renderer.setSize(w, window.innerHeight);

            // update the camera
            this.camera.aspect = w / window.innerHeight;
            this.camera.updateProjectionMatrix();
        };

        // bind the resize event
        window.addEventListener('resize', callback, false);

        // return .stop() the function to stop watching window resize
        return {
            /**
             * Stop watching window resize
             */
            stop: function() {
                window.removeEventListener('resize', callback);
            }
        };
    };

    keyDown = () => {
        let callback = (e) => {
            switch (e.keyCode) {
                case 38:
                    // UP key
                    this.rotating.rotateX(-0.5);
                    break;

                case 40:
                    // DOWN key
                    this.rotating.rotateX(0.5);
                    break;

                case 37:
                    // LEFT key
                    this.rotating.rotateY(-0.5);
                    break;

                case 39:
                    // RIGHT key
                    this.rotating.rotateY(0.5);
                    break;

                case 65:
                    // A key
                    this.camera.position.z -= 10;
                    break;

                case 83:
                    // S key
                    this.camera.position.z += 10;
                    break;

                default:
                    break;
            }
        };

        // bind the resize event
        window.addEventListener('keydown', callback, false);

        // return .stop() the function to stop watching window resize
        return {
            /**
             * Stop watching window resize
             */
            stop: function() {
                window.removeEventListener('keydown', callback);
            }
        };
    };

    initMouseEvents() {
        this.controls = new TrackballControls(this.camera, document.body);
        this.controls.minDistance = 100.0;
        this.controls.maxDistance = 800.0;
        this.controls.dynamicDampingFactor = 0.1;
    }

    initCurve() {
        let start = new Vector3(15, 0, 0),
            end = new Vector3(0, 15, 0),
            curve = this.makeConnectionLineGeometry(start, end, 5);

        this.rotating.add(curve);
    }

    /**
     *
     * @param start {Vector3}
     * @param end {Vector3}
     * @param value
     * @returns {*}
     */
    makeConnectionLineGeometry(start, end, value) {
        let distanceBetweenCountryCenter = 30, // TODO: exporter.center.clone().subSelf(importer.center).length();
            distanceHalf = distanceBetweenCountryCenter * 0.5;

        //	midpoint for the curve
        let midPoint = start.clone().lerp(end, 0.5);
        var midLength = midPoint.length();
        midPoint.normalize();
        midPoint.multiplyScalar(midLength + distanceBetweenCountryCenter * 0.7);

        //	the normal from start to end
        let normal = (new Vector3()).sub(start, end);
        normal.normalize();

        let midStartAnchor = midPoint.clone().add(normal.clone().multiplyScalar(distanceHalf));
        let midEndAnchor = midPoint.clone().add(normal.clone().multiplyScalar(-distanceHalf));

        //	now make a bezier curve out of the above like so in the diagram
        let splineCurveC = new CubicBezierCurve3(start, midStartAnchor, midEndAnchor, end);

        //	how many vertices do we want on this guy? this is for *each* side
        let vertexCountDesired = Math.floor(distanceBetweenCountryCenter * 0.02 + 6) * 2;
        let points = splineCurveC.getPoints(vertexCountDesired);

        let path = new Path(points);
        let geometry = path.createPointsGeometry(50);
        let material = new LineBasicMaterial({
            color: 0xff0000,
            linewidth: value
        });
        return new Line(geometry, material);
    }

    init() {
        this.scene = new Scene();
        this.rotating = new Object3D();
        this.scene.add(this.rotating);

        this.initCamera();
        this.initWebGLRenderer();
        this.initLights();

        // event listeners
        this.resize();
        this.keyDown();
        this.initMouseEvents();

        // add something to scene
        this.initSphere();
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