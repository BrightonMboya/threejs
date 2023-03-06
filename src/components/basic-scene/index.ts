import * as THREE from 'three';
import gsap from 'gsap';

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


const clock = new THREE.Clock();

//using gsap to do the animations
gsap.to(cube.position, { duration: 1, delay: 1, x: 2 });
gsap.to(cube.position, { duration: 1, delay: 2, x: 0 });

function rotateCube() {
    //fixing the fps on diff computers
    const elapsedTime = clock.getElapsedTime();

    requestAnimationFrame(rotateCube);
    // cube.rotation.y = elapsedTime;
    // cube.rotation.x = elapsedTime
    // cube.position.y = Math.sin(elapsedTime);
    // cube.position.x = Math.cos(elapsedTime);


    renderer.render(scene, camera);
}

rotateCube();