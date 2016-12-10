import { PerspectiveCamera } from 'three';

function initCamera(scene) {
    let camera = new PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.z = 400;
    camera.position.y = 0;
    camera.lookAt(scene.width / 2, scene.height / 2);

    return camera;
}

export default {
    initCamera
};