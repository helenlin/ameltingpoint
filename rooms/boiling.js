import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FirstPersonControls } from "./FirstPersonControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EditableCameraPathTool } from "./EditableCameraPathTool.js";

// create variables and make them available globally
let scene, myRenderer, camera;

// keep track of which frame we are on
let frameCount = 0;

// keep track of our controls so we can update them in the draw loop
let controls;

let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();

let pointerDown = false;

let textureLoader;

function onPointerDown() {
  pointerDown = true;
  
  raycaster.setFromCamera(pointer,camera);
  let intersections = raycaster.intersectObjects(scene.children);
  console.log(intersections[0].point);
  
}

function onPointerUp() {
  pointerDown = false;
}

function onPointerMove(ev) {
  let mx = ev.clientX;
  let my = ev.clientY;

  // convert from pixel coordinates to normalized device coordinates
  pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
}

function init() {
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

  // create a scene and give it a background color
  scene = new THREE.Scene();
  scene.background = new THREE.Color("rgb(20,20,20)");

  // create the renderer which will actually draw our scene and add it to the document
  myRenderer = new THREE.WebGLRenderer();
  myRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(myRenderer.domElement);
  
  // create our camera
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  camera.position.set(-1.4737147755333524, 22.49161696211208, -0.48755027734745354);
  camera.position.z += 3;
  camera.position.x += -3;
  camera.position.y += 2;
  
  camera.lookAt(10, 1, 10);
  
  
  let cameraPathPoints = [new THREE.Vector3(5.01790986601052, 19.104104162647268, -26.55831266834842),
    new THREE.Vector3(0.3843150259995598, 2.8304660690154133, -0.419056140522982),
    new THREE.Vector3(-2.7658811030401864, 4.386254997688389, 12.268531610119705),
    new THREE.Vector3(-5.562811367526596, 2.043335456859639, 21.645620539626574),
    new THREE.Vector3(-4.400331975149757, 2.303787903357875, 36.61455062721977),
    ];
  
  let cameraTargetPosition = new THREE.Vector3(7.761626661823774, 9.771962333849157, -0.011975554976154212);
  new EditableCameraPathTool(camera, scene, myRenderer, cameraPathPoints, cameraTargetPosition);
  
  
  
    // scene background texture
  textureLoader = new THREE.TextureLoader();
  let backgroundTex = textureLoader.load("https://cdn.glitch.global/01d9d043-5903-433c-aee7-5c27babdf644/volcanichdri.png?v=1742529405515");
  backgroundTex.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = backgroundTex;
  
  
    // add a directional light from above
  let directionalLight = new THREE.DirectionalLight( 0xc4e9f5, 2.5 );
  directionalLight.castShadow = true;
  directionalLight.position.set(10,10,10);
  scene.add( directionalLight );
  
  // and an ambient light
  let ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);
  
  
  /*
  let grid = new THREE.GridHelper(100, 100);
  scene.add(grid);
  */
  
  // add cave model
  addMyModel();

  // start the draw loop
  draw();
}

function addMyModel() {
  let modelLoader = new GLTFLoader();
  let url =
    "https://cdn.glitch.global/01d9d043-5903-433c-aee7-5c27babdf644/volcano.glb?v=1742529286632";

  modelLoader.load(url, placeModel1);
  




}

function placeModel1(gltf) {
  let mesh = gltf.scene;
  mesh.position.set(15, -20, -30);
  mesh.scale.set(50, 50, 50);
  
  scene.add(mesh);

}


function draw() {
  
  // adjust camera properties manually
   // camera.translateZ(0.1);
//   camera.translateX(0.1);
//   camera.lookAt(-1.4737147755333524, 22.49161696211208,  -0.48755027734745354)
  
  // camera.fov -= 0.1;
 //   camera.aspect = 0.5;
    camera.near = 15;
  
   camera.updateProjectionMatrix();
  
  
  
  
  
  
  
  
  
  
  
  //controls.update();

  frameCount = frameCount + 1;

  myRenderer.render(scene, camera);

  // ask the browser to render another frame when it is ready
  window.requestAnimationFrame(draw);
}

// get everything started by calling init
init();
