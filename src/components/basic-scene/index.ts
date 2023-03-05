import * as THREE from 'three';

const scene = new THREE.Scene();
// creating the mesh cube
const material = new THREE.MeshBasicMaterial({ color: 'red' });
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//sizes
const sizes = {
    width: 800,
    height: 600
}
// creating the camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera)

//making the camera to lookAt the cube
camera.lookAt(cube.position);

//the axes helpers
// const axesHelpers = new THREE.AxesHelper(2);
// scene.add(axesHelpers);

//scaling the objects
/* Scaling the object8/ */
// cube.scale.x = 2;
// cube.scale.y = 0.5;
// cube.scale.z = 0.5; 
// cube.scale.set(2, 0.5, 0.5);

//the distance between the object and the camera
// console.log(cube.position.distanceTo(camera.position))

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
    requestAnimationFrame(rotateCube);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;
    renderer.render(scene, camera);
}

rotateCube();