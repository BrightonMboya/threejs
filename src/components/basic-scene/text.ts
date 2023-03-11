import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';


const scene = new THREE.Scene();
// creating the mesh cube

// const geometry = new THREE.BufferGeometry().setFromPoints(points);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });


/*loading textures */
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);


/* Loading fonts */
const fontLoader = new FontLoader();
fontLoader.load('/helvetiker_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry(
        "Queen Rock Band",
        {
            font: font,
            size: 0.5,
            height: 0.2,
            curveSegments: 5,
            bevelThickness: 0.03,
            bevelEnabled: true,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        }
    );
    const textMaterial = new THREE.MeshBasicMaterial();
    textMaterial.wireframe = true
    const text = new THREE.Mesh(textGeometry, textMaterial);

    // textGeometry.translate(
    //     -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x),
    //     -0.5 * (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y),
    //     -0.5 * (textGeometry.boundingBox!.max.z - textGeometry.boundingBox!.min.z)
    // )
    textGeometry.center();
    textGeometry.computeBoundingBox();
    console.log(textGeometry.boundingBox)
    scene.add(text);
})


/* axes helpers */
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

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

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// controls for the OrbitControl cam
const controls = new OrbitControls(camera, document.querySelector('.webgl')! as HTMLElement);
controls.enableDamping = true;


//u can also use orthographic camera
// const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
camera.position.z = 3;

scene.add(camera)

//making the camera to lookAt the cube




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
