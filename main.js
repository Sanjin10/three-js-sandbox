import * as THREE from 'three';
import './style.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

//Creating a scene
const scene = new THREE.Scene();
console.log('test');

//Creating a sphere
const sunTexture = new THREE.TextureLoader().load('sun.jpg');
const geometry = new THREE.SphereGeometry(5, 64, 64);
const material = new THREE.MeshStandardMaterial({
	map: sunTexture,
	roughness: 1,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//Creating a moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
//Another way of making new elements
const moon = new THREE.Mesh(
	new THREE.SphereGeometry(3, 64, 64),
	new THREE.MeshStandardMaterial({ map: moonTexture })
);
scene.add(moon);
moon.position.set(12, 8, -10);

//Sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 5, 10);
light.intensity = 1.25;
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
	80,
	sizes.width / sizes.height,
	1,
	100
);
camera.position.z = 20;
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
renderer.setPixelRatio(2);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

//Add stars
function addStar() {
	const geometry1 = new THREE.SphereGeometry(0.15, 24, 24);
	const star_material = new THREE.MeshStandardMaterial({
		color: '#FFFBCC',
	});
	const star = new THREE.Mesh(geometry1, star_material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);
	scene.add(star);
}
Array(200).fill().forEach(addStar);

//Resize
window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	//Update Camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
};
loop();

//Timeline magic
const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
t1.fromTo('nav', { y: '-100%' }, { y: '0%' });
t1.fromTo('h1', { opacity: 0 }, { opacity: 1 });

//Color change on mouse down
let mouseDown = false;
let rgb = [];
window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
	if (mouseDown) {
		rgb = [
			Math.round((e.pageX / sizes.width) * 255),
			Math.round((e.pageY / sizes.height) * 255),
			150,
		];
		//Animation
		let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
		new THREE.Color(`rgb(0,100,150)`);
		gsap.to(mesh.material.color, {
			r: newColor.r,
			g: newColor.g,
			b: newColor.b,
		});
	}
});
