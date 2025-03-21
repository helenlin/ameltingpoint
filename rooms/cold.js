import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer;
let canvasWidth, canvasHeight;
let iceCubeMesh;
let frameCount;

function init() {

    frameCount = 0;
  // create a scene in which all other objects will exist
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(200,230,250)");

  // the renderer will actually show the camera view within our <canvas>
  renderer = new THREE.WebGLRenderer();
  canvasWidth = window.innerWidth-20;
  canvasHeight = window.innerHeight-20;
  renderer.setSize(canvasWidth, canvasHeight);
  document.body.appendChild(renderer.domElement);

  // create a camera and position it in space
  let aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.z = 3; // place the camera in space
  camera.position.x = 3;
  camera.position.y = 4;
  camera.lookAt(5, 5, 5);

  // add orbit controls
  let controls = new OrbitControls( camera, renderer.domElement );
  controls.enablePan = true;
  
  let gridHelper = new THREE.GridHelper(10, 10, "white", "white");
  scene.add(gridHelper);
  
  //create our water material
  let waterMat = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0,
    envMapIntensity: 0.9,
    clearcoat: 1,
    transparent: true,
    transmission: 0.95,
    opacity: 1,
    reflectivity: 0.7,
  });
  let iceCubeGeo = new THREE.BoxGeometry(2, 2, 2);

  iceCubeMesh = new THREE.Mesh(iceCubeGeo, waterMat);
  iceCubeMesh.position.set(0, 1, 0);
  //scene.add(iceCubeMesh);


  addMyModel(); 
  loop();
}



function loop() {
    
    frameCount = frameCount + 1;

    // rotate by an amount
    iceCubeMesh.rotateY(0.01);

  // take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);
  // pass the name of your loop function into this function
  window.requestAnimationFrame(loop);
  
}




function addMyModel() {
  let modelLoader = new GLTFLoader();
  let url =
    "../assets/icecube.glb";

  modelLoader.load(url, placeModel);
  
}

function placeModel(gltf) {
  let mesh = gltf.scene;
  mesh.position.set(0, 1, 0);
  mesh.scale.set(2, 2, 2);
  
  scene.add(mesh);
}




init();


