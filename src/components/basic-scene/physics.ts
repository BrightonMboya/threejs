import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'
import CANNON from 'cannon';


/**
 * Debug
 */
const gui = new GUI()
const debugObject = {
    createSphere: () => {
        createSphere(
            Math.random() * 0.5,
            { x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 })
    },
    createBox: () => {

        createBox(
            Math.random(),
            Math.random(),
            Math.random(),
            { x: (Math.random() - 0.5) * 3, y: 3, z: (Math.random() - 0.5) * 3 })
    },
    reset: () => {
        for (const object of objectsToUpdate) {
            object.body.removeEventListener('collide', playHitSound);
            //@ts-ignore
            world.removeBody(object.body);
            scene.remove(object.mesh);
        }
    }
};
gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//sounds
const hitSound = new Audio('/audio/hit.mp3');
const playHitSound = (collision: any) => {
    const impactStrength = collision['contact'].getImpactVelocityAlongNormal();
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random();
        hitSound.currentTime = 0;
        hitSound.play();
    }

    if (impactStrength > 7) {
        hitSound.volume = 1;
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/*Physics */
//world
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world); // better performance
world.allowSleep = true; // not to wake the bodies when they are not moving 
world.gravity.set(0, -9.82, 0);

//materials
const defaultMaterial = new CANNON.Material('default');


const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;



//floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);





/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas as HTMLCanvasElement);
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas!
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**Utils   */
const objectsToUpdate: any[] = [];
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})
const createSphere = (radius: number, position: { x: number, y: number, z: number }) => {
    //threejs mesh
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial)
    mesh.scale.set(radius, radius, radius);
    mesh.castShadow = true;
    mesh.position.copy(position as unknown as THREE.Vector3);
    scene.add(mesh);

    //cannon js body
    const shape = new CANNON.Sphere(radius);
    const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        position: new CANNON.Vec3(0, 3, 0),
        material: defaultMaterial
    });
    body.position.copy(position as unknown as CANNON.Vec3);
    body.addEventListener('collide', playHitSound)
    world.addBody(body);

    // save object to update
    objectsToUpdate.push({
        mesh,
        body
    })
}

// function for creating the boxes
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})
const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const createBox = (width: number, height: number, depth: number, position: { x: number, y: number, z: number }) => {
    // three js mesh
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    );
    mesh.castShadow = true;
    mesh.position.copy(position as unknown as THREE.Vector3);
    mesh.scale.set(width, height, depth);
    scene.add(mesh);

    // cannon js body
    const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
    const body = new CANNON.Body({
        mass: 1,
        shape: shape,
        position: new CANNON.Vec3(0, 3, 0),
        material: defaultMaterial
    })
    body.position.copy(position as unknown as CANNON.Vec3);
    body.addEventListener('collide', playHitSound)
    world.addBody(body);


    // saving the objects on the objectToUpdate array
    objectsToUpdate.push({ mesh, body })
}

createSphere(0.5, { x: 3, y: 3, z: 0 });
createBox(1, 1, 1, { x: 0, y: 3, z: 0 });


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // adding some wind
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);


    //update the physics world
    // you need to provide the timestamp (fps), time passed since last call (delta), time step (1/60)
    world.step(1 / 60, deltaTime, 3);
    for (const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position as unknown as THREE.Vector3);
        object.mesh.quaternion.copy(object.body.quaternion as unknown as THREE.Quaternion);
    }

    // sphere.position.copy(sphereBody.position as unknown as THREE.Vector3);


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()