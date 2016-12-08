import React from 'react';
import {
    Scene, SpotLight, PointLight, Object3D, Texture, ShaderMaterial,
    SphereGeometry, WebGLRenderer, Mesh, PerspectiveCamera, MeshBasicMaterial, TextureLoader
} from 'three';

import map_indexed from '../../public/images/map_indexed.png';

//const mapIndexedImage = new Image();
//mapIndexedImage.src = 'images/map_indexed.png';
//
//const mapOutlineImage = new Image();
//mapOutlineImage.src = 'images/map_outline.png';

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
        this.renderer.setSize(window.innerWidth-10, window.innerHeight-10);

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
        //let lookupCanvas = document.createElement('canvas');
        //lookupCanvas.width = 256;
        //lookupCanvas.height = 1;
        //
        //let lookupTexture = new Texture(lookupCanvas);
        //lookupTexture.magFilter = NearestFilter;
        //lookupTexture.minFilter = NearestFilter;
        //lookupTexture.needsUpdate = true;
        //
        //let indexedMapTexture = new Texture(mapIndexedImage);
        //indexedMapTexture.needsUpdate = true;
        //indexedMapTexture.magFilter = NearestFilter;
        //indexedMapTexture.minFilter = NearestFilter;
        //
        //let outlinedMapTexture = new Texture(mapOutlineImage);
        //outlinedMapTexture.needsUpdate = true;
        //
        //let uniforms = {
        //    'mapIndex': {
        //        type: 't',
        //        value: 0,
        //        texture: indexedMapTexture
        //    },
        //    'lookup': {
        //        type: 't',
        //        value: 1,
        //        texture: lookupTexture
        //    },
        //    'outline': {
        //        type: 't',
        //        value: 2,
        //        texture: outlinedMapTexture
        //    },
        //    'outlineLevel': {
        //        type: 'f',
        //        value: 1
        //    }
        //};
        //
        //var shaderMaterial = new ShaderMaterial({
        //    uniforms: uniforms,
        //    vertexShader: document.getElementById('globeVertexShader').textContent,
        //    fragmentShader: document.getElementById('globeFragmentShader').textContent
        //});

        let texture = new TextureLoader().load(map_indexed);
        let geometry = new SphereGeometry(15, 32, 32, 0, 6.3, 6.3);
        let material = new MeshBasicMaterial({
            color: 0xffff,
            map: texture
        });
        let sphere = new Mesh(geometry, material);
//        this.scene.add(sphere);

        this.rotating = new Object3D();
        this.rotating.add(sphere);
        this.scene.add(this.rotating);
    }

    animate = () => {
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

    init() {
        this.scene = new Scene();
        this.initCamera();
        this.initWebGLRenderer();
        this.initLights();

        this.resize();
        this.keyDown();

        // add something to scene
        this.initSphere();
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