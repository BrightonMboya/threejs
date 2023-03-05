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

// now we create the renderer
const canvas = document.querySelector('.webgl');
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas!,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
