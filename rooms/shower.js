import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FirstPersonControls } from "./FirstPersonControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let scene, camera, renderer, controls;

let myObjects = [];
let inactiveMat, activeMat, smallWallMat, waterMat;
let mouse;

let meshes = [];

let wHeightLimit = 20;

let frameCount = 0;
let raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();

let wallMesh1, wallMesh2, wallMesh3, wallMesh4, floorMesh;
let pointerDown = false;
let mx, my;

let pointIndex = 0;

let canvasWidth, canvasHeight;

function onPointerDown() {
  pointerDown = true;
}

function onPointerUp() {
  pointerDown = false;
}

// we will reuse these for all the orb meshes
let orbGeo = new THREE.SphereGeometry(0.02, 4, 4);
let orbMat = new THREE.MeshBasicMaterial({
  color: new THREE.Color("rgb(255,255,255)"),
});
// and for the lines
let lineMat = new THREE.LineBasicMaterial({ color: 0x0000ff });

function onPointerMove(ev) {
  mx = ev.clientX;
  my = ev.clientY;

  // convert from pixel coordinates to normalized device coordinates
  pointer.x = (mx / window.innerWidth) * 2 - 1;
  pointer.y = -(my / window.innerHeight) * 2 + 1;
}


function orbApply(mesh) {
    for (let i = 0; i < 10; i++) {
    let spread = 0.75;
    let offsetX = (Math.random() - 0.5) * spread;
    let offsetY = (Math.random() - 0.5) * spread;

    let offsetPointer = new THREE.Vector2(
      pointer.x + offsetX,
      pointer.y + offsetY
    );

    // use raycaster to cast a ray and see what it hits
    raycaster.setFromCamera(offsetPointer, camera);
    let intersections = raycaster.intersectObject(mesh);

    if (intersections[0]) {
      let raycastHit = intersections[0];
      console.log(raycastHit);

      // create the orb
      let orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(
        raycastHit.point.x,
        raycastHit.point.y,
        raycastHit.point.z
      );
      scene.add(orb);
    }
  }
}




function init() {
  window.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);

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
  camera.position.z = 5; // place the camera in space
  camera.position.y = 1;
  camera.lookAt(0, 0, 0);

  // add orbit controls
  controls = new FirstPersonControls(scene, camera, renderer);

  /*
  let gridHelper = new THREE.GridHelper(70, 70);
  scene.add(gridHelper);
  */

  // create our floor texture
  let myFloorTex = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/d6fcbee5-8ee4-409d-bdef-600011fccd52/TilesZelligeSquaresWeathered001_AO_2K.jpg?v=1740969621819"
  );
  myFloorTex.wrapS = THREE.RepeatWrapping;
  myFloorTex.wrapT = THREE.RepeatWrapping;
  myFloorTex.repeat.set(5, 5);
  // same with our normal texture
  let normFloorTex = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/d6fcbee5-8ee4-409d-bdef-600011fccd52/TilesZelligeSquaresWeathered001_NRM_2K.png?v=1740969321213"
  );
  normFloorTex.wrapS = THREE.RepeatWrapping;
  normFloorTex.wrapT = THREE.RepeatWrapping;
  normFloorTex.repeat.set(5, 5);

  let myFloorMat = new THREE.MeshPhongMaterial({
    map: myFloorTex,
    normalMap: normFloorTex,
  });
  let myFloorGeo = new THREE.BoxGeometry(70, 0.01, 70);
  floorMesh = new THREE.Mesh(myFloorGeo, myFloorMat);
  floorMesh.position.set(0, -1, 0);
  scene.add(floorMesh);

  //create our ceiling texture
  let ceilTex = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/d6fcbee5-8ee4-409d-bdef-600011fccd52/TilesZelligeSquaresWeathered001_AO_2K.jpg?v=1740969621819"
  );
  let ceilMat = new THREE.MeshPhongMaterial({ map: ceilTex });
  let ceilingMesh = new THREE.Mesh(myFloorGeo, myFloorMat);
  ceilingMesh.position.set(0, 7, 0);
  scene.add(ceilingMesh);

  /*
  //create our water material
  waterMat = new THREE.MeshPhysicalMaterial({
    metalness: 0,
    roughness: 0,
    envMapIntensity: 0.9,
    clearcoat: 1,
    transparent: true,
    transmission: 0.95,
    opacity: 1,
    reflectivity: 0.2,
  });
  */
  
  orbMat = myFloorMat;

  // create our small wall texture
  let smallWallTex = new THREE.TextureLoader().load(
    "https://cdn.glitch.global/d6fcbee5-8ee4-409d-bdef-600011fccd52/Poliigon_StoneQuartzite_8060_BaseColor.jpg?v=1740969290610"
  );
  smallWallTex.wrapS = THREE.RepeatWrapping;
  smallWallTex.wrapT = THREE.RepeatWrapping;
  smallWallTex.repeat.set(5, 1);
  smallWallMat = new THREE.MeshBasicMaterial({ map: smallWallTex });
  smallWallMat.color = new THREE.Color(0xe8f9ff);

  //-------wallMesh1
  let wallMesh1Geo = new THREE.BoxGeometry(70, 40, 0.01);
  wallMesh1 = new THREE.Mesh(wallMesh1Geo, myFloorMat);
  wallMesh1.position.set(0, 19, 35);
  scene.add(wallMesh1);

  //-------wallMesh2
  let wallMesh2Geo = new THREE.BoxGeometry(0.01, 40, 70);
  wallMesh2 = new THREE.Mesh(wallMesh2Geo, myFloorMat);
  wallMesh2.position.set(35, 19, 0);
  scene.add(wallMesh2);

  //-------wallMesh3
  let wallMesh3Geo = new THREE.BoxGeometry(0.01, 40, 70);
  wallMesh3 = new THREE.Mesh(wallMesh3Geo, smallWallMat);
  wallMesh3.position.set(-35, 19, 0);
  scene.add(wallMesh3);

  //-------wallMesh4
  let wallMesh4Geo = new THREE.BoxGeometry(70, 40, 0.01);
  wallMesh4 = new THREE.Mesh(wallMesh4Geo, myFloorMat);
  wallMesh4.position.set(0, 19, -35);
  scene.add(wallMesh4);

  // add a directional light from above
  let directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  scene.add(directionalLight);

  // and an ambient light
  let ambientLight = new THREE.AmbientLight(0xccf2ff, 2.0);
  scene.add(ambientLight);

  // create several objects which we can activate with raycasting
  // use a shared geometry for each object
  activeMat = new THREE.MeshBasicMaterial({ color: 0x707c9c });
  inactiveMat = new THREE.MeshBasicMaterial({ color: 0x283452 });

  addMyFaucets();
  addMySoaps();

  // ----------------------------INTERACTION------------>
  // add a raycast on click
  mouse = new THREE.Vector2(0, 0);
  document.addEventListener(
    "mousemove",
    (ev) => {
      // three.js expects 'normalized device coordinates' (i.e. between -1 and 1 on both axes)
      mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    },
    false
  );

  let raycaster = new THREE.Raycaster();
  document.addEventListener("click", (ev) => {
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(myObjects);

    // reset all materials
    for (let i = 0; i < myObjects.length; i++) {
      myObjects[i].material = inactiveMat;
    }
    for (let i = 0; i < intersects.length; i++) {
      intersects[i].object.material = activeMat;
    }
  
  });    
  // ----------------------------INTERACTION------------<

  loop();
}

function addMySoaps() {
  let modelLoader = new GLTFLoader();
  let url =
    "https://cdn.glitch.global/d6fcbee5-8ee4-409d-bdef-600011fccd52/hand_soap_bottle.glb?v=1740977462590";
  modelLoader.load(url, placeSoap);
}

function placeSoap(gltf) {
  let soapMesh = gltf.scene;

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      let soapClone = soapMesh.clone();
      soapClone.scale.set(3, 3, 3);
      soapClone.rotation.y = Math.PI * 1.5;
      soapClone.position.set(i * 10 - 18, -0.95, j * 10 - 20);

      scene.add(soapClone);
    }
  }
}

function addMyFaucets() {
  let modelLoader = new GLTFLoader();
  let url =
    "https://cdn.glitch.global/d6fcbee5-8ee4-409d-bdef-600011fccd52/shower_high_poly.glb?v=1740977178215";
  modelLoader.load(url, placeFaucet);
}

function placeFaucet(gltf) {
  let faucetMesh = gltf.scene;

  for (let i = 0; i < 5; i++) {
    //----------------------build smallWallMesh
    let smallWallGeo = new THREE.BoxGeometry(50, 12, 0.25);
    let smallWallMesh = new THREE.Mesh(smallWallGeo, smallWallMat);
    smallWallMesh.position.set(0, 0, i * 10 - 20.5);
    meshes.push(smallWallMesh);
    scene.add(smallWallMesh);

    //----------------------build faucetMesh clones
    for (let j = 0; j < 5; j++) {
      let faucetClone = faucetMesh.clone();
      faucetClone.material = inactiveMat;
      faucetClone.scale.set(3, 3, 3);
      faucetClone.position.set(i * 10 - 20, 1.5, j * 10 - 20);

      //mesh.rotation.y = Math.random() * 2;
      myObjects.push(faucetClone);
      scene.add(faucetClone);
    }
  }
}

function loop() {
  controls.update(); // FPW controls

  frameCount = frameCount + 1;
  
  
  
  
  if (pointerDown && floorMesh) orbApply(floorMesh);
  if (pointerDown && wallMesh1) orbApply(wallMesh1);
  if (pointerDown && wallMesh2) orbApply(wallMesh2);
  if (pointerDown && wallMesh3) orbApply(wallMesh3);
  if (pointerDown && wallMesh4) orbApply(wallMesh4);
  for (let i = 0; i < meshes.length; i++){
    if (pointerDown && meshes[i]) orbApply(meshes[i]);
  }

  // take a picture of the scene and show it in the <canvas>
  renderer.render(scene, camera);
  // pass the name of your loop function into this function
  window.requestAnimationFrame(loop);
  
}

init();
