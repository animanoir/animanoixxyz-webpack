console.log('animanoir.js loaded.')

import './style.css'
import Swup from 'swup'
import SwupSlideTheme from '@swup/slide-theme';
import gsap, {
  CSSPlugin
} from 'gsap';

import * as THREE from 'three';

import {
  FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js'
import {
  TextGeometry
} from 'three/examples/jsm/geometries/TextGeometry.js'
import {
  EffectComposer
} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {
  RenderPass
} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {
  GlitchPass
} from 'three/examples/jsm/postprocessing/GlitchPass.js'
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';



/* ---------------------------------- swup ---------------------------------- */
const swup = new Swup({
  plugins: [new SwupSlideTheme()]
});

/* -------------------------------- three.js -------------------------------- */
THREE.Cache.enabled = true;

const firstWordArray = [
  'Digital',
  'Creative',
  'Cyber',
  'Human',
  'Magic',
  'Analog',
  'Software',
  'Meta'
]

const firstWord = firstWordArray[Math.floor(Math.random() * firstWordArray.length)]

const secondWordArray = [
  'Developer',
  'Punk',
  'Love',
  'Artist',
  'Lover',
  'Crafter',
  'Philosophy'

]

const secondWord = secondWordArray[Math.floor(Math.random() * secondWordArray.length)]

const clock = new THREE.Clock()

const loadingBarElement = document.querySelector('.loading-bar')

//ANCHOR Raycaster + mouse hover detection
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// Canvas
const canvas = document.querySelector('canvas#three')

const windowSize = {
  width: window.innerWidth,
  height: window.innerHeight
}

const scene = new THREE.Scene();


//ANCHOR Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  powerPreference: 'high-performance'
})

renderer.setPixelRatio(window.devicePixelRatio, 2);
renderer.setSize(windowSize.width, windowSize.height)
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true

//ANCHOR Camera
const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 1000);
camera.position.z = 6;

//ANCHOR Loading Manager
const loadingManager = new THREE.LoadingManager(
  // Loaded
  () => {
    console.log('LOADING MANAGER: assets loaded.')
    window.setTimeout(() => {
      gsap.to(overlayMaterial.uniforms.uAlpha, {
        duration: 3,
        value: 0
      })
      loadingBarElement.classList.add('ended')
      loadingBarElement.style.transform = ''
    }, 500)
  },
  // Loading
  (itemUrl, itemsLoaded, itemsTotal) => {
    const progressRatio = (itemsLoaded / itemsTotal)
    loadingBarElement.style.transform = `scaleX(${progressRatio * .0})`
    console.log('LOADING MANAGER: assets loading...')
  }
)

//ANCHOR Post-processing
const effectComposer = new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(windowSize.width, windowSize.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const glitchPass = new GlitchPass()
effectComposer.addPass(glitchPass)

//ANCHOR Fonts
const fontLoader = new FontLoader(loadingManager)
const matcapTexture = new THREE.TextureLoader().load('/matcaps/161B1F_C7E0EC_90A5B3_7B8C9B-256px.png')

let mainText

//ANCHOR Model
const headLoader = new GLTFLoader(loadingManager);
var head
const logoModel = new GLTFLoader(loadingManager)
var logo

logoModel.load('/model/animanoirLogo-completo1.glb', function (gltf) {
  logo = gltf.scene
  logo.position.set(2, 0, -15)
  scene.add(logo)
}, undefined, function (error) {

  console.error(error);

});
headLoader.load('/model/myHead.glb', function (gltf) {
  head = gltf.scene
  head.position.set(0, 0, 8)
  scene.add(head)

}, undefined, function (error) {

  console.error(error);

});

fontLoader.load(
  '/fonts/notosansregular.json',
  (font) => {

    const textGeometry = new TextGeometry(
      `${firstWord} · ${secondWord}`, {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }
    )

    textGeometry.center();
    const textMaterial = new THREE.MeshMatcapMaterial({
      matcap: matcapTexture
    })
    mainText = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(mainText)
  }
)

function onPointerMove(event) {

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

}

// Axes helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

//Orbit controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

// Shader loader
const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
  transparent: true,
  vertexShader: `
      void main()
      {
          gl_Position = vec4(position, 1.0);
      }
  `,
  uniforms: {
    uAlpha: {
      value: 1
    }
  },
  fragmentShader: `
      uniform float uAlpha;
      void main()
      {
          gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
      }
  `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
scene.add(overlay)

// Video textures
const videoTex1 = document.getElementById('vid-m1');
const videoTex2 = document.getElementById('vid-m2');
const videoTex3 = document.getElementById('vid-m3');

videoTex1.play();
videoTex2.play();
videoTex3.play();

videoTex1.addEventListener('play', function () {

  this.currentTime = 3;

});
videoTex2.addEventListener('play', function () {

  this.currentTime = 3;

});
videoTex3.addEventListener('play', function () {

  this.currentTime = 3;

});

const texture = new THREE.VideoTexture(videoTex1);
const texture2 = new THREE.VideoTexture(videoTex2);
const texture3 = new THREE.VideoTexture(videoTex3);


const textures = [texture, texture2, texture3]

//ANCHOR Video cubes
const videoCubesGroup = new THREE.Group()
const cubesQuantity = 200
const geometry = new THREE.BoxGeometry(6, 6, 6, 4, 4, 4);
for (let i = 0; i < cubesQuantity; i++) {
  let zPosition = (-1 * (Math.random() - 0.5) * 100) - 10
  let wireframeEnabled = false
  if (zPosition >= -5) {
    wireframeEnabled = true
  }
  let randomIndex = Math.floor(Math.random() * textures.length)
  const material = new THREE.MeshPhongMaterial({
    color: 'white',
    map: textures[randomIndex],
    wireframe: wireframeEnabled
  });
  var cube = new THREE.Mesh(geometry, material);
  cube.position.x = ((Math.random() - 0.5) * 111) + 10
  cube.position.y = ((Math.random() - 0.5) * 111) + 10
  cube.position.z = zPosition
  cube.rotation.x = Math.random() * Math.PI
  cube.rotation.y = Math.random() * Math.PI
  // const scale = Math.random() * 1.5
  // cube.scale.set(scale, scale, scale)
  // scene.add(cube);

  videoCubesGroup.add(cube)
}

scene.add(videoCubesGroup)

// Circle behind Animanoir logo
const fragmentShader = `
  #include <common>

  uniform vec3 iResolution;
  uniform float iTime;

  // By iq: https://www.shadertoy.com/user/iq
  // license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
      // Normalized pixel coordinates (from 0 to 1)
      vec2 uv = fragCoord/iResolution.xy;

      // Time varying pixel color
      vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,4,4));

      // Output to screen
      fragColor = vec4(col,1.0);
  }

  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  `;
  const uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };
  const circleMaterial = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });

const circleGeometry = new THREE.CircleGeometry( 3, 32 );
const circle = new THREE.Mesh( circleGeometry, circleMaterial );
circle.position.set(2,0,-15.5)
scene.add( circle )


// Lighting
// let directionalLight = new THREE.AmbientLight('white', 0.5)
// directionalLight.castShadow = true
// scene.add(directionalLight)

const pointLight = new THREE.DirectionalLight(0xffffff, 1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)




// Glowing spheres
// const sphereOneGeometry = new THREE.SphereGeometry(1, 32, 32)
// const sphereOneMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffff00
// })
// const sphereOne = new THREE.Mesh(sphereOneGeometry, sphereOneMaterial)
// sphereOne.position.set(-4.516, 2.961, 0.114)
// scene.add(sphereOne)

// const sphereTwoGeometry = new THREE.SphereGeometry(1, 32, 32)
// const sphereTwoMaterial = new THREE.MeshStandardMaterial({
//   color: 0xffff00
// })
// const sphereTwo = new THREE.Mesh(sphereTwoGeometry, sphereTwoMaterial)
// sphereTwo.position.set(4.446, 3.215, 0)
// sphereTwo.scale.set(2, 2, 2)
// scene.add(sphereTwo)

// ANCHOR Render function
function render() {
  renderer.render(scene, camera);
  // effectComposer.render();
}

//ANCHOR Animation function
const animate = function () {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime()
  videoCubesGroup.rotation.y = elapsedTime * -0.01

  uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
  uniforms.iTime.value = elapsedTime;

  // controls.update();

  // Smooth camera angle movement
  camera.position.x = mouse.x
  // camera.position.z = (Math.cos(mouse.x * Math.PI) * 10)
  camera.position.y = mouse.y
  // camera.lookAt(mainText.position)

  // head.rotation.set(elapsedTime * -0.01,0,5)

  render()
};

animate();

/* --------------------------------- Raw JS --------------------------------- */

// Responsive 3D canvas
window.addEventListener('resize', () => {
  // Update sizes
  windowSize.width = window.innerWidth
  windowSize.height = window.innerHeight

  // Update camera
  camera.aspect = windowSize.width / windowSize.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(windowSize.width, windowSize.height)
})

// Detects mouse coordinates
window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX / windowSize.width - 0.5
  mouse.y = -(event.clientY / windowSize.height - 0.5)
})


// Detects mouse's middle button click
// window.addEventListener('mousedown', (event) => {
//   if (event.button == 1 || event.buttons == 4) {
//     console.log('middle mouse');

//   }
// });

// Detects key presses
// window.addEventListener('keydown', function (event) {
//   const key = event.key;
//   console.log(key)

//   if (key === 'a' || key === 'A') {
//     camera.rotation.y += 0.03;
//     console.log('awebo')
//   }else if (key === 'd' || key === 'D'){
//     camera.rotation.y -= 0.03;
//   }

// });

/* ------------------------------ Last.FM Data ------------------------------ */

const lastfmData = fetch('https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=swoephowx&api_key=8d1394415d95c0771ac9f8247cc7ee17&limit=1&nowplaying=true&format=json')
  .then(
    response => response.json()
  )
  .then(data => {
    // Removes quotes from JSON data
    const formattedTrackname = JSON.stringify(data.recenttracks.track[0].name).replace(/["]+/g, '')
    const formattedArtistname = JSON.stringify(data.recenttracks.track[0].artist['#text']).replace(/["]+/g, '')
    document.getElementById("track").textContent = formattedTrackname
    document.getElementById("artist").textContent = formattedArtistname
  });

/* ---------------------------------- gsap ---------------------------------- */

// Animates social links to the top after 500ms

setTimeout(() => {
  for (let i = 1; i <= 8; i++) {
    let link = '.link-' + i
    let linkDom = document.querySelector(`.link-${i}`)
    let speed = 100
    gsap.set(link, {
      visibility: "visible"
    });
    gsap.from(link, {
      duration: 1 * i * .5,
      y: 100,
      opacity: 0
    });
    linkDom.addEventListener("mouseout", () => {
      linkName.textContent = ''
    })
  }
}, 1000)


let linkName = document.querySelector('#linkName')

const linkOne = document.querySelector('.link-4')
linkOne.addEventListener('mouseover', () => {
  linkName.textContent = 'Twitter'
})

const linkTwo = document.querySelector('.link-5')
linkTwo.addEventListener('mouseover', () => {
  linkName.textContent = 'LinkedIn'


})
const linkThree = document.querySelector('.link-6')
linkThree.addEventListener('mouseover', () => {
  linkName.textContent = 'Blog (en español)'

})
const linkFour = document.querySelector('.link-7')
linkFour.addEventListener('mouseover', () => {
  linkName.textContent = 'More links...'
})

let isFar = false

// about animation
const aboutLink = document.getElementById('about')
const aboutText = document.getElementById('aboutText')

var aboutClicked = false

gsap.registerPlugin(CSSPlugin)

about.addEventListener('click', () => {
  aboutClicked = !aboutClicked

  if(isFar){
    gsap.to(projectsText, {
      duration: 0.5,
      left: '-50vw',
      ease: 'sine.inOut',
      opacity:  0
    })
    gsap.to(camera.position, {
      duration: 0.8,
      z: aboutClicked ? 22 : 6,
      ease: 'sine.inOut'
    })
    gsap.to(aboutText, {
      duration: 0.5,
      left: aboutClicked ? '5vw' : '-50vw',
      ease: 'sine.inOut',
      opacity: aboutClicked ? 1 : 0
    })

  }
  gsap.to(camera.position, {
    duration: 0.8,
    z: aboutClicked ? 11 : 6,
    ease: 'sine.inOut'
  })
  gsap.to(aboutText, {
    duration: 0.5,
    left: aboutClicked ? '5vw' : '-50vw',
    ease: 'sine.inOut',
    opacity: aboutClicked ? 1 : 0
  })
  if(aboutClicked){
  isFar = true
  }

})

// projects animation
const projectsLink = document.getElementById('projects')
const projectsText = document.getElementById('projectsText')

var projectsClicked = false

gsap.registerPlugin(CSSPlugin)

projectsLink.addEventListener('click', () => {
  projectsClicked = !projectsClicked
  if(isFar){
    gsap.to(aboutText, {
      duration: 0.5,
      left: '-50vw',
      ease: 'sine.inOut',
      opacity: 0
    })
    gsap.to(camera.position, {
      duration: 0.8,
      z:  -11,
      ease: 'sine.inOut'
    })
    gsap.to(projectsText, {
      duration: 0.5,
      left: '5vw',
      ease: 'sine.inOut',
      opacity: 1
    })
    isFar = false


  }else {
  gsap.to(camera.position, {
    duration: 0.8,
    z: projectsClicked ? -11 : 6,
    ease: 'sine.inOut'
  })
  gsap.to(projectsText, {
    duration: 0.5,
    left: projectsClicked ? '5vw' : '-50vw',
    ease: 'sine.inOut',
    opacity: projectsClicked ? 1 : 0
  })}
})