// Copyright 2021 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


import ThreejsOverlayView from '@ubilabs/threejs-overlay-view';
import {SphereGeometry, Mesh, MeshBasicMaterial} from 'three';
import {Line2} from 'three/examples/jsm/lines/Line2.js';
import {LineMaterial} from 'three/examples/jsm/lines/LineMaterial.js';
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry.js';
//

import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
const data = require('./results.json');
// console.log(data);

let curData = data[5];

const apiOptions = {
  apiKey: 'AIzaSyDPmt5AOCjogsTiZUp8VIekeIZu0fVyOXc',
  version: "beta"
};

let lati = curData[0].Latitude, lngi = curData[0].Longitude;
 
const mapOptions = {
  mapId: "fe058dbc4fb18811",
  disableDefaultUI: true,
  gestureHandling: 'greedy',

  center: {lat: lati, lng: lngi},
  zoom: 19,
  heading: 324,
  tilt: 65
};


// console.log(lati);
// console.log(lngi);
// const mapOptions = {
//   "tilt": 0,
//   "heading": 0,
//   "zoom": 18,
//   "center": { lat: lati, lng: lngi },
//   "mapId": "fe058dbc4fb18811"    
// }

// // ...

// let dataPoints = []
// data[5].forEach((e)=>{
//   let cur = {
//     lat: e.Latitude,
//     lng: e.Longitude,
//     alt: e.Altitude
//   }
//   dataPoints.push(cur);
// })

// console.log(dataPoints);

// const tmpVec3 = new THREE.Vector3();


async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  return new google.maps.Map(mapDiv, mapOptions);
}





async function initWebGLOverlayView(map) {  
  let scene, renderer, camera, loader;
  const webGLOverlayView = new google.maps.WebGLOverlayView();
  let overlay = new ThreejsOverlayView;

  curData.forEach((e)=>{
    mapOptions.center = {
      lat: e.Latitude,
      lng: e.Longitude
    }
    console.log(mapOptions.center);
    overlay = new ThreejsOverlayView({
      ...mapOptions.center
    });
    overlay.setMap(map);
  
    scene = overlay.getScene();
    let cube = new Mesh(
      new SphereGeometry(3 + (e["Horizontal accuracy"] + e["Vertical accuracy"])/2, 20, 20),
      new MeshBasicMaterial({color: 0x6a0572, transparent: true, opacity:0.3})
    );
  
    let cubeLocation = {...mapOptions.center, altitude: e.Altitude};
    overlay.latLngAltToVector3(cubeLocation, cube.position);
  
    scene.add(cube);

    mapOptions.center = {
      lat: e.Latitude,
      lng: e.Longitude
    }
    overlay = new ThreejsOverlayView({
      ...mapOptions.center
    });
    overlay.setMap(map);
  
    // scene = overlay.getScene();
    let sphere = new Mesh(
      new SphereGeometry(3, 20, 20),
      new MeshBasicMaterial({color: 0x6a0572, })
    );
  
    let sphereLocation = {...mapOptions.center, altitude: e.Altitude};
    overlay.latLngAltToVector3(sphereLocation, sphere.position);
  
    scene.add(sphere);
  })

  // curData.forEach((e)=>{
  //   mapOptions.center = {
  //     lat: e.Latitude,
  //     lng: e.Longitude
  //   }
  //   // console.log(mapOptions.center);
  //   overlay = new ThreejsOverlayView({
  //     ...mapOptions.center
  //   });
  //   overlay.setMap(map);
  
  //   const scene = overlay.getScene();
  //   const cube = new Mesh(
  //     new SphereGeometry(2, 20, 20),
  //     new MeshBasicMaterial({color: 0x6a0572, })
  //   );
  
  //   const cubeLocation = {...mapOptions.center, altitude: 0};
  //   overlay.latLngAltToVector3(cubeLocation, cube.position);
  
  //   scene.add(cube);
  // })
  scene = overlay.getScene();
    

  webGLOverlayView.onAdd = () => {   
    // set up the scene
    // scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
    
    console.log("here as well")
    // const points = dataPoints.map(p=>overlay.latLngAltToVector3(p))
    // // console.log(points);
    // const curve = new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.2)
    // curve.updateArcLengths();

    // const trackLine = createTrackLine(curve);
    // scene.add(trackLine);
  
    // load the model    
    // loader = new GLTFLoader();               
    // const source = "pin.gltf";
    // loader.load(
    //   source,
    //   gltf => {      
    //     gltf.scene.scale.set(5,5,5);
    //     gltf.scene.rotation.x = 180 * Math.PI/180; // rotations are in radians
    //     scene.add(gltf.scene);           
    //   }
    // );
  }
  
  webGLOverlayView.onContextRestored = ({gl}) => {    
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // wait to move the camera until the 3D model loads    
    // loader.manager.onLoad = () => {        
    //   renderer.setAnimationLoop(() => {
    //     map.moveCamera({
    //       "tilt": mapOptions.tilt,
    //       "heading": mapOptions.heading,
    //       "zoom": mapOptions.zoom
    //     });            
        
    //     // rotate the map 360 degrees 
    //     if (mapOptions.tilt < 67.5) {
    //       mapOptions.tilt += 0.5
    //     } else if (mapOptions.heading <= 360) {
    //       mapOptions.heading += 0.2;
    //     } else {
    //       renderer.setAnimationLoop(null)
    //     }
    //   });        
    // }
  }

  webGLOverlayView.onDraw = ({gl, transformer}) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    const latLngAltitudeLiteral = {
        lat: curData[0].Latitude,
        lng: curData[0].Longitude,
        altitude: 50
    }

    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
    scene = new THREE.Scene()
    webGLOverlayView.requestRedraw();      
    renderer.render(scene, camera);                  

    // always reset the GL state
    renderer.resetState();
    
  }
  webGLOverlayView.setMap(map);
}

(async () => {        
  const map = await initMap();
  initWebGLOverlayView(map);    
})();