import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
// import wall from "../../../public/images/wall.jpg";


const scene = new THREE.Scene();
// creating the mesh cube


/* loading the texture */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');
const matCapTexture = textureLoader.load('/textures/matcaps/1.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg',

])


/* creating the material */
const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial();
// material.color = new THREE.Color("#ff00ff")
// material.map = doorColorTexture;
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial()

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matCapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();\

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color(0xff00ff);

const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.65;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.05
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = doorAlphaTexture;

// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.7;
// material.roughness = 0.2;
// material.envMap = environmentMapTexture;


material.side = THREE.DoubleSide;
// making the objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 70, 70),
    material
)

sphere.position.x = -2;

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 100, 100),
    material
)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
// const uv2 = plane.geometry.attributes.uv;

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)

torus.position.x = 2;


const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
scene.add(plane, sphere, torus);

/* fucking light`s */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);


const pointLIght = new THREE.PointLight(0xffffff, 0.5);
pointLIght.position.x = 2;
pointLIght.position.y = 3;
pointLIght.position.z = 4;
scene.add(pointLIght);

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



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



/* adding the debug panel */
const gui = new GUI();

gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
gui.add(material, 'aoMapIntensity').min(0).max(1).step(0.001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);


function rotateCube() {
    //fixing the fps on diff computers
    const elapsedTime = clock.getElapsedTime();

    requestAnimationFrame(rotateCube);

    sphere.rotation.y = elapsedTime;
    // plane.rotation.y = elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;
    torus.rotation.x = 0.1 * elapsedTime;
    controls.update();
    renderer.render(scene, camera);
}

rotateCube();