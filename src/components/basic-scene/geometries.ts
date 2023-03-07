import { GUI } from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// params for the debug ui
const params = {
    color: 0xff0000,
    spin: () => {
        gsap.to(cube.rotation, { duration: 1, y: cube.rotation.y + Math.PI * 2 })
    }
}

const scene = new THREE.Scene();
// creating the mesh cube
const material = new THREE.MeshBasicMaterial({ color: params.color, wireframe: true });
const geometry = new THREE.BoxGeometry(1, 1, 1);
/* creating a basic triangle */
// const points = [];
// points.push(new THREE.Vecto r3(0, 1, 0));
// points.push(new THREE.Vector3(1, 0, 0));
// points.push(new THREE.Vector3(0, 0, 1));
// const geometry = new THREE.BufferGeometry().setFromPoints(points);

// const geometry = new THREE.BufferGeometry();
// const positions = [];

// for (let i = 0; i < 50; i++) {
//     positions.push((Math.random() - 0.5) * 4);
//     positions.push((Math.random() - 0.5) * 4);
//     positions.push((Math.random() - 0.5) * 4);

// }

// geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
// gui.add(cube.position, 'y')

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



/* handling resizes events */
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // renderer.render(scene, camera);

})

/* handling fullscreen events */
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas?.requestFullscreen();
    } else {
        document.exitFullscreen();
    }

});
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// controls for the OrbitControl cam
const controls = new OrbitControls(camera, document.querySelector('.webgl')! as HTMLElement);
controls.enableDamping = true;


//u can also use orthographic camera
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
camera.position.z = 3;
scene.add(camera)

//making the camera to lookAt the cube
camera.lookAt(cube.position);



// now we create the renderer
const canvas = document.querySelector('.webgl');
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas!,
});
renderer.setSize(sizes.width, sizes.height);
// renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);


/* adding the debug UI */
const gui = new GUI();
gui
    .add(cube.position, 'y')
    .min(-3).max(3)
    .step(0.01)
    .name('elevation');
gui
    .add(cube, 'visible')

gui.add(material, 'wireframe');

gui
    .addColor(params, 'color')
    .onChange(() => {
        material.color.set(params.color)
    })
gui
    .add(params, 'spin')

function rotateCube() {
    //fixing the fps on diff computers
    requestAnimationFrame(rotateCube);
    controls.update();
    renderer.render(scene, camera);
}

rotateCube();