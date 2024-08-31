// starfield.js

import * as THREE from 'three';

export default function starField(count = 10000) {
	// Create a group to hold all star particles
	const starGroup = new THREE.Group();

	// Function to create a starfield
	function addStars() {
		const starCount = 10000; // Number of stars
		const geometry = new THREE.BufferGeometry();
		const positions = new Float32Array(starCount * 3); // X, Y, Z for each star

		for (let i = 0; i < starCount; i++) {
			// Generate random spherical coordinates
			const radius = 500; // Radius of the sphere
			const theta = Math.random() * Math.PI * 2; // Angle around the Y-axis
			const phi = Math.acos(2 * Math.random() - 1); // Angle from Y-axis

			// Convert spherical coordinates to Cartesian coordinates
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);

			// Assign positions
			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;
		}

		geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

		const material = new THREE.PointsMaterial({
			color: 0xffffff,
			size: 0.12, // Size of each star
		});

		const stars = new THREE.Points(geometry, material);
		starGroup.add(stars);
	}

	// Call the function to create the starfield
	addStars();

	return starGroup; // Return the group containing the stars
}
