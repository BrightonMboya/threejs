import * as THREE from 'three'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color.set(parameters.materialColor);
        particleMaterial.color.set(parameters.materialColor);
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* Textures */
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')
gradientTexture.magFilter = THREE.NearestFilter; // no blur on the texture

/**
 * objects
 */
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture
})
// meshes
const objectsDistance = 4;
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 100),
    material,
);
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material,
);

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material,
)

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

scene.add(mesh1, mesh2, mesh3)

const sectionMeshes = [mesh1, mesh2, mesh3]


/* particles */
const particlesCount = 300;
const position = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    position[i * 3] = (Math.random() - 0.5) * 10;
    position[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length;
    position[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const particleMaterial = new THREE.PointsMaterial({
    sizeAttenuation: true,
    size: 0.03,
    color: parameters.materialColor
});
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
const particles = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particles);

/* Lights */
const directionalLight = new THREE.DirectionalLight('ffffff', 1)
directionalLight.position.set(1, 1, 0);
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

/* cursor */
const cursor = { x: 0, y: 0 }


window.addEventListener('mousemove', (event) => {
    // divide it by the size of the scene and make sure your values can be as +ve as -ve
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})

/**
 * Camera
 */
//group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas!,
    alpha: true
})
renderer.setClearAlpha(1)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/* scroll animation */
let scrollY = window.scrollY;
let currentSection = 0;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height)
    if (newSection !== currentSection) {
        currentSection = newSection;

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )

    }


})

/**
 * Animate
 */
const clock = new THREE.Clock()

//fixing frame rate issue
let previousTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // animate the camera
    camera.position.y = - scrollY / sizes.height * objectsDistance;

    //parallax stuff
    const parallaxX = cursor.x;
    const parallaxY = - cursor.y;
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.9 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.9 * deltaTime;


    //animate the meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.12;
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()