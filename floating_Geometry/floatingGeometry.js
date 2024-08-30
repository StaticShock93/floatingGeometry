import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// setting up the scene requires THREE things
// renderer
// camera
// scene object

// renderer
// const text = document.createElement('h1')
// text
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
camera.position.set(0, 0, 5);
// scene
const scene = new THREE.Scene();
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.dampingFactor = 0.03;

// scene object
const geo = new THREE.IcosahedronGeometry(1.0, 0);
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
mesh.position.set(0, 0, -1);

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

// Load a font and create text
const loader = new FontLoader();
loader.load('./helvetiker_regular.typeface.json', (font) => {
	const textGeometry = new TextGeometry('Hello, Three.js!', {
		font: font,
		size: 1, // Size of the text
		height: 0.2, // Depth of the text
		curveSegments: 12, // Number of points on the curves
		bevelEnabled: true, // Turn bevel on or off
		bevelThickness: 0.03, // Thickness of the bevel
		bevelSize: 0.02, // How far from the text outline the bevel starts
		bevelOffset: 0, // Bevel offset
		bevelSegments: 5, // Number of bevel segments
	});

	// Create a material for the text
	const textMaterial = new THREE.MeshStandardMaterial({color: 0xffffff});

	// Create a mesh and add it to the scene
	const textMesh = new THREE.Mesh(textGeometry, textMaterial);

	// Center the text in the scene
	textGeometry.computeBoundingBox();
	const boundingBox = textGeometry.boundingBox;
	const textWidth = boundingBox.max.x - boundingBox.min.x;
	const textHeight = boundingBox.max.y - boundingBox.min.y;

	// Center the text around the origin
	textMesh.position.set(-textWidth / 2, -textHeight / 2, 0);

	// Add the text mesh to the scene
	scene.add(textMesh);

	// Make the camera look at the text
	camera.lookAt(textMesh.position);
});

// Target position for smooth movement
const targetPosition = new THREE.Vector3();
targetPosition.copy(mesh.position); // Initialize with mesh's starting position

// Variables to track movement
const moveSpeed = 0.05; // Speed at which the mesh will move
const damping = 0.03; // Smoothing factor (higher value = smoother movement)

// Damping and target rotation
let targetRotation = new THREE.Vector3(); // Stores the target rotation as Euler angles
let dampingFactor = 0.1;
let targetRotationZ = 0; // Target rotation angle around Z-axis
let targetRotationX = 0; // Target rotation angle around Z-axis

// Event listener for keydown events
window.addEventListener('keydown', (event) => {
	const rotationSpeed = 0.3;
	switch (event.key) {
		case 'ArrowUp':
			targetPosition.y += moveSpeed; // Move mesh up
			targetRotationX -= rotationSpeed; // Rotate up
			break;
		case 'ArrowDown':
			targetPosition.y -= moveSpeed; // Move mesh down
			targetRotationX += rotationSpeed; // Rotate down

			break;
		case 'ArrowLeft':
			targetPosition.x -= moveSpeed; // Move mesh left
			targetRotationZ += rotationSpeed; // Rotate left (counterclockwise)

			break;
		case 'ArrowRight':
			targetPosition.x += moveSpeed; // Move mesh right
			targetRotationZ -= rotationSpeed; // Rotate left (counterclockwise)
			break;
		case ' ':
			targetPosition.z += moveSpeed; // Move mesh back
			targetRotationX += rotationSpeed // Rotate down
			break;
		case 'Shift':
			targetPosition.z -= moveSpeed; // Move mesh back
			break;
	}
});

// Function to smoothly move the mesh towards the target position
function smoothMoveMesh() {
	mesh.position.lerp(targetPosition, damping); // Interpolate mesh position towards target
}

// Function to smoothly rotate the mesh using damping
function smoothRotateMesh() {
	// Use quaternion to set rotation
	const targetQuaternion = new THREE.Quaternion().setFromEuler(
		new THREE.Euler(targetRotationX, 0, targetRotationZ)
	);

	mesh.quaternion.slerp(targetQuaternion, dampingFactor);
}

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

	// mesh.rotation.y = t * 0.0001;
	// mesh.rotation.x = t * 0.0001;
	// mesh.rotation.z = t * 0.0001;

	// updateMeshTargetPosition(); // Update target position based on key states
	smoothMoveMesh(); // Smoothly move mesh towards target position
	smoothRotateMesh();
	renderer.render(scene, camera);
	controls.update();
}
animate();

console.log('mesh', mesh);
console.log('scene', scene);

// render the scene
// renderer.render(scene, camera);
