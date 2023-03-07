import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



const scene = new THREE.Scene();
// creating the mesh cube
const material = new THREE.MeshBasicMaterial({ color: 'red', wireframe: true });
// const geometry = new THREE.BoxGeometry(1, 1, 1);
/* creating a basic triangle */
// const points = [];
// points.push(new THREE.Vector3(0, 1, 0));
// points.push(new THREE.Vector3(1, 0, 0));
// points.push(new THREE.Vector3(0, 0, 1));
// const geometry = new THREE.BufferGeometry().setFromPoints(points);

const geometry = new THREE.BufferGeometry();
const positions = [];

for (let i = 0; i < 50; i++) {
    positions.push((Math.random() - 0.5) * 4);
    positions.push((Math.random() - 0.5) * 4);
    positions.push((Math.random() - 0.5) * 4);

}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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




function rotateCube() {
    //fixing the fps on diff computers
    requestAnimationFrame(rotateCube);
    controls.update();
    renderer.render(scene, camera);
}

rotateCube();