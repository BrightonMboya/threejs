import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png');

/*Particles`*/
const particlesGeoometry = new THREE.BufferGeometry();
const particleMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,  //if its far from the cam it will be small and vice versa
    alphaMap: particleTexture,
    transparent: true,
    color: "#ff88cc",
})
// particleMaterial.alphaTest = 0.001; // for the transparent part of the texture
// particleMaterial.depthWrite = false;  // draw the particle without caring i f the particle is infrount of another object
particleMaterial.depthWrite = false; // dont look ar where you store the depth of the other object, just draw it

particleMaterial.blending = THREE.AdditiveBlending; // add the color of the particle to the color of the object
particleMaterial.vertexColors = true; // use the color of the vertex
const particles = new THREE.Points(particlesGeoometry, particleMaterial);
scene.add(particles);

// const particlesGeoometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial();
const count = 200000;
const vertices = new Float32Array(count * 3);
const color = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
    vertices[i] = (Math.random() - 0.5) * 10;
    color[i] = Math.random();
}
particlesGeoometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
particlesGeoometry.setAttribute('color', new THREE.Float32BufferAttribute(color, 3));
// const particles = new THREE.Points(particlesGeoometry, particlesMaterial);
// scene.add(particles);



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
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas as HTMLElement)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas!
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    //animating the particles
    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        particlesGeoometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + i)
    }
    particlesGeoometry.attributes.position.needsUpdate = true;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()