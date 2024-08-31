import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import starField from './starfield.js';
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const fov = 75;
const near = 0.1;
const far = 1000;

const camera = new THREE.PerspectiveCamera(fov, w / h, near, far);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180
scene.add(earthGroup)
new OrbitControls(camera, renderer.domElement);
// const loader = new THREE.TextureLoader()
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
	// color: 0xfff000,
	map: new THREE.TextureLoader().load('./assets/earthmap1k.jpg'),
	// flatShading: true,
});

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const stars = starField(30000);
scene.add(stars)

const hemiLight = new THREE.HemisphereLight(0xffffff);
scene.add(hemiLight);

camera.position.z = 3;

// Function to handle window resize
function onWindowResize() {
	const w = window.innerWidth;
	const h = window.innerHeight;
	renderer.setSize(w, h); // Update renderer size
	camera.aspect = w / h; // Update camera aspect ratio
	camera.updateProjectionMatrix(); // Apply the new aspect ratio
}

function animate() {
	// earth.rotation.x += 0.01;
	earthMesh.rotation.y += 0.01;
	onWindowResize();
	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
