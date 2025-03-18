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
  
  camera.lookAt(2, 1, 1);
  
  
  let cameraPathPoints = [
    new THREE.Vector3(5.01790986601052, 15.263034477961003, 14.370088473864921),
    new THREE.Vector3(-4.816732989261322, 0.5780442700787258, 7.147446154401097),
    new THREE.Vector3(-3.741245859988548, 4.2707321605602475, 14.00288913705147),
    new THREE.Vector3(-5.562811367526596, 2.043335456859639, 21.645620539626574),
    new THREE.Vector3(0.4011732488760409, 3.9791314797731365, 29.214046184741324)

    ];
  
  let cameraTargetPosition = new THREE.Vector3(7.761626661823774, 9.771962333849157, -0.011975554976154212);
  new EditableCameraPathTool(camera, scene, myRenderer, cameraPathPoints, cameraTargetPosition);
  
  
  
    // scene background texture
  textureLoader = new THREE.TextureLoader();
  let backgroundTex = textureLoader.load("https://cdn.glitch.global/bc7332d9-3f8a-4a6d-bba7-9e9039b4e61f/GraphicsCrate-HDRI_Ice_Terrain_prev_orig.png?v=1742227877076");
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
    "https://cdn.glitch.global/bc7332d9-3f8a-4a6d-bba7-9e9039b4e61f/ice_cliff_uhpocesfa_mid.glb?v=1742227386338";

  modelLoader.load(url, placeModel1);
  
  let url2 =
    "https://cdn.glitch.global/bc7332d9-3f8a-4a6d-bba7-9e9039b4e61f/ice_cliff_veipbcmcb_mid.glb?v=1742231324869";

  modelLoader.load(url2, placeModel2);
}

function placeModel1(gltf) {
  let mesh = gltf.scene;
  mesh.position.set(2, 0, 2);
  mesh.scale.set(5, 5, 5);
  
  // create our texture and load in an image file
  let baseColor = textureLoader.load("https://cdn.glitch.global/bc7332d9-3f8a-4a6d-bba7-9e9039b4e61f/Ice_Cliff_uhpocesfa_Mid_2K_BaseColor.jpg?v=1742228384564");
  
  // create a normal texture
  let normColor = textureLoader.load("hhttps://cdn.glitch.global/bc7332d9-3f8a-4a6d-bba7-9e9039b4e61f/Ice_Cliff_uhpocesfa_Mid_2K_Normal.jpg?v=1742228353111");
  
  mesh.material = new THREE.MeshPhongMaterial( {map: baseColor, normalMap: normColor} );
  
  scene.add(mesh);

}

function placeModel2(gltf) {
  let mesh = gltf.scene;
  mesh.position.set(30, 0, -5);
  //mesh.rotateY(10);
  mesh.scale.set(7, 7, 7);
  
  // create our texture and load in an image file
  let baseColor = textureLoader.load("https://cdn.glitch.global/bc7332d9-3f8a-4a6d-bba7-9e9039b4e61f/Ice_Cliff_uhpocesfa_Mid_2K_BaseColor.jpg?v=1742228384564");
  
  // create a normal texture
  let normColor = textureLoader.load("hhttps://cdn.glitch.global/bc7332d9-3f8a-4a6d-bba7-9e9039b4e61f/Ice_Cliff_uhpocesfa_Mid_2K_Normal.jpg?v=1742228353111");
  
  mesh.material = new THREE.MeshPhongMaterial( {map: baseColor, normalMap: normColor} );
  
  scene.add(mesh);

}

function draw() {
  
  // adjust camera properties manually
   camera.translateZ(0.1);
//   camera.translateX(0.1);
//   camera.lookAt(-1.4737147755333524, 22.49161696211208,  -0.48755027734745354)
  
  // camera.fov -= 0.1;
 //   camera.aspect = 0.5;
    camera.near = 25;
  
   camera.updateProjectionMatrix();
  
  
  
  
  
  
  
  
  
  
  
  //controls.update();

  frameCount = frameCount + 1;

  myRenderer.render(scene, camera);

  // ask the browser to render another frame when it is ready
  window.requestAnimationFrame(draw);
}

// get everything started by calling init
init();
