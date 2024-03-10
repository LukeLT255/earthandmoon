import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";
// import vertexShader from "./shaders/vertex.glsl";
// import fragmentShader from "./shaders/fragment.glsl";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(5); 

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
const detail = 12;
const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("globeMap.jpeg"),
  specularMap: loader.load("02_earthspec1k.jpg"),
  bumpMap: loader.load("01_earthbump1k.jpg"),
  bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geometry, material);
earthMesh.castShadow = true; //default is false
earthMesh.receiveShadow = true; //default
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load('03_earthlights1k.jpg'),
  blending: THREE.AdditiveBlending,
  opacity: 0.4
});

const lightsMesh = new THREE.Mesh(geometry, lightsMat)
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.35,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('05_earthcloudmaptrans.jpg'),
  // alphaTest: 0.3,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);



const moonGeometry = new THREE.IcosahedronGeometry(1, detail);
const moonMat = new THREE.MeshPhongMaterial({
  map: loader.load('moonmap4k.jpg'),
  bumpMap: loader.load('moonbump4k.jpg')
})
const moonMesh = new THREE.Mesh(moonGeometry, moonMat);
moonMesh.position.set(4, 1, 0.1);
moonMesh.scale.set(0.27, 0.27, 0.27);
moonMesh.castShadow = true; //default is false
moonMesh.receiveShadow = true; //default

const moonObj = new THREE.Object3D();
moonObj.add(moonMesh);
scene.add(moonObj);

const sunGroup = new THREE.Group();
sunGroup.position.set(-50, 0.5, 1.5);
scene.add(sunGroup);

const sunGeometry = new THREE.IcosahedronGeometry(1, detail);
const sunMaterial = new THREE.MeshPhongMaterial({
  map: loader.load('sunmap.jpg')
})
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
sunGroup.add(sunMesh);

const sunShaderGeo = new THREE.IcosahedronGeometry(1, detail);
const sunShaderMat = new THREE.ShaderMaterial({
  // vertexShader: vertexShader,
  // fragmentShader: fragmentShader,
});

const stars = getStarfield({numStars: 5000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-50, 0.5, 1.5);
sunLight.castShadow = true;
//Set up shadow properties for the light
sunLight.shadow.mapSize.width = 512; // default
sunLight.shadow.mapSize.height = 512; // default
sunLight.shadow.camera.near = 0.5; // default
sunLight.shadow.camera.far = 500; // default

scene.add(sunLight);

const sunPointLight = new THREE.PointLight( 0xffffff, 100, 0 );
sunPointLight.position.set(-46, 0.5, 1.5);
scene.add( sunPointLight );

// const sphereSize = 1;
// const pointLightHelper = new THREE.PointLightHelper(sunPointLight, sphereSize);
// scene.add(pointLightHelper);

// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);


// const helper = new THREE.CameraHelper( sunLight.shadow.camera );
// scene.add( helper );

// const lightHelper = new THREE.DirectionalLightHelper(sunLight);
// scene.add(lightHelper);

// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);
const controls = new OrbitControls(camera, renderer.domElement);
controls.keys = {
	LEFT: 'ArrowLeft', //left arrow
	UP: 'ArrowUp', // up arrow
	RIGHT: 'ArrowRight', // right arrow
	BOTTOM: 'ArrowDown' // down arrow
}
controls.listenToKeyEvents(window);
controls.maxDistance = 20;
controls.minDistance = 3;
controls.enableDamping = true;
controls.update();

function animate() {
  moonObj.rotation.y += 0.00019;
  earthMesh.rotation.y += 0.005;
  lightsMesh.rotation.y += 0.005;
  cloudsMesh.rotation.y += 0.0055;
  glowMesh.rotation.y += 0.005;

  requestAnimationFrame( animate );
  controls.update();
  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);