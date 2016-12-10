import { SpotLight, PointLight } from 'three';

function initLights(scene) {
    let light1 = new SpotLight(0xeeeeee, 3);
    light1.position.x = 730;
    light1.position.y = 520;
    light1.position.z = 626;
    light1.castShadow = true;
    scene.add(light1);

    let light2 = new PointLight(0x222222, 14.8);
    light2.position.x = -640;
    light2.position.y = -500;
    light2.position.z = -1000;
    scene.add(light2);
}

export default {
    initLights
};