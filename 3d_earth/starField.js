// starfield.js

import * as THREE from 'three';

export default function starField(count = 10000) {
	// Create a group to hold all star particles
	const starGroup = new THREE.Group();

	// Function to create a starfield
	function addStars() {
		const starCount = count;
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3); // X, Y, Z for each star

		for (let i = 0; i < starCount * 3; i++) {
			positions[i] = (Math.random() - 0.5) * 1000; // Random position within a large cube
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.1, // Size of each star
		});

		const stars = new THREE.Points(geometry, material);
		starGroup.add(stars);
	}

	// Call the function to create the starfield
	addStars();

	return starGroup; // Return the group containing the stars
}
