import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// setting up the scene requires THREE things
// renderer
// camera
// scene object

// renderer
const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// camera
const fov = 75; // 75degrees
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;
// scene
const scene = new THREE.Scene();
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;

// scene object
const geo = new THREE.IcosahedronGeometry(1.0, 3);
// const geo = new THREE.TetrahedronGeometry(1.0, 3);
const mat = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	flatShading: true,
});
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const wireMat = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	wireframe: true,
});
const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.005);
mesh.add(wireMesh);

const hemiLight = new THREE.HemisphereLight(0x0099ff, 0xaa5500);
scene.add(hemiLight);



// Raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isMouseOverMesh = false; // Flag to track whether mouse is over mesh

// Function to handle window resize
function onWindowResize() {
	const w = window.innerWidth;
	const h = window.innerHeight;
	renderer.setSize(w, h); // Update renderer size
	camera.aspect = w / h; // Update camera aspect ratio
	camera.updateProjectionMatrix(); // Apply the new aspect ratio
}

// Add an event listener for window resize
window.addEventListener('resize', onWindowResize);

// Add an event listener for mouse movement
window.addEventListener('mousemove', (event) => {
	// Update mouse position in normalized device coordinates (-1 to +1) for raycasting
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate(t = 0) {
	requestAnimationFrame(animate);
	// mesh.scale.setScalar(Math.cos(t * 0.001 + 1))
	// mesh.rotation.x = 0.01;
	// mesh.rotation.z -= 0.01;

	// Update raycaster with the current camera and mouse position
	raycaster.setFromCamera(mouse, camera);

	// Check for intersections with the mesh
	const intersects = raycaster.intersectObject(mesh);

	// If there's an intersection, change cursor to pointer, otherwise default
	if (intersects.length > 0) {
		document.body.style.cursor = 'pointer';
		isMouseOverMesh = true;
	} else {
		document.body.style.cursor = 'default';
		isMouseOverMesh = false;
	}

	// Update controls only if mouse is over mesh
	controls.enabled = isMouseOverMesh;

	mesh.rotation.y = t * 0.0001;
	mesh.rotation.x = t * 0.0001;
	mesh.rotation.z = t * 0.0001;

	renderer.render(scene, camera);
	controls.update();
}
animate();

console.log('mesh', mesh);
console.log('scene', scene);

// render the scene
// renderer.render(scene, camera);
o;
