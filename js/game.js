(() => {
'use strict';
// ---------------------------------------------------------------------------
// LUMINHIVE — 3D BEE ECONOMY SIMULATOR (Three.js)
// ---------------------------------------------------------------------------

// ======================== SOUND SYNTHESIZER ========================
class SoundSynth {
  constructor(){this.ctx=null;this.masterGain=null;this.muted=true;this.ambienceStarted=false;}
  init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.masterGain=this.ctx.createGain();this.masterGain.gain.value=0;this.masterGain.connect(this.ctx.destination);this.startBgm();this.startAmbience();}catch(e){console.error(e);}}
  setMute(m){this.muted=m;if(this.masterGain&&this.ctx){this.masterGain.gain.setTargetAtTime(m?0:0.20,this.ctx.currentTime,0.1);}}
  _tone(freq,dur,vol=0.04,type='sine'){if(!this.ctx||this.muted)return;const now=this.ctx.currentTime;const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,now);g.gain.setValueAtTime(vol,now);g.gain.exponentialRampToValueAtTime(0.001,now+dur);o.connect(g);g.connect(this.masterGain);o.start(now);o.stop(now+dur+0.01);}
  playFootstep(){if(!this.ctx||this.muted)return;const now=this.ctx.currentTime;const bs=this.ctx.sampleRate*0.04;const buf=this.ctx.createBuffer(1,bs,this.ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<bs;i++)d[i]=Math.random()*2-1;const n=this.ctx.createBufferSource();n.buffer=buf;const f=this.ctx.createBiquadFilter();f.type='bandpass';f.frequency.value=650;f.Q.value=5;const g=this.ctx.createGain();g.gain.setValueAtTime(0.025,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.035);n.connect(f);f.connect(g);g.connect(this.masterGain);n.start(now);}
  playPollenPop(){this._tone(600,0.06,0.05);if(this.ctx&&!this.muted){const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type='sine';const now=this.ctx.currentTime;o.frequency.setValueAtTime(600,now);o.frequency.exponentialRampToValueAtTime(1400,now+0.05);g.gain.setValueAtTime(0.05,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.055);o.connect(g);g.connect(this.masterGain);o.start(now);o.stop(now+0.06);}}
  playHoneyChime(){if(!this.ctx||this.muted)return;const now=this.ctx.currentTime;[880,1320].forEach((freq,i)=>{const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(freq,now+i*0.04);g.gain.setValueAtTime(0.04,now+i*0.04);g.gain.exponentialRampToValueAtTime(0.001,now+i*0.04+0.12);o.connect(g);g.connect(this.masterGain);o.start(now+i*0.04);o.stop(now+i*0.04+0.15);});}
  playBell(){if(!this.ctx||this.muted)return;const now=this.ctx.currentTime;[1046.5,1567.98].forEach(f=>{const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.05,now);g.gain.exponentialRampToValueAtTime(0.001,now+0.2);o.connect(g);g.connect(this.masterGain);o.start(now);o.stop(now+0.22);});}
  playSwarmToggle(isSwarm){this._tone(isSwarm?523:784,0.15,0.04);}
  playCasino(win){if(!this.ctx||this.muted)return;const now=this.ctx.currentTime;if(win){[659.25,783.99,1046.5,1318.51].forEach((f,i)=>{const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f,now+i*0.05);g.gain.setValueAtTime(0.04,now+i*0.05);g.gain.exponentialRampToValueAtTime(0.001,now+i*0.05+0.15);o.connect(g);g.connect(this.masterGain);o.start(now+i*0.05);o.stop(now+i*0.05+0.18);});}else{this._tone(220,0.35,0.05,'triangle');}}
  playSpinTick(){this._tone(1200,0.015,0.012,'triangle');}
  playClaimHive(){if(!this.ctx||this.muted)return;const now=this.ctx.currentTime;[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.06,now+i*0.12);g.gain.exponentialRampToValueAtTime(0.001,now+i*0.12+0.4);o.connect(g);g.connect(this.masterGain);o.start(now+i*0.12);o.stop(now+i*0.12+0.45);});}
  startAmbience(){if(!this.ctx||this.ambienceStarted)return;this.ambienceStarted=true;const sampleCount=this.ctx.sampleRate*2;const buf=this.ctx.createBuffer(1,sampleCount,this.ctx.sampleRate);const d=buf.getChannelData(0);let last=0;for(let i=0;i<sampleCount;i++){last=last*0.985+(Math.random()*2-1)*0.015;d[i]=last;}const wind=this.ctx.createBufferSource();wind.buffer=buf;wind.loop=true;const low=this.ctx.createBiquadFilter();low.type='lowpass';low.frequency.value=520;const windGain=this.ctx.createGain();windGain.gain.value=0.024;wind.connect(low);low.connect(windGain);windGain.connect(this.masterGain);wind.start();const buzz=()=>{if(!this.ctx)return;const now=this.ctx.currentTime;for(let i=0;i<2;i++){const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type='sawtooth';const start=now+i*0.38;const base=96+Math.random()*38;o.frequency.setValueAtTime(base,start);o.frequency.linearRampToValueAtTime(base+18+Math.random()*16,start+1.2);g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(0.006,start+0.35);g.gain.linearRampToValueAtTime(0,start+1.35);o.connect(g);g.connect(this.masterGain);o.start(start);o.stop(start+1.45);}setTimeout(buzz,3600+Math.random()*4200);};buzz();}
  startBgm(){const play=()=>{if(!this.ctx)return;const now=this.ctx.currentTime;const chords=[[87.31,130.81,174.61],[77.78,116.54,155.56],[69.3,103.83,138.59],[77.78,116.54,155.56]];const dur=4;chords.forEach((ch,ci)=>{ch.forEach(f=>{const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.type='sine';o.frequency.value=f;const s=now+ci*dur,e=s+dur;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(0.008,s+1.2);g.gain.setValueAtTime(0.008,e-1.2);g.gain.linearRampToValueAtTime(0,e);o.connect(g);g.connect(this.masterGain);o.start(s);o.stop(e);});});setTimeout(play,dur*4*1000-100);};play();}
}
const synth = new SoundSynth();

// ======================== HELPERS ========================
const rand  = (a,b) => a + Math.random() * (b - a);
const clamp = (v,a,b) => v < a ? a : v > b ? b : v;
const dist2 = (x1,z1,x2,z2) => Math.hypot(x1-x2, z1-z2);
const lerp  = (a,b,t) => a + (b-a) * t;
// Frame-rate-independent smoothing factor: a per-frame lerp constant `k` (tuned at
// 60fps) is converted to the equivalent factor for the actual elapsed `dt`, so
// camera/rotation easing feels identical on 60Hz and 144Hz displays.
const smoothK = (k, dt) => 1 - Math.pow(1 - k, dt * 60);
const sqDist = (x1, z1, x2, z2) => {
  const dx = x1 - x2, dz = z1 - z2;
  return dx * dx + dz * dz;
};
const windUniforms = [];

// ======================== THREE.JS SCENE SETUP ========================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x6CB4EE);
scene.fog = new THREE.Fog(0x6CB4EE, 100, 200);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 25, 60);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
const renderQuality = {
  maxDpr: Math.min(window.devicePixelRatio || 1, 1.15),
  minDpr: Math.min(window.devicePixelRatio || 1, 0.72),
  dpr: Math.min(window.devicePixelRatio || 1, 1.15),
  // Runtime DPR changes are disabled: calling renderer.setPixelRatio() reallocates
  // the WebGL drawing buffer, which flashes the whole canvas. When frame work-time
  // hovered near the thresholds the DPR flapped up/down, producing a visible flash
  // every few seconds. We keep a stable, sharp pixel ratio instead.
  adaptive: false,
  averageWorkMs: 0,
  samples: 0,
  cooldown: 0,
  contextLost: false,
  wasRunning: false,
};

function applyRenderPixelRatio() {
  renderer.setPixelRatio(renderQuality.dpr);
}

renderer.setSize(window.innerWidth, window.innerHeight);
applyRenderPixelRatio();
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('gameContainer').appendChild(renderer.domElement);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderQuality.maxDpr = Math.min(window.devicePixelRatio || 1, 1.15);
  renderQuality.minDpr = Math.min(window.devicePixelRatio || 1, 0.72);
  renderQuality.dpr = clamp(renderQuality.dpr, renderQuality.minDpr, renderQuality.maxDpr);
  applyRenderPixelRatio();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.domElement.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  renderQuality.contextLost = true;
  renderQuality.wasRunning = game.running;
  game.running = false;
  showTutorial('Graphics context paused. Luminhive will resume when the browser restores it.');
});

renderer.domElement.addEventListener('webglcontextrestored', () => {
  renderQuality.contextLost = false;
  game.running = renderQuality.wasRunning;
  last = performance.now();
  simulationAccumulator = 0;
  showTutorial('Graphics restored.');
});

// Lighting
const ambientLight = new THREE.AmbientLight(0x99aacc, 0.7);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xfff5dd, 1.3);
sunLight.position.set(40, 60, 30);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 1024;
sunLight.shadow.mapSize.height = 1024;
sunLight.shadow.camera.near = 1;
sunLight.shadow.camera.far = 200;
sunLight.shadow.camera.left = -100;
sunLight.shadow.camera.right = 100;
sunLight.shadow.camera.top = 100;
sunLight.shadow.camera.bottom = -100;
scene.add(sunLight);

const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x3a5a1e, 0.4);
scene.add(hemiLight);

// ======================== 3D MODEL FACTORIES ========================

function createMeadowTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(size * 0.52, size * 0.45, 20, size * 0.5, size * 0.5, size * 0.72);
  grad.addColorStop(0, '#77ad42');
  grad.addColorStop(0.55, '#5f9b36');
  grad.addColorStop(1, '#3e7e2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 900; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const len = 4 + Math.random() * 14;
    const angle = -0.6 + Math.random() * 1.2;
    ctx.strokeStyle = Math.random() > 0.45 ? 'rgba(184, 220, 95, 0.16)' : 'rgba(23, 86, 31, 0.18)';
    ctx.lineWidth = 0.7 + Math.random() * 1.1;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
    ctx.stroke();
  }

  for (let i = 0; i < 90; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 10 + Math.random() * 34;
    const patch = ctx.createRadialGradient(x, y, 0, x, y, r);
    patch.addColorStop(0, 'rgba(42, 115, 39, 0.28)');
    patch.addColorStop(0.72, 'rgba(42, 115, 39, 0.11)');
    patch.addColorStop(1, 'rgba(42, 115, 39, 0)');
    ctx.fillStyle = patch;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < 180; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    ctx.fillStyle = ['rgba(255, 224, 76, 0.5)', 'rgba(255, 116, 160, 0.42)', 'rgba(84, 226, 206, 0.38)'][i % 3];
    ctx.beginPath();
    ctx.arc(x, y, 0.8 + Math.random() * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function createTreeModel(type) {
  const group = new THREE.Group();
  
  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.45, 4.5, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4d321d, roughness: 0.9 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 2.25;
  trunk.castShadow = true;
  trunk.receiveShadow = true;
  group.add(trunk);
  
  if (type === 'pine') {
    // Stacked cones for pine
    const coneColors = [0x1e3f20, 0x2d5c30, 0x3d7a40];
    let y = 2.4;
    let radius = 1.9;
    for (let i = 0; i < 3; i++) {
      const coneGeo = new THREE.ConeGeometry(radius, 1.8, 6);
      const coneMat = new THREE.MeshStandardMaterial({ color: coneColors[i], roughness: 0.85 });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = y;
      cone.castShadow = true;
      cone.receiveShadow = true;
      group.add(cone);
      y += 1.25;
      radius *= 0.72;
    }
  } else {
    // Stacked shapes for Oak
    const foliageGeo = new THREE.DodecahedronGeometry(1.6, 0);
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e6a4f, roughness: 0.8 });
    
    const foliage1 = new THREE.Mesh(foliageGeo, foliageMat);
    foliage1.position.y = 4.2;
    foliage1.castShadow = true;
    group.add(foliage1);
    
    const puffGeo = new THREE.DodecahedronGeometry(1.1, 0);
    const foliage2 = new THREE.Mesh(puffGeo, foliageMat);
    foliage2.position.set(-1.0, 3.8, 0.5);
    foliage2.castShadow = true;
    group.add(foliage2);
    
    const foliage3 = new THREE.Mesh(puffGeo, foliageMat);
    foliage3.position.set(0.9, 4.4, -0.6);
    foliage3.castShadow = true;
    group.add(foliage3);
  }
  
  return group;
}

const butterflyWingGeo = (() => {
  const geo = new THREE.CircleGeometry(0.16, 8);
  geo.scale(1.15, 0.62, 1);
  return geo;
})();
const butterflyBodyGeo = new THREE.CylinderGeometry(0.025, 0.035, 0.26, 6);
const butterflyBodyMat = new THREE.MeshLambertMaterial({ color: 0x2f2318 });

function createButterflyModel(colorHex) {
  const group = new THREE.Group();
  const wingMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.82,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  const body = new THREE.Mesh(butterflyBodyGeo, butterflyBodyMat);
  body.rotation.x = Math.PI / 2;
  group.add(body);
  const wingL = new THREE.Mesh(butterflyWingGeo, wingMat);
  wingL.position.set(0.12, 0.02, 0);
  wingL.rotation.y = 0.35;
  group.add(wingL);
  const wingR = new THREE.Mesh(butterflyWingGeo, wingMat);
  wingR.position.set(-0.12, 0.02, 0);
  wingR.rotation.y = -0.35;
  group.add(wingR);
  group.userData.wingL = wingL;
  group.userData.wingR = wingR;
  group.scale.setScalar(0.9);
  return group;
}

function spawnAmbientButterflies() {
  game.butterflies = [];
  const palette = [0xffcc00, 0x28d7c5, 0xff7aa6, 0xffffff, 0x9b8cff];
  let index = 0;
  for (const field of FIELD_DEFS) {
    const count = field.id === 'starter' ? 5 : 3;
    for (let i = 0; i < count; i++) {
      const model = createButterflyModel(palette[(index + i) % palette.length]);
      const orbit = field.radius * rand(0.24, 0.74);
      const phase = Math.random() * Math.PI * 2;
      const baseY = field.elevation || 0;
      model.position.set(field.center.x + Math.cos(phase) * orbit, baseY + 1.2, field.center.z + Math.sin(phase) * orbit);
      scene.add(model);
      game.butterflies.push({
        model,
        center: field.center,
        fieldId: field.id,
        orbit,
        phase,
        speed: rand(0.22, 0.46),
        yPhase: Math.random() * Math.PI * 2,
        flapPhase: Math.random() * Math.PI * 2,
      });
    }
    index += count;
  }
}

function randomPointInField(field, margin = 0.86) {
  const a = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * field.radius * margin;
  return {
    x: field.center.x + Math.cos(a) * r,
    z: field.center.z + Math.sin(a) * r
  };
}

function createFieldSetPieces(group, field, baseY = 0) {
  const surfaceAt = (x, z) => terrainHeightAt(x, z);
  const addTree = (x, z, type = 'oak', scale = 0.9) => {
    const tree = createTreeModel(type);
    tree.position.set(x, surfaceAt(x, z), z);
    tree.rotation.y = Math.random() * Math.PI * 2;
    tree.scale.set(scale, scale * rand(0.94, 1.18), scale);
    group.add(tree);
    return tree;
  };
  const addRock = (x, z, scale = 1, color = 0x8c8c82) => {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(scale, 0),
      new THREE.MeshStandardMaterial({ color, roughness: 0.92, flatShading: true })
    );
    rock.position.set(x, surfaceAt(x, z) + scale * 0.42, z);
    rock.rotation.set(rand(-0.25, 0.25), Math.random() * Math.PI, rand(-0.25, 0.25));
    rock.scale.set(1.25, 0.62, 0.9);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
    return rock;
  };
  const radial = (angle, distance) => ({
    x: field.center.x + Math.cos(angle) * distance,
    z: field.center.z + Math.sin(angle) * distance,
  });

  if (field.id === 'starter') {
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x7b5727, roughness: 0.9 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x4c3219, roughness: 0.92 });
    const bench = new THREE.Group();
    const plank = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.28, 0.8), benchMat);
    plank.position.y = baseY + 0.58;
    plank.castShadow = true;
    bench.add(plank);
    for (const x of [-1.75, 1.75]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.15, 0.7, 6), legMat);
      leg.position.set(x, baseY + 0.28, 0);
      leg.castShadow = true;
      bench.add(leg);
    }
    const p = radial(-Math.PI * 0.8, field.radius + 3.6);
    bench.position.set(p.x, 0, p.z);
    bench.rotation.y = 0.18;
    group.add(bench);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.25;
      const p2 = radial(a, field.radius + 1.1 + (i % 2) * 0.55);
      addRock(p2.x, p2.z, 0.36 + Math.random() * 0.18, 0xd7c184);
    }
  } else if (field.id === 'yellow') {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.18;
      if (a > Math.PI * 0.54 && a < Math.PI * 0.86) continue; // leave the footpath approach open
      const p = radial(a, field.radius + rand(2.2, 4.8));
      addTree(p.x, p.z, 'oak', rand(0.7, 1.05));
    }
    const sunStone = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.65, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xd9a32b, roughness: 0.82, emissive: 0x4a2500, emissiveIntensity: 0.09 })
    );
    const p = radial(-0.65, field.radius * 0.42);
    sunStone.position.set(p.x, baseY + 0.25, p.z);
    sunStone.rotation.y = Math.PI / 8;
    sunStone.castShadow = true;
    sunStone.receiveShadow = true;
    group.add(sunStone);
  } else if (field.id === 'blue_dew') {
    const pond = new THREE.Group();
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(8.2, 42),
      new THREE.MeshBasicMaterial({ color: 0x43d8ee, transparent: true, opacity: 0.46, side: THREE.DoubleSide, depthWrite: false })
    );
    water.rotation.x = -Math.PI / 2;
    water.scale.set(1.28, 0.62, 1);
    water.position.y = 0.085;
    pond.add(water);
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(7.35, 0.22, 6, 48),
      new THREE.MeshStandardMaterial({ color: 0x314f59, roughness: 0.94 })
    );
    rim.rotation.x = Math.PI / 2;
    rim.scale.set(1.28, 0.62, 1);
    rim.position.y = 0.12;
    pond.add(rim);
    const p = radial(-0.95, field.radius + 4.2);
    pond.position.set(p.x, surfaceAt(p.x, p.z), p.z);
    group.add(pond);
    for (let i = 0; i < 11; i++) {
      const a = -0.95 + rand(-0.7, 0.7);
      const d = field.radius + rand(1.2, 6.4);
      const r = radial(a, d);
      const reed = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, rand(0.9, 1.6), 4),
        new THREE.MeshLambertMaterial({ color: 0x2f8c5d })
      );
      reed.position.set(r.x, surfaceAt(r.x, r.z) + 0.45, r.z);
      reed.rotation.set(rand(-0.18, 0.18), Math.random() * Math.PI, rand(-0.18, 0.18));
      group.add(reed);
    }
  } else if (field.id === 'rare') {
    const island = new THREE.Group();
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(7.6, 8.5, 0.8, 12),
      new THREE.MeshStandardMaterial({ color: 0x6f4a88, roughness: 0.9, flatShading: true })
    );
    const cliff = new THREE.Mesh(
      new THREE.CylinderGeometry(7.4, 3.4, 4.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x3b2547, roughness: 0.94, flatShading: true })
    );
    top.position.y = baseY - 0.42;
    cliff.position.y = baseY - 2.8;
    island.add(top, cliff);
    const p = radial(0.8, field.radius + 8.0);
    island.position.set(p.x, 0, p.z);
    island.rotation.y = 0.35;
    group.add(island);
    for (let i = 0; i < 7; i++) {
      const p2 = radial(0.8 + rand(-0.45, 0.45), field.radius + rand(4.0, 9.2));
      addRock(p2.x, p2.z, rand(0.42, 0.8), 0xd946ef);
    }
  } else if (field.id === 'night') {
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      if (a > 0.2 && a < 1.1) continue;
      const p = radial(a, field.radius + rand(2.5, 5.5));
      addTree(p.x, p.z, 'pine', rand(0.8, 1.16));
    }
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xb9d8ff, transparent: true, opacity: 0.82, side: THREE.DoubleSide });
    for (let i = 0; i < 6; i++) {
      const p = radial(-2.15 + i * 0.16, field.radius * 0.42 + i * 0.5);
      const shard = new THREE.Mesh(new THREE.ConeGeometry(0.28, 1.8 + i * 0.12, 5), moonMat);
      shard.position.set(p.x, baseY + 0.9, p.z);
      shard.rotation.set(rand(-0.1, 0.1), Math.random() * Math.PI, rand(-0.1, 0.1));
      group.add(shard);
    }
  }
}

// Decor (boulders, shrubs, grass, mushrooms) must not crowd the hives or sit on
// top of the planted field plots — keep those zones clear.
function inDecorKeepOut(x, z) {
  if (z > 78 && Math.abs(x) < 54) return true;                 // apiary hive row + deck
  for (const f of FIELD_DEFS) {
    const dx = x - f.center.x, dz = z - f.center.z;
    if (dx * dx + dz * dz < (f.radius + 2.5) * (f.radius + 2.5)) return true;
  }
  if (dist2(x, z, SHOP_POS.x, SHOP_POS.z) < 7) return true;
  if (dist2(x, z, TRADE_POS.x, TRADE_POS.z) < 8) return true;
  if (dist2(x, z, PLAYER_START.x, PLAYER_START.z) < 9) return true;
  return false;
}

function createIsland() {
  const group = new THREE.Group();
  const islandRadius = ISLE_RADIUS;

  // Main ground disc
  const groundGeo = new THREE.CircleGeometry(islandRadius, 96);
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x86b84b, map: createMeadowTexture() });
  groundMat.map.repeat.set(8, 8);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  group.add(ground);

  // Cliff edge
  const cliffGeo = new THREE.CylinderGeometry(islandRadius, islandRadius - 5, 14, 96, 1, true);
  const cliffMat = new THREE.MeshLambertMaterial({ color: 0x6b5a3a, side: THREE.DoubleSide });
  const cliff = new THREE.Mesh(cliffGeo, cliffMat);
  cliff.position.y = -7;
  group.add(cliff);

  // Bottom cap
  const botGeo = new THREE.CircleGeometry(islandRadius - 5, 96);
  const botMat = new THREE.MeshLambertMaterial({ color: 0x4a3a25 });
  const bot = new THREE.Mesh(botGeo, botMat);
  bot.rotation.x = Math.PI / 2;
  bot.position.y = -14;
  group.add(bot);

  // Instanced grass blades (lush & color varied)
  const bladeGeo = new THREE.ConeGeometry(0.14, 0.85, 4);
  const bladeMat = new THREE.MeshLambertMaterial({ color: 0x5a9a35 });
  bladeMat.onBeforeCompile = shader => {
    shader.uniforms.uWindTime = { value: 0 };
    windUniforms.push(shader.uniforms.uWindTime);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uWindTime;')
      .replace('#include <begin_vertex>', [
        '#include <begin_vertex>',
        '#ifdef USE_INSTANCING',
        '  float windSeed = instanceMatrix[3].x * 0.08 + instanceMatrix[3].z * 0.11;',
        '#else',
        '  float windSeed = position.x * 0.08 + position.z * 0.11;',
        '#endif',
        'float windWave = sin(uWindTime * 1.35 + windSeed) + 0.45 * sin(uWindTime * 2.15 + windSeed * 1.7);',
        'float bladeMask = smoothstep(-0.18, 0.42, position.y);',
        'transformed.x += windWave * 0.055 * bladeMask;',
        'transformed.z += cos(uWindTime * 1.1 + windSeed) * 0.035 * bladeMask;'
      ].join('\n'));
  };
  const grassCount = 3500;
  const grassMesh = new THREE.InstancedMesh(bladeGeo, bladeMat, grassCount);
  const dummy = new THREE.Object3D();
  const c1 = new THREE.Color(0x427c2b);
  const c2 = new THREE.Color(0x76b542);
  
  for (let i = 0; i < grassCount; i++) {
    let a, rr, gx, gz, tries = 0;
    do {
      a = Math.random() * Math.PI * 2;
      rr = Math.sqrt(Math.random()) * (islandRadius - 8);
      gx = Math.cos(a) * rr; gz = Math.sin(a) * rr;
    } while (inDecorKeepOut(gx, gz) && ++tries < 6);
    const h = 0.5 + Math.random() * 0.5;
    dummy.position.set(gx, inDecorKeepOut(gx, gz) ? -5 : h*0.5, gz);
    dummy.rotation.set((Math.random()-0.5)*0.2, Math.random()*Math.PI, (Math.random()-0.5)*0.2);
    dummy.scale.set(1, 0.6+Math.random()*0.8, 1);
    dummy.updateMatrix();
    grassMesh.setMatrixAt(i, dummy.matrix);
    
    // Vary coloring
    const color = c1.clone().lerp(c2, Math.random());
    grassMesh.setColorAt(i, color);
  }
  grassMesh.instanceMatrix.needsUpdate = true;
  group.add(grassMesh);

  // Tiny wildflowers as instanced color clusters
  const flowerDotGeo = new THREE.SphereGeometry(0.08, 6, 4);
  const flowerDotColors = [0xffda4d, 0xff6f9d, 0x55e1c9, 0x9bd85d];
  for (const color of flowerDotColors) {
    const dotMat = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.12 });
    const count = 110;
    const dots = new THREE.InstancedMesh(flowerDotGeo, dotMat, count);
    for (let i = 0; i < count; i++) {
      let a, rr, dx, dz, tries = 0;
      do {
        a = Math.random() * Math.PI * 2;
        rr = Math.sqrt(Math.random()) * (islandRadius - 9);
        dx = Math.cos(a) * rr; dz = Math.sin(a) * rr;
      } while (inDecorKeepOut(dx, dz) && ++tries < 6);
      dummy.position.set(dx, inDecorKeepOut(dx, dz) ? -5 : 0.12 + Math.random() * 0.1, dz);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      const s = 0.7 + Math.random() * 0.9;
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      dots.setMatrixAt(i, dummy.matrix);
    }
    dots.instanceMatrix.needsUpdate = true;
    group.add(dots);
  }

  // Honeycomb pavers give the meadow intentional paths. Two instanced layers
  // (dark base + warm top) keep the stones readable and stop the path from
  // looking like flat random stamps on the grass.
  const paverTopGeo = new THREE.CylinderGeometry(0.44, 0.4, 0.07, 6);
  const paverBaseGeo = new THREE.CylinderGeometry(0.5, 0.54, 0.08, 6);
  const paverTopMat = new THREE.MeshStandardMaterial({ color: 0xc99e4b, roughness: 0.9, metalness: 0.015, emissive: 0x160c00, emissiveIntensity: 0.02 });
  const paverBaseMat = new THREE.MeshStandardMaterial({ color: 0x66502b, roughness: 0.96 });
  const paverCount = 86;
  const pavers = new THREE.InstancedMesh(paverTopGeo, paverTopMat, paverCount);
  const paverBases = new THREE.InstancedMesh(paverBaseGeo, paverBaseMat, paverCount);
  let paverIndex = 0;
  const fieldGate = (field, from, margin = 2.7) => {
    const dx = from.x - field.center.x;
    const dz = from.z - field.center.z;
    const len = Math.hypot(dx, dz) || 1;
    return {
      x: field.center.x + (dx / len) * (field.radius + margin),
      z: field.center.z + (dz / len) * (field.radius + margin),
    };
  };
  const placePath = (from, to, spacing = 2.45, bow = 0) => {
    const routeLen = dist2(from.x, from.z, to.x, to.z);
    const steps = Math.max(2, Math.ceil(routeLen / spacing) + 1);
    for (let i = 0; i < steps && paverIndex < paverCount; i++) {
      const t = i / Math.max(1, steps - 1);
      const dx = to.x - from.x;
      const dz = to.z - from.z;
      const len = Math.hypot(dx, dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;
      const curve = Math.sin(t * Math.PI) * bow;
      const micro = Math.sin(t * Math.PI * 4.0) * 0.24;
      const x = lerp(from.x, to.x, t) + nx * (curve + micro);
      const z = lerp(from.z, to.z, t) + nz * (curve + micro);
      const y = terrainHeightAt(x, z);
      const angle = Math.atan2(dx, dz) + Math.PI / 6 + rand(-0.16, 0.16);
      const s = 0.86 + Math.random() * 0.18;
      dummy.position.set(x, y + 0.045, z);
      dummy.rotation.set(0, angle, 0);
      dummy.scale.set(s * rand(0.92, 1.08), 1, s * rand(0.9, 1.06));
      dummy.updateMatrix();
      paverBases.setMatrixAt(paverIndex, dummy.matrix);
      dummy.position.y = y + 0.112;
      dummy.scale.set(s * rand(0.86, 1.0), 1, s * rand(0.84, 0.98));
      dummy.updateMatrix();
      pavers.setMatrixAt(paverIndex++, dummy.matrix);
    }
  };
  const hiveApron = { x: HIVE_POS.x, z: HIVE_POS.z - 6.2 };
  const starterGate = fieldGate(FIELD_DEFS[0], hiveApron, 2.8);
  const yellowGate = fieldGate(FIELD_DEFS[1], starterGate, 3.1);
  const blueGate = fieldGate(FIELD_DEFS[2], starterGate, 3.1);
  const nightGate = fieldGate(FIELD_DEFS[4], TRADE_POS, 3.0);
  const royalGate = fieldGate(FIELD_DEFS[3], TRADE_POS, 3.6);
  placePath(PLAYER_START, hiveApron, 2.65, 0.65);
  placePath(hiveApron, TRADE_POS, 2.9, -0.95);
  placePath(hiveApron, starterGate, 2.75, 0.55);
  placePath(starterGate, yellowGate, 3.05, 1.25);
  placePath(starterGate, blueGate, 3.05, -1.35);
  placePath(TRADE_POS, nightGate, 3.15, 1.45);
  placePath(TRADE_POS, royalGate, 3.1, -1.1);
  pavers.count = paverIndex;
  paverBases.count = paverIndex;
  pavers.instanceMatrix.needsUpdate = true;
  paverBases.instanceMatrix.needsUpdate = true;
  pavers.castShadow = true;
  pavers.receiveShadow = true;
  paverBases.receiveShadow = true;
  group.add(paverBases, pavers);

  // Visible field zones communicate the gather route from the edge hive.
  for (const field of FIELD_DEFS) {
    const zoneGeo = new THREE.CircleGeometry(field.radius, 44);
    
    // Choose soil colors and border stones based on field type
    let soilColor = 0x5a483a;
    let stoneColor = 0x6e6a62;
    let glowColor = 0xffcc00;
    
    if (field.id === 'starter') {
      soilColor = 0x3f5520; stoneColor = 0x6c6c6c; glowColor = 0xff88aa;
    } else if (field.id === 'yellow') {
      soilColor = 0x5e451a; stoneColor = 0x827054; glowColor = 0xffcc00;
    } else if (field.id === 'blue_dew') {
      soilColor = 0x24495a; stoneColor = 0x34464c; glowColor = 0x00e5ff;
    } else if (field.id === 'rare') {
      soilColor = 0x51225a; stoneColor = 0x583e5a; glowColor = 0xd946ef;
    } else if (field.id === 'night') {
      soilColor = 0x1c1738; stoneColor = 0x302747; glowColor = 0x7c5cff;
    }

    const baseY = field.elevation || 0;

    // Raised plateau (the "mountain" fields): a sloped rocky frustum under the
    // plot, matching terrainHeightAt() so the player walks up onto it.
    if (baseY > 0) {
      const topR = field.radius + 0.6;
      const botR = field.radius + 0.6 + baseY * 1.7 + 4;
      const mound = new THREE.Mesh(
        new THREE.CylinderGeometry(topR, botR, baseY, 48),
        new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.96, metalness: 0.02, flatShading: true })
      );
      mound.position.set(field.center.x, baseY / 2, field.center.z);
      mound.receiveShadow = true; mound.castShadow = true;
      group.add(mound);
      // Grassy rim cap so the plateau top blends to the meadow palette.
      const rim = new THREE.Mesh(
        new THREE.CylinderGeometry(topR + 0.1, topR + 0.1, 0.25, 48),
        new THREE.MeshLambertMaterial({ color: 0x6f9e3f })
      );
      rim.position.set(field.center.x, baseY - 0.05, field.center.z);
      group.add(rim);
    }

    const zoneMat = new THREE.MeshStandardMaterial({
      color: soilColor,
      roughness: 0.92,
      metalness: 0.04,
      side: THREE.DoubleSide
    });
    const zone = new THREE.Mesh(zoneGeo, zoneMat);
    zone.rotation.x = -Math.PI / 2;
    zone.position.set(field.center.x, baseY + 0.02, field.center.z);
    zone.receiveShadow = true;
    group.add(zone);

    // Field interiors now use only real collectible flowers. Large set pieces
    // stay outside/around fields so flower-like objects no longer confuse
    // collection feedback.
    createFieldSetPieces(group, field, baseY);

    // Stone border bricks enclosing the field
    const brickGeo = new THREE.BoxGeometry(0.55, 0.18, 0.95);
    const stoneMat = new THREE.MeshStandardMaterial({ color: stoneColor, roughness: 0.88 });
    const borderCount = Math.floor(field.radius * 2 * Math.PI / 1.05) || 12;
    const borderBricks = new THREE.InstancedMesh(brickGeo, stoneMat, borderCount);
    borderBricks.castShadow = true;
    borderBricks.receiveShadow = true;
    const gemCount = Math.ceil(borderCount / 8);
    const borderGems = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.14, 0.14, 0.14),
      new THREE.MeshBasicMaterial({ color: glowColor }),
      gemCount
    );
    let gemIndex = 0;
    for (let j = 0; j < borderCount; j++) {
      const angle = (j / borderCount) * Math.PI * 2;
      const bx = field.center.x + Math.cos(angle) * field.radius;
      const bz = field.center.z + Math.sin(angle) * field.radius;

      dummy.position.set(bx, baseY + 0.09, bz);
      dummy.rotation.set(0, -angle, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      borderBricks.setMatrixAt(j, dummy.matrix);

      // Every 8th brick gets a small glowing colored crystal
      if (j % 8 === 0) {
        dummy.position.set(bx, baseY + 0.22, bz);
        dummy.rotation.set(Math.random(), Math.random(), Math.random());
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        borderGems.setMatrixAt(gemIndex++, dummy.matrix);
      }
    }
    borderBricks.instanceMatrix.needsUpdate = true;
    borderGems.instanceMatrix.needsUpdate = true;
    group.add(borderBricks, borderGems);

    // Glowing perimeter ring in the field's signature colour — strong identity.
    const haloGeo = new THREE.RingGeometry(field.radius - 0.55, field.radius + 0.15, 64);
    const halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({
      color: glowColor, transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false
    }));
    halo.rotation.x = -Math.PI / 2;
    halo.position.set(field.center.x, baseY + 0.06, field.center.z);
    group.add(halo);

    // Tinted ambient light so each field's colour washes its own ground/flora.
    const fieldGlow = new THREE.PointLight(glowColor, field.id === 'night' ? 0.9 : 0.55, field.radius * 2.4, 2);
    fieldGlow.position.set(field.center.x, baseY + 4.5, field.center.z);
    group.add(fieldGlow);

    // Named signpost at the field edge facing the island centre.
    const toCenter = Math.atan2(-field.center.x, -field.center.z);
    const signpost = createFieldSignpost(field);
    signpost.position.set(
      field.center.x + Math.sin(toCenter) * (field.radius + 1.6),
      baseY,
      field.center.z + Math.cos(toCenter) * (field.radius + 1.6)
    );
    group.add(signpost);
  }

  // Wax lantern posts act as readable landmarks around the expanded field.
  const postGeo = new THREE.CylinderGeometry(0.09, 0.12, 1.5, 6);
  const postMat = new THREE.MeshLambertMaterial({ color: 0x6b421f });
  const lanternGeo = new THREE.SphereGeometry(0.22, 8, 6);
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffd45a, transparent: true, opacity: 0.8 });
  const lanternCount = 26;
  const posts = new THREE.InstancedMesh(postGeo, postMat, lanternCount);
  const lamps = new THREE.InstancedMesh(lanternGeo, lanternMat, lanternCount);
  for (let i = 0; i < lanternCount; i++) {
    const a = (i / lanternCount) * Math.PI * 2;
    const rr = i % 3 === 0 ? 20 + Math.random() * 8 : 45 + Math.random() * 48;
    const x = Math.cos(a) * rr;
    const z = Math.sin(a) * rr;
    dummy.position.set(x, 0.75, z);
    dummy.rotation.set(0, Math.random() * Math.PI, 0);
    dummy.scale.setScalar(1);
    dummy.updateMatrix();
    posts.setMatrixAt(i, dummy.matrix);
    dummy.position.set(x, 1.55, z);
    dummy.scale.setScalar(1 + Math.random() * 0.35);
    dummy.updateMatrix();
    lamps.setMatrixAt(i, dummy.matrix);
  }
  posts.instanceMatrix.needsUpdate = true;
  lamps.instanceMatrix.needsUpdate = true;
  group.add(posts);
  group.add(lamps);

  // Taller nectar reeds add vertical color so the field is not just a flat texture.
  const reedStemGeo = new THREE.CylinderGeometry(0.045, 0.07, 0.85, 6);
  const reedStemMat = new THREE.MeshLambertMaterial({ color: 0x2f8f4d });
  const reedBudGeo = new THREE.SphereGeometry(0.2, 8, 6);
  const reedBudMats = [
    new THREE.MeshLambertMaterial({ color: 0x28d7c5, emissive: 0x074743, emissiveIntensity: 0.24 }),
    new THREE.MeshLambertMaterial({ color: 0xffd85a, emissive: 0x5a3d00, emissiveIntensity: 0.18 }),
    new THREE.MeshLambertMaterial({ color: 0xff7bb0, emissive: 0x511225, emissiveIntensity: 0.18 }),
  ];
  for (const mat of reedBudMats) {
    const count = 18;
    const stems = new THREE.InstancedMesh(reedStemGeo, reedStemMat, count);
    const buds = new THREE.InstancedMesh(reedBudGeo, mat, count);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const rr = 16 + Math.random() * (islandRadius - 26);
      const x = Math.cos(a) * rr;
      const z = Math.sin(a) * rr;
      const s = 0.8 + Math.random() * 0.9;
      dummy.position.set(x, 0.42 * s, z);
      dummy.rotation.set((Math.random()-0.5)*0.15, Math.random()*Math.PI, (Math.random()-0.5)*0.15);
      dummy.scale.set(s, s, s);
      dummy.updateMatrix();
      stems.setMatrixAt(i, dummy.matrix);
      dummy.position.set(x, 0.92 * s, z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      buds.setMatrixAt(i, dummy.matrix);
    }
    stems.instanceMatrix.needsUpdate = true;
    buds.instanceMatrix.needsUpdate = true;
    group.add(stems);
    group.add(buds);
  }

  const shrubGeo = new THREE.DodecahedronGeometry(0.65, 0);
  const shrubMat = new THREE.MeshLambertMaterial({ color: 0x4f8f34 });
  const shrubCount = 30;
  const shrubs = new THREE.InstancedMesh(shrubGeo, shrubMat, shrubCount);
  for (let i = 0; i < shrubCount; i++) {
    let a, rr, sx, sz, tries = 0;
    do {
      a = Math.random() * Math.PI * 2;
      rr = 24 + Math.random() * (islandRadius - 38);
      sx = Math.cos(a) * rr; sz = Math.sin(a) * rr;
    } while (inDecorKeepOut(sx, sz) && ++tries < 6);
    dummy.position.set(sx, inDecorKeepOut(sx, sz) ? -6 : 0.38, sz);
    dummy.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
    const s = 0.9 + Math.random() * 1.5;
    dummy.scale.set(s * 1.35, s * 0.55, s);
    dummy.updateMatrix();
    shrubs.setMatrixAt(i, dummy.matrix);
  }
  shrubs.instanceMatrix.needsUpdate = true;
  group.add(shrubs);

  // Decorative mushroom clusters break up the grass and make routes more memorable.
  const mushStemGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.35, 6);
  const mushStemMat = new THREE.MeshLambertMaterial({ color: 0xe8d8b6 });
  const mushCapGeo = new THREE.SphereGeometry(0.24, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const mushCapMats = [
    new THREE.MeshLambertMaterial({ color: 0x54d8d0, emissive: 0x0a4c4a, emissiveIntensity: 0.12 }),
    new THREE.MeshLambertMaterial({ color: 0xff7aa6, emissive: 0x4a1024, emissiveIntensity: 0.1 }),
    new THREE.MeshLambertMaterial({ color: 0xffc84a, emissive: 0x513000, emissiveIntensity: 0.1 }),
  ];
  for (let c = 0; c < 18; c++) {
    const a = Math.random() * Math.PI * 2;
    const rr = 28 + Math.random() * (islandRadius - 42);
    const cx = Math.cos(a) * rr;
    const cz = Math.sin(a) * rr;
    if (inDecorKeepOut(cx, cz)) continue;
    for (let j = 0; j < 4; j++) {
      const stem = new THREE.Mesh(mushStemGeo, mushStemMat);
      const cap = new THREE.Mesh(mushCapGeo, mushCapMats[(c + j) % mushCapMats.length]);
      const ox = rand(-1.3, 1.3);
      const oz = rand(-1.3, 1.3);
      const s = 0.65 + Math.random() * 0.65;
      stem.position.set(cx + ox, 0.18 * s, cz + oz);
      stem.scale.setScalar(s);
      cap.position.set(cx + ox, 0.38 * s, cz + oz);
      cap.scale.setScalar(s);
      group.add(stem);
      group.add(cap);
    }
  }

  // Floating side-islands make the sky garden feel larger without changing collision.
  const sideTopMat = new THREE.MeshLambertMaterial({ color: 0x74a943 });
  const sideCliffMat = new THREE.MeshLambertMaterial({ color: 0x60482b });
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + 0.35;
    const rr = islandRadius + 24 + Math.random() * 28;
    const rad = 6 + Math.random() * 8;
    const side = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad * 0.86, 1.2, 14), sideTopMat);
    const clifflet = new THREE.Mesh(new THREE.CylinderGeometry(rad * 0.86, rad * 0.45, 7, 14), sideCliffMat);
    top.position.y = -0.8;
    clifflet.position.y = -5;
    side.add(top);
    side.add(clifflet);
    side.position.set(Math.cos(a) * rr, -2 - Math.random() * 4, Math.sin(a) * rr);
    side.rotation.y = Math.random() * Math.PI;
    group.add(side);
  }

  // Stylized Rock Formations (stacked cairns)
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x828487, roughness: 0.85 });
  for (let i = 0; i < 22; i++) {
    const a = Math.random() * Math.PI * 2;
    const rr = 22 + Math.random() * (islandRadius - 32);
    const rx = Math.cos(a) * rr;
    const rz = Math.sin(a) * rr;

    if (rx*rx + rz*rz < 15*15) continue;
    if (inDecorKeepOut(rx, rz)) continue;            // keep boulders off hives & fields

    const formation = new THREE.Group();
    formation.position.set(rx, 0, rz);
    
    const baseSz = 1.2 + Math.random() * 1.6;
    const rockBase = new THREE.Mesh(new THREE.DodecahedronGeometry(baseSz, 0), rockMat);
    rockBase.position.y = baseSz * 0.4;
    rockBase.rotation.set(Math.random(), Math.random(), Math.random());
    rockBase.castShadow = true;
    rockBase.receiveShadow = true;
    formation.add(rockBase);
    
    if (Math.random() > 0.4) {
      const secSz = baseSz * (0.5 + Math.random()*0.3);
      const rockSec = new THREE.Mesh(new THREE.DodecahedronGeometry(secSz, 0), rockMat);
      rockSec.position.set(rand(-baseSz*0.4, baseSz*0.4), baseSz * 0.7, rand(-baseSz*0.4, baseSz*0.4));
      rockSec.rotation.set(Math.random(), Math.random(), Math.random());
      rockSec.castShadow = true;
      formation.add(rockSec);
    }
    group.add(formation);
  }

  // Stylized Majestic Trees spawning on the outer boundary
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2 + Math.random() * 0.12;
    const rr = 68 + Math.random() * 18;
    const type = i % 2 === 0 ? 'pine' : 'oak';
    const tree = createTreeModel(type);
    
    const x = Math.cos(a) * rr;
    const z = Math.sin(a) * rr;

    // Avoid the old centre and keep the apiary plaza clear of occluding trees
    if (x*x + z*z < 25*25) continue;
    if (z > 56 && Math.abs(x) < 60) continue;

    tree.position.set(x, 0, z);
    tree.rotation.y = Math.random() * Math.PI;
    const s = 1.1 + Math.random() * 0.8;
    tree.scale.set(s, s + Math.random()*0.4, s);
    group.add(tree);
  }

  return group;
}

const flowerAssets = {
  shadowGeo: new THREE.CircleGeometry(0.42, 16),
  plotGeo: new THREE.CylinderGeometry(0.24, 0.34, 0.1, 10),
  tierRingGeo: new THREE.RingGeometry(0.3, 0.44, 24),
  stemGeo: new THREE.CylinderGeometry(0.04, 0.05, 0.7, 6),
  leafGeo: (() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(0.08, 0.06, 0.18, 0);
    shape.quadraticCurveTo(0.08, -0.04, 0, 0);
    return new THREE.ShapeGeometry(shape);
  })(),
  petalGeo: (() => {
    const geo = new THREE.SphereGeometry(0.185, 8, 6);
    geo.scale(1, 0.26, 1.65);
    return geo;
  })(),
  centerGeo: new THREE.SphereGeometry(0.095, 8, 6),
  miniBloomGeo: new THREE.SphereGeometry(0.08, 7, 5),
  miniCenterGeo: new THREE.SphereGeometry(0.035, 6, 4),
  miniStemGeos: new Map(),
  starGeo: (() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const radius = i % 2 === 0 ? 0.18 : 0.075;
      const angle = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  })(),
  pipGeo: new THREE.CylinderGeometry(0.035, 0.035, 0.018, 6),
  glowGeo: new THREE.SphereGeometry(0.26, 8, 6),
  shadowMat: new THREE.MeshBasicMaterial({ color: 0x0c1407, transparent: true, opacity: 0.26, depthWrite: false }),
  stemMat: new THREE.MeshLambertMaterial({ color: 0x2a8835 }),
  leafMat: new THREE.MeshLambertMaterial({ color: 0x33aa44, side: THREE.DoubleSide }),
  centerMat: new THREE.MeshLambertMaterial({ color: 0xffdd00, emissive: 0xffaa00, emissiveIntensity: 0.4 }),
  starMat: new THREE.MeshBasicMaterial({ color: 0xfff36b, transparent: true, opacity: 0.94, side: THREE.DoubleSide }),
  pipMat: new THREE.MeshBasicMaterial({ color: 0xfff36b }),
};
function createFlowerModel(hueStr) {
  const group = new THREE.Group();
  const color = new THREE.Color(hueStr);

  const plotMat = new THREE.MeshStandardMaterial({
    color: 0x65b85d,
    roughness: 0.95,
    emissive: 0x102b13,
    emissiveIntensity: 0.05
  });
  // Restore the original compact circular contact shadow.
  const shadow = new THREE.Mesh(flowerAssets.shadowGeo, flowerAssets.shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.012;
  group.add(shadow);

  // The original circular plot now communicates resource health: bright green
  // when full, muted and dark when depleted.
  const plot = new THREE.Mesh(flowerAssets.plotGeo, plotMat);
  plot.position.y = 0.05;
  plot.receiveShadow = true;
  group.add(plot);

  // Restore the original circular tier ring.
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x8bd879, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide
  });
  const tierRing = new THREE.Mesh(flowerAssets.tierRingGeo, ringMat);
  tierRing.rotation.x = -Math.PI / 2;
  tierRing.position.y = 0.055;
  group.add(tierRing);

  // Stem
  const stemMat = flowerAssets.stemMat;
  const stem = new THREE.Mesh(flowerAssets.stemGeo, stemMat);
  stem.position.y = 0.35;
  group.add(stem);

  // Leaves
  const leafGeo = flowerAssets.leafGeo;
  const leafMat = flowerAssets.leafMat;
  const leaf1 = new THREE.Mesh(leafGeo, leafMat);
  leaf1.position.set(0.05, 0.22, 0);
  leaf1.rotation.set(0, 0, -0.4);
  group.add(leaf1);
  const leaf2 = new THREE.Mesh(leafGeo, leafMat);
  leaf2.position.set(-0.03, 0.38, 0.04);
  leaf2.rotation.set(0.3, Math.PI, 0.3);
  group.add(leaf2);

  // Flower head group (for phase animation)
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.75;

  // Petals
  const petalCount = 6;
  const petalGeo = flowerAssets.petalGeo;
  const petalMat = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.2 });
  const petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
  petalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  petalMesh.frustumCulled = false;
  const petalStates = [];
  for (let i = 0; i < petalCount; i++) {
    const petal = new THREE.Object3D();
    const angle = (i / petalCount) * Math.PI * 2;
    petal.position.x = Math.cos(angle) * 0.12;
    petal.position.z = Math.sin(angle) * 0.12;
    petal.rotation.y = -angle;
    petal.rotation.x = 0.35;
    petal.updateMatrix();
    petalMesh.setMatrixAt(i, petal.matrix);
    petalStates.push(petal);
  }
  petalMesh.instanceMatrix.needsUpdate = true;
  headGroup.add(petalMesh);

  // Center
  const centerGeo = flowerAssets.centerGeo;
  const centerMat = flowerAssets.centerMat;
  const center = new THREE.Mesh(centerGeo, centerMat);
  headGroup.add(center);

  const tierBlooms = [];
  const miniBloomGeo = flowerAssets.miniBloomGeo;
  const miniCenterGeo = flowerAssets.miniCenterGeo;
  const miniOffsets = [
    { x: -0.28, z: 0.05, y: 0.58, s: 0.9 },
    { x: 0.25, z: -0.12, y: 0.52, s: 0.78 },
  ];
  for (const off of miniOffsets) {
    const mini = new THREE.Group();
    if (!flowerAssets.miniStemGeos.has(off.y)) {
      flowerAssets.miniStemGeos.set(off.y, new THREE.CylinderGeometry(0.025, 0.03, off.y, 5));
    }
    const miniStem = new THREE.Mesh(flowerAssets.miniStemGeos.get(off.y), stemMat);
    miniStem.position.y = off.y * 0.5;
    mini.add(miniStem);
    const miniHead = new THREE.Mesh(miniBloomGeo, petalMat);
    miniHead.scale.set(1.4 * off.s, 0.5 * off.s, 1.4 * off.s);
    miniHead.position.y = off.y;
    mini.add(miniHead);
    const miniCenter = new THREE.Mesh(miniCenterGeo, centerMat);
    miniCenter.position.y = off.y + 0.015;
    mini.add(miniCenter);
    mini.position.set(off.x, 0, off.z);
    mini.visible = false;
    group.add(mini);
    tierBlooms.push(mini);
  }

  const star = new THREE.Mesh(flowerAssets.starGeo, flowerAssets.starMat);
  star.position.y = 0.19;
  star.rotation.x = -Math.PI / 2;
  star.visible = false;
  headGroup.add(star);

  const tierPips = [];
  const pipGeo = flowerAssets.pipGeo;
  const pipMat = flowerAssets.pipMat;
  for (let i = 0; i < 5; i++) {
    const pip = new THREE.Mesh(pipGeo, pipMat);
    pip.position.set(-0.28 + i * 0.14, 0.055, -0.47);
    pip.visible = false;
    group.add(pip);
    tierPips.push(pip);
  }

  // Cheap local glow. A real PointLight per flower gets expensive once fields are dense.
  const glowMat = new THREE.MeshBasicMaterial({
    color: color.getHex(),
    transparent: true,
    opacity: 0.08,
    depthWrite: false
  });
  const glowMesh = new THREE.Mesh(flowerAssets.glowGeo, glowMat);
  glowMesh.scale.set(1.15, 0.45, 1.15);
  headGroup.add(glowMesh);
  const glow = {
    get intensity() { return glowMat.opacity / 0.22; },
    set intensity(v) {
      const opacity = clamp(v * 0.22, 0, 0.52);
      glowMat.opacity = opacity;
      glowMesh.visible = opacity > 0.01;
    }
  };

  group.add(headGroup);
  group.userData.headGroup = headGroup;
  group.userData.glow = glow;
  group.userData.petals = petalStates;
  group.userData.petalMesh = petalMesh;
  group.userData.plotMat = plotMat;
  group.userData.tierBlooms = tierBlooms;
  group.userData.tierPips = tierPips;
  group.userData.star = star;
  group.userData.tierRing = tierRing;
  group.userData.tierRingMat = ringMat;
  group.userData.baseColor = color.clone();

  return group;
}

function createBeeAbdomenTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  // Base color: Warm honey gold
  ctx.fillStyle = '#ffaa00';
  ctx.fillRect(0, 0, 128, 128);
  
  // Draw detailed fluffy stripes
  ctx.fillStyle = '#1e1a12';
  // 3 distinct abdominal stripes + dark tip
  ctx.fillRect(0, 28, 128, 14);
  ctx.fillRect(0, 56, 128, 14);
  ctx.fillRect(0, 84, 128, 14);
  ctx.fillRect(0, 108, 128, 20); // sting tip
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createBeeWingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, 64, 128);
  
  // Soft glowing white wing outline
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(12, 120);
  ctx.bezierCurveTo(4, 55, 14, 4, 32, 8);
  ctx.bezierCurveTo(50, 12, 60, 55, 52, 120);
  ctx.bezierCurveTo(32, 126, 32, 126, 12, 120);
  ctx.stroke();
  
  // Wing veins
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(12, 120);
  ctx.quadraticCurveTo(32, 58, 32, 12);
  ctx.stroke();
  
  // Radial secondary veins
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.beginPath();
  ctx.moveTo(20, 85);
  ctx.quadraticCurveTo(42, 92, 48, 92);
  ctx.moveTo(24, 68);
  ctx.quadraticCurveTo(44, 72, 50, 68);
  ctx.moveTo(28, 48);
  ctx.quadraticCurveTo(44, 48, 48, 40);
  ctx.moveTo(30, 28);
  ctx.quadraticCurveTo(40, 24, 44, 20);
  ctx.stroke();
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

let cachedBeeAbdomenTex = null;
let cachedBeeWingTex = null;
let cachedBeeWingMat = null;
let cachedBeeAbdomenMat = null;

// Shared, cached materials so 50+ bees stay cheap.
let cachedBeeWingMat2 = null;
let cachedBeeEyeMat = null;
let cachedBeeFuzzMat = null;
let cachedBeeChitinMat = null;
function getBeeSharedMats() {
  if (!cachedBeeAbdomenTex) {
    cachedBeeAbdomenTex = createBeeAbdomenTexture();
    cachedBeeAbdomenMat = new THREE.MeshStandardMaterial({ map: cachedBeeAbdomenTex, roughness: 0.62, metalness: 0.0 });
  }
  if (!cachedBeeWingMat2) {
    cachedBeeWingMat2 = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, transparent: true, opacity: 0.58, roughness: 0.1,
      metalness: 0, transmission: 0.5, side: THREE.DoubleSide, depthWrite: false,
      emissive: 0xdff2ff, emissiveIntensity: 0.28,
    });
    cachedBeeEyeMat = new THREE.MeshPhongMaterial({ color: 0x100c08, shininess: 140, specular: 0xffffff });
    cachedBeeFuzzMat = new THREE.MeshStandardMaterial({ color: 0x3a2a10, roughness: 1.0, metalness: 0 });
    cachedBeeChitinMat = new THREE.MeshStandardMaterial({ color: 0x241708, roughness: 0.55, metalness: 0.1 });
    cachedBeeOutlineMat = new THREE.MeshBasicMaterial({ color: 0x140d04, side: THREE.BackSide });
  }
  return { abd: cachedBeeAbdomenMat, wing: cachedBeeWingMat2, eye: cachedBeeEyeMat, fuzz: cachedBeeFuzzMat, chitin: cachedBeeChitinMat, outline: cachedBeeOutlineMat };
}
let cachedBeeOutlineMat = null;

const beeGeoCache = {};
function getBeeGeos() {
  if (!beeGeoCache.abdomen) {
    beeGeoCache.abdomen = new THREE.SphereGeometry(0.26, 16, 12);
    beeGeoCache.abdomen.rotateX(Math.PI / 2);
    beeGeoCache.thorax = new THREE.SphereGeometry(0.21, 14, 10);
    beeGeoCache.head = new THREE.SphereGeometry(0.16, 14, 10);
    beeGeoCache.eye = new THREE.SphereGeometry(0.066, 10, 10);
    beeGeoCache.shine = new THREE.SphereGeometry(0.02, 6, 6);
    beeGeoCache.sting = new THREE.ConeGeometry(0.05, 0.16, 7);
    beeGeoCache.sting.rotateX(-Math.PI / 2);
    beeGeoCache.leg = new THREE.CylinderGeometry(0.018, 0.012, 0.18, 5);
    beeGeoCache.leg.translate(0, -0.09, 0);
    beeGeoCache.antenna = new THREE.CylinderGeometry(0.011, 0.011, 0.18, 5);
    beeGeoCache.antenna.translate(0, 0.09, 0);
    beeGeoCache.antennaTip = new THREE.SphereGeometry(0.028, 6, 6);
    beeGeoCache.blush = new THREE.CircleGeometry(0.05, 10);
    beeGeoCache.glow = new THREE.SphereGeometry(0.46, 8, 6);
  }
  return beeGeoCache;
}

// Rounded teardrop wing built once and reused.
let cachedBeeWingGeo = null;
function getBeeWingGeo() {
  if (!cachedBeeWingGeo) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.05, 0.30, 0.30, 0.46, 0.46, 0.30);
    shape.bezierCurveTo(0.62, 0.14, 0.46, -0.06, 0.20, -0.05);
    shape.bezierCurveTo(0.10, -0.05, 0.03, -0.03, 0, 0);
    cachedBeeWingGeo = new THREE.ShapeGeometry(shape);
  }
  return cachedBeeWingGeo;
}

function createBeeModel(typeHue, accent = 'none') {
  const group = new THREE.Group();
  const hueColor = new THREE.Color(typeHue);
  const M = getBeeSharedMats();
  const G = getBeeGeos();

  // Big chunky striped abdomen (the signature plush bee body)
  // Toon outline shell so the bee reads as a bold silhouette at distance
  const abdOutline = new THREE.Mesh(G.abdomen, M.outline);
  abdOutline.scale.set(1.0 * 1.12, 0.92 * 1.12, 1.32 * 1.08);
  abdOutline.position.set(0, -0.01, -0.18);
  group.add(abdOutline);
  const abdomen = new THREE.Mesh(G.abdomen, M.abd);
  abdomen.scale.set(1.0, 0.92, 1.32);
  abdomen.position.set(0, -0.01, -0.18);
  abdomen.castShadow = true;
  group.add(abdomen);

  // Pointed stinger tip
  const sting = new THREE.Mesh(G.sting, M.chitin);
  sting.position.set(0, -0.02, -0.52);
  group.add(sting);

  // Fuzzy thorax collar (the fluffy shoulders)
  const thorOutline = new THREE.Mesh(G.thorax, M.outline);
  thorOutline.scale.set(1.05 * 1.12, 1.0 * 1.12, 0.95 * 1.12);
  thorOutline.position.set(0, 0.0, 0.12);
  group.add(thorOutline);
  const thorax = new THREE.Mesh(G.thorax, M.fuzz);
  thorax.scale.set(1.05, 1.0, 0.95);
  thorax.position.set(0, 0.0, 0.12);
  thorax.castShadow = true;
  group.add(thorax);

  // Head
  const headOutline = new THREE.Mesh(G.head, M.outline);
  headOutline.scale.set(1.05 * 1.14, 0.95 * 1.14, 0.9 * 1.14);
  headOutline.position.set(0, 0.05, 0.30);
  group.add(headOutline);
  const head = new THREE.Mesh(G.head, M.chitin);
  head.scale.set(1.05, 0.95, 0.9);
  head.position.set(0, 0.05, 0.30);
  group.add(head);

  // Big cute eyes with white catch-light
  const eyeL = new THREE.Mesh(G.eye, M.eye);
  eyeL.position.set(0.085, 0.09, 0.37);
  group.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = -0.085;
  group.add(eyeR);
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const shineL = new THREE.Mesh(G.shine, shineMat);
  shineL.position.set(0.105, 0.115, 0.42);
  group.add(shineL);
  const shineR = shineL.clone();
  shineR.position.x = -0.065;
  group.add(shineR);

  // Hue-tinted cheeks/blush ring so each bee type reads at a glance
  const blushMat = new THREE.MeshBasicMaterial({ color: hueColor, transparent: true, opacity: 0.55 });
  const blushL = new THREE.Mesh(G.blush, blushMat);
  blushL.position.set(0.13, 0.0, 0.40); blushL.rotation.y = -0.5;
  group.add(blushL);
  const blushR = blushL.clone();
  blushR.position.x = -0.13; blushR.rotation.y = 0.5;
  group.add(blushR);

  // Four rounded translucent wings on animated pivots
  const wingGeo = getBeeWingGeo();
  const makeWing = (px, py, pz, sx, scale) => {
    const pivot = new THREE.Group();
    pivot.position.set(px, py, pz);
    const mesh = new THREE.Mesh(wingGeo, M.wing);
    mesh.rotation.x = -Math.PI / 2;       // lay flat, sweeping back
    mesh.scale.set(sx * scale, scale, scale);
    pivot.add(mesh);
    group.add(pivot);
    return pivot;
  };
  const wingPivotL  = makeWing(0.10, 0.20, 0.02,  1, 1.0);
  const wingPivotL2 = makeWing(0.08, 0.16, -0.10, 1, 0.74);
  const wingPivotR  = makeWing(-0.10, 0.20, 0.02, -1, 1.0);
  const wingPivotR2 = makeWing(-0.08, 0.16, -0.10, -1, 0.74);

  // Six stubby dangling legs
  const legZs = [0.14, 0.02, -0.12];
  for (let i = 0; i < 3; i++) {
    const legL = new THREE.Mesh(G.leg, M.chitin);
    legL.position.set(0.11, -0.12, legZs[i]);
    legL.rotation.z = -0.5; legL.rotation.x = 0.3;
    group.add(legL);
    const legR = new THREE.Mesh(G.leg, M.chitin);
    legR.position.set(-0.11, -0.12, legZs[i]);
    legR.rotation.z = 0.5; legR.rotation.x = 0.3;
    group.add(legR);
  }

  // Antennae with glowing hue tips
  const tipMat = new THREE.MeshBasicMaterial({ color: hueColor });
  const antL = new THREE.Group();
  antL.position.set(0.05, 0.16, 0.34);
  const antMeshL = new THREE.Mesh(G.antenna, M.chitin);
  antMeshL.rotation.set(0.35, 0, 0.3);
  const tipL = new THREE.Mesh(G.antennaTip, tipMat); tipL.position.y = 0.18;
  antMeshL.add(tipL); antL.add(antMeshL); group.add(antL);
  const antR = antL.clone();
  antR.position.x = -0.05; antR.children[0].rotation.z = -0.3;
  group.add(antR);

  // Soft hue glow without per-bee lights. Real point lights scale poorly once
  // the squad grows, while this keeps the same readable aura.
  const glow = new THREE.Mesh(
    G.glow,
    new THREE.MeshBasicMaterial({ color: hueColor, transparent: true, opacity: 0.13, depthWrite: false })
  );
  glow.scale.set(1.1, 0.75, 1.25);
  glow.position.set(0, 0.04, -0.06);
  group.add(glow);

  // Per-type look accents so bees are distinguishable at a glance.
  if (accent === 'visor') {
    const visor = new THREE.Mesh(
      new THREE.SphereGeometry(0.17, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
      new THREE.MeshStandardMaterial({ color: 0x0c1622, roughness: 0.25, metalness: 0.4, emissive: hueColor, emissiveIntensity: 0.5 })
    );
    visor.rotation.x = -0.5; visor.position.set(0, 0.1, 0.36);
    group.add(visor);
  } else if (accent === 'crown') {
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xffd54a, roughness: 0.3, metalness: 0.6, emissive: 0x664400, emissiveIntensity: 0.5 });
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 6, 12), crownMat);
    band.rotation.x = Math.PI / 2; band.position.set(0, 0.27, 0.28); group.add(band);
    for (let k = 0; k < 5; k++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.11, 5), crownMat);
      const a = (k / 5) * Math.PI * 2;
      spike.position.set(Math.cos(a) * 0.12, 0.33, 0.28 + Math.sin(a) * 0.12);
      group.add(spike);
    }
  } else if (accent === 'halo') {
    // Celest Lumen: a glowing celestial ring + brighter aura.
    glow.material.opacity = 0.26;
    glow.scale.set(1.35, 0.95, 1.5);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: 0.8, depthWrite: false });
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.028, 8, 20), haloMat);
    halo.rotation.x = Math.PI / 2.6; halo.position.set(0, 0.34, 0.2);
    group.add(halo);
    group.userData.halo = halo;
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshBasicMaterial({ color: 0xeaffff }));
    star.position.set(0, 0.46, 0.2); group.add(star);
  }

  group.userData.wingPivotL = wingPivotL;
  group.userData.wingPivotL2 = wingPivotL2;
  group.userData.wingPivotR = wingPivotR;
  group.userData.wingPivotR2 = wingPivotR2;
  group.userData.wingL = wingPivotL; // back-compat
  group.userData.wingR = wingPivotR; // back-compat
  group.userData.glow = glow;

  group.scale.set(0.62, 0.62, 0.62);
  return group;
}

function createBeeComboLabel() {
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  }));
  sprite.position.set(0, 1.04, 0);
  sprite.scale.set(1.65, 0.66, 1);
  sprite.visible = false;
  sprite.userData = { ctx, texture, text: '' };
  return sprite;
}

function setBeeComboLabel(bee, text, color = '#8fddff') {
  const sprite = bee?.model?.userData?.comboLabel;
  if (!sprite) return;
  if (!text) {
    sprite.visible = false;
    return;
  }
  sprite.visible = true;
  if (sprite.userData.text === `${text}:${color}`) return;
  const ctx = sprite.userData.ctx;
  ctx.clearRect(0, 0, 160, 64);
  ctx.fillStyle = 'rgba(5, 24, 38, 0.88)';
  ctx.fillRect(18, 10, 124, 44);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 10, 124, 44);
  ctx.font = '800 28px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, 80, 33);
  sprite.userData.texture.needsUpdate = true;
  sprite.userData.text = `${text}:${color}`;
}

function createPlayerModel() {
  const group = new THREE.Group();

  // Materials
  const suitColor = 0xddaa33; // Warm golden yellow suit
  const gloveColor = 0x3d2c1c; // Dark leather gloves
  const bootColor = 0x241d17;  // Heavy leather boots
  const hatColor = 0xe5c158;   // Straw hat color
  const skinColor = 0xdfb087;  // Cozy peach skin tone
  
  const suitMat = new THREE.MeshStandardMaterial({ color: suitColor, roughness: 0.8 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xffe18a, roughness: 0.62, metalness: 0.05, emissive: 0x2c1800, emissiveIntensity: 0.08 });
  const leatherMat = new THREE.MeshStandardMaterial({ color: gloveColor, roughness: 0.7 });
  const bootMat = new THREE.MeshStandardMaterial({ color: bootColor, roughness: 0.85 });
  const hatMat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.95 });
  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.75 });
  const glassMat = new THREE.MeshBasicMaterial({ color: 0x0c1720, transparent: true, opacity: 0.72, side: THREE.DoubleSide });

  const torsoGroup = new THREE.Group();
  group.add(torsoGroup);

  // Legs (Hip-pivoted groups for natural swinging!)
  const legLGroup = new THREE.Group();
  legLGroup.position.set(0.15, 0.56, 0);
  group.add(legLGroup);
  const legRGroup = new THREE.Group();
  legRGroup.position.set(-0.15, 0.56, 0);
  group.add(legRGroup);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.55, 8);
  const legL = new THREE.Mesh(legGeo, suitMat);
  legL.position.set(0, -0.28, 0);
  legL.castShadow = true;
  legLGroup.add(legL);
  const legR = new THREE.Mesh(legGeo, suitMat);
  legR.position.set(0, -0.28, 0);
  legR.castShadow = true;
  legRGroup.add(legR);

  // Boots (now children of leg groups so they swing together!)
  const footGeo = new THREE.BoxGeometry(0.16, 0.12, 0.28);
  const footL = new THREE.Mesh(footGeo, bootMat);
  footL.position.set(0, -0.5, 0.06);
  footL.castShadow = true;
  legLGroup.add(footL);
  const footR = new THREE.Mesh(footGeo, bootMat);
  footR.position.set(0, -0.5, 0.06);
  footR.castShadow = true;
  legRGroup.add(footR);

  // Upper Body Coat
  const bodyGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.5, 8);
  const body = new THREE.Mesh(bodyGeo, suitMat);
  body.position.y = 1.15;
  body.castShadow = true;
  torsoGroup.add(body);
  
  // Lower Coat Skirt (flared raincoat look)
  const skirtGeo = new THREE.CylinderGeometry(0.32, 0.42, 0.4, 8);
  const skirt = new THREE.Mesh(skirtGeo, suitMat);
  skirt.position.y = 0.75;
  skirt.castShadow = true;
  torsoGroup.add(skirt);

  // Dark Belt
  const beltGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.07, 8);
  const beltMat = new THREE.MeshStandardMaterial({ color: 0x221a10, roughness: 0.9 });
  const belt = new THREE.Mesh(beltGeo, beltMat);
  belt.position.y = 0.95;
  torsoGroup.add(belt);

  // Suit trim and harness
  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.035), trimMat);
  chestPlate.position.set(0, 1.18, 0.285);
  chestPlate.castShadow = true;
  torsoGroup.add(chestPlate);
  const strapGeo = new THREE.BoxGeometry(0.045, 0.78, 0.035);
  const strapL = new THREE.Mesh(strapGeo, leatherMat);
  strapL.position.set(0.16, 1.04, 0.31);
  strapL.rotation.z = -0.18;
  torsoGroup.add(strapL);
  const strapR = strapL.clone();
  strapR.position.x = -0.16;
  strapR.rotation.z = 0.18;
  torsoGroup.add(strapR);

  // Head
  const headGeo = new THREE.SphereGeometry(0.23, 12, 10);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.y = 1.58;
  head.castShadow = true;
  torsoGroup.add(head);

  // Straw Hat Brim (flat wide disc)
  const brimGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.04, 16);
  const brim = new THREE.Mesh(brimGeo, hatMat);
  brim.position.y = 1.78;
  brim.castShadow = true;
  torsoGroup.add(brim);

  // Straw Hat Dome (rounded straw cap)
  const domeGeo = new THREE.SphereGeometry(0.34, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const dome = new THREE.Mesh(domeGeo, hatMat);
  dome.position.y = 1.78;
  dome.castShadow = true;
  torsoGroup.add(dome);

  // Dark Net Veil (realistic mesh)
  const veilGeo = new THREE.CylinderGeometry(0.38, 0.35, 0.36, 12, 1, true);
  const veilMat = new THREE.MeshStandardMaterial({ color: 0x2b2b2b, transparent: true, opacity: 0.42, side: THREE.DoubleSide });
  const veil = new THREE.Mesh(veilGeo, veilMat);
  veil.position.y = 1.52;
  torsoGroup.add(veil);

  const visor = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.18), glassMat);
  visor.position.set(0, 1.58, 0.235);
  torsoGroup.add(visor);
  const eyeLine = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.018, 0.018), new THREE.MeshBasicMaterial({ color: 0x28d7c5 }));
  eyeLine.position.set(0, 1.59, 0.247);
  torsoGroup.add(eyeLine);

  // Arms (Shoulder-pivoted groups for natural swinging!)
  const armLGroup = new THREE.Group();
  armLGroup.position.set(0.38, 1.32, 0);
  armLGroup.rotation.z = 0.3;
  torsoGroup.add(armLGroup);
  const armRGroup = new THREE.Group();
  armRGroup.position.set(-0.38, 1.32, 0);
  armRGroup.rotation.z = -0.3;
  torsoGroup.add(armRGroup);

  const armGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.55, 8);
  const armL = new THREE.Mesh(armGeo, suitMat);
  armL.position.set(0, -0.28, 0);
  armL.castShadow = true;
  armLGroup.add(armL);
  const armR = new THREE.Mesh(armGeo, suitMat);
  armR.position.set(0, -0.28, 0);
  armR.castShadow = true;
  armRGroup.add(armR);

  // Leather Gloves (now children of arm groups)
  const gloveGeo = new THREE.SphereGeometry(0.08, 8, 8);
  const gloveL = new THREE.Mesh(gloveGeo, leatherMat);
  gloveL.position.set(0, -0.56, 0.02);
  armLGroup.add(gloveL);
  const gloveR = new THREE.Mesh(gloveGeo, leatherMat);
  gloveR.position.set(0, -0.56, 0.02);
  armRGroup.add(gloveR);

  // Starter nectar tool: upgraded in the shop and animated when walking through fields.
  const toolPivot = new THREE.Group();
  toolPivot.position.set(-0.52, 0.78, 0.16);
  toolPivot.rotation.set(-0.55, 0.12, -0.52);
  const toolHandleMat = new THREE.MeshStandardMaterial({ color: 0x7a4d1f, roughness: 0.8 });
  const toolHeadMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0x4a3000, emissiveIntensity: 0.35, roughness: 0.42 });
  const toolHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.9, 6), toolHandleMat);
  toolHandle.rotation.x = Math.PI / 2;
  toolHandle.position.z = 0.34;
  toolHandle.castShadow = true;
  toolPivot.add(toolHandle);
  const toolHead = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.028, 6, 16), toolHeadMat);
  toolHead.rotation.x = Math.PI / 2;
  toolHead.position.z = 0.82;
  toolHead.castShadow = true;
  toolPivot.add(toolHead);
  const toolComb = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 0.08), toolHeadMat);
  toolComb.position.z = 0.84;
  toolComb.castShadow = true;
  toolPivot.add(toolComb);
  const toolBeamMat = new THREE.MeshBasicMaterial({ color: 0xffef75, transparent: true, opacity: 0.38, depthWrite: false });
  const toolBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.12, 1.25, 8, 1, true), toolBeamMat);
  toolBeam.rotation.x = Math.PI / 2;
  toolBeam.position.z = 1.42;
  toolBeam.visible = false;
  toolPivot.add(toolBeam);
  toolPivot.userData.headMat = toolHeadMat;
  toolPivot.userData.beam = toolBeam;
  toolPivot.userData.beamMat = toolBeamMat;
  group.add(toolPivot);

  // Wooden Pollen Frame Backpack (Beekeeper Pack)
  const packFrameGeo = new THREE.BoxGeometry(0.55, 0.72, 0.32);
  const packFrameMat = new THREE.MeshStandardMaterial({ color: 0x5a3d16, roughness: 0.9 });
  const packFrame = new THREE.Mesh(packFrameGeo, packFrameMat);
  packFrame.position.set(0, 1.12, -0.36);
  packFrame.castShadow = true;
  torsoGroup.add(packFrame);
  
  // Metal brackets on the pack
  const bracketGeo = new THREE.BoxGeometry(0.57, 0.06, 0.34);
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x7a7a7a, metalness: 0.8, roughness: 0.3 });
  const bracketT = new THREE.Mesh(bracketGeo, metalMat);
  bracketT.position.set(0, 1.35, -0.36);
  torsoGroup.add(bracketT);
  const bracketB = new THREE.Mesh(bracketGeo, metalMat);
  bracketB.position.set(0, 0.9, -0.36);
  torsoGroup.add(bracketB);
  const packWindow = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.38, 0.025), new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.48 }));
  packWindow.position.set(0, 1.11, -0.535);
  torsoGroup.add(packWindow);

  // Shadow disc on ground
  const shadowGeo = new THREE.CircleGeometry(0.45, 12);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.26 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  // Field Scanner Navigation Arrow (3D Floating Compass)
  const arrowGeo = new THREE.ConeGeometry(0.12, 0.45, 5);
  arrowGeo.rotateX(Math.PI / 2);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffcc00, depthTest: false, transparent: true, opacity: 0.85 });
  const navArrow = new THREE.Mesh(arrowGeo, arrowMat);
  navArrow.position.set(0, 2.35, 0);
  navArrow.visible = false;
  group.add(navArrow);

  group.userData.armL = armLGroup;
  group.userData.armR = armRGroup;
  group.userData.legL = legLGroup;
  group.userData.legR = legRGroup;
  group.userData.navArrow = navArrow;
  group.userData.packWindow = packWindow;
  group.userData.toolPivot = toolPivot;
  group.userData.torsoGroup = torsoGroup;
  return group;
}

// ===== Honeycomb hive bay (Bee Swarm Simulator–style apiary) =====
// Each bay is a wooden A-frame holding a real hexagonal honeycomb wall. The bee
// SLOTS sit in pockets BEHIND the comb; bees fly into a cell and pass through the
// comb to dock in their slot, so you watch them "live through the honeycomb".
const COMB_COLS = 6, COMB_ROWS = 8;          // 48 cells — a grand honeycomb wall
const COMB_DX = 1.24, COMB_DY = 1.10;        // cell spacing (much bigger hive)
const COMB_WALL_Z = -2.5;                    // local z of comb plane (behind the skep)
const COMB_BASE_Y = 2.1;                     // local y of bottom row
const COMB_POCKET_DZ = 0.48;                 // how far behind the comb a docked bee rests (shallow = visible)
const COMB_ENTRY_DZ = 1.5;                   // approach point in front of the comb
const COMB_CONVERT_DZ = 0.12;                // bees spin THIS far in FRONT of the comb while converting, so the honey-spin is visible

const combAssets = {
  rimGeo: (() => { const g = new THREE.TorusGeometry(0.56, 0.105, 6, 6); g.rotateZ(Math.PI / 6); return g; })(),
  holeGeo: (() => { const g = new THREE.CircleGeometry(0.52, 6); g.rotateZ(Math.PI / 6); return g; })(),
  capGeo: (() => { const g = new THREE.CircleGeometry(0.53, 6); g.rotateZ(Math.PI / 6); return g; })(),
  glowGeo: (() => { const g = new THREE.CircleGeometry(0.57, 6); g.rotateZ(Math.PI / 6); return g; })(),
  holeMat: new THREE.MeshStandardMaterial({ color: 0x160e05, roughness: 1.0 }),
  rimMat: new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.48, metalness: 0.02,
    emissive: 0x2a1600, emissiveIntensity: 0.4,
  }),
  capMat: new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.42, metalness: 0.02,
    emissive: 0x291700, emissiveIntensity: 0.24,
  }),
  glowMat: new THREE.MeshBasicMaterial({
    color: 0xffffff, transparent: true, opacity: 0.8,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }),
};
const combInstanceDummy = new THREE.Object3D();
const combInstanceColor = new THREE.Color();

function setCombInstanceTransform(mesh, index, local, zOffset, scale = 1) {
  combInstanceDummy.position.set(local.x, local.y, local.z + zOffset);
  combInstanceDummy.rotation.set(0, 0, 0);
  combInstanceDummy.scale.setScalar(scale);
  combInstanceDummy.updateMatrix();
  mesh.setMatrixAt(index, combInstanceDummy.matrix);
}

function setCombCellVisual(cell, state, rimHex = 0xc8902f, glowHex = 0xffce4d) {
  const { instances, index, local } = cell;
  const capVisible = state === 'locked';
  const glowVisible = state === 'occupied' || state === 'rival';
  const capHex = state === 'locked' ? 0x8f7132 : 0xd9a23b;

  setCombInstanceTransform(instances.rims, index, local, 0, 1);
  setCombInstanceTransform(instances.caps, index, local, 0.02, capVisible ? 1 : 0.001);
  setCombInstanceTransform(instances.glows, index, local, -0.13, glowVisible ? 1 : 0.001);
  instances.rims.setColorAt(index, combInstanceColor.setHex(rimHex));
  instances.caps.setColorAt(index, combInstanceColor.setHex(capHex));
  instances.glows.setColorAt(index, combInstanceColor.setHex(glowHex));
  instances.rims.instanceMatrix.needsUpdate = true;
  instances.caps.instanceMatrix.needsUpdate = true;
  instances.glows.instanceMatrix.needsUpdate = true;
  instances.rims.instanceColor.needsUpdate = true;
  instances.caps.instanceColor.needsUpdate = true;
  instances.glows.instanceColor.needsUpdate = true;
  cell.visualState = state;
  cell.glowVisible = glowVisible;
}

// Column-major index so the first unlocked slots fill the bottom of column 0.
function combCellLocal(index) {
  const c = Math.floor(index / COMB_ROWS);   // 0..4
  const r = index % COMB_ROWS;               // 0..6
  const x = (c - (COMB_COLS - 1) / 2) * COMB_DX;
  const y = COMB_BASE_Y + r * COMB_DY + ((c % 2) ? COMB_DY * 0.5 : 0);
  return { x, y, z: COMB_WALL_Z };
}

function makeBaySign(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(8,12,20,0.82)';
  roundRectPath(ctx, 4, 8, 248, 48, 12); ctx.fill();
  ctx.strokeStyle = '#ffcf57'; ctx.lineWidth = 3;
  roundRectPath(ctx, 4, 8, 248, 48, 12); ctx.stroke();
  ctx.fillStyle = '#ffe9a8';
  ctx.font = 'bold 26px Outfit, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 34);
  const tex = new THREE.CanvasTexture(canvas);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.scale.set(3.4, 0.85, 1);
  spr.userData.ctx = ctx; spr.userData.tex = tex;
  return spr;
}
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// A wooden signpost + glowing billboard naming a field and its honey type.
// Gives each field a clear, color-coded identity from across the meadow.
function createFieldSignpost(field) {
  const group = new THREE.Group();
  const glowHex = '#' + (new THREE.Color(field.zoneColor).getHexString());

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b461f, roughness: 0.9 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 3.0, 7), woodMat);
  post.position.y = 1.5; post.castShadow = true;
  group.add(post);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 0.3, 8), woodMat);
  base.position.y = 0.15; group.add(base);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), new THREE.MeshBasicMaterial({ color: field.zoneColor }));
  finial.position.y = 3.15; group.add(finial);

  // Billboard banner (always faces the camera)
  const canvas = document.createElement('canvas');
  canvas.width = 384; canvas.height = 160;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(10,14,22,0.9)';
  roundRectPath(ctx, 6, 6, 372, 148, 20); ctx.fill();
  ctx.strokeStyle = glowHex; ctx.lineWidth = 6;
  roundRectPath(ctx, 6, 6, 372, 148, 20); ctx.stroke();
  ctx.textAlign = 'center';
  ctx.fillStyle = glowHex;
  ctx.font = 'bold 40px Outfit, sans-serif';
  ctx.fillText(field.name.toUpperCase(), 192, 62);
  ctx.fillStyle = '#ffe9a8';
  ctx.font = '600 26px Outfit, sans-serif';
  ctx.fillText('🍯 ' + field.honeyType, 192, 104);
  ctx.fillStyle = '#9fb3c8';
  ctx.font = '600 21px Outfit, sans-serif';
  const gate = field.gateBees || 0;
  const gateText = gate <= 1 ? 'Open from the start' : ('Unlocks at ' + gate + ' bees');
  ctx.fillText(gateText, 192, 136);
  const tex = new THREE.CanvasTexture(canvas);
  const banner = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  banner.scale.set(5.4, 2.25, 1);
  banner.position.y = 4.7;
  group.add(banner);

  return group;
}

function createHiveBay(bayIndex) {
  const group = new THREE.Group();

  const combTopY = COMB_BASE_Y + (COMB_ROWS - 1) * COMB_DY + COMB_DY;
  const combMidY = COMB_BASE_Y + (COMB_ROWS - 1) * COMB_DY / 2 + COMB_DY * 0.25;
  const combHalfW = (COMB_COLS - 1) * COMB_DX / 2 + COMB_DX * 0.6;

  // Wooden platform base
  const platformGeo = new THREE.CylinderGeometry(4.9, 5.4, 0.6, 6);
  const platformMat = new THREE.MeshStandardMaterial({ color: 0x5a3e1a, roughness: 0.85 });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.set(0, 0.3, -0.4);
  platform.rotation.y = Math.PI / 6;
  platform.castShadow = true; platform.receiveShadow = true;
  group.add(platform);

  // A-frame timber that holds the comb wall up
  const beamMat = new THREE.MeshStandardMaterial({ color: 0x4a3015, roughness: 0.9 });
  const postGeo = new THREE.BoxGeometry(0.44, combTopY + 0.7, 0.44);
  const postX = combHalfW + 0.45;
  const postL = new THREE.Mesh(postGeo, beamMat);
  postL.position.set(-postX, (combTopY + 0.6) / 2, COMB_WALL_Z - 0.3); postL.rotation.z = 0.05;
  postL.castShadow = true; group.add(postL);
  const postR = new THREE.Mesh(postGeo, beamMat);
  postR.position.set(postX, (combTopY + 0.6) / 2, COMB_WALL_Z - 0.3); postR.rotation.z = -0.05;
  postR.castShadow = true; group.add(postR);
  const topBeam = new THREE.Mesh(new THREE.BoxGeometry(combHalfW * 2 + 1.0, 0.38, 0.38), beamMat);
  topBeam.position.set(0, combTopY + 0.35, COMB_WALL_Z - 0.3);
  topBeam.castShadow = true; group.add(topBeam);
  // Deep pitched canopy with two readable roof planes and a bright ridge cap.
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x8f4d25, roughness: 0.72, metalness: 0.03 });
  const roofTrimMat = new THREE.MeshStandardMaterial({ color: 0xd89b3b, roughness: 0.58, metalness: 0.08 });
  const roofRise = 1.25;
  const roofRun = combHalfW + 0.95;
  const roofAngle = Math.atan2(roofRise, roofRun);
  const roofSlope = Math.hypot(roofRun, roofRise);
  for (const side of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(roofSlope, 0.22, 4.1), roofMat);
    panel.position.set(side * roofRun * 0.5, combTopY + 0.72, COMB_WALL_Z - 0.25);
    panel.rotation.z = side * -roofAngle;
    panel.castShadow = true;
    group.add(panel);
  }
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 4.35), roofTrimMat);
  ridge.position.set(0, combTopY + roofRise + 0.12, COMB_WALL_Z - 0.25);
  ridge.castShadow = true;
  group.add(ridge);
  for (const side of [-1, 1]) {
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.38, 4.25), roofTrimMat);
    fascia.position.set(side * roofRun, combTopY + 0.13, COMB_WALL_Z - 0.25);
    fascia.castShadow = true;
    group.add(fascia);
  }

  // Dark backing board so the comb cells read as deep pockets
  const backBoard = new THREE.Mesh(
    new THREE.BoxGeometry(combHalfW * 2 + 0.4, COMB_ROWS * COMB_DY + 0.9, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x2a1c0c, roughness: 0.95 })
  );
  backBoard.position.set(0, combMidY, COMB_WALL_Z - 0.4);
  backBoard.receiveShadow = true; group.add(backBoard);

  // The honeycomb wall — four instanced layers keep all 48 cells to four draw
  // calls per bay while still allowing per-cell colours and open/closed states.
  const wallGroup = new THREE.Group();
  group.add(wallGroup);
  const instanceCount = COMB_COLS * COMB_ROWS;
  const instances = {
    holes: new THREE.InstancedMesh(combAssets.holeGeo, combAssets.holeMat, instanceCount),
    glows: new THREE.InstancedMesh(combAssets.glowGeo, combAssets.glowMat, instanceCount),
    rims: new THREE.InstancedMesh(combAssets.rimGeo, combAssets.rimMat, instanceCount),
    caps: new THREE.InstancedMesh(combAssets.capGeo, combAssets.capMat, instanceCount),
  };
  instances.glows.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  instances.caps.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  instances.glows.renderOrder = 1;
  wallGroup.add(instances.holes, instances.glows, instances.rims, instances.caps);
  const cells = [];
  for (let index = 0; index < instanceCount; index++) {
    const p = combCellLocal(index);
    const cellGroup = new THREE.Group();
    cellGroup.position.set(p.x, p.y, p.z);
    wallGroup.add(cellGroup);
    setCombInstanceTransform(instances.holes, index, p, -0.16, 1);
    const cell = { group: cellGroup, index, local: p, instances, visualState: 'locked', glowVisible: false };
    cells.push(cell);
    setCombCellVisual(cell, 'locked', 0x80642e, 0xffce4d);
  }
  for (const mesh of Object.values(instances)) {
    mesh.instanceMatrix.needsUpdate = true;
    // r128 does not account for every instance in its base geometry bounds.
    // Four always-visible comb layers are cheaper than a false-positive cull.
    mesh.frustumCulled = false;
  }

  // Low honey-pot deposit station at the front. (Replaces the old tall straw-skep
  // dome so the tall honeycomb wall reads as the hive's silhouette.)
  const coilMat = new THREE.MeshStandardMaterial({ color: 0xbf8b2c, roughness: 0.92, metalness: 0.04 });
  const skep = new THREE.Group();
  skep.position.set(0, 0, 2.4);
  // Glowing landing pad — the spot where the keeper banks pollen.
  const padBase = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.75, 0.18, 20), new THREE.MeshStandardMaterial({ color: 0x76542b, roughness: 0.8 }));
  padBase.position.y = 0.12; padBase.receiveShadow = true; skep.add(padBase);
  const padGlow = new THREE.Mesh(new THREE.CircleGeometry(1.3, 28), new THREE.MeshBasicMaterial({ color: 0xffb52e, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
  padGlow.rotation.x = -Math.PI / 2; padGlow.position.y = 0.22; skep.add(padGlow);
  // Squat honey pot as a clear, low deposit target.
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.64, 0.8, 0.95, 16), coilMat);
  pot.position.y = 0.68; pot.castShadow = true; skep.add(pot);
  const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.1, 8, 18), coilMat);
  potRim.rotation.x = Math.PI / 2; potRim.position.y = 1.14; skep.add(potRim);
  const portal = new THREE.Mesh(new THREE.CircleGeometry(0.6, 18), new THREE.MeshBasicMaterial({ color: 0xffc23a }));
  portal.rotation.x = -Math.PI / 2; portal.position.set(0, 1.16, 0); skep.add(portal);
  group.add(skep);

  // Glow light (brightens when the bay is claimed)
  const hiveLight = new THREE.PointLight(0xffa200, 0.6, 18);
  hiveLight.position.set(0, 3.8, 1.0);
  group.add(hiveLight);

  // Claim beacon + floating sign shown until the bay is taken
  const beacon = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 11, 5),
    new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.45 })
  );
  beacon.position.set(0, 6, 1.0);
  group.add(beacon);
  const sign = makeBaySign('CLAIM  ·  PRESS E');
  sign.position.set(0, combTopY + 2.0, 1.0);
  group.add(sign);

  // Proximity ring on the ground (in front, where the player stands)
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(5.6, 6.1, 36),
    new THREE.MeshBasicMaterial({ color: 0xffcc00, transparent: true, opacity: 0.1, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.04, 1.5);
  group.add(ring);

  group.userData = { bodyMat: coilMat, baseMat: platformMat, hiveLight, beacon, sign, portal, cells, ring, index: bayIndex };
  return {
    group, index: bayIndex, pos: HIVE_BAYS[bayIndex],
    cells, skepMat: coilMat, baseMat: platformMat,
    hiveLight, beacon, sign, ring, claimed: false, owner: null, facing: 0,
  };
}

function createApiary() {
  const root = new THREE.Group();
  const bays = [];

  // Long planked deck spanning the whole bay row, on the rim side behind the bays
  const minX = HIVE_BAYS[0].x, maxX = HIVE_BAYS[HIVE_BAY_COUNT - 1].x;
  const deckW = (maxX - minX) + 22;
  const deckZ = APIARY_CENTER.z + 3.0;     // behind the hives, toward the island rim
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x6b4a22, roughness: 0.9 });
  const plankMat = new THREE.MeshStandardMaterial({ color: 0x5e4120, roughness: 0.92 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(deckW, 0.3, 12), deckMat);
  deck.position.set(0, 0.15, deckZ);
  deck.receiveShadow = true; root.add(deck);
  // Plank seams
  const plankCount = Math.floor(deckW / 1.2);
  const deckPlanks = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1.05, 0.32, 11.6),
    plankMat,
    plankCount
  );
  const apiaryDummy = new THREE.Object3D();
  for (let i = 0; i < plankCount; i++) {
    apiaryDummy.position.set(-deckW / 2 + 0.6 + i * 1.2, 0.16, deckZ);
    apiaryDummy.rotation.set(0, 0, 0);
    apiaryDummy.scale.setScalar(1);
    apiaryDummy.updateMatrix();
    deckPlanks.setMatrixAt(i, apiaryDummy.matrix);
  }
  deckPlanks.instanceMatrix.needsUpdate = true;
  deckPlanks.receiveShadow = true;
  root.add(deckPlanks);
  // Rustic back fence along the rim
  const fenceMat = new THREE.MeshStandardMaterial({ color: 0x4a3015, roughness: 0.9 });
  const fenceZ = deckZ + 5.0;
  const fenceXs = [];
  for (let x = -deckW / 2 + 1; x <= deckW / 2 - 1; x += 2.4) fenceXs.push(x);
  const fencePosts = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.16, 0.18, 2.2, 6),
    fenceMat,
    fenceXs.length
  );
  for (let i = 0; i < fenceXs.length; i++) {
    apiaryDummy.position.set(fenceXs[i], 1.1, fenceZ);
    apiaryDummy.rotation.set(0, 0, 0);
    apiaryDummy.scale.setScalar(1);
    apiaryDummy.updateMatrix();
    fencePosts.setMatrixAt(i, apiaryDummy.matrix);
  }
  fencePosts.instanceMatrix.needsUpdate = true;
  fencePosts.castShadow = true;
  root.add(fencePosts);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(deckW - 1, 0.18, 0.18), fenceMat);
  rail.position.set(0, 1.6, fenceZ); root.add(rail);

  // Hanging lanterns above the bays for warmth
  for (let k = 0; k < HIVE_BAY_COUNT - 1; k++) {
    const lx = (HIVE_BAYS[k].x + HIVE_BAYS[k + 1].x) / 2;
    const lz = (HIVE_BAYS[k].z + HIVE_BAYS[k + 1].z) / 2 + 1.0;
    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd27a })
    );
    lantern.position.set(lx, 4.2, lz);
    root.add(lantern);
    const lp = new THREE.PointLight(0xffb347, 0.5, 11);
    lp.position.copy(lantern.position); root.add(lp);
  }

  // The bays themselves — rotated to face the plaza
  for (let i = 0; i < HIVE_BAY_COUNT; i++) {
    const bay = createHiveBay(i);
    bay.group.position.set(HIVE_BAYS[i].x, 0, HIVE_BAYS[i].z);
    bay.group.rotation.y = BAY_FACING;
    bay.group.scale.setScalar(HIVE_WORLD_SCALE);
    bay.facing = BAY_FACING;
    root.add(bay.group);
    bays.push(bay);
  }

  return { group: root, bays };
}

// A cozy market stall the player walks up to in order to open the shop popup.
function createShopStall() {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x6b4a22, roughness: 0.9 });
  const woodDarkMat = new THREE.MeshStandardMaterial({ color: 0x4f3417, roughness: 0.92 });
  const topMat = new THREE.MeshStandardMaterial({ color: 0x8a5e2a, roughness: 0.85 });
  const jarMat = (color, emissive) => new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.32, roughness: 0.28, metalness: 0.05 });

  // Plank base/deck so the stall reads as a built market stand, not a floating box.
  const base = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.18, 3.2), woodDarkMat);
  base.position.set(0, 0.09, -0.1); base.receiveShadow = true; group.add(base);
  for (let i = 0; i < 5; i++) {
    const plank = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.2, 3.0), i % 2 ? woodMat : topMat);
    plank.position.set(-2.0 + i * 1.0, 0.19, -0.1); plank.receiveShadow = true; group.add(plank);
  }

  const counter = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.1, 1.5), woodMat);
  counter.position.set(0, 0.73, 0.15); counter.castShadow = true; counter.receiveShadow = true;
  group.add(counter);
  // Front face board with a lighter trim for a friendlier market look.
  const front = new THREE.Mesh(new THREE.BoxGeometry(3.64, 0.7, 0.12), topMat);
  front.position.set(0, 0.62, 0.92); group.add(front);
  const top = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.2, 1.8), topMat);
  top.position.set(0, 1.33, 0.15); top.castShadow = true; group.add(top);

  // Corner posts holding the awning
  const postGeo = new THREE.CylinderGeometry(0.1, 0.12, 3.6, 8);
  [[-1.9, -0.7], [1.9, -0.7], [-1.9, 1.0], [1.9, 1.0]].forEach(([x, z]) => {
    const po = new THREE.Mesh(postGeo, woodMat); po.position.set(x, 1.85, z);
    po.castShadow = true; group.add(po);
  });

  // Back shelf with a row of graded honey jars (glow → moon) for color & charm.
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.12, 0.5), woodDarkMat);
  shelf.position.set(0, 2.35, -0.78); shelf.castShadow = true; group.add(shelf);
  const shelfHues = [[0xffd84a, 0x5a3a00], [0xffb52e, 0x5a2c00], [0x6fe0d0, 0x064b43], [0xb48cff, 0x2a1a55], [0xff7ad0, 0x4a1030]];
  shelfHues.forEach(([c, e], i) => {
    const j = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.5, 10), jarMat(c, e));
    j.position.set(-1.5 + i * 0.75, 2.66, -0.78); j.castShadow = true; group.add(j);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.08, 10), woodDarkMat);
    lid.position.set(-1.5 + i * 0.75, 2.93, -0.78); group.add(lid);
  });

  // Striped awning facing the plaza (+Z), with a scalloped valance hanging off the front.
  for (let i = 0; i < 6; i++) {
    const c = i % 2 === 0 ? 0xff6a5a : 0xfff2dd;
    const mat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 });
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 2.4), mat);
    stripe.position.set(-2.1 + 0.7 * i + 0.35, 3.62, 0.7);
    stripe.rotation.x = -0.32; stripe.castShadow = true; group.add(stripe);
    // Scalloped valance tab dangling from the awning's front lip.
    const tab = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.34, 0.08), mat);
    tab.position.set(-2.1 + 0.7 * i + 0.35, 2.92, 1.74); group.add(tab);
  }

  // Honey jars + a wooden dipper on the counter as decoration
  for (let i = 0; i < 3; i++) {
    const j = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.42, 8), jarMat(0xffb52e, 0x5a2c00));
    j.position.set(-1.0 + i * 1.0, 1.64, 0.35); j.castShadow = true; group.add(j);
  }

  // A small barrel beside the stall for that cozy market feel.
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 1.3, 14), woodMat);
  barrel.position.set(2.65, 0.74, 0.6); barrel.castShadow = true; group.add(barrel);
  for (const by of [0.45, 0.74, 1.03]) {
    const hoop = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.045, 6, 18), woodDarkMat);
    hoop.rotation.x = Math.PI / 2; hoop.position.set(2.65, by, 0.6); group.add(hoop);
  }
  const barrelHoney = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.08, 14), jarMat(0xffc23a, 0x5a3000));
  barrelHoney.position.set(2.65, 1.4, 0.6); group.add(barrelHoney);

  // A stack of little crates on the other side.
  for (const [cx, cy, cz, s] of [[-2.6, 0.42, 0.7, 0.8], [-2.55, 1.12, 0.55, 0.66], [-2.9, 0.42, 0.0, 0.7]]) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), cy > 0.9 ? topMat : woodMat);
    crate.position.set(cx, cy, cz); crate.castShadow = true; group.add(crate);
  }

  // Flower planters beside the stall for extra market charm
  const planterMat = new THREE.MeshStandardMaterial({ color: 0x7a4525, roughness: 0.85 });
  const flowerMat1 = new THREE.MeshStandardMaterial({ color: 0xff6090, emissive: 0xff6090, emissiveIntensity: 0.15, roughness: 0.5 });
  const flowerMat2 = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00, emissiveIntensity: 0.15, roughness: 0.5 });
  for (const [px, pz, fm] of [[-2.8, 1.4, flowerMat1], [2.9, 1.5, flowerMat2]]) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.55, 10), planterMat);
    pot.position.set(px, 0.36, pz); pot.castShadow = true; group.add(pot);
    const dirt = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 10), new THREE.MeshStandardMaterial({ color: 0x3a2a18, roughness: 1 }));
    dirt.position.set(px, 0.64, pz); group.add(dirt);
    for (let fi = 0; fi < 3; fi++) {
      const petal = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 4), fm);
      petal.position.set(px + Math.cos(fi * 2.1) * 0.14, 0.82, pz + Math.sin(fi * 2.1) * 0.14);
      group.add(petal);
    }
  }

  // Warm hanging lantern
  const lanternBody = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.2, 0.36, 8), new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.7, metalness: 0.3 }));
  lanternBody.position.set(1.5, 3.15, 0.8); group.add(lanternBody);
  const lanternGlow = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 4), new THREE.MeshStandardMaterial({ color: 0xffc46a, emissive: 0xffc46a, emissiveIntensity: 0.8, transparent: true, opacity: 0.9 }));
  lanternGlow.position.set(1.5, 3.15, 0.8); group.add(lanternGlow);
  const lanternLight = new THREE.PointLight(0xffc46a, 0.4, 6);
  lanternLight.position.set(1.5, 3.15, 0.8); group.add(lanternLight);

  // Hanging sign
  const sign = makeBaySign('🛒  SHOP');
  sign.position.set(0, 4.55, 0.45); sign.scale.set(3.0, 0.75, 1);
  group.add(sign);

  // Warm light + ground ring
  const light = new THREE.PointLight(0xffc46a, 0.85, 13);
  light.position.set(0, 3.1, 0.7); group.add(light);
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(4.6, 5.1, 32),
    new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
  );
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.05; group.add(ring);

  group.userData.sign = sign;
  return group;
}

function createTradeTerminalModel() {
  const group = new THREE.Group();

  // Sturdy Base Block
  const baseGeo = new THREE.BoxGeometry(2.2, 0.4, 2.2);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x2b3d3a, roughness: 0.8 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.2;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);
  
  // Dual Support Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.14, 0.16, 2.4, 8);
  const pillarMat = new THREE.MeshStandardMaterial({ color: 0x1d2826, metalness: 0.6, roughness: 0.3 });
  const pillarL = new THREE.Mesh(pillarGeo, pillarMat);
  pillarL.position.set(-0.8, 1.2, 0);
  pillarL.castShadow = true;
  group.add(pillarL);
  const pillarR = new THREE.Mesh(pillarGeo, pillarMat);
  pillarR.position.set(0.8, 1.2, 0);
  pillarR.castShadow = true;
  group.add(pillarR);

  // Screen frame (Large Billboard screen)
  const frameGeo = new THREE.BoxGeometry(4.2, 3.0, 0.16);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x172c34, metalness: 0.4, roughness: 0.5 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.y = 3.2;
  frame.rotation.x = -0.08;
  frame.castShadow = true;
  group.add(frame);

  // Screen Canvas & Texture (High resolution 512x384)
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#081419';
  ctx.fillRect(0, 0, 512, 384);
  
  const texture = new THREE.CanvasTexture(canvas);
  
  // Screen glow plane
  const screenGeo = new THREE.PlaneGeometry(3.95, 2.75);
  const screenMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 3.2, 0.095);
  screen.rotation.x = -0.08;
  group.add(screen);

  // Point light
  const light = new THREE.PointLight(0x28d7c5, 0.9, 15);
  light.position.set(0, 3.8, 1.5);
  group.add(light);

  // Ground ring
  const ringGeo = new THREE.RingGeometry(4, 4.3, 32);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x28d7c5, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.03;
  group.add(ring);

  group.userData.screen = screen;
  group.userData.light = light;
  group.userData.screenCtx = ctx;
  group.userData.screenTex = texture;
  return group;
}

const pollenOrbAssets = {
  gemGeo: new THREE.OctahedronGeometry(0.3, 0),
  ringGeo: new THREE.TorusGeometry(0.48, 0.035, 6, 20),
  glowGeo: new THREE.SphereGeometry(0.62, 10, 8),
  beaconGeo: new THREE.RingGeometry(0.52, 0.64, 24),
  beaconMat: new THREE.MeshBasicMaterial({ color: 0xeaffff, transparent: true, opacity: 0.52, side: THREE.DoubleSide }),
  materials: new Map(),
};
const pollenOrbPool = [];

function getPollenOrbMaterials(hueStr) {
  if (!pollenOrbAssets.materials.has(hueStr)) {
    const c = new THREE.Color(hueStr);
    pollenOrbAssets.materials.set(hueStr, {
      gem: new THREE.MeshLambertMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: 1.15,
        transparent: true,
        opacity: 0.95
      }),
      ring: new THREE.MeshBasicMaterial({ color: 0xeaffff, transparent: true, opacity: 0.76 }),
      glow: new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.34 }),
    });
  }
  return pollenOrbAssets.materials.get(hueStr);
}

function setPollenOrbHue(model, hueStr) {
  const mats = getPollenOrbMaterials(hueStr);
  model.userData.gem.material = mats.gem;
  model.userData.ring.material = mats.ring;
  model.userData.glow.material = mats.glow;
  model.userData.hue = hueStr;
}

function createPollenOrbModel(hueStr) {
  const group = new THREE.Group();
  const mats = getPollenOrbMaterials(hueStr);

  // Sparkly octahedron gem shape
  const gem = new THREE.Mesh(pollenOrbAssets.gemGeo, mats.gem);
  gem.castShadow = true;
  group.add(gem);

  // Floating horizontal halo ring
  const ring = new THREE.Mesh(pollenOrbAssets.ringGeo, mats.ring);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  // Outer glow
  const glow = new THREE.Mesh(pollenOrbAssets.glowGeo, mats.glow);
  group.add(glow);

  // Ground beacon keeps dropped pollen readable against grass and wax colors.
  const beacon = new THREE.Mesh(pollenOrbAssets.beaconGeo, pollenOrbAssets.beaconMat);
  beacon.rotation.x = -Math.PI / 2;
  beacon.position.y = -0.42;
  group.add(beacon);

  group.userData.gem = gem;
  group.userData.ring = ring;
  group.userData.glow = glow;
  group.userData.beacon = beacon;
  group.userData.hue = hueStr;
  group.scale.set(1.15, 1.15, 1.15);
  return group;
}

function acquirePollenOrbModel(hueStr) {
  const model = pollenOrbPool.pop() || createPollenOrbModel(hueStr);
  setPollenOrbHue(model, hueStr);
  model.visible = true;
  model.rotation.set(0, 0, 0);
  return model;
}

function releasePollenOrbModel(model) {
  if (!model) return;
  scene.remove(model);
  model.visible = false;
  pollenOrbPool.push(model);
}

const abilityTokenTextureLoader = new THREE.TextureLoader();
const celestialLinkTexture = abilityTokenTextureLoader.load('assets/celestial_link.png');
celestialLinkTexture.encoding = THREE.sRGBEncoding;
celestialLinkTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy?.() || 1);

const ABILITY_TOKEN_DEFS = {
  honeyDrop: { label: 'Honey Drop', color: 0xffcc00, life: 14 },
  pollenBurst: { label: 'Pollen Burst', color: 0x28d7c5, life: 12 },
  beeFocus: { label: 'Celestial Link', color: 0x7fd8ff, life: 18 },
  nectarHaze: { label: 'Nectar Haze', color: 0xb8ff66, life: 15 },
  marketSpark: { label: 'Market Spark', color: 0x8a7cff, life: 15 },
  royalGlow: { label: 'Royal Glow', color: 0xff7a3a, life: 16 },
};
const ABILITY_TOKEN_TOUCH_RADIUS = 1.18;
const ABILITY_TOKEN_SPAWN_TIME = 0.68;
const abilityTokenAssets = {
  pedestalGeo: new THREE.CylinderGeometry(0.58, 0.72, 0.1, 18),
  coinGeo: new THREE.CylinderGeometry(0.36, 0.36, 0.09, 18),
  ringGeo: new THREE.TorusGeometry(0.5, 0.026, 6, 24),
  outerRingGeo: new THREE.TorusGeometry(0.68, 0.018, 6, 28),
  glowGeo: new THREE.SphereGeometry(0.72, 12, 8),
  iconGeo: new THREE.DodecahedronGeometry(0.2, 0),
  beaconGeo: new THREE.CylinderGeometry(0.1, 0.28, 2.0, 12, 1, true),
  materials: new Map(),
};
const abilityTokenPool = [];

function getAbilityTokenMaterials(type) {
  if (!abilityTokenAssets.materials.has(type)) {
    const def = ABILITY_TOKEN_DEFS[type] || ABILITY_TOKEN_DEFS.pollenBurst;
    const celestial = type === 'beeFocus';
    const c = new THREE.Color(def.color);
    abilityTokenAssets.materials.set(type, {
      pedestal: new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: celestial ? 0.14 : 0.2, depthWrite: false }),
      coin: new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: celestial ? 0.2 : 0.9 }),
      ring: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: celestial ? 0.44 : 0.58 }),
      outerRing: new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: celestial ? 0.18 : 0.24, depthWrite: false }),
      glow: new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: celestial ? 0.1 : 0.14, depthWrite: false }),
      icon: celestial
        ? new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0
          })
        : new THREE.MeshBasicMaterial({ color: 0xeaffff, transparent: true, opacity: 0.98 }),
      imageIcon: celestial
        ? new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: celestialLinkTexture,
            transparent: true,
            opacity: 0.96,
            alphaTest: 0.03,
            depthWrite: false,
            depthTest: true,
            side: THREE.DoubleSide
          })
        : null,
      beacon: new THREE.MeshBasicMaterial({
        color: c,
        transparent: true,
        opacity: celestial ? 0.06 : 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
    });
  }
  return abilityTokenAssets.materials.get(type);
}

function setAbilityTokenType(model, type) {
  const mats = getAbilityTokenMaterials(type);
  const celestial = type === 'beeFocus';
  model.userData.pedestal.material = mats.pedestal;
  model.userData.coin.material = mats.coin;
  model.userData.ring.material = mats.ring;
  model.userData.outerRing.material = mats.outerRing;
  model.userData.glow.material = mats.glow;
  model.userData.icon.material = mats.icon;
  model.userData.icon.geometry = abilityTokenAssets.iconGeo;
  model.userData.icon.visible = !celestial;
  model.userData.icon.position.set(0, 0.11, 0);
  model.userData.icon.rotation.set(0, 0, 0);
  model.userData.imageIcon.visible = celestial;
  if (celestial) {
    model.userData.imageIcon.material = mats.imageIcon;
    model.userData.imageIcon.rotation.set(0, 0, 0);
    model.userData.imageIcon.position.set(0, 0.65, -0.04);
    model.userData.imageIcon.scale.set(2.2, 2.2, 1);
  }
  model.userData.beacon.material = mats.beacon;
  model.userData.type = type;
}

function createAbilityTokenModel(type) {
  const group = new THREE.Group();
  const mats = getAbilityTokenMaterials(type);
  const pedestal = new THREE.Mesh(abilityTokenAssets.pedestalGeo, mats.pedestal);
  pedestal.position.y = -0.12;
  group.add(pedestal);
  const coin = new THREE.Mesh(abilityTokenAssets.coinGeo, mats.coin);
  coin.rotation.x = Math.PI / 2;
  group.add(coin);
  const ring = new THREE.Mesh(abilityTokenAssets.ringGeo, mats.ring);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);
  const outerRing = new THREE.Mesh(abilityTokenAssets.outerRingGeo, mats.outerRing);
  outerRing.rotation.x = Math.PI / 2;
  outerRing.position.y = -0.02;
  group.add(outerRing);
  const glow = new THREE.Mesh(abilityTokenAssets.glowGeo, mats.glow);
  group.add(glow);
  const icon = new THREE.Mesh(abilityTokenAssets.iconGeo, mats.icon);
  icon.position.y = 0.11;
  group.add(icon);
  const imageIcon = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), getAbilityTokenMaterials('beeFocus').imageIcon);
  imageIcon.position.set(0, 0.65, -0.04);
  imageIcon.scale.set(2.2, 2.2, 1);
  imageIcon.visible = type === 'beeFocus';
  group.add(imageIcon);
  const beacon = new THREE.Mesh(abilityTokenAssets.beaconGeo, mats.beacon);
  beacon.position.y = 0.72;
  group.add(beacon);
  group.userData = { pedestal, coin, ring, outerRing, glow, icon, imageIcon, beacon, type };
  return group;
}

function acquireAbilityTokenModel(type) {
  const model = abilityTokenPool.pop() || createAbilityTokenModel(type);
  setAbilityTokenType(model, type);
  model.visible = true;
  model.scale.setScalar(1.45);
  return model;
}

function releaseAbilityTokenModel(model) {
  if (!model) return;
  scene.remove(model);
  model.visible = false;
  abilityTokenPool.push(model);
}

function chooseAbilityTokenType(fieldType) {
  const r = Math.random();
  if (fieldType === 'rare' && r > 0.62) return 'royalGlow';
  if (fieldType === 'night' && r > 0.66) return 'marketSpark';
  if ((fieldType === 'starter' || fieldType === 'yellow') && r > 0.84) return 'nectarHaze';
  if (r < 0.30) return 'pollenBurst';
  if (r < 0.56) return 'nectarHaze';
  if (r < 0.76) return 'honeyDrop';
  if (r < 0.92) return 'marketSpark';
  return 'royalGlow';
}

function spawnAbilityToken(type, x, z, spread = 1.2) {
  if (game.abilityTokens.length >= 16) return null;
  const def = ABILITY_TOKEN_DEFS[type] || ABILITY_TOKEN_DEFS.pollenBurst;
  const model = acquireAbilityTokenModel(type);
  const ox = x + rand(-spread, spread);
  const oz = z + rand(-spread, spread);
  const y = terrainHeightAt(ox, oz) + 0.75;
  model.position.set(ox, y, oz);
  scene.add(model);
  const token = {
    type, x: ox, z: oz, y, groundY: terrainHeightAt(ox, oz),
    life: def.life, phase: Math.random() * Math.PI * 2,
    spawnAge: 0,
    model,
  };
  game.abilityTokens.push(token);
  return token;
}

function maybeSpawnAbilityToken(flower, chance, sourceBee = null) {
  if (!flower || !fieldUnlocked(flower.fieldType)) return;
  const modeMult = game.swarmMode === 'forage' ? 1.5 : 1.0;
  if (Math.random() > (chance * modeMult)) return;
  const spawnX = Number.isFinite(sourceBee?.x) ? sourceBee.x : flower.x;
  const spawnZ = Number.isFinite(sourceBee?.z) ? sourceBee.z : flower.z;
  spawnAbilityToken(chooseAbilityTokenType(flower.fieldType), spawnX, spawnZ, sourceBee ? 0 : 1.2);
}

function applyAbilityToken(token) {
  const def = ABILITY_TOKEN_DEFS[token.type] || ABILITY_TOKEN_DEFS.pollenBurst;
  game.stats.tokensCollected++;
  if (token.type === 'honeyDrop') {
    const gain = 8 + game.lumens.length * 4;
    game.honey += gain;
    game.honeyAccum += gain;
    showTutorial(`${def.label}: +${gain} honey.`);
    synth.playHoneyChime();
  } else if (token.type === 'pollenBurst') {
    const gain = Math.min(pollenCap() - game.pollen, 6 + game.lumens.length * 2);
    if (gain > 0) game.pollen += gain;
    showTutorial(`${def.label}: +${Math.floor(gain)} pollen.`);
    synth.playPollenPop();
  } else if (token.type === 'beeFocus') {
    // Celest's token starts the routing challenge. Only linked bees receive the
    // multiplier; collecting it no longer grants an unrelated global tool buff.
    if (!game.bloom) {
      const elig = eligibleBees();
      if (elig.length >= T.bloom.minBees) {
        startBloom(elig);
        showTutorial('Celestial Link ready — reach the Celest marked START.');
      } else {
        showTutorial('Bloom Chain needs at least 3 active Lumens.');
      }
    } else {
      showTutorial('A Bloom Chain is already active.');
    }
    synth.playBell();
  } else if (token.type === 'nectarHaze') {
    const changed = pollinateNearbyFlowers(token.x, token.z, 8, 18 + game.equipment.scanner.level * 2, 75);
    showTutorial(changed > 0 ? `${def.label}: pollinated ${changed} flowers into richer tiers.` : `${def.label}: nearby flowers are already max tier.`);
    synth.playBell();
  } else if (token.type === 'marketSpark') {
    game.tokenBuffs.marketSpark = Math.min(5, game.tokenBuffs.marketSpark + 1);
    game.market.lastEvent = 'Market spark';
    showTutorial(`${def.label}: next forecast gets safer odds.`);
    synth.playBell();
  } else if (token.type === 'royalGlow') {
    game.tokenBuffs.royal = Math.max(game.tokenBuffs.royal, 45);
    showTutorial(`${def.label}: better rare hatch odds for a short time.`);
    synth.playCasino(true);
  }
  game.market.uiDirty = true;
  game.ui.fullMarketDirty = true;
}

function updateAbilityTokenVisual(token, dt) {
  if (!token?.model) return;
  const celestial = token.type === 'beeFocus';
  token.spawnAge = Math.min(ABILITY_TOKEN_SPAWN_TIME, (token.spawnAge || 0) + dt);
  const spawnT = clamp(token.spawnAge / ABILITY_TOKEN_SPAWN_TIME, 0, 1);
  const spawnEase = spawnT * spawnT * (3 - 2 * spawnT);
  const forming = spawnT < 1;

  token.phase += dt * 3.8;
  const hoverY = (token.groundY || 0) + 0.86 + Math.sin(token.phase) * (celestial ? 0.12 : 0.16);
  const introY = (token.groundY || 0) + 1.62;
  token.y = lerp(introY, hoverY, spawnEase);
  token.model.position.set(token.x, token.y, token.z);
  token.model.rotation.y += dt * (forming ? (celestial ? 12.5 : 8.5) : (celestial ? 0.62 : 1.2));

  const u = token.model.userData;
  u.coin.rotation.z += dt * (celestial ? 0.55 : 1.25);
  u.ring.rotation.z -= dt * (forming ? 5.0 : (celestial ? 0.85 : 2.2));
  u.outerRing.rotation.z += dt * (forming ? 4.2 : (celestial ? 0.72 : 1.35));
  if (celestial) {
    u.icon.rotation.x = 0;
    u.icon.rotation.y = 0;
    u.icon.rotation.z = 0;
    // Stand straight up vertically and slowly spin around the Y-axis
    u.imageIcon.rotation.y += dt * (forming ? 4.5 : 1.25);
    u.imageIcon.rotation.x = 0;
    u.imageIcon.rotation.z = 0;
    u.imageIcon.material.opacity = forming ? lerp(0.25, 0.96, spawnEase) : 0.96;
  } else {
    u.icon.rotation.y -= dt * 3.5;
    u.icon.rotation.x += dt * 2.0;
  }
  const glowWave = Math.sin(token.phase * 1.45) * 0.5 + 0.5;
  u.beacon.material.opacity = (celestial ? 0.035 : 0.055) + glowWave * (celestial ? 0.055 : 0.08);
  u.outerRing.material.opacity = (celestial ? 0.16 : 0.22) + glowWave * (celestial ? 0.08 : 0.11);
  u.glow.material.opacity = (celestial ? 0.07 : 0.1) + glowWave * (celestial ? 0.035 : 0.05);
  const pulse = (celestial ? 1.18 : 1.34) + Math.sin(token.phase * 1.6) * (celestial ? 0.055 : 0.1);
  token.model.scale.setScalar(lerp(0.24, pulse, spawnEase));
}

function updateAbilityTokens(dt) {
  const p = game.player;
  for (let i = game.abilityTokens.length - 1; i >= 0; i--) {
    const t = game.abilityTokens[i];
    t.life -= dt;
    updateAbilityTokenVisual(t, dt);
    const d = dist2(p.x, p.z, t.x, t.z);
    // Ability tokens are deliberate touch pickups. They stay exactly where the
    // bee spawned them; magnets affect pollen/honey drops, not ability tokens.
    const collectionReady = (t.spawnAge || 0) >= ABILITY_TOKEN_SPAWN_TIME * 0.82;
    if (collectionReady && d < ABILITY_TOKEN_TOUCH_RADIUS) {
      applyAbilityToken(t);
      releaseAbilityTokenModel(t.model);
      game.abilityTokens.splice(i, 1);
      continue;
    }
    if (t.life <= 0) {
      releaseAbilityTokenModel(t.model);
      game.abilityTokens.splice(i, 1);
      continue;
    }
  }
}

function updateTokenBuffs(dt) {
  game.tokenBuffs.focus = Math.max(0, game.tokenBuffs.focus - dt);
  game.tokenBuffs.royal = Math.max(0, game.tokenBuffs.royal - dt);
}

const honeyJarAssets = {
  jarGeo: new THREE.CylinderGeometry(0.28, 0.28, 0.52, 6),
  jarMat: new THREE.MeshPhysicalMaterial({
    color: 0xff8a1c,
    emissive: 0x6a2600,
    emissiveIntensity: 0.45,
    roughness: 0.18,
    transparent: true,
    opacity: 0.82,
    transmission: 0.35
  }),
  corkGeo: new THREE.CylinderGeometry(0.18, 0.15, 0.1, 8),
  corkMat: new THREE.MeshLambertMaterial({ color: 0x5a3215 }),
  honeyGeo: new THREE.CylinderGeometry(0.21, 0.21, 0.38, 6),
  honeyMat: new THREE.MeshBasicMaterial({ color: 0xffd24a }),
  ringGeo: new THREE.TorusGeometry(0.38, 0.025, 6, 18),
  ringMat: new THREE.MeshBasicMaterial({ color: 0x28d7c5, transparent: true, opacity: 0.7 }),
};
const honeyJarPool = [];

function createHoneyJarModel() {
  const group = new THREE.Group();

  // Hexagonal Glass Jar Body
  const jar = new THREE.Mesh(honeyJarAssets.jarGeo, honeyJarAssets.jarMat);
  jar.castShadow = true;
  group.add(jar);

  // Cork stopper top
  const cork = new THREE.Mesh(honeyJarAssets.corkGeo, honeyJarAssets.corkMat);
  cork.position.y = 0.26;
  group.add(cork);

  // Golden glowing core inside
  const honey = new THREE.Mesh(honeyJarAssets.honeyGeo, honeyJarAssets.honeyMat);
  honey.position.y = -0.02;
  group.add(honey);

  const ring = new THREE.Mesh(honeyJarAssets.ringGeo, honeyJarAssets.ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.23;
  group.add(ring);

  group.userData.jar = jar;
  group.userData.ring = ring;
  group.scale.set(1.08, 1.08, 1.08);
  return group;
}

function acquireHoneyJarModel() {
  const model = honeyJarPool.pop() || createHoneyJarModel();
  model.visible = true;
  model.rotation.set(0, 0, 0);
  return model;
}

function releaseHoneyJarModel(model) {
  if (!model) return;
  scene.remove(model);
  model.visible = false;
  honeyJarPool.push(model);
}

function createSkyElements() {
  // Sun
  const sunGeo = new THREE.SphereGeometry(3, 16, 12);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffde0 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(120, 72, -90);
  scene.add(sun);

  // Cloud puffs
  const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
  for (let i = 0; i < 8; i++) {
    const cGroup = new THREE.Group();
    for (let j = 0; j < 4; j++) {
      const sz = 3 + Math.random() * 5;
      const puff = new THREE.Mesh(new THREE.SphereGeometry(sz, 8, 6), cloudMat);
      puff.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*2, (Math.random()-0.5)*6);
      puff.scale.y = 0.5;
      cGroup.add(puff);
    }
    cGroup.position.set(
      (Math.random()-0.5) * 200,
      35 + Math.random() * 20,
      (Math.random()-0.5) * 280
    );
    cGroup.userData.speed = 0.3 + Math.random() * 0.5;
    scene.add(cGroup);
    game.clouds.push(cGroup);
  }

  return sun;
}

// ======================== TUNING CONSTANTS ========================
const T = {
  flower: {
    yieldMult: [0.1, 0.33, 0.66, 1.0],
    harvestTimeMult: [1.6, 1.3, 1.15, 1.0],
    regenPerPhase: 2.5,
    basePollen: 3.2,
    harvestBaseTime: 1.65,
    // Vitality: each harvest of the SAME flower before it recovers wears it down
    // (shorter, grayer, dimmer burst). Recovers when left alone.
    vitalityHit: 0.34,        // vitality lost per harvest (≈3 hits to fully wilt)
    vitalityRecover: 0.06,    // vitality regained per second when left alone (~16s full)
  },
  lumen: {
    baseSpeed: 6.5,
    carryCap: 16,
    passiveSpeedMult: 0.62,
    passiveGatherMult: 0.32,
    passiveHarvestTimeMult: 2.1,
  },
  tool: {
    baseCooldown: 0.95,
    minCooldown: 0.34,
    baseRadius: 3.7,
    basePower: 0.28,
  },
  hive: {
    refineBase: 5,
    pollenCapBase: 100,
    conversionRadius: 6.4,
    beeConvertBase: 0.2,
    conversionPayloadSeconds: 20,
    conversionRest: 1.8,
    conversionSpeedMult: 0.58,
  },
  dayLength: 120,
  nightPollenBonus: 1.25,
  bloom: {
    touchRadius: 3.4, perTouchTime: 5, readyTimeout: 8,
    cooldown: 40, minBees: 3, triggerChance: 0.32, checkInterval: 8,
  },
};

const ISLE_RADIUS = 132;
const PLAYER_RADIUS = 0.48;
const MAX_MOTION_STEP = 0.2;
const HIVE_POS = { x: 0, z: 88 };           // central bay — default hive reference
const PLAYER_START = { x: 0, z: 72 };        // in the starting plaza, facing the hive row
const TRADE_POS = { x: 38, z: 70 };          // stock terminal, in the starting plaza
const SHOP_POS  = { x: -50, z: 86 };         // walk-up shop stall, tucked at the left end of the hive row
const HIVE_WORLD_SCALE = 1.06;
const FLOWER_WORLD_SCALE = 1.10;
const BEE_WORLD_SCALE = 1.10;

// Bee Swarm Simulator–style apiary: a row of claimable hive bays along one edge.
// The bays FACE the plaza (toward -Z / the meadow); the deck & fence sit behind them
// on the island rim. Keep them in one clean row so every comb board lines up.
const HIVE_BAY_COUNT = 5;
const HIVE_BAYS = [];
for (let k = -2; k <= 2; k++) {
  HIVE_BAYS.push({ x: k * 20.8, z: HIVE_POS.z });
}
const APIARY_CENTER = { x: 0, z: HIVE_POS.z + 1 };
const BAY_FACING = Math.PI;                  // bays rotated to face the plaza
const APIARY_DECK_Z = APIARY_CENTER.z + 3;
const APIARY_DECK_HALF_W = ((HIVE_BAYS[HIVE_BAY_COUNT - 1].x - HIVE_BAYS[0].x) + 22) / 2;
const FIELD_DEFS = [
  {
    id: 'starter', name: 'Starter Field', center: { x: 0, z: 48 }, radius: 21, elevation: 0,
    count: 150, hues: ['#ffcc66', '#ff88aa', '#ffffff'], maxPollen: 9, regrowth: 1.35,
    valueMult: 0.85, honeyType: 'Glow Honey', zoneColor: 0xffcc66, gateBees: 1
  },
  {
    id: 'yellow', name: 'Yellow Bloom Field', center: { x: 50, z: 16 }, radius: 25, elevation: 1.4,
    count: 132, hues: ['#ffcc00', '#ffd85a', '#ffad33', '#fff2a6'], maxPollen: 15, regrowth: 0.9,
    valueMult: 1.25, honeyType: 'Sun Honey', zoneColor: 0xffcc00, gateBees: 5
  },
  {
    id: 'blue_dew', name: 'Blue Dew Field', center: { x: -52, z: -16 }, radius: 27, elevation: 2.2,
    count: 144, hues: ['#00e5ff', '#6aa9ff', '#78f0d4', '#d3ffff'], maxPollen: 20, regrowth: 0.7,
    valueMult: 1.55, honeyType: 'Dew Honey', zoneColor: 0x28d7c5, gateBees: 10
  },
  {
    id: 'rare', name: 'Royal Field', center: { x: 42, z: -56 }, radius: 18, elevation: 4.5,
    count: 76, hues: ['#d946ef', '#ff66cc', '#ffee66', '#b48cff'], maxPollen: 28, regrowth: 0.42,
    valueMult: 2.15, honeyType: 'Rare Honey', zoneColor: 0xd946ef, gateBees: 25
  },
  {
    id: 'night', name: 'Night Field', center: { x: -58, z: -70 }, radius: 24, elevation: 3.4,
    count: 112, hues: ['#7c5cff', '#8ad7ff', '#b48cff', '#f3e8ff'], maxPollen: 24, regrowth: 0.55,
    valueMult: 1.75, honeyType: 'Moon Honey', zoneColor: 0x6956d8, gateBees: 15
  },
];
const FLOWER_HUES = ['#ff6090','#d946ef','#ffcc00','#00ff66','#ff7722','#6699ff','#00e5ff'];
// Bee-Swarm-style flower colours: every field is mostly ONE of red / blue / white,
// with a light sprinkle of the other two. Bright, saturated hues so blooms pop off
// the pale meadow instead of blending into it.
const FLOWER_COLORS = { red: '#ff3b5c', blue: '#3f86ff', white: '#fdfdff' };
const FLOWER_COLOR_KEYS = ['red', 'blue', 'white'];
const FIELD_FLOWER_DOMINANT = { starter: 'white', yellow: 'red', blue_dew: 'blue', rare: 'red', night: 'blue' };
function pickFlowerHue(field) {
  const dom = FIELD_FLOWER_DOMINANT[field.id] || 'white';
  // ~72% dominant colour, the rest split between the other two.
  if (Math.random() < 0.72) return FLOWER_COLORS[dom];
  const others = FLOWER_COLOR_KEYS.filter(k => k !== dom);
  return FLOWER_COLORS[others[Math.random() < 0.5 ? 0 : 1]];
}
const BEE_TYPES = [
  { name:'dew', hue:'#00e5ff' },
  { name:'solar', hue:'#ffcc00' },
  { name:'ember', hue:'#ff5722' },
  { name:'mist', hue:'#d946ef' },
];
// Each bee type has its own colour, look accent and signature ability.
const BEE_RARITIES = [
  { rarity: 'Common', chance: 0.64, gatherPower: 1, speed: 1, hue: '#ffd21f', type: 'Worker Bee', role: 'Gatherer', ability: 'sturdy', abilityName: 'Steady Hands', accent: 'none' },
  { rarity: 'Uncommon', chance: 0.24, gatherPower: 1.25, speed: 1.08, hue: '#33e0a0', type: 'Scout Bee', role: 'Scout', ability: 'haste', abilityName: 'Quick Wings', accent: 'visor' },
  { rarity: 'Rare', chance: 0.09, gatherPower: 1.65, speed: 1.16, hue: '#5fb8ff', type: 'Celest Lumen', role: 'Weaver', ability: 'bloomLink', abilityName: 'Bloom Chain', accent: 'halo' },
  { rarity: 'Epic', chance: 0.025, gatherPower: 2.1, speed: 1.24, hue: '#a574ff', type: 'Pulse Bee', role: 'Token Maker', ability: 'token', abilityName: 'Token Pulse', accent: 'crown' },
  { rarity: 'Legendary', chance: 0.005, gatherPower: 2.75, speed: 1.34, hue: '#ff7a3a', type: 'Royal Bee', role: 'Field Captain', ability: 'pollinate', abilityName: 'Royal Bloom', accent: 'crown' },
];
// Your very first bee — a serene blue light-bee that weaves the Bloom Link web.
const CELEST_LUMEN = {
  rarity: 'Celestial', chance: 0, gatherPower: 1.2, speed: 1.14, hue: '#5fb8ff',
  type: 'Celest Lumen', role: 'Weaver', ability: 'bloomLink', abilityName: 'Bloom Chain', accent: 'halo'
};
const ALL_BEE_TEMPLATES = [...BEE_RARITIES, CELEST_LUMEN];
const INITIAL_HEX_SLOTS = 48;
const DEAD_FLOWER_COLOR = new THREE.Color(0x3a4030);
const POLLINATED_FLOWER_COLOR = new THREE.Color(0xfff2a6);
const FULL_FLOWER_PLOT_COLOR = new THREE.Color(0x65b85d);
const EMPTY_FLOWER_PLOT_COLOR = new THREE.Color(0x253229);
const tempFlowerColor = new THREE.Color();
const tempBurstColor = new THREE.Color();
const BURST_GRAY_COLOR = new THREE.Color(0x70726b);   // worn-flower harvest burst fades toward this

// Harvest-burst tint: bright flower hue when the flower is fresh, fading toward a
// dull gray the more it has been over-picked (uses vitality captured at harvest).
function harvestBurstHex(flower) {
  const v = clamp(flower.lastHarvestVitality ?? 1, 0, 1);
  return tempBurstColor.set(flower.hue).lerp(BURST_GRAY_COLOR, (1 - v) * 0.82).getHex();
}
const FLOWER_TIER_CAPACITY = [0, 30, 45, 60, 75, 90];
const FLOWER_TIER_REGEN = [0, 1.0, 1.18, 1.38, 1.62, 1.9];
const FLOWER_TIER_YIELD = [0, 1.0, 1.16, 1.34, 1.56, 1.82];
const FLOWER_TIER_DEPLETION = [0, 1.0, 0.9, 0.8, 0.68, 0.56];
// Beyond this distance (squared) from the camera, a flower skips its per-frame
// visual refresh. ~58 world units comfortably covers the field you're standing in.
const FLOWER_VISUAL_CULL_SQ = 58 * 58;
const FLOWER_RENDER_CULL_SQ = 66 * 66;

// ======================== GAME STATE ========================
const game = {
  running: false,
  phase: 'unclaimed', // 'unclaimed' -> 'playing'
  time: 0,
  pollen: 0,
  hivePollen: 0,
  honey: 100,
  hps: 0,
  honeyAccum: 0,
  hpsTimer: 0,
  nextPollenSound: 0,
  nextHoneySound: 0,
  marketPanelOpen: false,
  pendingRivalClaims: [],
  flowers: [],
  lumens: [],
  pollenOrbs: [],
  honeyJars: [],
  harvestFX: [],
  abilityTokens: [],
  butterflies: [],
  honeyBonds: null,
  honeyRefinedAccum: 0,
  conversionStarted: false,
  tokenBuffs: { focus: 0, royal: 0, marketSpark: 0 },
  stats: {
    fieldPollen: {},
    convertedPollen: 0,
    tokensCollected: 0,
    eggsHatched: 0,
    marketTrades: 0,
  },
  questIndex: 0,
  questJustCompletedAt: -1,
  swarmMode: 'swarm',
  eggs: [],
  nextBeeId: 1,
  beeSlots: Array.from({ length: INITIAL_HEX_SLOTS }, (_, i) => ({
    id: `slot_${String(i + 1).padStart(3, '0')}`,
    unlocked: i < 3,
    beeId: null
  })),
  equipment: {
    tool: { level: 0 },
    pack: { level: 0 },
    boots: { level: 0 },
    whistle: { level: 0 },
    magnet: { level: 0 },
    jar: { level: 0 },
    scanner: { level: 0 },
  },
  perks: {
    discipline: { level: 0, base: 80, name: 'Bee Discipline', desc: '+2% bee gather speed per level' },
    handling: { level: 0, base: 70, name: 'Pollen Handling', desc: '+5 pollen pack capacity per level' },
    refinement: { level: 0, base: 95, name: 'Honey Refinement', desc: '+1% conversion bonus per level' },
    instinct: { level: 0, base: 110, name: 'Market Instinct', desc: '+1% safer Honey Forecast roll per level (max +10%)' },
    architecture: { level: 0, base: 125, name: 'Hive Architecture', desc: '-1% hive slot costs per level' },
  },
  playerProfile: {
    playerId: 'local_operator',
    displayName: 'Hive Operator',
    marketHoldings: {},
    seasonStats: { netHiveValue: 0, honeyFlow: 0, beesOwned: 0, rareBeesOwned: 0, seasonRank: null },
  },
  leaderboardTypes: {
    entry: { playerId: '', displayName: '', netHiveValue: 0, honeyFlow: 0, beesOwned: 0, rareBeesOwned: 0, seasonRank: 0 },
    marketTick: { marketId: '', price: 0, supply: 0, demand: 0, eventModifier: 0, timestamp: 0 },
  },
  ui: {
    perkOpen: false, fullMarketOpen: false, shopOpen: true,
    inventoryOpen: false, helpOpen: false, eggConfirmOpen: false,
    fullMarketDirty: true, shopTab: 'bees', selectedEggIndex: 0, dragEggType: null, pendingHatch: null,
  },
  playerHistory: [],
  clouds: [],
  flashes: [],
  camera: {
    yaw: 0,
    pitch: 0.83,
    distance: 34,
    minDistance: 18,
    maxDistance: 72,
    dragging: false,
    shiftLock: false,
    pointerLocked: false,
    lastX: 0,
    lastY: 0,
    sensitivity: 0.0035,
    firstPerson: false,
  },
  player: {
    x: PLAYER_START.x, z: PLAYER_START.z,
    facing: 0,
    speed: 14,
    moving: false,
    model: null,
    footstepTimer: 0,
    walkPhase: 0,
    groundY: 0,
    vx: 0,
    vz: 0,
    toolCooldown: 0,
    toolSwing: 0,
    toolHeld: false,
    toolBeamTimer: 0,
  },
  hive: { ...HIVE_POS, claimed: false, model: null, bayIndex: null, slotMeshes: [] },
  apiary: null,
  colliders: [],
  tradePost: { ...TRADE_POS, model: null },
  bloom: null,
  bloomAfterglow: null,
  bloomCooldown: 4,
  bloomCheck: T.bloom.checkInterval,
  tutorial: { step: 0, timer: 0, text: '' },
  upgrades: {
    bees:    { level: 0, base: 22,  growth: 1.55 },
    speed:   { level: 0, base: 55,  growth: 1.65 },
    refine:  { level: 0, base: 48,  growth: 1.6  },
    storage: { level: 0, base: 42,  growth: 1.5  },
    pollen:  { level: 0, base: 64,  growth: 1.72 },
    marketTerminal: { level: 0, base: 220, growth: 1.7 },
  },
  market: {
    tick: 0, interval: 2.2,
    selectedAssetIndex: 0,
    tradeQty: 1,
    newsTimer: 10,
    lastEvent: 'Calm skies',
    forecastLog: [],
    uiDirty: true,
    rows: [],
    assets: [
      { id:'glow_honey', sym:'GLWH', name:'Glow Honey', price:10, prev:10, owned:0, hist:Array(30).fill(10), priceHistory:[], drift:0.003, eventModifier:0, playerPressure:0, vol:0.035, supply:980, demand:1040, hue:'#ffcc00' },
      { id:'sun_honey', sym:'SUNH', name:'Sun Honey', price:14, prev:14, owned:0, hist:Array(30).fill(14), priceHistory:[], drift:0.004, eventModifier:0, playerPressure:0, vol:0.045, supply:900, demand:980, hue:'#ffad33' },
      { id:'dew_honey', sym:'DEWH', name:'Dew Honey', price:18, prev:18, owned:0, hist:Array(30).fill(18), priceHistory:[], drift:0.002, eventModifier:0, playerPressure:0, vol:0.06, supply:760, demand:850, hue:'#28d7c5' },
      { id:'moon_honey', sym:'MOON', name:'Moon Honey', price:22, prev:22, owned:0, hist:Array(30).fill(22), priceHistory:[], drift:0.002, eventModifier:0, playerPressure:0, vol:0.08, supply:620, demand:700, hue:'#8a7cff' },
      { id:'royal_honey_fund', sym:'RHF', name:'Royal Honey Fund', price:30, prev:30, owned:0, hist:Array(30).fill(30), priceHistory:[], drift:0.004, eventModifier:0, playerPressure:0, vol:0.075, supply:520, demand:610, hue:'#ffe08a' },
      { id:'rare_bee_index', sym:'RBI', name:'Rare Bee Index', price:8, prev:8, owned:0, hist:Array(30).fill(8), priceHistory:[], drift:0.001, eventModifier:0, playerPressure:0, vol:0.05, supply:430, demand:480, hue:'#d946ef' },
    ],
  },
};

// Derived stats
const beeSpeed   = () => T.lumen.baseSpeed * (1 + 0.13 * game.upgrades.speed.level + 0.06 * game.equipment.whistle.level + 0.02 * game.perks.discipline.level) * (game.tokenBuffs.focus > 0 ? 1.25 : 1);
const beeHarvestSpeedMult = () => 1 + 0.02 * game.perks.discipline.level;
const honeyConversionRate = () => 1 + 0.01 * game.perks.refinement.level + 0.03 * game.equipment.jar.level;
const pollenCap  = () => T.hive.pollenCapBase + 50 * game.upgrades.storage.level + 40 * game.equipment.pack.level + 5 * game.perks.handling.level;
const pollenAdd  = () => 2 * game.upgrades.pollen.level;
const pickupRadius = () => (6 + game.equipment.magnet.level * 0.8) * (game.swarmMode === 'swarm' ? 1.4 : 1.0);
const toolRadius = () => T.tool.baseRadius + game.equipment.tool.level * 0.24;
const toolPower = () => T.tool.basePower + game.equipment.tool.level * 0.24 + game.upgrades.pollen.level * 0.08 + (game.tokenBuffs.focus > 0 ? 0.28 : 0);
const toolCooldown = () => Math.max(T.tool.minCooldown, T.tool.baseCooldown - game.equipment.tool.level * 0.025);
function toolPattern() {
  const lvl = game.equipment.tool.level || 0;
  if (lvl >= 8) return 'strongest';
  if (lvl >= 6) return 'grid';
  if (lvl >= 4) return 'ring';
  if (lvl >= 2) return 'line';
  return 'single';
}
const dayPhase   = () => (game.time % T.dayLength) / T.dayLength;
const nightFactor= () => (1 - Math.cos(dayPhase() * Math.PI * 2)) / 2;
const isNight    = () => nightFactor() > 0.5;
const eggCost = () => Math.floor(25 * Math.pow(1.35, game.lumens.length));
const packCost = () => Math.floor(50 * Math.pow(1.6, game.equipment.pack.level));
const bootsCost = () => Math.floor(70 * Math.pow(1.55, game.equipment.boots.level));
const whistleCost = () => Math.floor(80 * Math.pow(1.55, game.equipment.whistle.level));
const magnetCost = () => Math.floor(95 * Math.pow(1.55, game.equipment.magnet.level));
const jarCost = () => Math.floor(120 * Math.pow(1.58, game.equipment.jar.level));
const scannerCost = () => Math.floor(130 * Math.pow(1.62, game.equipment.scanner.level));
const toolCost = () => Math.floor(45 * Math.pow(1.48, game.equipment.tool.level));
const slotCost = () => Math.floor((75 * Math.pow(1.45, game.beeSlots.filter(s => s.unlocked).length - 3)) * (1 - Math.min(0.25, game.perks.architecture.level * 0.01)));
const perkCost = key => Math.floor(game.perks[key].base * Math.pow(1.75, game.perks[key].level));

function beeBaseConversionRate(bee) {
  const power = clamp(bee?.gatherPower || 1, 0.8, 3.4);
  const level = Math.max(1, bee?.level || 1);
  const rarity = String(bee?.rarity || '').toLowerCase();
  let rarityMult = 1;
  if (rarity === 'uncommon') rarityMult = 1.08;
  else if (rarity === 'rare') rarityMult = 1.18;
  else if (rarity === 'epic') rarityMult = 1.34;
  else if (rarity === 'legendary') rarityMult = 1.55;
  else if (rarity === 'celestial') rarityMult = 1.22;
  return T.hive.beeConvertBase * (0.72 + power * 0.28) * rarityMult * (1 + (level - 1) * 0.045);
}

function beeConversionRate(bee) {
  const base = typeof bee?.conversionRate === 'number' && isFinite(bee.conversionRate)
    ? bee.conversionRate
    : beeBaseConversionRate(bee);
  return base * (1 + 0.08 * game.upgrades.refine.level + 0.012 * game.perks.refinement.level + 0.07 * game.equipment.jar.level);
}

const refineRate = () => game.lumens.reduce((sum, bee) => sum + beeConversionRate(bee), 0);

// The Honey Jar also accelerates the at-hive conversion itself: each level makes
// bees shuttle pollen to the comb faster and rest less between trips, so banked
// pollen turns into honey noticeably quicker (on top of the bigger per-bee flow).
const jarShuttleBonus = () => 0.06 * game.equipment.jar.level;

// O(1) id -> def lookup. fieldDef() is called per flower, per frame (and again for
// every bee target pick), so the old linear FIELD_DEFS.find() scan was pure waste.
const FIELD_BY_ID = Object.fromEntries(FIELD_DEFS.map(f => [f.id, f]));
function fieldDef(fieldType) {
  return FIELD_BY_ID[fieldType];
}

function fieldAtPosition(x, z, margin = 1.04) {
  let best = null;
  let bestRatio = Infinity;
  for (const field of FIELD_DEFS) {
    const ratio = dist2(x, z, field.center.x, field.center.z) / field.radius;
    if (ratio <= margin && ratio < bestRatio) {
      best = field;
      bestRatio = ratio;
    }
  }
  return best;
}

// Nearby-mode bees should work the whole field the keeper entered, not only the
// few flowers directly under the player. Each bee advances through a different
// rotating sector/radius target so a larger squad naturally fans out.
function pickFlowerAcrossField(b, field) {
  if (!field || !fieldUnlocked(field.id)) return null;
  const cycle = b.forageCycle || 0;
  const squadSize = Math.max(1, game.lumens.length);
  const angle = ((b.swarmIndex || 0) / squadSize) * Math.PI * 2 + cycle * 2.399963229728653;
  const radialStep = ((b.swarmIndex || 0) * 0.37 + cycle * 0.29) % 1;
  const radius = field.radius * (0.25 + radialStep * 0.58);
  const targetX = field.center.x + Math.sin(angle) * radius;
  const targetZ = field.center.z + Math.cos(angle) * radius;

  let best = null;
  let bestScore = -Infinity;
  for (const flower of game.flowers) {
    if (flower.fieldType !== field.id || flower.pollen <= 0.2 || flower.claims > 0) continue;
    const fullness = flower.maxPollen ? flower.pollen / flower.maxPollen : flower.phase / 3;
    const sectorDistance = dist2(flower.x, flower.z, targetX, targetZ);
    const flightDistance = dist2(b.x, b.z, flower.x, flower.z);
    const score = fullness * 4
      + flowerEffectiveTier(flower) * 0.45
      - sectorDistance / Math.max(4, field.radius * 0.42)
      - flightDistance / Math.max(16, field.radius * 3.5);
    if (score > bestScore) {
      bestScore = score;
      best = flower;
    }
  }
  return best;
}

// Ground height at a world position. Higher-tier fields sit on raised plateaus
// (the "mountain" fields); the slope eases up over a ring just outside the plot
// so the player, bees, flowers and orbs all share one consistent surface.
function terrainHeightAt(x, z) {
  let h = 0;
  for (const f of FIELD_DEFS) {
    const e = f.elevation || 0;
    if (e <= 0) continue;
    const d = dist2(x, z, f.center.x, f.center.z);
    const flat = f.radius + 0.5;          // full height across the whole plot
    const foot = flat + e * 1.7 + 4;      // slope meets the meadow here
    if (d <= flat) { if (e > h) h = e; }
    else if (d < foot) {
      const t = 1 - (d - flat) / (foot - flat);
      const hh = e * (t * t * (3 - 2 * t));  // smoothstep ease
      if (hh > h) h = hh;
    }
  }

  // Static walkable surfaces in the apiary. Keeping this in the same height
  // query as field terrain prevents the keeper and camera from clipping through
  // the deck or the low hexagonal hive plinths.
  if (Math.abs(x) <= APIARY_DECK_HALF_W && Math.abs(z - APIARY_DECK_Z) <= 6) {
    h = Math.max(h, 0.3);
  }
  for (const bay of HIVE_BAYS) {
    const platformZ = bay.z + 0.4 * HIVE_WORLD_SCALE; // local z -0.4 rotated by BAY_FACING
    const platformR = 4.85 * HIVE_WORLD_SCALE;
    if (sqDist(x, z, bay.x, platformZ) <= platformR * platformR) h = Math.max(h, 0.6);
  }
  return h;
}

function fieldUnlocked(fieldType) {
  const def = fieldDef(fieldType);
  if (!def) return true;
  return game.phase === 'playing' && game.lumens.length >= (def.gateBees || 0);
}

function nextFieldUnlock() {
  return FIELD_DEFS
    .filter(f => (f.gateBees || 0) > game.lumens.length)
    .sort((a, b) => (a.gateBees || 0) - (b.gateBees || 0))[0] || null;
}

function flowerTierIndex(tier) {
  return clamp(Math.round(tier || 1), 1, 5);
}

function flowerTierCapacity(tier) {
  return FLOWER_TIER_CAPACITY[flowerTierIndex(tier)];
}

function flowerTierRegenMult(tier) {
  return FLOWER_TIER_REGEN[flowerTierIndex(tier)];
}

function flowerTierYieldMult(tier) {
  return FLOWER_TIER_YIELD[flowerTierIndex(tier)];
}

function flowerTierDepletionMult(tier) {
  return FLOWER_TIER_DEPLETION[flowerTierIndex(tier)];
}

function flowerEffectiveTier(flower) {
  const base = flowerTierIndex(flower?.baseTier || flower?.tier || 1);
  return flowerTierIndex(base + (flower?.pollinatedTier || 0));
}

function syncFlowerTier(flower, keepRatio = true) {
  if (!flower) return;
  const nextTier = flowerEffectiveTier(flower);
  const oldMax = Math.max(1, flower.maxPollen || flowerTierCapacity(nextTier));
  const ratio = clamp((flower.pollen ?? oldMax) / oldMax, 0, 1);
  flower.tier = nextTier;
  flower.maxPollen = flowerTierCapacity(nextTier);
  flower.pollen = keepRatio ? flower.maxPollen * ratio : Math.min(flower.pollen ?? flower.maxPollen, flower.maxPollen);
  flower.phase = clamp(Math.ceil((flower.pollen / flower.maxPollen) * 3), 0, 3);

  // Distinct per-tier silhouette, modelled on Bee Swarm Simulator flowers:
  //   T1 single bloom · T2 double · T3 triple · T4 one LARGE bloom · T5 large + star.
  const isLarge = nextTier >= 4;
  flower.headScaleTier = nextTier >= 5 ? 1.62 : nextTier === 4 ? 1.46 : 1 + (nextTier - 1) * 0.06;

  const data = flower.model?.userData;
  if (!data) return;
  if (data.star) data.star.visible = nextTier >= 5;
  if (data.tierBlooms) {
    // Side blooms appear for double/triple, then fold away as the bloom fuses
    // into a single large flower at tier 4-5.
    data.tierBlooms.forEach((bloom, index) => {
      bloom.visible = !isLarge && nextTier >= index + 2;
    });
  }
  if (data.tierPips) {
    data.tierPips.forEach((pip, index) => {
      pip.visible = index < nextTier;
      if (pip.material) pip.material.color.setHex((flower.pollinatedTier || 0) > 0 ? 0x28d7c5 : 0xfff36b);
    });
  }
  if (data.tierRing) {
    const ringScale = 0.82 + nextTier * 0.13;
    data.tierRing.scale.setScalar(ringScale);
  }
}

function pollinateFlower(flower, seconds = 60, tiers = 1) {
  if (!flower || !fieldUnlocked(flower.fieldType)) return false;
  const base = flowerTierIndex(flower.baseTier || 1);
  const maxBonus = Math.max(0, 5 - base);
  if (maxBonus <= 0) {
    flower.flash = 1;
    return true;
  }
  flower.pollinatedTier = clamp((flower.pollinatedTier || 0) + tiers, 0, maxBonus);
  flower.pollinationTimer = Math.min(240, (flower.pollinationTimer || 0) + seconds);
  flower.flash = 1;
  syncFlowerTier(flower, true);
  return true;
}

function pollinateNearbyFlowers(x, z, radius, count, seconds = 60, preferFieldType = null) {
  const radiusSq = radius * radius;
  const candidates = [];
  for (const f of game.flowers) {
    if (!fieldUnlocked(f.fieldType)) continue;
    if (preferFieldType && f.fieldType !== preferFieldType) continue;
    const dx = f.x - x, dz = f.z - z;
    const d = dx * dx + dz * dz;
    if (d <= radiusSq && flowerEffectiveTier(f) < 5) candidates.push({ f, d: d + Math.random() * 2.2 });
  }
  candidates.sort((a, b) => a.d - b.d);
  let changed = 0;
  for (let i = 0; i < Math.min(count, candidates.length); i++) {
    if (pollinateFlower(candidates[i].f, seconds, 1)) changed++;
  }
  return changed;
}

function randomFlowerBaseTier(field) {
  const r = Math.random();
  if (field.id === 'starter') {
    if (r < 0.74) return 1;
    if (r < 0.95) return 2;
    return 3;
  }
  if (field.id === 'yellow') {
    if (r < 0.48) return 1;
    if (r < 0.82) return 2;
    if (r < 0.97) return 3;
    return 4;
  }
  if (field.id === 'blue_dew') {
    if (r < 0.38) return 1;
    if (r < 0.72) return 2;
    if (r < 0.94) return 3;
    return 4;
  }
  if (field.id === 'night') {
    if (r < 0.16) return 1;
    if (r < 0.50) return 2;
    if (r < 0.82) return 3;
    if (r < 0.97) return 4;
    return 5;
  }
  if (field.id === 'rare') {
    if (r < 0.10) return 1;
    if (r < 0.34) return 2;
    if (r < 0.66) return 3;
    if (r < 0.92) return 4;
    return 5;
  }
  return 1;
}

function recordFieldPollen(fieldType, amount) {
  if (!fieldType || amount <= 0) return;
  game.stats.fieldPollen[fieldType] = (game.stats.fieldPollen[fieldType] || 0) + amount;
}

function queueEgg(type = 'Basic Egg') {
  game.eggs.push({ id:`egg_${Date.now()}_${game.eggs.length}_${Math.floor(Math.random() * 9999)}`, type });
}

const QUESTS = [
  {
    id: 'claim_hive',
    name: 'Claim Your Hive',
    desc: 'Choose a vacant honeycomb bay. Your bees, slots, and upgrades live there.',
    goal: 1,
    progress: () => game.phase === 'playing' ? 1 : 0,
    rewardText: '+20 honey, Basic Egg',
    reward: () => { game.honey += 20; queueEgg('Basic Egg'); }
  },
  {
    id: 'starter_pollen',
    name: 'Work Starter Field',
    desc: 'Collect 40 Glow pollen in the Starter Field so the first loop has a clear target.',
    goal: 40,
    progress: () => game.stats.fieldPollen.starter || 0,
    rewardText: '+60 honey',
    reward: () => { game.honey += 60; }
  },
  {
    id: 'bank_honey',
    name: 'Bank The Run',
    desc: 'Return to your hive and convert 40 pollen into spendable honey.',
    goal: 40,
    progress: () => game.stats.convertedPollen || 0,
    rewardText: 'Basic Egg',
    reward: () => queueEgg('Basic Egg')
  },
  {
    id: 'field_tokens',
    name: 'Chase Field Tokens',
    desc: 'Collect 2 ability tokens. They keep field work active instead of stationary.',
    goal: 2,
    progress: () => game.stats.tokensCollected || 0,
    rewardText: '+75 honey, Focus buff',
    reward: () => { game.honey += 75; game.tokenBuffs.focus = Math.max(game.tokenBuffs.focus, 20); }
  },
  {
    id: 'second_bee',
    name: 'Grow The Swarm',
    desc: 'Hatch eggs until 2 bees occupy your hex slots.',
    goal: 2,
    progress: () => game.lumens.length,
    rewardText: '+90 honey',
    reward: () => { game.honey += 90; }
  },
  {
    id: 'first_investment',
    name: 'Use Risk Capital',
    desc: 'Make one Honey Market trade after banking honey. Honey is now strategy, not only shop currency.',
    goal: 1,
    progress: () => game.stats.marketTrades || 0,
    rewardText: '2 Market Spark charges',
    reward: () => { game.tokenBuffs.marketSpark += 2; }
  },
];

// ======================== WORLD INITIALIZATION ========================
let playerModel, hiveModel, tradeModel, sunMesh;

function clampToIsland(obj) {
  const limit = ISLE_RADIUS * 0.93 - PLAYER_RADIUS;
  const d = Math.hypot(obj.x, obj.z);
  if (d > limit) {
    const nx = obj.x / d, nz = obj.z / d;
    const s = limit / d;
    obj.x *= s;
    obj.z *= s;
    if (Number.isFinite(obj.vx) && Number.isFinite(obj.vz)) {
      const outwardSpeed = obj.vx * nx + obj.vz * nz;
      if (outwardSpeed > 0) {
        obj.vx -= outwardSpeed * nx;
        obj.vz -= outwardSpeed * nz;
      }
    }
  }
}

function removeVelocityInto(player, nx, nz) {
  const intoSurface = player.vx * nx + player.vz * nz;
  if (intoSurface < 0) {
    player.vx -= intoSurface * nx;
    player.vz -= intoSurface * nz;
  }
}

function resolveCircleCollider(player, collider) {
  const dx = player.x - collider.x;
  const dz = player.z - collider.z;
  const minDistance = PLAYER_RADIUS + collider.r;
  const distanceSq = dx * dx + dz * dz;
  if (distanceSq >= minDistance * minDistance) return false;

  let nx, nz, distance;
  if (distanceSq > 1e-8) {
    distance = Math.sqrt(distanceSq);
    nx = dx / distance;
    nz = dz / distance;
  } else {
    const speed = Math.hypot(player.vx, player.vz);
    nx = speed > 1e-5 ? -player.vx / speed : 0;
    nz = speed > 1e-5 ? -player.vz / speed : -1;
    distance = 0;
  }
  const correction = minDistance - distance + 0.0001;
  player.x += nx * correction;
  player.z += nz * correction;
  removeVelocityInto(player, nx, nz);
  return true;
}

function resolveAabbCollider(player, collider) {
  const minX = collider.x - collider.hx;
  const maxX = collider.x + collider.hx;
  const minZ = collider.z - collider.hz;
  const maxZ = collider.z + collider.hz;
  const closestX = clamp(player.x, minX, maxX);
  const closestZ = clamp(player.z, minZ, maxZ);
  const dx = player.x - closestX;
  const dz = player.z - closestZ;
  const distanceSq = dx * dx + dz * dz;
  if (distanceSq >= PLAYER_RADIUS * PLAYER_RADIUS) return false;

  if (distanceSq > 1e-8) {
    const distance = Math.sqrt(distanceSq);
    const nx = dx / distance, nz = dz / distance;
    const correction = PLAYER_RADIUS - distance + 0.0001;
    player.x += nx * correction;
    player.z += nz * correction;
    removeVelocityInto(player, nx, nz);
    return true;
  }

  // The centre is inside the box. Exit through the nearest face, including the
  // keeper radius, so a bad spawn or a frame hitch cannot leave it trapped.
  const exits = [
    { distance: Math.abs(player.x - minX), x: minX - PLAYER_RADIUS, nx: -1, nz: 0 },
    { distance: Math.abs(maxX - player.x), x: maxX + PLAYER_RADIUS, nx: 1, nz: 0 },
    { distance: Math.abs(player.z - minZ), z: minZ - PLAYER_RADIUS, nx: 0, nz: -1 },
    { distance: Math.abs(maxZ - player.z), z: maxZ + PLAYER_RADIUS, nx: 0, nz: 1 },
  ];
  exits.sort((a, b) => a.distance - b.distance);
  const exit = exits[0];
  if (exit.x !== undefined) player.x = exit.x;
  if (exit.z !== undefined) player.z = exit.z;
  removeVelocityInto(player, exit.nx, exit.nz);
  return true;
}

function resolvePlayerCollisions(player) {
  for (const collider of game.colliders) {
    if (collider.type === 'circle') resolveCircleCollider(player, collider);
    else resolveAabbCollider(player, collider);
  }
  clampToIsland(player);
}

function movePlayerKinematic(player, deltaX, deltaZ) {
  const distance = Math.hypot(deltaX, deltaZ);
  const steps = Math.max(1, Math.ceil(distance / MAX_MOTION_STEP));
  const stepX = deltaX / steps;
  const stepZ = deltaZ / steps;
  for (let i = 0; i < steps; i++) {
    player.x += stepX;
    player.z += stepZ;
    // Two solver passes handle corners where two simple proxies overlap.
    resolvePlayerCollisions(player);
    resolvePlayerCollisions(player);
  }
}

function recoverPlayerIfInvalid(player) {
  if (Number.isFinite(player.x) && Number.isFinite(player.z) && Number.isFinite(player.groundY || 0)) return;
  player.x = PLAYER_START.x;
  player.z = PLAYER_START.z;
  player.groundY = terrainHeightAt(player.x, player.z);
  player.vx = 0;
  player.vz = 0;
  showTutorial('Keeper position recovered safely.');
}

function spawnFlowers() {
  let flowerIndex = 1;
  for (const field of FIELD_DEFS) {
    const positions = [];
    const fillR = field.radius * 0.95;      // bloom almost to the stone rim
    // Hex-jittered grid sized to cover the WHOLE disc (slightly over-seeded, then
    // shuffled + trimmed to count) so flowers fill the field edge-to-edge — the
    // old fixed-2.05 spacing only reached the centre and left a bare outer ring.
    const spacing = Math.max(1.5, fillR * Math.sqrt(2.6 / field.count));
    for (let gz = -fillR; gz <= fillR + 0.0001; gz += spacing) {
      const odd = Math.round(gz / spacing) & 1;
      for (let gx = -fillR; gx <= fillR + 0.0001; gx += spacing) {
        const px = gx + odd * spacing * 0.5 + rand(-spacing * 0.32, spacing * 0.32);
        const pz = gz + rand(-spacing * 0.32, spacing * 0.32);
        if (px * px + pz * pz <= fillR * fillR) positions.push({ x: field.center.x + px, z: field.center.z + pz });
      }
    }
    positions.sort(() => Math.random() - 0.5);
    while (positions.length < field.count) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * fillR;
      positions.push({ x: field.center.x + Math.cos(a) * r, z: field.center.z + Math.sin(a) * r });
    }

    for (let i = 0; i < field.count; i++) {
      const pos = positions[i];
      const x = pos.x;
      const z = pos.z;
      const hue = pickFlowerHue(field);
      const baseTier = randomFlowerBaseTier(field);
      const maxPollen = flowerTierCapacity(baseTier);
      const model = createFlowerModel(hue);
      const fieldScale = field.id === 'rare' ? rand(1.08, 1.24) : field.id === 'starter' ? rand(0.9, 1.04) : rand(1.0, 1.16);
      const scale = fieldScale * FLOWER_WORLD_SCALE;
      const groundY = field.elevation || 0;
      model.position.set(x, groundY, z);
      model.rotation.y = Math.random() * Math.PI * 2;
      model.scale.setScalar(scale);
      scene.add(model);

      const flower = {
        id: `flower_${String(flowerIndex++).padStart(3, '0')}`,
        x, z, groundY, phase: 3, regen: 0, claims: 0,
        baseTier,
        tier: baseTier,
        pollinatedTier: 0,
        pollinationTimer: 0,
        pollen: maxPollen,
        maxPollen,
        regrowthPerSecond: field.regrowth,
        fieldType: field.id,
        fieldName: field.name,
        honeyType: field.honeyType,
        valueMult: field.valueMult,
        sway: Math.random() * Math.PI * 2,
        pulse: Math.random() * Math.PI * 2,
        flash: 0, hue, model,
        vitality: 1, baseScale: scale, lastHarvestVitality: 1,
      };
      syncFlowerTier(flower, false);
      game.flowers.push(flower);
    }
  }
}

function rollBeeTemplate() {
  const royalBoost = game.tokenBuffs.royal > 0;
  const weights = BEE_RARITIES.map(t => {
    if (!royalBoost) return t.chance;
    if (t.rarity === 'Common') return t.chance * 0.62;
    if (t.rarity === 'Uncommon') return t.chance * 1.08;
    if (t.rarity === 'Rare') return t.chance * 1.7;
    return t.chance * 2.4;
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  const r = Math.random() * total;
  let acc = 0;
  for (let i = 0; i < BEE_RARITIES.length; i++) {
    acc += weights[i];
    if (r <= acc) return BEE_RARITIES[i];
  }
  return BEE_RARITIES[0];
}

function openHexSlot() {
  return game.beeSlots.find(s => s.unlocked && !s.beeId);
}

function createBeeData(slotId, forcedType = null) {
  let tpl;
  if (forcedType) {
    tpl = ALL_BEE_TEMPLATES.find(r => r.type === forcedType) || rollBeeTemplate();
  } else {
    tpl = rollBeeTemplate();
  }
  const id = `bee_${String(game.nextBeeId++).padStart(3, '0')}`;
  return {
    id,
    name: tpl.type,
    type: tpl.type,
    rarity: tpl.rarity,
    role: tpl.role,
    level: 1,
    gatherPower: tpl.gatherPower,
    speed: tpl.speed,
    status: 'idle',
    hiveSlotId: slotId,
    hue: tpl.hue,
    conversionRate: beeBaseConversionRate(tpl),
    ability: tpl.ability || 'sturdy',
    abilityName: tpl.abilityName || '',
    accent: tpl.accent || 'none',
  };
}

function beeDockCell(b) {
  const cells = game.hive.slotMeshes;
  if (!cells || !cells.length) return null;
  const idx = game.beeSlots.findIndex(s => s.id === b.hiveSlotId);
  if (idx < 0) return null;
  const cell = cells[idx];
  return (cell && cell.podWorld) ? cell : null;
}

function makeLumen(beeData = null) {
  const slot = beeData ? game.beeSlots.find(s => s.id === beeData.hiveSlotId) : openHexSlot();
  if (!slot && !beeData) return null;
  const data = beeData || createBeeData(slot.id);
  if (typeof data.conversionRate !== 'number' || !isFinite(data.conversionRate)) {
    data.conversionRate = beeBaseConversionRate(data);
  }
  if (slot) slot.beeId = data.id;
  const model = createBeeModel(data.hue, data.accent || 'none');
  model.scale.setScalar(BEE_WORLD_SCALE);
  const comboLabel = createBeeComboLabel();
  model.add(comboLabel);
  model.userData.comboLabel = comboLabel;

  // Hatch from inside the bee's comb cell and crawl out through the honeycomb.
  let sx = game.hive.x + rand(-3, 3), sy = 1.5, sz = game.hive.z + rand(2, 5);
  let initState = 'toFlower';
  const idx = game.beeSlots.findIndex(s => s.id === data.hiveSlotId);
  const cell = game.hive.slotMeshes && game.hive.slotMeshes[idx];
  if (cell && cell.podWorld) {
    sx = cell.podWorld.x; sy = cell.podWorld.y; sz = cell.podWorld.z;
    initState = 'emerging';
  }
  model.position.set(sx, sy, sz);
  scene.add(model);
  return {
    ...data,
    x: sx, z: sz, y: sy,
    state: initState, target: null, harvestTimer: 0, carry: 0,
    convertPayload: 0,
    honeyBondActive: false, inConversionLoop: false, launchToConversion: false,
    boostTimer: 0, boostMult: 1, inChain: false, restTimer: 0,
    wing: Math.random() * Math.PI * 2,
    bob: Math.random() * Math.PI * 2,
    model,
    swarmIndex: game.lumens.length,
    idleAngle: (game.lumens.length * 2.399963229728653) % (Math.PI * 2),
    idlePhase: Math.random() * Math.PI * 2,
    idleOrbitSpeed: rand(0.34, 0.54),
    idleWeave: rand(0.18, 0.38),
    idleLift: rand(0.12, 0.24),
    forageCycle: 0,
  };
}

function addBeeFromEgg() {
  const slot = openHexSlot();
  if (!slot) { showTutorial('No open hex slots. Unlock a Hive Slot in the shop.'); return null; }
  if (game.eggs.length === 0) { showTutorial('Buy an Egg in the Hive Shop first.'); return null; }
  const egg = game.eggs.shift();
  let forcedType = null;
  if (egg.type === 'Worker Egg') forcedType = 'Worker Bee';
  else if (egg.type === 'Scout Egg') forcedType = 'Scout Bee';
  else if (egg.type === 'Rare Egg') forcedType = 'Celest Lumen';
  const bee = makeLumen(createBeeData(slot.id, forcedType));
  if (bee) {
    game.lumens.push(bee);
    game.stats.eggsHatched++;
    synth.playClaimHive();
    const slotNum = slot.id.replace(/^slot_0*/i, '') || '1';
    showTutorial(`${bee.rarity} ${bee.name} hatched into Slot ${slotNum}.`);
  }
  updateProgressionUI();
  updateHiveVisuals();
  return bee;
}

function initWorld() {
  // Island
  const island = createIsland();
  scene.add(island);

  // Apiary — a row of claimable honeycomb hive bays
  const apiary = createApiary();
  scene.add(apiary.group);
  game.apiary = apiary;
  // Default references point at the central bay until the player claims one.
  const centralBay = apiary.bays[Math.floor(HIVE_BAY_COUNT / 2)];
  hiveModel = centralBay.group;
  game.hive.model = hiveModel;
  game.hive.slotMeshes = centralBay.cells;
  // A couple of bays already belong to rival keepers (cannot be claimed by you).
  setBayOwner(apiary.bays[0], NEIGHBOR_NAMES[0]);
  setBayOwner(apiary.bays[HIVE_BAY_COUNT - 1], NEIGHBOR_NAMES[4]);

  // Trade Terminal
  tradeModel = createTradeTerminalModel();
  tradeModel.position.set(TRADE_POS.x, 0, TRADE_POS.z);
  tradeModel.scale.set(2.8, 2.8, 2.8);
  tradeModel.rotation.y = Math.PI + 0.48;     // tilt slightly toward plaza center
  scene.add(tradeModel);
  game.tradePost.model = tradeModel;

  // Walk-up shop stall — sits at the end of the hive row, angled out toward the fields.
  const shopStall = createShopStall();
  shopStall.position.set(SHOP_POS.x, 0, SHOP_POS.z);
  shopStall.rotation.y = 2.22;                  // face outward toward the meadow and flower fields
  scene.add(shopStall);
  game.shopStall = shopStall;

  // Simple, data-only collision proxies. They are deliberately independent of
  // Three.js meshes so movement remains deterministic and can later move to a
  // worker or a dedicated physics engine without rewriting rendering code.
  game.colliders = [];
  for (const bay of apiary.bays) {
    game.colliders.push({
      id: `hive_wall_${bay.index}`, type: 'aabb',
      x: bay.pos.x, z: bay.pos.z + 2.5 * HIVE_WORLD_SCALE,
      hx: 4.65 * HIVE_WORLD_SCALE, hz: 0.48 * HIVE_WORLD_SCALE,
    });
    game.colliders.push({
      id: `hive_pot_${bay.index}`, type: 'circle',
      x: bay.pos.x, z: bay.pos.z - 2.4 * HIVE_WORLD_SCALE,
      r: 0.82 * HIVE_WORLD_SCALE,
    });
  }
  game.colliders.push({
    id: 'shop_counter', type: 'circle',
    x: SHOP_POS.x, z: SHOP_POS.z, r: 2.2,
  });
  game.colliders.push({ id: 'trade_terminal', type: 'circle', x: TRADE_POS.x, z: TRADE_POS.z, r: 3.25 });
  game.colliders.push({
    id: 'apiary_fence', type: 'aabb',
    x: 0, z: APIARY_DECK_Z + 5, hx: APIARY_DECK_HALF_W, hz: 0.2,
  });

  // Player
  playerModel = createPlayerModel();
  playerModel.position.set(game.player.x, 0, game.player.z);
  scene.add(playerModel);
  game.player.model = playerModel;

  // Flowers
  spawnFlowers();

  // Sky
  sunMesh = createSkyElements();

  // Floating pollen motes (ambient particles)
  const moteGeo = new THREE.SphereGeometry(0.06, 4, 4);
  const moteMat = new THREE.MeshBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 0.5 });
  game.motes = [];
  for (let i = 0; i < 40; i++) {
    const mote = new THREE.Mesh(moteGeo, moteMat);
    mote.position.set((Math.random()-0.5)*180, 1+Math.random()*8, (Math.random()-0.5)*180);
    scene.add(mote);
    game.motes.push({ mesh: mote, phase: Math.random()*Math.PI*2, speed: 0.3+Math.random()*0.6 });
  }

  spawnAmbientButterflies();
}

// ======================== INPUT HANDLING ========================
const keys = new Set();
const CAMERA_THIRD_PERSON_FOV = 50;
const CAMERA_FIRST_PERSON_FOV = 62;
const CAMERA_FIRST_PERSON_MIN_PITCH = -1.35;
const CAMERA_FIRST_PERSON_MAX_PITCH = 1.35;
const CAMERA_FIRST_PERSON_EYE_HEIGHT = 1.68;
const CAMERA_FIRST_PERSON_HEAD_BOB = 0.035;
const CAMERA_FIRST_PERSON_SIDE_BOB = 0.018;
const CAMERA_THIRD_PERSON_MIN_PITCH = -0.48;
const CAMERA_THIRD_PERSON_MAX_PITCH = 1.22;
const CAMERA_THIRD_PERSON_LOOK_UP_OFFSET = 20;
const CAMERA_FOV_LERP = 0.12;

function uiCapturesInput() {
  return game.ui.helpOpen ||
    game.ui.eggConfirmOpen || game.ui.perkOpen || game.ui.fullMarketOpen;
}

function releaseCameraInput() {
  game.player.toolHeld = false;
  game.camera.dragging = false;
  keys.clear();
  document.body.classList.remove('camera-dragging');
  if (document.pointerLockElement === renderer.domElement) document.exitPointerLock?.();
}

function adjustCameraOrbit(dx, dy) {
  const c = game.camera;
  const yawMultiplier = c.firstPerson ? 0.82 : 1;
  c.yaw -= dx * c.sensitivity * yawMultiplier;
  if (c.firstPerson) {
    c.pitch = clamp(c.pitch - dy * c.sensitivity * 0.58, CAMERA_FIRST_PERSON_MIN_PITCH, CAMERA_FIRST_PERSON_MAX_PITCH);
  } else {
    c.pitch = clamp(c.pitch + dy * c.sensitivity * 0.65, CAMERA_THIRD_PERSON_MIN_PITCH, CAMERA_THIRD_PERSON_MAX_PITCH);
  }
}

function updateCameraModeUI() {
  document.body.classList.toggle('shift-lock-active', game.camera.shiftLock);
  const mode = document.getElementById('cameraMode');
  if (mode) {
    mode.textContent = game.camera.shiftLock ? 'LOCKED' : 'FREE';
    mode.classList.toggle('locked', game.camera.shiftLock);
  }
}

function setShiftLock(on) {
  game.camera.shiftLock = on;
  updateCameraModeUI();
  if (on) {
    showTutorial('SHIFT LOCK ON — drag the mouse to steer; panels stay clickable.');
  } else {
    showTutorial('SHIFT LOCK OFF — drag the mouse to orbit the camera.');
  }
}

window.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (['arrowup','arrowdown','arrowleft','arrowright',' ','e','shift','m','b','p','h','i','v','?','escape'].includes(k)) e.preventDefault();
  if (k === 'escape') {
    setInventoryOpen(false);
    setHelpOpen(false);
    closeAllModals();
    return;
  }
  if (game.running && !e.repeat && k === 'i') {
    setInventoryOpen(!game.ui.inventoryOpen);
    return;
  }
  if (game.running && !e.repeat && k === '?') {
    setHelpOpen(!game.ui.helpOpen);
    return;
  }
  if (k === 'shift' && game.running && !e.repeat) {
    setShiftLock(!game.camera.shiftLock);
    return;
  }
  if (game.running && !e.repeat && k === 'm') {
    setModalOpen('fullMarketModal', !game.ui.fullMarketOpen);
    return;
  }
  if (game.running && !e.repeat && k === 'b') {
    setInventoryOpen(true);
    showTutorial('Drag an egg from the satchel onto your claimed hive to hatch it.');
    return;
  }
  if (game.running && !e.repeat && k === 'p') {
    setModalOpen('perkModal', !game.ui.perkOpen);
    return;
  }
  if (game.running && !e.repeat && k === 'h') {
    if (game.ui.shopOpen) { setShopPanelOpen(false); }
    else if (game.phase === 'playing' && dist2(game.player.x, game.player.z, SHOP_POS.x, SHOP_POS.z) < 9) { setShopPanelOpen(true); }
    else { showTutorial('Walk up to the SHOP stall in the plaza to open the shop.'); }
    return;
  }
  if (game.running && !e.repeat && k === 'v') {
    const c = game.camera;
    c.firstPerson = !c.firstPerson;
    if (playerModel) playerModel.visible = !c.firstPerson;
    
    if (!c.firstPerson) {
      c.pitch = clamp(c.pitch, CAMERA_THIRD_PERSON_MIN_PITCH, CAMERA_THIRD_PERSON_MAX_PITCH);
    } else {
      c.pitch = 0.0;
    }
    
    const viewEl = document.getElementById('cameraView');
    if (viewEl) viewEl.textContent = c.firstPerson ? '1ST' : '3RD';
    showTutorial(c.firstPerson ? 'FIRST PERSON VIEW' : 'THIRD PERSON VIEW');
    return;
  }
  // Bee-mode toggle removed: bees now always hover around the keeper and fan
  // out to gather whenever you step into a field (game.swarmMode stays 'swarm').
  if (k === 'e' && game.running && !uiCapturesInput()) {
    handleInteract();
  }
  keys.add(k);
});
window.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());
renderer.domElement.addEventListener('pointerdown', e => {
  if (!game.running || uiCapturesInput()) return;
  if (e.button === 0) game.player.toolHeld = true;
  if (game.camera.firstPerson) {
    renderer.domElement.requestPointerLock?.();
    return;
  }
  if (e.button !== 0 && e.button !== 2) return;
  game.camera.dragging = true;
  game.camera.lastX = e.clientX;
  game.camera.lastY = e.clientY;
  document.body.classList.add('camera-dragging');
  renderer.domElement.setPointerCapture?.(e.pointerId);
});

window.addEventListener('pointerup', e => {
  if (e.button === 0) game.player.toolHeld = false;
  if (!game.camera.dragging) return;
  game.camera.dragging = false;
  document.body.classList.remove('camera-dragging');
  renderer.domElement.releasePointerCapture?.(e.pointerId);
});

window.addEventListener('pointercancel', () => {
  game.player.toolHeld = false;
  game.camera.dragging = false;
  document.body.classList.remove('camera-dragging');
});

window.addEventListener('blur', () => {
  game.player.toolHeld = false;
  game.camera.dragging = false;
  keys.clear();
  document.body.classList.remove('camera-dragging');
});

window.addEventListener('pointermove', e => {
  if (!game.running || uiCapturesInput()) return;
  if (game.camera.pointerLocked || game.camera.dragging) {
    const dx = game.camera.pointerLocked ? e.movementX : (e.clientX - game.camera.lastX);
    const dy = game.camera.pointerLocked ? e.movementY : (e.clientY - game.camera.lastY);
    if (!game.camera.pointerLocked) {
      game.camera.lastX = e.clientX;
      game.camera.lastY = e.clientY;
    }
    adjustCameraOrbit(dx, dy);
  }
});

renderer.domElement.addEventListener('wheel', e => {
  if (!game.running || uiCapturesInput()) return;
  e.preventDefault();
  game.camera.distance = clamp(game.camera.distance + e.deltaY * 0.025, game.camera.minDistance, game.camera.maxDistance);
}, { passive: false });

document.addEventListener('pointerlockchange', () => {
  game.camera.pointerLocked = document.pointerLockElement === renderer.domElement;
});

function nearestBay(maxDist = 7) {
  if (!game.apiary) return null;
  let best = null, bestD = maxDist;
  for (const bay of game.apiary.bays) {
    if (bay.owner) continue;                 // only vacant bays are claimable
    const d = dist2(game.player.x, game.player.z, bay.pos.x, bay.pos.z);
    if (d < bestD) { bestD = d; best = bay; }
  }
  return best;
}

function handleInteract() {
  if (game.phase === 'unclaimed') {
    const bay = nearestBay();
    if (bay) claimHive(bay.index);
  } else if (game.phase === 'playing') {
    const ds = dist2(game.player.x, game.player.z, SHOP_POS.x, SHOP_POS.z);
    if (ds < 8) {
      setShopPanelOpen(!game.ui.shopOpen);
      return;
    }

    if (distanceToHiveCircle() < T.hive.conversionRadius) {
      if (!game.conversionStarted) {
        if (!conversionWorkAvailable()) {
          convertPollenAtHive(true);
          return;
        }
        game.conversionStarted = true;
        convertPollenAtHive(true);
      } else {
        game.conversionStarted = false;
        for (const b of game.lumens) cancelBeeConversion(b);
        showTutorial('Honey conversion stopped.');
      }
    }
  }
}

function addHoneyFromPollen(amount) {
  const modeMult = game.swarmMode === 'forage' ? 1.3 : 1.0;
  const honeyGain = amount * honeyConversionRate() * modeMult;
  game.honey += honeyGain;
  game.honeyAccum += honeyGain;
  return honeyGain;
}

const hiveCircleVec = new THREE.Vector3();
const backpackVec = new THREE.Vector3();
const bondBeeVec = new THREE.Vector3();
const bondDummy = new THREE.Object3D();
const bondDir = new THREE.Vector3();
const bondUp = new THREE.Vector3(0, 1, 0);
const HONEY_BOND_MAX = INITIAL_HEX_SLOTS;
const BOND_SEGMENTS_PER_BEE = 6;
const CONVERSION_STATES = ['convertToPack', 'convertToCell', 'convertEntering'];

function hiveCircleCenter() {
  const bay = game.hive.bay;
  if (bay && bay.group) {
    hiveCircleVec.set(0, 0.04, 1.5);
    bay.group.localToWorld(hiveCircleVec);
  } else {
    hiveCircleVec.set(game.hive.x, 0.04, game.hive.z - 1.5);
  }
  return hiveCircleVec;
}

function distanceToHiveCircle() {
  const c = hiveCircleCenter();
  return dist2(game.player.x, game.player.z, c.x, c.z);
}

function hiveConversionActive() {
  return game.phase === 'playing' && game.hive.claimed && distanceToHiveCircle() <= T.hive.conversionRadius;
}

function queuedPollenForHoney() {
  return Math.max(0, game.pollen);
}

function conversionPollenInFlight() {
  let total = 0;
  for (const b of game.lumens) total += Math.max(0, b.convertPayload || 0);
  return total;
}

function conversionBondsActive() {
  return game.lumens.some(beeHoneyBondVisible);
}

function conversionWorkAvailable() {
  return queuedPollenForHoney() + conversionPollenInFlight() > 0.000001;
}

function takePollenForConversion(amount) {
  let fromPack = Math.min(game.pollen, Math.max(0, amount));
  if (game.pollen - fromPack < 0.000001) {
    fromPack = game.pollen;
    game.pollen = 0;
  } else {
    game.pollen -= fromPack;
  }
  return fromPack;
}

function returnPollenFromConversion(amount) {
  if (amount > 0) game.pollen = Math.min(pollenCap(), game.pollen + amount);
}

function releaseBeeTarget(b) {
  if (b && b.target) {
    b.target.claims = Math.max(0, (b.target.claims || 0) - 1);
    b.target = null;
  }
  if (b) b.passiveHarvest = false;
}

function beeWantsConversion(b) {
  return game.conversionStarted
    && hiveConversionActive()
    && queuedPollenForHoney() > 0.000001
    && game.lumens.length > 0;
}

function beeHoneyBondWorld(bee) {
  if (bee?.model) {
    bondBeeVec.set(0, 0.08, -0.24);
    bee.model.localToWorld(bondBeeVec);
  } else {
    bondBeeVec.set(bee?.x || 0, bee?.y || 0, bee?.z || 0);
  }
  return bondBeeVec;
}

function beeHoneyBondVisible(bee) {
  return !!bee?.honeyBondActive
    && !!bee.model
    && (bee.convertPayload || 0) > 0.000001
    && (bee.state === 'convertToCell' || bee.state === 'convertEntering');
}

function beginConversionFlight(bee, target, kind) {
  const startY = Number.isFinite(bee.y) ? bee.y : terrainHeightAt(bee.x, bee.z) + 1.2;
  const start = { x: bee.x, y: startY, z: bee.z };
  const len = Math.max(1, Math.hypot(target.x - start.x, target.y - start.y, target.z - start.z));
  const seed = (bee.idlePhase || 0) + (bee.swarmIndex || 0) * 1.73 + Math.random() * 0.3;
  bee.conversionFlight = {
    kind,
    start,
    len,
    t: 0,
    seed,
    lift: clamp(len * 0.26, 0.75, 2.35),
    lateral: clamp(len * 0.12, 0.22, 1.25),
  };
  bee.flightStart = start;
  bee.flightDist = len;
}

function ensureConversionFlight(bee, target, kind) {
  if (!bee.conversionFlight || bee.conversionFlight.kind !== kind || !Number.isFinite(bee.conversionFlight.t)) {
    beginConversionFlight(bee, target, kind);
  }
  return bee.conversionFlight;
}

function followConversionFlight(bee, target, kind, speed, dt, arriveRadius) {
  const flight = ensureConversionFlight(bee, target, kind);
  const dynamicLen = Math.max(1, Math.hypot(target.x - flight.start.x, target.y - flight.start.y, target.z - flight.start.z));
  flight.t = clamp(flight.t + (speed * dt) / dynamicLen, 0, 1);

  const t = flight.t;
  const eased = t * t * (3 - 2 * t);
  const dx = target.x - flight.start.x;
  const dz = target.z - flight.start.z;
  const flatLen = Math.hypot(dx, dz) || 1;
  const perpX = -dz / flatLen;
  const perpZ = dx / flatLen;
  const taper = Math.sin(t * Math.PI);
  const weave = Math.sin(t * Math.PI * 2.6 + flight.seed) * taper * flight.lateral;
  const micro = Math.sin(game.time * 11 + flight.seed) * taper * 0.08;

  const nextX = lerp(flight.start.x, target.x, eased) + perpX * (weave + micro);
  const nextZ = lerp(flight.start.z, target.z, eased) + perpZ * (weave + micro);
  const arc = Math.sin(t * Math.PI) * flight.lift;
  const wingBob = Math.sin(game.time * 18 + flight.seed) * taper * 0.06;
  const nextY = Math.max(
    lerp(flight.start.y, target.y, eased) + arc + wingBob,
    terrainHeightAt(nextX, nextZ) + 0.95
  );

  bee.x = nextX;
  bee.z = nextZ;
  bee.y = lerp(Number.isFinite(bee.y) ? bee.y : nextY, nextY, Math.min(1, dt * 12));
  return t >= 0.985 || near3D(bee, target, arriveRadius);
}

function clearConversionFlight(bee) {
  if (!bee) return;
  bee.conversionFlight = null;
  bee.flightStart = null;
  bee.flightDist = 0;
}

function prepareBeeForConversion(b) {
  if (!b || !game.conversionStarted || !hiveConversionActive()) return false;

  if (!beeWantsConversion(b)) return false;

  // Recover old/stale loop flags left on a bee that is no longer following any
  // conversion route. This makes the next E press self-healing instead of
  // requiring a page refresh.
  if (b.inConversionLoop) {
    const hasRoute = CONVERSION_STATES.includes(b.state)
      || (DOCK_STATES.includes(b.state) && (
        b.launchToConversion
        || b.honeyBondActive
        || b.convertResting
      ));
    if (hasRoute) return false;
    b.inConversionLoop = false;
    b.launchToConversion = false;
    b.honeyBondActive = false;
  }

  releaseBeeTarget(b);
  b.inConversionLoop = true;
  clearConversionFlight(b);
  if (b.state === 'resting') {
    b.state = 'launching';
    b.launchToConversion = true;
  } else {
    b.state = 'convertToPack';
    b.status = 'linking to pack';
    beginConversionFlight(b, playerBackpackWorld(), 'pack');
  }
  return true;
}

function cancelBeeConversion(b) {
  if (!b) return;
  b.inConversionLoop = false;
  b.honeyBondActive = false;
  b.launchToConversion = false;
  clearConversionFlight(b);
  if (!CONVERSION_STATES.includes(b.state)) return;
  returnPollenFromConversion(b.convertPayload || 0);
  b.convertPayload = 0;
  b.state = 'returningHome';
  b.status = 'conversion paused';
}

function playerBackpackWorld() {
  const model = game.player.model;
  if (model) {
    backpackVec.set(0, 1.12, -0.64);
    model.localToWorld(backpackVec);
  } else {
    const p = game.player;
    backpackVec.set(p.x + Math.sin(p.facing || 0) * 0.62, (p.groundY || 0) + 1.12, p.z - Math.cos(p.facing || 0) * 0.62);
  }
  return backpackVec;
}

function convertPollenAtHive(manual = false) {
  if (!conversionWorkAvailable()) {
    if (manual) showTutorial('Your pollen pack is empty. Send bees to a field first.');
    return 0;
  }
  if (!hiveConversionActive()) {
    if (manual) showTutorial('Step inside your hive circle to start honey conversion.');
    return 0;
  }
  if (queuedPollenForHoney() > 0.000001) for (const b of game.lumens) prepareBeeForConversion(b);
  if (manual) {
    showTutorial(`Honey conversion active — stay inside the circle. Bee flow: ${refineRate().toFixed(1)} pollen/sec.`);
  }
  return 0;
}

function updateBeeConversion(b, sp, dt) {
  const active = hiveConversionActive();
  if (!active) {
    cancelBeeConversion(b);
    return;
  }
  const cell = beeDockCell(b);
  if (!cell) {
    returnPollenFromConversion(b.convertPayload || 0);
    b.convertPayload = 0;
    b.honeyBondActive = false;
    b.inConversionLoop = false;
    clearConversionFlight(b);
    b.state = 'toFlower';
    return;
  }
  cell.transiting = true;
  const pack = playerBackpackWorld();
  const conversionSpeed = sp * T.hive.conversionSpeedMult * (1 + jarShuttleBonus());

  if (b.state === 'convertToPack') {
    b.status = 'linking to pack';
    if (followConversionFlight(b, pack, 'pack', conversionSpeed, dt, 0.85)) {
      const payload = takePollenForConversion(beeConversionRate(b) * T.hive.conversionPayloadSeconds);
      if (payload <= 0.000001) {
        b.convertPayload = 0;
        b.honeyBondActive = false;
        b.inConversionLoop = false;
        b.launchToConversion = false;
        clearConversionFlight(b);
        b.state = 'returningHome';
        b.status = 'waiting for pollen';
        return;
      }
      b.convertPayload = payload;
      // The bond represents real pollen in transit. It is shown only while this
      // bee carries a payload from the backpack to its comb cell.
      b.honeyBondActive = true;
      b.state = 'convertToCell';
      b.status = 'carrying honey bond';
      beginConversionFlight(b, cell.entryWorld, 'cell');
      
      if (game.time >= game.nextPollenSound) {
        synth.playPollenPop();
        game.nextPollenSound = game.time + 0.16;
      }
    }
  } else if (b.state === 'convertToCell') {
    b.status = 'returning to slot';
    if (followConversionFlight(b, cell.entryWorld, 'cell', conversionSpeed * 1.04, dt, 0.34)) {
      clearConversionFlight(b);
      b.state = 'convertEntering';
    }
  } else if (b.state === 'convertEntering') {
    b.status = 'sealing honey';
    // Spin in front of the comb face (not buried in the pocket) so the keeper
    // can actually see the bee whirl as it seals the honey.
    const spinAt = cell.convertWorld || cell.podWorld;
    const shakeAmp = 0.06;
    const shakeFreq = 18;
    const shakeX = Math.sin(game.time * shakeFreq + b.swarmIndex * 2.1) * shakeAmp;
    const shakeZ = Math.cos(game.time * shakeFreq * 1.3 + b.swarmIndex * 1.7) * shakeAmp;
    const shakeTarget = { x: spinAt.x + shakeX, y: spinAt.y, z: spinAt.z + shakeZ };
    moveTowardXYZ(b, shakeTarget, conversionSpeed * 0.72, dt);
    if (near3D(b, spinAt, 0.28)) {
      const payload = b.convertPayload || 0;
      b.convertPayload = 0;
      b.honeyBondActive = false;
      if (hiveConversionActive() && payload > 0.01) {
        game.stats.convertedPollen += payload;
        game.honeyRefinedAccum += payload;
        addHoneyFromPollen(payload);
        if (game.time >= game.nextHoneySound) {
          synth.playHoneyChime();
          game.nextHoneySound = game.time + 0.18;
        }
      } else {
        returnPollenFromConversion(payload);
      }
      b.state = 'resting';
      b.convertResting = true;   // keep spinning in front of the comb, not in the pocket
      b.restTimer = T.hive.conversionRest / (1 + jarShuttleBonus());
      b.spinTimer = 1.5;
    }
  }
}

// Per-bee honey bonds between each owned bee and the beekeeper backpack.
function updateConversionBeam(dt) {
  if (!game.honeyBonds) {
    const positions = new Float32Array(HONEY_BOND_MAX * BOND_SEGMENTS_PER_BEE * 6);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({
      color: 0xffd45a,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lines = new THREE.LineSegments(geo, mat);
    lines.frustumCulled = false;
    lines.visible = false;
    scene.add(lines);

    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xffd45a,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tubes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.045, 0.045, 1, 8, 1, true), tubeMat, HONEY_BOND_MAX);
    tubes.frustumCulled = false;
    tubes.visible = false;
    scene.add(tubes);

    const beadMat = new THREE.MeshBasicMaterial({
      color: 0xfff0a5,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 8, 6), beadMat, HONEY_BOND_MAX);
    beads.frustumCulled = false;
    beads.visible = false;
    scene.add(beads);
    game.honeyBonds = { lines, geo, positions, mat, tubes, tubeMat, beads, beadMat, intensity: 0 };
  }

  const bonds = game.honeyBonds;
  const active = game.phase === 'playing' && game.lumens.some(beeHoneyBondVisible);
  const targetIntensity = active ? 1 : 0;
  bonds.intensity = lerp(bonds.intensity || 0, targetIntensity, Math.min(1, dt * 7));
  const pack = playerBackpackWorld();
  const packWindow = game.player.model?.userData?.packWindow;
  if (packWindow?.material) {
    packWindow.material.opacity = 0.42 + bonds.intensity * (0.28 + Math.sin(game.time * 9) * 0.08);
  }

  if (bonds.intensity < 0.025) {
    bonds.lines.visible = false;
    bonds.tubes.visible = false;
    bonds.beads.visible = false;
    bonds.mat.opacity = 0;
    bonds.tubeMat.opacity = 0;
    bonds.beadMat.opacity = 0;
    return;
  }

  let count = 0;
  let segmentCount = 0;
  const pos = bonds.positions;
  for (const b of game.lumens) {
    if (count >= HONEY_BOND_MAX || !b.model) continue;
    if (!beeHoneyBondVisible(b)) continue;
    const converting = true;
    const strength = 1;
    const beePoint = beeHoneyBondWorld(b);
    const bx = beePoint.x, by = beePoint.y, bz = beePoint.z;
    const dx = pack.x - bx, dy = pack.y - by, dz = pack.z - bz;
    const len = Math.hypot(dx, dy, dz) || 1;
    bondDir.set(dx / len, dy / len, dz / len);

    const perpX = -bondDir.z;
    const perpZ = bondDir.x;
    const wobbleAmp = (0.16 + strength * 0.12) * bonds.intensity;
    for (let s = 0; s < BOND_SEGMENTS_PER_BEE; s++) {
      const t0 = s / BOND_SEGMENTS_PER_BEE;
      const t1 = (s + 1) / BOND_SEGMENTS_PER_BEE;
      const wave0 = Math.sin(t0 * Math.PI * 2.2 + game.time * 4.2 + count) * wobbleAmp * Math.sin(t0 * Math.PI);
      const wave1 = Math.sin(t1 * Math.PI * 2.2 + game.time * 4.2 + count) * wobbleAmp * Math.sin(t1 * Math.PI);
      const base = segmentCount * 6;
      pos[base + 0] = lerp(bx, pack.x, t0) + perpX * wave0;
      pos[base + 1] = lerp(by, pack.y, t0) + Math.sin(t0 * Math.PI + game.time * 3.4 + count) * wobbleAmp * 0.5;
      pos[base + 2] = lerp(bz, pack.z, t0) + perpZ * wave0;
      pos[base + 3] = lerp(bx, pack.x, t1) + perpX * wave1;
      pos[base + 4] = lerp(by, pack.y, t1) + Math.sin(t1 * Math.PI + game.time * 3.4 + count) * wobbleAmp * 0.5;
      pos[base + 5] = lerp(bz, pack.z, t1) + perpZ * wave1;
      segmentCount++;
    }

    bondDummy.position.set((bx + pack.x) * 0.5, (by + pack.y) * 0.5, (bz + pack.z) * 0.5);
    bondDummy.quaternion.setFromUnitVectors(bondUp, bondDir);
    bondDummy.scale.set(0.82 + strength * 0.2, len, 0.82 + strength * 0.2);
    bondDummy.updateMatrix();
    bonds.tubes.setMatrixAt(count, bondDummy.matrix);

    let t = (game.time * (converting ? 1.45 : 0.65) + count * 0.17) % 1;
    if (b.state === 'convertToCell' || b.state === 'convertEntering' || b.state === 'resting') t = 1 - t;
    bondDummy.position.set(
      lerp(bx, pack.x, t),
      lerp(by, pack.y, t) + Math.sin(game.time * 8 + count) * 0.035,
      lerp(bz, pack.z, t)
    );
    bondDummy.scale.setScalar((0.65 + strength * 0.55) * bonds.intensity);
    bondDummy.updateMatrix();
    bonds.beads.setMatrixAt(count, bondDummy.matrix);
    count++;
  }

  bonds.geo.setDrawRange(0, segmentCount * 2);
  bonds.geo.attributes.position.needsUpdate = true;
  bonds.tubes.count = count;
  bonds.tubes.instanceMatrix.needsUpdate = true;
  bonds.beads.count = count;
  bonds.beads.instanceMatrix.needsUpdate = true;
  bonds.mat.opacity = 0.22 + bonds.intensity * (0.42 + Math.sin(game.time * 7) * 0.08);
  bonds.tubeMat.opacity = 0.08 + bonds.intensity * 0.16;
  bonds.beadMat.opacity = 0.5 + bonds.intensity * 0.35;
  bonds.lines.visible = count > 0;
  bonds.tubes.visible = count > 0;
  bonds.beads.visible = count > 0;
}

// ======================== PROGRESSION: CLAIM HIVE ========================
// Resolve the world-space dock points for a bay's comb cells (cell face, the
// pocket behind the comb where a bee rests, and the front approach point).
function computeBaySlotWorld(bay) {
  bay.group.updateWorldMatrix(true, true);
  const theta = bay.group.rotation.y;
  const nx = Math.sin(theta), nz = Math.cos(theta); // comb outward normal (toward plaza)
  const v = new THREE.Vector3();
  for (const cell of bay.cells) {
    cell.group.getWorldPosition(v);
    const cx = v.x, cy = v.y, cz = v.z;
    cell.cellWorld = { x: cx, y: cy, z: cz };
    cell.entryWorld = { x: cx + nx * COMB_ENTRY_DZ, y: cy, z: cz + nz * COMB_ENTRY_DZ };
    cell.podWorld   = { x: cx - nx * COMB_POCKET_DZ, y: cy, z: cz - nz * COMB_POCKET_DZ };
    cell.convertWorld = { x: cx + nx * COMB_CONVERT_DZ, y: cy, z: cz + nz * COMB_CONVERT_DZ };
  }
}

const NEIGHBOR_NAMES = ['ZephyrHive', 'GoldGuild', 'NoctuaNest', 'AuroraHive', 'EmberHaven'];

// Turn a bay into a rival keeper's claimed hive: dim, named, sealed comb with a
// couple of resting bees. A claimed bay can never be claimed by anyone else.
function setBayOwner(bay, name) {
  bay.owner = name;
  bay.claimed = true;
  bay.beacon.visible = false;
  bay.skepMat.color.set(0x8a6a2e);
  bay.baseMat.color.set(0x6e521f);
  bay.hiveLight.intensity = 0.7;
  bay.hiveLight.color.set(0xffb347);
  const ctx = bay.sign.userData.ctx;
  ctx.clearRect(0, 0, 256, 64);
  ctx.fillStyle = 'rgba(8,12,20,0.7)';
  roundRectPath(ctx, 4, 8, 248, 48, 12); ctx.fill();
  ctx.strokeStyle = '#7c8a99'; ctx.lineWidth = 2.5;
  roundRectPath(ctx, 4, 8, 248, 48, 12); ctx.stroke();
  ctx.fillStyle = '#aebccc';
  ctx.font = 'bold 21px Outfit, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('🔒 ' + name, 128, 34);
  bay.sign.userData.tex.needsUpdate = true;
  bay.sign.scale.set(2.8, 0.7, 1);
  bay.sign.visible = true;
  // Resting neighbour bees so rival hives feel inhabited
  computeBaySlotWorld(bay);
  if (!game.neighborBees) game.neighborBees = [];
  for (let s = 0; s < 3; s++) {
    const cell = bay.cells[s];
    const nb = createBeeModel(BEE_TYPES[(bay.index + s) % BEE_TYPES.length].hue);
    nb.position.set(cell.podWorld.x, cell.podWorld.y, cell.podWorld.z);
    nb.rotation.y = BAY_FACING;
    nb.scale.setScalar(0.55 * BEE_WORLD_SCALE);
    scene.add(nb);
    game.neighborBees.push({ model: nb, baseY: cell.podWorld.y, phase: Math.random() * Math.PI * 2 });
    setCombCellVisual(cell, 'rival', 0xb8863b, 0xffb24f);
  }
}

function queueRivalBayClaims(claimedIndex) {
  const jobs = [];
  game.apiary.bays.forEach((bay, i) => {
    if (i === claimedIndex || bay.owner) return;
    bay.owner = '__pending_rival__';
    jobs.push({ bay, name: NEIGHBOR_NAMES[i % NEIGHBOR_NAMES.length], timer: 0.12 + jobs.length * 0.18 });
  });
  game.pendingRivalClaims.push(...jobs);
}

function updateDeferredRivalClaims(dt) {
  const queue = game.pendingRivalClaims;
  if (!queue || !queue.length) return;
  for (let i = queue.length - 1; i >= 0; i--) {
    const job = queue[i];
    job.timer -= dt;
    if (job.timer <= 0) {
      setBayOwner(job.bay, job.name);
      queue.splice(i, 1);
      break;
    }
  }
}

function claimHive(bayIndex, silent = false) {
  const bay = game.apiary.bays[bayIndex];
  if (!bay || bay.owner) return;                    // already taken by someone
  if (game.hive.bayIndex !== null) {                // you may only keep one hive
    showTutorial('You already keep a hive in the apiary.');
    return;
  }

  game.phase = 'playing';
  game.hive.claimed = true;
  game.hive.bayIndex = bayIndex;
  game.hive.bay = bay;
  game.hive.model = bay.group;
  game.hive.slotMeshes = bay.cells;
  game.hive.x = bay.pos.x;
  game.hive.z = bay.pos.z;
  bay.claimed = true;
  bay.owner = 'you';
  computeBaySlotWorld(bay);

  // Light up the claimed bay
  bay.skepMat.color.set(0xCC8800);
  bay.baseMat.color.set(0x8B6914);
  bay.hiveLight.color.set(0xFFAA00);
  bay.hiveLight.intensity = 2.4;
  bay.hiveLight.distance = 18;
  bay.beacon.visible = false;

  // Keep a glowing gold "YOUR HIVE" nameplate so your hive stands out
  const sctx = bay.sign.userData.ctx;
  sctx.clearRect(0, 0, 256, 64);
  sctx.fillStyle = 'rgba(36,22,2,0.9)';
  roundRectPath(sctx, 4, 8, 248, 48, 12); sctx.fill();
  sctx.strokeStyle = '#ffd24a'; sctx.lineWidth = 3.5;
  roundRectPath(sctx, 4, 8, 248, 48, 12); sctx.stroke();
  sctx.fillStyle = '#ffe9a8';
  sctx.font = 'bold 23px Outfit, sans-serif';
  sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
  sctx.fillText('★ YOUR HIVE ★', 128, 34);
  bay.sign.userData.tex.needsUpdate = true;
  bay.sign.scale.set(3.2, 0.8, 1);
  bay.sign.visible = true;

  // Gold pennant flag on the roof
  const flag = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 6),
    new THREE.MeshStandardMaterial({ color: 0x5a3d16, roughness: 0.8 }));
  pole.position.y = 0.8; flag.add(pole);
  const pennant = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.9, 3),
    new THREE.MeshStandardMaterial({ color: 0xffc23a, emissive: 0x5a3a00, emissiveIntensity: 0.4, roughness: 0.5, side: THREE.DoubleSide }));
  pennant.rotation.z = -Math.PI / 2; pennant.rotation.y = Math.PI / 2;
  pennant.position.set(0.32, 1.35, 0); flag.add(pennant);
  const combTopLocalY = COMB_BASE_Y + (COMB_ROWS - 1) * COMB_DY + COMB_DY + 1.7;
  flag.position.set(0, combTopLocalY, COMB_WALL_Z - 0.3);
  bay.group.add(flag);
  bay.flag = flag;

  // Any other still-vacant bays get snapped up by rival keepers, but staggered
  // so claiming your hive does not build every rival hive and bee in one frame.
  queueRivalBayClaims(bayIndex);

  // Spawn your first bee — always a plain Common Worker Bee so everyone starts
  // on equal, basic footing (no special/rare starter). Skipped when restoring a
  // save (the saved bees are spawned instead).
  if (!silent) {
    const firstBee = makeLumen(createBeeData(game.beeSlots[0].id, 'Worker Bee'));
    if (firstBee) game.lumens.push(firstBee);
  }

  if (!silent) {
    synth.playClaimHive();
    showTutorial('Hive claimed! Hold left mouse near flowers to harvest. Your bees hover with you and fan out to gather whenever you step into a field.');
    setTimeout(() => showTutorial('Walk to the SHOP stall for upgrades, or the HONEY MARKET terminal to invest spare honey.'), 5500);
  }
  updateProgressionUI();
  updateHiveVisuals();

  document.getElementById('interactPrompt').classList.add('hidden');
}

// ======================== PLAYER MOVEMENT ========================
function toolHarvestTargets(radius) {
  const p = game.player;
  const targets = [];
  const pattern = toolPattern();
  const forwardX = -Math.sin(game.camera.yaw);
  const forwardZ = -Math.cos(game.camera.yaw);
  for (const f of game.flowers) {
    if (f.pollen <= 0.2) continue;
    if (!fieldUnlocked(f.fieldType)) continue;
    const dx = f.x - p.x;
    const dz = f.z - p.z;
    const d = dist2(p.x, p.z, f.x, f.z);
    if (d <= radius) {
      const along = dx * forwardX + dz * forwardZ;
      const lateral = Math.abs(dx * forwardZ - dz * forwardX);
      const fullness = f.maxPollen ? f.pollen / f.maxPollen : 1;
      targets.push({
        f, d, along, lateral,
        ring: Math.abs(d - radius * 0.68),
        strength: flowerEffectiveTier(f) * 2 + fullness
      });
    }
  }
  if (pattern === 'line') {
    targets.sort((a, b) => (a.lateral + (a.along < -0.6 ? 8 : 0)) - (b.lateral + (b.along < -0.6 ? 8 : 0)) || a.d - b.d);
  } else if (pattern === 'ring') {
    targets.sort((a, b) => a.ring - b.ring || a.d - b.d);
  } else if (pattern === 'strongest') {
    targets.sort((a, b) => b.strength - a.strength || a.d - b.d);
  } else {
    targets.sort((a, b) => a.d - b.d);
  }
  return targets;
}

function collectToolTarget(flower, boost) {
  if (!flower || game.pollen >= pollenCap()) return 0;
  const val = harvestFlowerPollen(flower, boost);
  if (val <= 0) return 0;
  const room = Math.max(0, pollenCap() - game.pollen);
  const moved = Math.min(room, val);
  game.pollen += moved;
  flower.flash = 1;
  flower.harvestPop = 0.75;
  const gy = flower.groundY || 0;
  spawnHarvestBurst(flower.x, gy + 0.9, flower.z, harvestBurstHex(flower), moved, gy, true, flower.lastHarvestVitality);
  maybeSpawnAbilityToken(flower, 0.045 + Math.min(0.04, game.equipment.tool.level * 0.006));
  if (moved > 0 && game.time >= game.nextPollenSound) {
    synth.playPollenPop();
    game.nextPollenSound = game.time + 0.14;
  }
  return moved;
}

function updatePlayerTool(dt) {
  if (game.phase !== 'playing') return;
  const p = game.player;
  p.toolCooldown = Math.max(0, (p.toolCooldown || 0) - dt);
  p.toolSwing = Math.max(0, (p.toolSwing || 0) - dt * 3.8);
  p.toolBeamTimer = Math.max(0, (p.toolBeamTimer || 0) - dt);
  const toolActive = p.toolHeld;
  if (!toolActive || p.toolCooldown > 0 || game.pollen >= pollenCap()) return;

  const targets = toolHarvestTargets(toolRadius());
  if (!targets.length) return;

  const patternBonus = toolPattern() === 'grid' ? 2 : 0;
  const hits = Math.min(1 + Math.floor(game.equipment.tool.level / 3) + patternBonus, targets.length);
  const boost = toolPower();
  let collected = 0;
  for (let i = 0; i < hits; i++) {
    collected += collectToolTarget(targets[i].f, boost * (i === 0 ? 1 : 0.62));
    if (game.pollen >= pollenCap()) break;
  }
  if (collected <= 0) return;
  p.toolCooldown = toolCooldown();
  p.toolSwing = 1;
  p.toolBeamTimer = 0.18;
  if (!game.toolHintShown) {
    game.toolHintShown = true;
    showTutorial('Hold left mouse near flowers to harvest with your tool. Walk into a field and your bees fan out to gather it with you.');
  }
}

function updatePlayer(dt) {
  const p = game.player;
  recoverPlayerIfInvalid(p);
  const acceptMovementInput = !uiCapturesInput();
  let forwardInput = 0, rightInput = 0;
  if (acceptMovementInput && (keys.has('w') || keys.has('arrowup')))    forwardInput += 1;
  if (acceptMovementInput && (keys.has('s') || keys.has('arrowdown')))  forwardInput -= 1;
  if (acceptMovementInput && (keys.has('d') || keys.has('arrowright'))) rightInput += 1;
  if (acceptMovementInput && (keys.has('a') || keys.has('arrowleft')))  rightInput -= 1;

  const yaw = game.camera.yaw;
  const forwardX = -Math.sin(yaw);
  const forwardZ = -Math.cos(yaw);
  const rightX = Math.cos(yaw);
  const rightZ = -Math.sin(yaw);
  const moveX = forwardX * forwardInput + rightX * rightInput;
  const moveZ = forwardZ * forwardInput + rightZ * rightInput;

  if (p.vx === undefined) {
    p.vx = 0;
    p.vz = 0;
  }
  
  // Acceleration and friction parameters for organic movement feel
  const accel = clamp(18 * dt, 0, 1);
  const friction = clamp(12 * dt, 0, 1);
  const maxSpd = p.speed;   
  
  let targetVx = 0, targetVz = 0;
  if (moveX || moveZ) {
    const d = Math.hypot(moveX, moveZ);
    targetVx = (moveX / d) * maxSpd;
    targetVz = (moveZ / d) * maxSpd;
  }
  
  if (moveX || moveZ) {
    p.vx = lerp(p.vx, targetVx, accel);
    p.vz = lerp(p.vz, targetVz, accel);
  } else {
    p.vx = lerp(p.vx, 0, friction);
    p.vz = lerp(p.vz, 0, friction);
  }
  
  movePlayerKinematic(p, p.vx * dt, p.vz * dt);
  
  const currentSpeed = Math.hypot(p.vx, p.vz);
  if (currentSpeed > 0.05) {
    p.moving = true;
    p.facing = game.camera.shiftLock || game.camera.firstPerson ? Math.atan2(forwardX, forwardZ) : Math.atan2(p.vx, p.vz);
    
    p.footstepTimer += dt;
    if (p.footstepTimer >= 0.32) {
      p.footstepTimer = 0;
      synth.playFootstep();
    }
    p.walkPhase += dt * (currentSpeed * 2.2); 
  } else {
    p.moving = false;
    p.footstepTimer = 0.3;
    if (game.camera.shiftLock || game.camera.firstPerson) p.facing = Math.atan2(forwardX, forwardZ);
  }

  updatePlayerTool(dt);

  // Follow the authoritative walkable-surface query at a bounded vertical
  // speed. This gives stable ramps and snaps safely onto low decks/platforms.
  const targetGroundY = terrainHeightAt(p.x, p.z);
  const groundDelta = targetGroundY - (p.groundY || 0);
  p.groundY = (p.groundY || 0) + clamp(groundDelta, -9 * dt, 12 * dt);

  // Update 3D model
  const model = p.model;
  model.position.set(p.x, p.groundY, p.z);
  // Smooth rotation toward facing
  const targetRot = p.facing;
  let currentRot = model.rotation.y;
  let diff = targetRot - currentRot;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  model.rotation.y += diff * smoothK(0.15, dt);

  // Arm/leg swing animation
  // Torso bobbing and swaying walk cycle
  const torso = model.userData.torsoGroup;
  if (torso) {
    if (p.moving) {
      torso.position.y = Math.abs(Math.sin(p.walkPhase * 2)) * -0.06;
      torso.rotation.x = lerp(torso.rotation.x, 0.08, Math.min(1, dt * 10));
      torso.rotation.z = Math.sin(p.walkPhase) * -0.025;
      torso.rotation.y = Math.sin(p.walkPhase) * 0.02;
    } else {
      torso.position.y = lerp(torso.position.y, 0, Math.min(1, dt * 10));
      torso.rotation.x = lerp(torso.rotation.x, 0, Math.min(1, dt * 10));
      torso.rotation.z = lerp(torso.rotation.z, 0, Math.min(1, dt * 10));
      torso.rotation.y = lerp(torso.rotation.y, 0, Math.min(1, dt * 10));
    }
  }

  if (p.moving) {
    const swing = Math.sin(p.walkPhase) * 0.4;
    model.userData.armL.rotation.x = swing;
    model.userData.armR.rotation.x = -swing;
    model.userData.legL.rotation.x = -swing * 0.6;
    model.userData.legR.rotation.x = swing * 0.6;
  } else {
    model.userData.armL.rotation.x = lerp(model.userData.armL.rotation.x, 0, Math.min(1, dt * 10));
    model.userData.armR.rotation.x = lerp(model.userData.armR.rotation.x, 0, Math.min(1, dt * 10));
    model.userData.legL.rotation.x = lerp(model.userData.legL.rotation.x, 0, Math.min(1, dt * 10));
    model.userData.legR.rotation.x = lerp(model.userData.legR.rotation.x, 0, Math.min(1, dt * 10));
  }

  const tool = model.userData.toolPivot;
  if (tool) {
    const swing = Math.sin(clamp(p.toolSwing || 0, 0, 1) * Math.PI);
    const toolActive = p.toolHeld || p.toolBeamTimer > 0;
    
    // Sweeping anim while collecting
    let sweepX = 0, sweepY = 0, sweepZ = 0;
    if (p.toolHeld) {
      const sweepAngle = game.time * 12;
      sweepX = Math.sin(sweepAngle) * 0.28;
      sweepY = Math.cos(sweepAngle * 0.5) * 0.16;
      sweepZ = Math.sin(sweepAngle) * 0.24;
    }

    tool.rotation.x = -0.55 + swing * 0.95 + sweepX;
    tool.rotation.y = 0.12 + swing * 0.08 + sweepY;
    tool.rotation.z = -0.52 - swing * 0.3 + sweepZ;
    const toolScale = 1 + Math.min(0.24, game.equipment.tool.level * 0.025);
    tool.scale.setScalar(toolScale);
    if (tool.userData.headMat) {
      tool.userData.headMat.emissiveIntensity = 0.35 + swing * 0.7 + (toolActive ? 0.45 : 0) + Math.min(0.3, game.equipment.tool.level * 0.025);
    }
    if (tool.userData.beam) {
      const beam = tool.userData.beam;
      beam.visible = toolActive;
      beam.scale.set(1 + swing * 0.45, 1, 1 + Math.min(0.45, game.equipment.tool.level * 0.04));
      if (tool.userData.beamMat) {
        tool.userData.beamMat.opacity = p.toolBeamTimer > 0 ? 0.48 : 0.18;
      }
    }
  }

  // Field Scanner Navigation Arrow (3D Floating Compass Radar)
  const navArrow = model.userData.navArrow;
  if (navArrow) {
    const scannerLvl = game.equipment.scanner?.level || 0;
    if (scannerLvl >= 1) {
      // Find the closest blooming flower that has pollen
      let nearF = null, nearD = Infinity;
      const scannerRange = 18 + scannerLvl * 14;
      for (const f of game.flowers) {
        if (f.phase >= 2 && f.pollen > 2) {
          const d = dist2(p.x, p.z, f.x, f.z);
          if (d <= scannerRange && d < nearD) {
            nearD = d;
            nearF = f;
          }
        }
      }
      if (nearF) {
        navArrow.visible = true;
        const angle = Math.atan2(nearF.x - p.x, nearF.z - p.z);
        navArrow.rotation.y = angle - model.rotation.y;
        navArrow.position.y = 2.35 + Math.sin(game.time * 6) * 0.05;
      } else {
        navArrow.visible = false;
      }
    } else {
      navArrow.visible = false;
    }
  }

  // Player trail for swarm mode
  game.playerHistory.push({ x: p.x, z: p.z });
  if (game.playerHistory.length > 150) game.playerHistory.shift();
}

// ======================== CAMERA ========================
const cameraTarget = new THREE.Vector3();
const cameraDesired = new THREE.Vector3();

function updateCamera(dt) {
  const c = game.camera;
  const gy = game.player.groundY || 0;
  const targetFov = c.firstPerson ? CAMERA_FIRST_PERSON_FOV : CAMERA_THIRD_PERSON_FOV;
  if (Math.abs(camera.fov - targetFov) > 0.02) {
    camera.fov = lerp(camera.fov, targetFov, smoothK(CAMERA_FOV_LERP, dt));
    camera.updateProjectionMatrix();
  }

  if (c.firstPerson) {
    // First person sits just above the keeper body with a very small gait bob.
    // The bob is intentionally subtle so gathering still feels precise.
    const gait = game.player.moving ? game.player.walkPhase : 0;
    const headBob = game.player.moving ? Math.sin(gait * 2) * CAMERA_FIRST_PERSON_HEAD_BOB : 0;
    const sideBob = game.player.moving ? Math.sin(gait) * CAMERA_FIRST_PERSON_SIDE_BOB : 0;
    const rightX = Math.cos(c.yaw);
    const rightZ = -Math.sin(c.yaw);
    const eyeX = game.player.x + rightX * sideBob;
    const eyeY = gy + CAMERA_FIRST_PERSON_EYE_HEIGHT + headBob;
    const eyeZ = game.player.z + rightZ * sideBob;
    camera.position.set(eyeX, eyeY, eyeZ);

    // Look target in direction of yaw and pitch
    const targetX = eyeX - Math.sin(c.yaw) * Math.cos(c.pitch);
    const targetY = eyeY + Math.sin(c.pitch);
    const targetZ = eyeZ - Math.cos(c.yaw) * Math.cos(c.pitch);
    camera.lookAt(targetX, targetY, targetZ);
  } else {
    // Third person camera
    const horizontal = Math.cos(c.pitch) * c.distance;
    const height = Math.sin(c.pitch) * c.distance;
    const lookUpAmount = clamp((-c.pitch) / Math.max(0.001, -CAMERA_THIRD_PERSON_MIN_PITCH), 0, 1);
    const targetYOffset = 1.2 + lookUpAmount * CAMERA_THIRD_PERSON_LOOK_UP_OFFSET;
    cameraTarget.set(game.player.x, targetYOffset + gy, game.player.z);
    cameraDesired.set(
      game.player.x + Math.sin(c.yaw) * horizontal,
      cameraTarget.y + height,
      game.player.z + Math.cos(c.yaw) * horizontal
    );
    const cameraGroundY = terrainHeightAt(cameraDesired.x, cameraDesired.z);
    cameraDesired.y = Math.max(cameraDesired.y, cameraGroundY + 0.85);
    camera.position.lerp(cameraDesired, smoothK(0.08, dt));
    camera.lookAt(cameraTarget);
  }
}

// ======================== BEE AI ========================
function pickFlower(b) {
  let best = null, bestScore = -Infinity;
  for (const f of game.flowers) {
    if (f.pollen <= 0.2) continue;
    if (!fieldUnlocked(f.fieldType)) continue;
    const d = dist2(b.x, b.z, f.x, f.z);
    const fullness = f.maxPollen ? f.pollen / f.maxPollen : T.flower.yieldMult[f.phase];
    const score = fullness * (2 + f.valueMult) * beeFieldAffinity(b, f.fieldType) - d / 26 - f.claims * 1.5;
    if (score > bestScore) { bestScore = score; best = f; }
  }
  return best;
}

function moveToward3D(b, tx, tz, speed, dt) {
  const dx = tx - b.x, dz = tz - b.z;
  const d = Math.hypot(dx, dz);
  if (d < 0.001) return;
  // Prevent overshoot and chatter by clamping step size to remaining distance
  const step = Math.min(d, speed * dt);
  b.x += (dx / d) * step;
  b.z += (dz / d) * step;
}

// Full 3D move (used for flying up into the comb cells).
function moveTowardXYZ(b, t, speed, dt) {
  const dx = t.x - b.x, dy = t.y - b.y, dz = t.z - b.z;
  const d = Math.hypot(dx, dy, dz);
  if (d < 0.0001) return;
  const step = Math.min(d, speed * dt);
  b.x += (dx / d) * step; b.y += (dy / d) * step; b.z += (dz / d) * step;
}
function near3D(b, t, r) { return Math.hypot(t.x - b.x, t.y - b.y, t.z - b.z) < r; }

const DOCK_STATES = ['emerging', 'launching', 'returningHome', 'entering', 'resting'];

// Bees hatch from, rest in, and launch out of their comb cell — passing through
// the honeycomb to reach the slot pocket behind it.
function updateBeeDock(b, dt, sp) {
  const cell = beeDockCell(b);
  if (!cell) { b.state = 'toFlower'; b.target = null; return; }
  const pod = cell.podWorld, entry = cell.entryWorld;
  const speed = sp * 1.15;
  cell.transiting = true;   // flag for the comb cell to flare open this frame

  if (b.state === 'emerging' || b.state === 'launching') {
    // climb out of the pocket, through the cell, to the front approach point
    moveTowardXYZ(b, entry, speed, dt);
    if (near3D(b, entry, 0.3)) {
      if (b.launchToConversion) {
        b.launchToConversion = false;
        b.state = 'convertToPack';
        beginConversionFlight(b, playerBackpackWorld(), 'pack');
      } else {
        b.state = 'toFlower';
        b.target = null;
      }
    }
  } else if (b.state === 'returningHome') {
    moveTowardXYZ(b, entry, speed, dt);
    if (near3D(b, entry, 0.35)) b.state = 'entering';
  } else if (b.state === 'entering') {
    // slip through the comb into the pocket behind it
    moveTowardXYZ(b, pod, speed * 0.8, dt);
    if (near3D(b, pod, 0.2)) { b.state = 'resting'; b.convertResting = false; b.restTimer = rand(1.6, 3.4); }
  } else if (b.state === 'resting') {
    // A bee that just sealed honey hovers in front of the comb (convertWorld);
    // an ordinary docked bee rests in the pocket behind it (pod).
    const rest = (b.convertResting && cell.convertWorld) ? cell.convertWorld : pod;
    b.x = lerp(b.x, rest.x + Math.sin(b.bob * 0.8) * 0.04, 0.2);
    b.y = lerp(b.y, rest.y + Math.sin(b.bob) * 0.05, 0.2);
    b.z = lerp(b.z, rest.z, 0.2);
    b.restTimer -= dt;
    if (b.restTimer <= 0) {
      if (b.convertResting && !beeWantsConversion(b)) {
        b.honeyBondActive = false;
        b.inConversionLoop = false;
        b.convertResting = false;
      }
      b.convertResting = false;
      if (beeWantsConversion(b)) {
        b.state = 'launching';
        b.launchToConversion = true;
      } else {
        const wantsWork = game.swarmMode === 'swarm' || !!pickFlower(b);
        if (wantsWork) b.state = 'launching';
        else b.restTimer = rand(1.0, 2.2);
      }
    }
  }
}

function harvestFlowerPollen(flower, boost) {
  if (!flower || flower.pollen <= 0.2) return 0;
  if (!fieldUnlocked(flower.fieldType)) return 0;
  const tier = flowerEffectiveTier(flower);
  let val = (T.flower.basePollen + pollenAdd()) * (flower.valueMult || 1) * boost * flowerTierYieldMult(tier);
  if (isNight()) val *= T.nightPollenBonus;
  const loss = Math.min(flower.pollen, val * flowerTierDepletionMult(tier));
  val = loss / Math.max(0.1, flowerTierDepletionMult(tier));
  flower.pollen = Math.max(0, flower.pollen - loss);
  flower.phase = flower.maxPollen ? clamp(Math.ceil((flower.pollen / flower.maxPollen) * 3), 0, 3) : Math.max(0, flower.phase - 1);
  flower.regen = 0;
  recordFieldPollen(flower.fieldType, val);
  // Wear the flower down: the burst uses the vitality it had AT harvest (so the
  // first pluck of a recovered flower is brightest), then vitality drops.
  flower.lastHarvestVitality = flower.vitality ?? 1;
  flower.vitality = clamp((flower.vitality ?? 1) - T.flower.vitalityHit, 0, 1);
  return val;
}

function beeFieldAffinity(bee, fieldType) {
  if (!bee) return 1;
  const hue = String(bee.hue || '').toLowerCase();
  const rarity = String(bee.rarity || '').toLowerCase();
  if (fieldType === 'blue_dew' && hue === '#00e5ff') return 1.5;
  if ((fieldType === 'starter' || fieldType === 'yellow') && hue === '#ffcc00') return 1.25;
  if ((fieldType === 'rare' || fieldType === 'night') && (rarity === 'rare' || rarity === 'epic' || rarity === 'legendary')) return 1.35;
  return 1;
}

function finishBeeHarvest(b) {
  if (!b.target) { b.state = 'toFlower'; return; }
  const flower = b.target;
  b.forageCycle = (b.forageCycle || 0) + 1;
  const passive = !!b.passiveHarvest;
  const swarmMult = game.swarmMode === 'swarm'
    ? 1.05 + Math.min(0.45, game.upgrades.pollen.level * 0.05)
    : 1.0;
  const boost = b.boostMult * (b.gatherPower || 1) * beeFieldAffinity(b, flower.fieldType) * (passive ? T.lumen.passiveGatherMult : 1) * swarmMult;
  const gained = harvestFlowerPollen(flower, boost);
  flower.claims = Math.max(0, flower.claims - 1);
  b.target = null;
  b.passiveHarvest = false;
  if (gained > 0) {
    flower.flash = 1;
    flower.harvestPop = 0.8;
    const gy = flower.groundY || 0;
    spawnHarvestBurst(flower.x, gy + 0.9, flower.z, harvestBurstHex(flower), gained, gy, true, flower.lastHarvestVitality);
    if ((b.rarity === 'Epic' || b.rarity === 'Legendary') && Math.random() < (passive ? 0.12 : 0.24)) {
      const count = b.rarity === 'Legendary' ? 7 : 4;
      pollinateNearbyFlowers(flower.x, flower.z, 5.4, count, 60, flower.fieldType);
    }
    maybeSpawnAbilityToken(flower, passive ? 0.08 : 0.16, b);
    // Bees no longer ferry pollen back to the keeper — they bank what they
    // gather instantly and immediately move on to the next flower, so the
    // swarm keeps working the whole field instead of commuting.
    b.carry = (b.carry || 0) + gained;
    const room = pollenCap() - game.pollen;
    if (room > 0) {
      const moved = Math.min(room, b.carry);
      game.pollen += moved;
      b.carry -= moved;
      if (moved > 0 && game.time >= game.nextPollenSound) {
        synth.playPollenPop();
        game.nextPollenSound = game.time + 0.08;
      }
    }
    b.state = 'toFlower';
    b.status = 'gathering';
  } else {
    b.state = 'toFlower';
  }
}

function updateBeeDelivery(b, sp, dt) {
  const offset = (b.swarmIndex || 0) * 1.7 + b.bob;
  const tx = game.player.x + Math.sin(offset) * 1.2;
  const tz = game.player.z + Math.cos(offset) * 1.2;
  moveToward3D(b, tx, tz, sp * 1.18, dt);

  if (dist2(b.x, b.z, game.player.x, game.player.z) < 1.9) {
    const room = pollenCap() - game.pollen;
    if (room > 0) {
      const moved = Math.min(room, b.carry || 0);
      game.pollen += moved;
      b.carry = Math.max(0, (b.carry || 0) - moved);
      if (moved > 0 && game.time >= game.nextPollenSound) {
        synth.playPollenPop();
        game.nextPollenSound = game.time + 0.08;
      }
      if (b.carry <= 0.01) {
        b.carry = 0;
        b.state = 'toFlower';
      }
    } else {
      b.status = 'pack full';
    }
  }
}

function updateBeeHiveDelivery(b, sp, dt) {
  const cell = beeDockCell(b);
  const target = cell && cell.entryWorld ? cell.entryWorld : { x: game.hive.x, y: 1.35, z: game.hive.z };
  moveTowardXYZ(b, target, sp * T.lumen.passiveSpeedMult * 1.08, dt);

  if (near3D(b, target, 1.0)) {
    const moved = b.carry || 0;
    if (moved > 0) {
      game.hivePollen += moved;
      if (game.time >= game.nextPollenSound) {
        synth.playPollenPop();
        game.nextPollenSound = game.time + 0.12;
      }
    }
    b.carry = 0;
    b.state = 'toFlower';
    b.status = 'passive work';
  }
}

function updateLumen(b, dt) {
  b.wing += dt * 40;
  b.bob += dt * 5;
  if (b.chainReadyTimer > 0) b.chainReadyTimer = Math.max(0, b.chainReadyTimer - dt);
  const sp = beeSpeed() * (b.speed || 1) * (game.swarmMode === 'swarm' ? 1.3 : 1.0);
  b.idleHover = false;
  b.status = CONVERSION_STATES.includes(b.state)
    ? 'converting honey'
    : b.carry > 0
    ? (b.state === 'returningHive' ? 'passive delivery' : 'delivering pollen')
    : b.state === 'harvesting' ? 'gathering' : b.state === 'toFlower' ? 'foraging' : 'idle';

  // Wing animation for double wings
  if (b.model) {
    const wFlap = Math.sin(b.wing) * 0.7;
    const wFlap2 = Math.sin(b.wing - 0.5) * 0.6;
    if (b.model.userData.wingPivotL) {
      b.model.userData.wingPivotL.rotation.z = 0.4 + wFlap;
      b.model.userData.wingPivotL2.rotation.z = 0.6 + wFlap2;
      b.model.userData.wingPivotR.rotation.z = -0.4 - wFlap;
      b.model.userData.wingPivotR2.rotation.z = -0.6 - wFlap2;
    } else {
      b.model.userData.wingL.rotation.z = 0.5 + wFlap;
      b.model.userData.wingR.rotation.z = -0.5 - wFlap;
    }
    if (b.model.userData.glow?.material) {
      const baseGlow = b.accent === 'halo' ? 0.26 : 0.13;
      const bloomReady = (game.bloom && !game.bloom.started && game.bloom.starter === b) || b.chainReadyTimer > 0;
      const bloomLinked = !!(
        (game.bloom?.order && game.bloom.order.includes(b))
        || (game.bloomAfterglow?.bees && game.bloomAfterglow.bees.includes(b))
      );
      const targetGlow = bloomReady
        ? 0.72 + Math.sin(game.time * 8 + b.swarmIndex) * 0.16
        : bloomLinked
        ? 0.48 + Math.sin(game.time * 5 + b.swarmIndex) * 0.1
        : CONVERSION_STATES.includes(b.state)
        ? 0.34 + Math.sin(game.time * 9 + b.swarmIndex) * 0.05
        : baseGlow;
      const glowMesh = b.model.userData.glow;
      glowMesh.material.opacity = lerp(glowMesh.material.opacity, targetGlow, Math.min(1, dt * 7));
      const baseScale = b.accent === 'halo' ? { x: 1.35, y: 0.95, z: 1.5 } : { x: 1.1, y: 0.75, z: 1.25 };
      const auraScale = bloomReady ? 1.55 : bloomLinked ? 1.28 : 1;
      glowMesh.scale.x = lerp(glowMesh.scale.x, baseScale.x * auraScale, Math.min(1, dt * 6));
      glowMesh.scale.y = lerp(glowMesh.scale.y, baseScale.y * auraScale, Math.min(1, dt * 6));
      glowMesh.scale.z = lerp(glowMesh.scale.z, baseScale.z * auraScale, Math.min(1, dt * 6));
      if (b.model.userData.halo) {
        b.model.userData.halo.rotation.z += dt * (bloomReady ? 4.5 : 1.2);
        b.model.userData.halo.material.opacity = bloomReady ? 0.95 : bloomLinked ? 0.86 : 0.8;
      }
    }
  }

  let comboText = '';
  let comboColor = '#8fddff';
  if (b.chainReadyTimer > 0 && !game.bloom) {
    comboText = '✦ TOKEN';
  } else if (game.bloom && !game.bloom.started && game.bloom.starter === b) {
    comboText = 'START';
  } else if (game.bloom?.order?.includes(b)) {
    comboText = `×${game.bloom.multiplier.toFixed(1)}`;
  } else if (game.bloomAfterglow?.bees?.includes(b)) {
    comboText = `×${game.bloomAfterglow.multiplier.toFixed(1)}`;
    comboColor = game.bloomAfterglow.perfect ? '#ffe47a' : '#8fddff';
  }
  setBeeComboLabel(b, comboText, comboColor);

  if (b.boostTimer > 0) {
    b.boostTimer -= dt;
    if (b.boostTimer <= 0 && !b.inChain) b.boostMult = 1;
  }

  if (CONVERSION_STATES.includes(b.state) && (!hiveConversionActive() || !game.conversionStarted)) {
    cancelBeeConversion(b);
  } else if (game.conversionStarted) {
    prepareBeeForConversion(b);
  }

  const docking = DOCK_STATES.includes(b.state);
  const converting = CONVERSION_STATES.includes(b.state);
  if (docking) {
    updateBeeDock(b, dt, sp);
  } else if (converting) {
    updateBeeConversion(b, sp, dt);
  } else if (b.state === 'returning') {
    updateBeeDelivery(b, sp, dt);
  } else if (b.state === 'returningHive') {
    updateBeeHiveDelivery(b, sp, dt);
  } else if (game.swarmMode === 'swarm') {
    // Spacer: First bee is 10 frames behind player, next ones are spaced 8 frames apart
    const tidx = Math.max(0, game.playerHistory.length - 1 - 10 - (b.swarmIndex * 8));
    const st = game.playerHistory[tidx] || game.player;

    if (b.state === 'toFlower' || b.state === 'harvesting') {
      if (!b.target) {
        // Bees only fan out to forage while the keeper is standing inside a
        // field; out in the open they simply hover around the player.
        const activeField = fieldAtPosition(game.player.x, game.player.z);
        let nearF = activeField ? pickFlowerAcrossField(b, activeField) : null;
        if (!nearF && activeField) {
          let nearD = (activeField.radius + 4) * (activeField.radius + 4);
          for (const f of game.flowers) {
            if (f.fieldType !== activeField.id || !fieldUnlocked(f.fieldType)) continue;
            const fd = dist2(game.player.x, game.player.z, f.x, f.z);
            if (fd < nearD && f.phase > 0 && f.pollen > 0.2 && f.claims === 0) { nearD = fd; nearF = f; }
          }
        }
        if (nearF) { b.target = nearF; b.target.claims++; }
      }
      if (b.target) {
        moveToward3D(b, b.target.x, b.target.z, sp, dt);
        if (b.state !== 'harvesting' && dist2(b.x, b.z, b.target.x, b.target.z) < 1) {
          b.harvestTimer = T.flower.harvestBaseTime * T.flower.harvestTimeMult[b.target.phase] / beeHarvestSpeedMult();
          b.passiveHarvest = false;
          b.state = 'harvesting';
        }
        if (b.state === 'harvesting') {
          b.harvestTimer -= dt;
          if (b.harvestTimer <= 0) {
            finishBeeHarvest(b);
          }
        }
      } else {
        b.idleHover = true;
        const idx = b.swarmIndex || 0;
        const p = b.idlePhase || 0;
        // Orbit direction: alternate clockwise and counter-clockwise
        const direction = (idx % 2 === 0) ? 1 : -1;
        // Orbit angle at a fast, steady speed (5.2 factor) + added phase offset to prevent chirp acceleration over time
        const baseAngle = b.idleAngle + game.time * (b.idleOrbitSpeed || 0.42) * 5.2 * direction + Math.sin(game.time * 1.8 + idx) * 0.35;
        // Closer around the player but fanned out organically (1.3m to 3.5m) and breathing in/out dynamically
        const distance = 1.3 + ((idx * 2) % 5) * 0.55 + Math.sin(game.time * 0.85 + idx * 1.5) * 0.42;
        // Moderate organic wander offsets
        const wanderX = Math.sin(game.time * 1.3 + p) * 0.22;
        const wanderZ = Math.cos(game.time * 1.3 + p) * 0.22;
        
        const base = game.player.moving ? st : game.player;
        const hoverX = base.x + Math.sin(baseAngle) * distance + wanderX;
        const hoverZ = base.z + Math.cos(baseAngle) * distance + wanderZ;
        
        // Fast, responsive tracking speeds to keep up with the fast-spinning targets
        const dx = hoverX - b.x;
        const dz = hoverZ - b.z;
        const distToTarget = Math.hypot(dx, dz);
        const speedMult = game.player.moving 
          ? 1.45 
          : distToTarget > 2.0 
          ? 1.35 
          : 1.15;
          
        moveToward3D(b, hoverX, hoverZ, sp * speedMult, dt);
      }
    } else {
      b.state = 'toFlower';
    }
  } else {
    // Passive forage mode: slower autonomous work that feeds the hive refinery.
    const passiveSp = sp * T.lumen.passiveSpeedMult;
    if (b.state === 'toFlower') {
      if (b.target && b.target.pollen <= 0.2) {
        b.target.claims = Math.max(0, b.target.claims - 1);
        b.target = null;
      }
      if (!b.target) {
        b.target = pickFlower(b);
        if (b.target) b.target.claims++;
      }
      if (!b.target) { b.state = 'returningHome'; }   // nothing to forage → dock in the comb
      else {
        moveToward3D(b, b.target.x, b.target.z, passiveSp, dt);
        if (dist2(b.x, b.z, b.target.x, b.target.z) < 1) {
          b.harvestTimer = T.flower.harvestBaseTime * T.flower.harvestTimeMult[b.target.phase] * T.lumen.passiveHarvestTimeMult / beeHarvestSpeedMult();
          b.passiveHarvest = true;
          b.state = 'harvesting';
        }
      }
    } else if (b.state === 'harvesting') {
      if (!b.target) { b.state = 'toFlower'; return; }
      b.harvestTimer -= dt;
      if (b.harvestTimer <= 0) {
        finishBeeHarvest(b);
      }
    }
  }

  // Update 3D position and smooth flight tilting
  const lastX = b.x, lastZ = b.z;
  // Apply flight bob — but docked bees keep the height set by the dock routine.
  if (!docking && !CONVERSION_STATES.includes(b.state)) {
    const groundY = terrainHeightAt(b.x, b.z);   // fly over raised plateau fields
    let targetY;
    if (b.idleHover) {
      const idx = b.swarmIndex || 0;
      const p = b.idlePhase || 0;
      // Form a helical shape vertically with gentle vertical waving
      const heightOffset = 0.7 + ((idx * 3) % 5) * 0.35 + Math.cos(game.time * 0.9 + idx * 2.0) * 0.25;
      // Dynamic bobbing speed and height variation
      const uniqueBob = Math.sin(game.time * 2.0 + p) * 0.16;
      targetY = groundY + heightOffset + uniqueBob;
    } else {
      targetY = groundY + 1.2 + Math.sin(b.bob) * 0.3;
    }
    b.y = lerp(b.y !== undefined ? b.y : targetY, targetY, Math.min(1, dt * 3.5));
  }

  if (b.model) {
    b.model.position.set(b.x, b.y, b.z);
    
    if (b.spinTimer > 0) {
      b.spinTimer -= dt;
      b.model.rotation.y += dt * 10;
    }

    // We compute the physical delta to face direction and bank
    const dx = b.x - (b.lastX !== undefined ? b.lastX : b.x);
    const dy = b.y - (b.lastY !== undefined ? b.lastY : b.y);
    const dz = b.z - (b.lastZ !== undefined ? b.lastZ : b.z);
    const speedSq = dx*dx + dz*dz;
    const speedSq3D = dx*dx + dy*dy + dz*dz;
    // Use a higher threshold to filter out tiny micro-hover adjustments
    // Include Y-axis so bees flying up/down into hive cells still count as moving
    const isMoving = speedSq3D > 0.00018;

    if (isMoving) {
      const targetYaw = Math.atan2(dx, dz);
      let diff = targetYaw - b.model.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      
      // Smooth yaw rotation lerp
      b.model.rotation.y += diff * Math.min(1, 10 * dt);
      
      // Bank/Roll into turn
      const targetRoll = clamp(diff * 1.6, -0.42, 0.42);
      b.model.rotation.z = lerp(b.model.rotation.z, targetRoll, 6 * dt);
      
      // Pitch down based on speed
      const speed = Math.sqrt(speedSq) / (dt || 0.016);
      const targetPitch = clamp(speed * 0.015, 0, 0.25);
      b.model.rotation.x = lerp(b.model.rotation.x, targetPitch, 6 * dt);
    } else if (b.idleHover && !game.player.moving) {
      const p = b.idlePhase || 0;
      // Gentle yaw wander (looking around)
      const wanderYaw = Math.sin(game.time * 0.75 + p * 2.3) * 0.18;
      const targetYaw = Math.atan2(game.player.x - b.x, game.player.z - b.z) + wanderYaw;
      
      let diff = targetYaw - b.model.rotation.y;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      b.model.rotation.y += diff * Math.min(1, 3.2 * dt);
      
      // Gentle micro-balancing tilts (roll/pitch wobble) in mid-air
      const hoverRoll = Math.sin(game.time * 4.5 + p) * 0.08 + Math.cos(game.time * 1.5 + p * 1.8) * 0.03;
      const hoverPitch = Math.cos(game.time * 3.2 + p * 1.2) * 0.06 + Math.sin(game.time * 1.0 + p) * 0.03;
      
      b.model.rotation.z = lerp(b.model.rotation.z, hoverRoll, 5 * dt);
      b.model.rotation.x = lerp(b.model.rotation.x, hoverPitch, 5 * dt);
    } else {
      // Level out when hovering stationary
      b.model.rotation.z = lerp(b.model.rotation.z, 0, 6 * dt);
      b.model.rotation.x = lerp(b.model.rotation.x, 0, 6 * dt);
    }
  }
  b.lastX = b.x;
  b.lastY = b.y;
  b.lastZ = b.z;
}

// ======================== FLOWERS ========================
function updateFlower(f, dt) {
  if (!f.tier) syncFlowerTier(f, false);
  if ((f.pollinatedTier || 0) > 0) {
    f.pollinationTimer = Math.max(-1, (f.pollinationTimer || 0) - dt);
    let decayed = false;
    while (f.pollinationTimer <= 0 && (f.pollinatedTier || 0) > 0) {
      f.pollinatedTier = Math.max(0, f.pollinatedTier - 1);
      f.pollinationTimer += 60;
      decayed = true;
    }
    if ((f.pollinatedTier || 0) <= 0) f.pollinationTimer = 0;
    if (decayed) syncFlowerTier(f, false);
  }

  if (typeof f.pollen === 'number' && typeof f.maxPollen === 'number') {
    if (f.pollen < f.maxPollen) {
      f.pollen = Math.min(f.maxPollen, f.pollen + f.regrowthPerSecond * flowerTierRegenMult(f.tier) * dt);
    }
    f.phase = clamp(Math.ceil((f.pollen / f.maxPollen) * 3), 0, 3);
  } else if (f.phase < 3) {
    f.regen += dt;
    if (f.regen >= T.flower.regenPerPhase) {
      f.regen -= T.flower.regenPerPhase;
      f.phase = Math.min(3, f.phase + 1);
    }
  }
  f.sway += dt;
  f.pulse += dt * 2.2;
  f.flash = Math.max(0, (f.flash || 0) - dt * 2.4);
  f.harvestPop = Math.max(0, (f.harvestPop || 0) - dt * 3.4);
  // Vitality slowly returns while the flower is left undisturbed (runs for every
  // flower, even culled ones, so a field heals back up while you're elsewhere).
  if ((f.vitality ?? 1) < 1) f.vitality = clamp((f.vitality ?? 1) + T.flower.vitalityRecover * dt, 0, 1);
  const locked = !fieldUnlocked(f.fieldType);

  // Animate: sway and phase-based petal scale/color.
  // PERF: skip the (expensive) per-frame material/scale/glow refresh for flowers
  // far from the camera — they're tiny on screen and barely change. Gameplay
  // (pollen regrow / phase, handled above) still runs for EVERY flower, so bees
  // and regrowth stay correct; only the visual polish is distance-culled. A
  // flash (just-harvested pop) always refreshes so nearby feedback never stalls.
  if (f.model) {
    const cdx = f.x - camera.position.x, cdz = f.z - camera.position.z;
    const cameraDistanceSq = cdx * cdx + cdz * cdz;
    const shouldRender = cameraDistanceSq <= FLOWER_RENDER_CULL_SQ;
    if (f.model.visible !== shouldRender) f.model.visible = shouldRender;
    if (!shouldRender) return;
    if (cameraDistanceSq > FLOWER_VISUAL_CULL_SQ && (f.flash || 0) <= 0.01) return;
    const swayAmt = Math.sin(f.sway * 1.5 + f.x * 0.1) * 0.08;
    f.model.rotation.z = swayAmt;
    f.model.rotation.x = swayAmt * 0.5;

    const headGroup = f.model.userData.headGroup;
    const petals = f.model.userData.petals;
    const tier = flowerEffectiveTier(f);
    const vitality = clamp(f.vitality ?? 1, 0, 1);

    // Worn flowers stand noticeably shorter (over-picked → wilted, regrows when rested).
    const baseScale = f.baseScale || 1;
    f.model.scale.set(baseScale, baseScale * (0.45 + 0.55 * vitality), baseScale);

    // Define colors for withered vs healthy states without per-frame allocations.
    const finalColor = tempFlowerColor.set(f.hue);
    if (!locked && (f.pollinatedTier || 0) > 0) finalColor.lerp(POLLINATED_FLOWER_COLOR, 0.24 + f.flash * 0.18);
    finalColor.lerp(DEAD_FLOWER_COLOR, locked ? 0.72 : (f.phase === 0 ? 0.9 : (3 - f.phase) * 0.16));
    if (!locked) finalColor.lerp(DEAD_FLOWER_COLOR, (1 - vitality) * 0.65);   // grays out as it wears down

    // Apply color and rotation to petals based on phase
    if (petals) {
      const petalMesh = f.model.userData.petalMesh;
      if (petalMesh && petalMesh.material) {
        petalMesh.material.color.copy(finalColor);
        petalMesh.material.emissive.copy(finalColor).multiplyScalar(f.phase === 0 ? 0.05 : 0.5);
      }
      petals.forEach((p, index) => {
        // Fold/droop petals downward if empty (phase 0), otherwise keep open
        let targetRotX = 0.25;
        if (f.phase === 0) {
          targetRotX = f.species === 1 ? -0.85 : 0.85; // Tulip folds down differently
        } else if (f.species === 1) {
          targetRotX = -0.2;
        } else if (f.species === 2) {
          targetRotX = 0.15;
        }
        p.rotation.x = lerp(p.rotation.x, targetRotX, 0.1);
        p.updateMatrix();
        if (petalMesh) petalMesh.setMatrixAt(index, p.matrix);
      });
      if (petalMesh) petalMesh.instanceMatrix.needsUpdate = true;
    }

    // Bloom size tracks pollen fullness continuously: a flower visibly shrinks as
    // it is depleted and swells back up as it regrows — a clear "how full am I" read.
    const fullness = f.maxPollen ? clamp(f.pollen / f.maxPollen, 0, 1) : f.phase / 3;
    const openness = locked ? 0.3 : 0.32 + 0.68 * fullness;
    const tierScale = (f.headScaleTier || (0.83 + tier * 0.07)) + ((f.pollinatedTier || 0) > 0 ? 0.05 : 0);
    const pop = 1 - (f.harvestPop || 0) * 0.24;
    headGroup.scale.setScalar(openness * tierScale * pop);

    if (f.model.userData.plotMat) {
      const plotMat = f.model.userData.plotMat;
      const plotFullness = locked ? 0 : fullness;
      plotMat.color.copy(FULL_FLOWER_PLOT_COLOR).lerp(EMPTY_FLOWER_PLOT_COLOR, 1 - plotFullness);
      if (!locked && (f.pollinatedTier || 0) > 0) plotMat.color.lerp(POLLINATED_FLOWER_COLOR, 0.18);
      if (!locked) plotMat.color.lerp(DEAD_FLOWER_COLOR, (1 - vitality) * 0.5);
      plotMat.emissive.copy(plotMat.color).multiplyScalar(0.12);
      plotMat.emissiveIntensity = locked ? 0 : (0.04 + plotFullness * 0.1 + f.flash * 0.14) * (0.4 + 0.6 * vitality);
    }

    // Base ring: brightens with fullness, pulses, glows cyan while pollinated,
    // and flares on harvest — the clearest "this flower is ready" signal. It also
    // grays + dims the more the flower has been over-picked (vitality).
    if (f.model.userData.tierRing) {
      const ringMat = f.model.userData.tierRingMat;
      if (locked) {
        ringMat.opacity = 0.07;
        ringMat.color.copy(DEAD_FLOWER_COLOR);
      } else {
        if ((f.pollinatedTier || 0) > 0) ringMat.color.setHex(0x28d7c5);
        else {
          ringMat.color.copy(FULL_FLOWER_PLOT_COLOR).lerp(EMPTY_FLOWER_PLOT_COLOR, 1 - fullness);
          ringMat.color.lerp(DEAD_FLOWER_COLOR, (1 - vitality) * 0.6);
        }
        const pulse = (0.26 + 0.3 * fullness + Math.sin(f.pulse * 1.7) * 0.06 + (f.flash || 0) * 0.5) * (0.4 + 0.6 * vitality);
        ringMat.opacity = clamp(pulse, 0.05, 0.96);
      }
    }
    if (f.model.userData.star && f.model.userData.star.visible) {
      f.model.userData.star.rotation.z += dt * 1.6;
    }

    // Glow intensity & pulsing for fully bloomed flowers (worn flowers glow less).
    if (f.model.userData.glow) {
      let gi;
      if (locked || f.phase === 0) gi = 0;
      else if (f.phase === 3) gi = Math.sin(f.pulse * 2.0) * 0.25 + 0.85 + f.flash * 0.45;
      else gi = 0.1 + 0.6 * T.flower.yieldMult[f.phase] + f.flash * 0.25;
      f.model.userData.glow.intensity = gi * (0.3 + 0.7 * vitality);
    }
  }
}

// ======================== HARVEST FEEDBACK FX ========================
// Pooled burst rings + floating "+pollen" numbers so a harvest reads clearly,
// even in a crowded field. Capped so dense swings never spam the scene.
const HARVEST_FX_MAX = 22;
const harvestRingGeo = new THREE.RingGeometry(0.32, 0.5, 24);
const harvestFXPool = [];

function makeFloatTextSprite() {
  const canvas = document.createElement('canvas');
  canvas.width = 128; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.userData = { ctx, tex };
  return spr;
}

function drawFloatText(spr, text, colorHex) {
  const ctx = spr.userData.ctx;
  ctx.clearRect(0, 0, 128, 64);
  const col = '#' + colorHex.toString(16).padStart(6, '0');
  ctx.font = 'bold 34px Outfit, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(8,10,16,0.85)';
  ctx.strokeText(text, 64, 32);
  ctx.fillStyle = col;
  ctx.fillText(text, 64, 32);
  spr.userData.tex.needsUpdate = true;
}

function spawnHarvestBurst(x, y, z, colorHex, amount, groundY = 0, showAmount = true, vitality = 1) {
  if (game.harvestFX.length >= HARVEST_FX_MAX) return;
  const fx = harvestFXPool.pop() || (() => {
    const group = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthWrite: false });
    const ring = new THREE.Mesh(harvestRingGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);
    const text = makeFloatTextSprite();
    text.scale.set(2.0, 1.0, 1);
    group.add(text);
    return { group, ring, ringMat, text };
  })();
  fx.ringMat.color.setHex(colorHex);
  // Worn-out flowers produce a dimmer, smaller burst ring.
  fx.vitality = clamp(vitality, 0, 1);
  fx.peakOpacity = 0.3 + 0.55 * fx.vitality;
  fx.peakScale = 0.62 + 0.38 * fx.vitality;
  fx.ringMat.opacity = fx.peakOpacity;
  fx.ring.scale.setScalar(fx.peakScale);
  fx.ring.position.set(x, groundY + 0.12, z);
  fx.text.visible = showAmount;
  if (showAmount) drawFloatText(fx.text, '+' + Math.round(amount), 0xfff2a6);
  fx.text.position.set(x, y + 0.2, z);
  fx.text.material.opacity = 1;
  fx.life = 0;
  fx.x = x; fx.z = z; fx.y = y;
  scene.add(fx.group);
  game.harvestFX.push(fx);
}

function updateHarvestFX(dt) {
  for (let i = game.harvestFX.length - 1; i >= 0; i--) {
    const fx = game.harvestFX[i];
    fx.life += dt;
    const t = fx.life / 0.7;
    // Ring expands & fades flat on the ground (dimmer/smaller for worn flowers)
    const grow = fx.peakScale ?? 1;
    fx.ring.scale.setScalar((1 + t * 3.2) * grow);
    fx.ringMat.opacity = Math.max(0, (fx.peakOpacity ?? 0.85) * (1 - t));
    // Number floats up and fades
    fx.text.position.y = fx.y + 0.2 + t * 1.3;
    fx.text.material.opacity = Math.max(0, 1 - t);
    if (fx.life >= 0.7) {
      scene.remove(fx.group);
      game.harvestFX.splice(i, 1);
      harvestFXPool.push(fx);
    }
  }
}

// ======================== POLLEN & HONEY PHYSICS ========================
function spawnPollenOrbs(flower, boost) {
  const val = harvestFlowerPollen(flower, boost);
  if (val <= 0) return;
  maybeSpawnAbilityToken(flower, 0.11 + Math.min(0.08, game.equipment.tool.level * 0.01));

  // Punchy, distinct harvest feedback: flash, squash-pop, ground burst, +pollen.
  const gy = flower.groundY || 0;
  flower.flash = 1;
  flower.harvestPop = 1;
  spawnHarvestBurst(flower.x, gy + 0.9, flower.z, harvestBurstHex(flower), val, gy, false, flower.lastHarvestVitality);
  if (game.time >= (game.nextHarvestSfx || 0)) {
    synth.playPollenPop();
    game.nextHarvestSfx = game.time + 0.06;
  }

  const numOrbs = Math.floor(rand(2, 4));
  const perOrb = val / numOrbs;
  for (let i = 0; i < numOrbs; i++) {
    const model = acquirePollenOrbModel(flower.hue);
    const ox = flower.x + rand(-1.5, 1.5);
    const oz = flower.z + rand(-1.5, 1.5);
    model.position.set(ox, gy + 1.25, oz);
    scene.add(model);
    game.pollenOrbs.push({
      x: ox, z: oz, y: gy + 1.25, groundY: gy,
      vy: rand(3, 6), vx: rand(-2, 2), vz: rand(-2, 2),
      val: perOrb, hue: flower.hue,
      bounce: 2, model, bobPhase: Math.random() * Math.PI * 2,
    });
  }
}

function updatePollenOrbs(dt) {
  const p = game.player;
  const cap = pollenCap();
  for (let i = game.pollenOrbs.length - 1; i >= 0; i--) {
    const o = game.pollenOrbs[i];
    const d = dist2(p.x, p.z, o.x, o.z);

    if (d < pickupRadius() && game.pollen < cap) {
      // Pull toward player
      const dx = p.x - o.x, dz = p.z - o.z;
      const dd = Math.hypot(dx, dz) || 1;
      const pullSpeed = 20;
      o.x += (dx/dd) * pullSpeed * dt;
      o.z += (dz/dd) * pullSpeed * dt;
      o.y = lerp(o.y, (o.groundY || 0) + 0.8, 0.1);

      if (d < 1.5) {
        game.pollen = Math.min(cap, game.pollen + o.val);
        if (game.time >= game.nextPollenSound) {
          synth.playPollenPop();
          game.nextPollenSound = game.time + 0.08;
        }
        releasePollenOrbModel(o.model);
        game.pollenOrbs.splice(i, 1);
        continue;
      }
    } else {
      const floor = (o.groundY || 0) + 0.55;
      if (o.bounce > 0) {
        o.vy -= 15 * dt;
        o.y += o.vy * dt;
        o.x += o.vx * dt;
        o.z += o.vz * dt;
        if (o.y <= floor) {
          o.y = floor; o.vy = Math.abs(o.vy) * 0.4;
          o.vx *= 0.5; o.vz *= 0.5;
          o.bounce--;
        }
      } else {
        o.bobPhase += dt * 4;
        o.y = (o.groundY || 0) + 0.68 + Math.sin(o.bobPhase) * 0.14;
      }
    }
    if (o.model) {
      o.model.position.set(o.x, o.y, o.z);
      // Spin the crystal gem and the outer halo ring
      if (o.model.userData.gem) {
        o.model.userData.gem.rotation.y += dt * 2.5;
        o.model.userData.gem.rotation.x += dt * 1.2;
      }
      if (o.model.userData.ring) {
        o.model.userData.ring.rotation.z += dt * 1.5;
      }
      if (o.model.userData.beacon) {
        o.model.userData.beacon.rotation.z -= dt * 0.8;
      }
    }
  }
}

function updateHoneyJars(dt) {
  const p = game.player;
  for (let i = game.honeyJars.length - 1; i >= 0; i--) {
    const j = game.honeyJars[i];
    const d = dist2(p.x, p.z, j.x, j.z);

    if (d < 2.5) {
      game.honey += j.val;
      if (game.time >= game.nextHoneySound) {
        synth.playHoneyChime();
        game.nextHoneySound = game.time + 0.1;
      }
      releaseHoneyJarModel(j.model);
      game.honeyJars.splice(i, 1);
      continue;
    }

    if (j.bounce > 0) {
      j.vy -= 15 * dt;
      j.y += j.vy * dt;
      j.x += j.vx * dt;
      j.z += j.vz * dt;
      if (j.y <= 0.2) {
        j.y = 0.2; j.vy = Math.abs(j.vy) * 0.35;
        j.vx *= 0.5; j.vz *= 0.5;
        j.bounce--;
      }
    } else {
      j.bobPhase += dt * 3;
      j.y = 0.25 + Math.sin(j.bobPhase) * 0.08;
    }
    if (j.model) {
      j.model.position.set(j.x, j.y, j.z);
      j.model.rotation.y += dt * 1.5;
      if (j.model.userData.ring) j.model.userData.ring.rotation.z -= dt * 1.8;
    }
  }
}

// ======================== BLOOM CHAINS ========================
function eligibleBees() {
  return game.lumens.filter(b =>
    b.state === 'harvesting'
    || b.state === 'toFlower'
    || b.state === 'returning'
    || b.state === 'returningHive'
  );
}

function startBloom(elig) {
  const starter = elig.find(b => b.ability === 'bloomLink') || elig[Math.floor(Math.random() * elig.length)];
  starter.chainReadyTimer = 0;
  game.bloomAfterglow = null;
  game.bloom = { started:false, starter, eligible:elig.slice(), order:[], multiplier:1.0, timer:0, readyTimer:T.bloom.readyTimeout, pulse:0 };
}

function liveBoost(bl) {
  for (const b of bl.order) { b.boostMult=bl.multiplier; b.boostTimer=Math.max(b.boostTimer,6); b.inChain=true; }
}

function endBloom(perfect) {
  const bl = game.bloom;
  if (bl && bl.started) {
    const boosted = perfect ? bl.eligible : bl.order;
    const linkedCount = boosted.length;
    const dur = perfect
      ? Math.min(20, 6 + linkedCount * 0.55)
      : Math.min(14, 5 + linkedCount * 0.35);
    for (const b of boosted) { b.boostMult=bl.multiplier; b.boostTimer=dur; }
    game.bloomAfterglow = {
      bees: boosted.slice(),
      multiplier: bl.multiplier,
      perfect,
      timer: dur,
      duration: dur,
      pulse: bl.pulse
    };
    if (perfect) {
      showTutorial(`Perfect Bloom Chain: ${linkedCount} bees at ×${bl.multiplier.toFixed(1)} for ${dur.toFixed(1)}s.`);
      synth.playCasino(true);
    } else {
      showTutorial(`Partial Bloom Chain: ${linkedCount} bees at ×${bl.multiplier.toFixed(1)} for ${dur.toFixed(1)}s.`);
      synth.playCasino(false);
    }
  } else if (bl) {
    showTutorial('Bloom Chain missed.');
  }
  for (const b of game.lumens) b.inChain = false;
  game.bloom = null;
  game.bloomCooldown = T.bloom.cooldown;
}

// The Bloom Link web: glowing blue strands connecting you and every linked bee
// into a shimmering spider-web while a chain is active (Celest Lumen's ability).
const BLOOM_WEB_MAX_SEG = 1225;
const bloomWebDummy = new THREE.Object3D();
const bloomWebDir = new THREE.Vector3();
const bloomWebUp = new THREE.Vector3(0, 1, 0);
function updateBloomWeb() {
  if (!game.bloomWeb) {
    const positions = new Float32Array(BLOOM_WEB_MAX_SEG * 6);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.LineBasicMaterial({ color: 0x1a5acc, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false });
    const lines = new THREE.LineSegments(geo, mat);
    lines.frustumCulled = false; lines.visible = false;
    scene.add(lines);

    // WebGL ignores wide LineBasicMaterial widths on most platforms, so one
    // instanced cyan tube per bond provides a reliably thicker Celest web.
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x0c3eb0,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const tubes = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.11, 0.11, 1, 8, 1, true),
      tubeMat,
      BLOOM_WEB_MAX_SEG
    );
    tubes.frustumCulled = false;
    tubes.visible = false;
    scene.add(tubes);
    game.bloomWeb = { lines, geo, positions, mat, tubes, tubeMat };
  }
  const web = game.bloomWeb;
  const bl = game.bloom;
  const afterglow = game.bloomAfterglow;
  const linkedBees = bl && bl.started && bl.order && bl.order.length
    ? bl.order
    : afterglow && afterglow.timer > 0
    ? afterglow.bees
    : null;
  if (!linkedBees || !linkedBees.length) {
    web.lines.visible = false;
    web.tubes.visible = false;
    return;
  }

  const p = game.player;
  const nodes = [{ x: p.x, y: (p.groundY || 0) + 1.0, z: p.z }];
  const cap = Math.min(linkedBees.length, INITIAL_HEX_SLOTS);
  for (let i = 0; i < cap; i++) { const b = linkedBees[i]; nodes.push({ x: b.x, y: b.y, z: b.z }); }

  const pos = web.positions;
  let s = 0;
  for (let i = 0; i < nodes.length && s < BLOOM_WEB_MAX_SEG; i++) {
    for (let j = i + 1; j < nodes.length && s < BLOOM_WEB_MAX_SEG; j++) {
      const a = nodes[i], b = nodes[j];
      pos[s*6+0] = a.x; pos[s*6+1] = a.y; pos[s*6+2] = a.z;
      pos[s*6+3] = b.x; pos[s*6+4] = b.y; pos[s*6+5] = b.z;

      const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z;
      const len = Math.hypot(dx, dy, dz) || 0.001;
      bloomWebDir.set(dx / len, dy / len, dz / len);
      bloomWebDummy.position.set((a.x + b.x) * 0.5, (a.y + b.y) * 0.5, (a.z + b.z) * 0.5);
      bloomWebDummy.quaternion.setFromUnitVectors(bloomWebUp, bloomWebDir);
      bloomWebDummy.scale.set(1, len, 1);
      bloomWebDummy.updateMatrix();
      web.tubes.setMatrixAt(s, bloomWebDummy.matrix);
      s++;
    }
  }
  web.geo.setDrawRange(0, s * 2);
  web.geo.attributes.position.needsUpdate = true;
  const pulse = bl ? bl.pulse : afterglow.pulse;
  const fade = afterglow && !bl ? clamp(afterglow.timer / 2, 0, 1) : 1;
  web.mat.opacity = (0.32 + Math.sin(pulse) * 0.12) * fade;
  web.tubeMat.opacity = (0.22 + Math.sin(pulse) * 0.06) * fade;
  web.tubes.count = s;
  web.tubes.instanceMatrix.needsUpdate = true;
  web.lines.visible = true;
  web.tubes.visible = true;
}

function updateBloom(dt) {
  game.bloomCooldown = Math.max(0, game.bloomCooldown - dt);
  if (game.bloomAfterglow) {
    game.bloomAfterglow.timer -= dt;
    game.bloomAfterglow.pulse += dt * 5;
    if (game.bloomAfterglow.timer <= 0) game.bloomAfterglow = null;
  }
  if (!game.bloom) {
    game.bloomCheck -= dt;
    if (game.bloomCheck <= 0) {
      game.bloomCheck = T.bloom.checkInterval;
      const harvestingByField = new Map();
      for (const b of game.lumens) {
        if (b.state !== 'harvesting' || !b.target) continue;
        const fieldId = b.target.fieldType;
        if (!harvestingByField.has(fieldId)) harvestingByField.set(fieldId, []);
        harvestingByField.get(fieldId).push(b);
      }
      const harvesting = [...harvestingByField.values()].sort((a, b) => b.length - a.length)[0] || [];
      const celest = harvesting.find(b => b.ability === 'bloomLink');
      const tokenReady = game.abilityTokens.some(t => t.type === 'beeFocus');
      if (
        celest
        && !game.bloomAfterglow
        && !tokenReady
        && game.bloomCooldown <= 0
        && harvesting.length >= T.bloom.minBees
        && Math.random() < T.bloom.triggerChance
      ) {
        let x = 0, z = 0;
        for (const b of harvesting) {
          x += b.target ? b.target.x : b.x;
          z += b.target ? b.target.z : b.z;
        }
        x /= harvesting.length;
        z /= harvesting.length;
        if (spawnAbilityToken('beeFocus', x, z)) {
          // The bee no longer glows immediately upon spawning the token.
          // Triggering occurs only when the player walks into the token.
          game.bloomCooldown = T.bloom.cooldown;
          showTutorial('Celest Lumen formed a Celestial Link token between the flowers.');
        }
      }
    }
    return;
  }
  const bl = game.bloom;
  bl.pulse += dt * 6;
  const p = game.player;
  if (!bl.started) {
    bl.readyTimer -= dt;
    if (dist2(p.x, p.z, bl.starter.x, bl.starter.z) < T.bloom.touchRadius) {
      bl.started = true; bl.order = [bl.starter]; bl.multiplier = 1.5;
      bl.timer = T.bloom.perTouchTime; liveBoost(bl); synth.playPollenPop();
    } else if (bl.readyTimer <= 0) { endBloom(false); }
    return;
  }
  bl.timer -= dt;
  for (const b of bl.eligible) {
    if (bl.order.includes(b)) continue;
    if (dist2(p.x, p.z, b.x, b.z) < T.bloom.touchRadius) {
      bl.order.push(b); bl.multiplier += 0.5; bl.timer = T.bloom.perTouchTime;
      liveBoost(bl); synth.playPollenPop();
    }
  }
  liveBoost(bl);
  if (bl.order.length >= bl.eligible.length) { endBloom(true); return; }
  if (bl.timer <= 0) endBloom(false);
}

// ======================== REFINERY ========================
function refineTick(dt) {
  // Auto-deactivate conversion when player walks away (using hysteresis padding) or all pollen is converted
  if (game.conversionStarted && (distanceToHiveCircle() > T.hive.conversionRadius + 2.0 || !conversionWorkAvailable())) {
    game.conversionStarted = false;
    for (const b of game.lumens) cancelBeeConversion(b);
  }

  if (!game.conversionStarted || !hiveConversionActive()) {
    for (const b of game.lumens) cancelBeeConversion(b);
  } else if (queuedPollenForHoney() > 0.000001) {
    for (const b of game.lumens) prepareBeeForConversion(b);
  }

  game.hpsTimer += dt;
  if (game.hpsTimer >= 0.5) {
    game.hps = game.honeyAccum / game.hpsTimer;
    game.honeyAccum = 0; game.hpsTimer = 0;
  }
}

// ======================== SHOP / EGG SATCHEL / PERKS ========================
const SHOP_SECTIONS = [
  {
    title: 'Bees & Eggs',
    items: [
      { key:'basicEgg', name:'Basic Egg', desc:'Adds a Basic Egg to the queue', cost: eggCost, tag:'Bees' },
      { key:'workerEgg', name:'Worker Bee Egg', desc:'Guarantees a Common Worker Bee', cost: () => Math.floor(eggCost()*2.2), tag:'Bees' },
      { key:'scoutEgg', name:'Scout Bee Egg', desc:'Guarantees an Uncommon Scout Bee', cost: () => Math.floor(eggCost()*3.2), tag:'Bees' },
      { key:'rareEgg', name:'Rare Egg', desc:'Guarantees a mystical Rare Celest Lumen', cost: () => Math.floor(eggCost()*5.5), tag:'Bees' },
    ]
  },
  {
    title: 'Equipment',
    items: [
      { key:'tool', name:'Nectar Tool', desc:'Hold left mouse to harvest with more reach and power', cost: toolCost, tag:'Equipment' },
      { key:'pack', name:'Bigger Pollen Pack', desc:'+40 pollen capacity', cost: packCost, tag:'Equipment' },
      { key:'boots', name:'Faster Boots', desc:'+6% movement speed', cost: bootsCost, tag:'Equipment' },
      { key:'whistle', name:'Better Bee Whistle', desc:'+6% bee travel speed', cost: whistleCost, tag:'Equipment' },
      { key:'magnet', name:'Pollen Magnet', desc:'+0.8 pickup radius', cost: magnetCost, tag:'Equipment' },
      { key:'jar', name:'Honey Jar', desc:'+3% honey yield & faster hive conversion', cost: jarCost, tag:'Equipment' },
      { key:'scanner', name:'Field Scanner', desc:'Adds a compass toward healthy flowers without overhead labels', cost: scannerCost, tag:'Equipment' },
    ]
  },
  {
    title: 'Hive Utility',
    items: [
      { key:'slot', name:'Unlock Hex Slot', desc:'Adds room for another owned bee', cost: slotCost, tag:'Hive' },
      { key:'refine', name:'Honey Refinery Flow', desc:'+8% bee conversion rate', cost: () => upgCost(game.upgrades.refine), tag:'Hive' },
      { key:'storage', name:'Hive Storage Cell', desc:'+50 pollen pack capacity', cost: () => upgCost(game.upgrades.storage), tag:'Hive' },
      { key:'marketTerminal', name:'Market Terminal', desc:'Unlocks price trend indicators in Honey Market', cost: () => upgCost(game.upgrades.marketTerminal), tag:'Hive' },
    ]
  }
];
const upgCost = u => Math.floor(u.base * Math.pow(u.growth, u.level));

function spendHoney(cost) {
  if (game.honey < cost) {
    showTutorial(`Need ${cost} honey.`);
    return false;
  }
  game.honey -= cost;
  synth.playBell();
  return true;
}

function buyShopItem(key) {
  if (game.phase !== 'playing') return;
  const dh = distanceToHiveCircle();
  const ds = dist2(game.player.x, game.player.z, SHOP_POS.x, SHOP_POS.z);
  if (dh >= 10 && ds >= 10) { showTutorial('Walk to the SHOP stall or your hive to buy upgrades.'); return; }
  const item = SHOP_SECTIONS.flatMap(s => s.items).find(i => i.key === key);
  if (!item || item.locked) return;
  const cost = item.cost();
  if (!spendHoney(cost)) return;

  if (key === 'basicEgg') {
    queueEgg('Basic Egg');
    showTutorial('Basic Egg added to your satchel. Drag it onto your hive to hatch it.');
  } else if (key === 'workerEgg') {
    queueEgg('Worker Egg');
    showTutorial('Worker Egg added to your satchel. Drag it onto your hive to hatch it.');
  } else if (key === 'scoutEgg') {
    queueEgg('Scout Egg');
    showTutorial('Scout Egg added to your satchel. Drag it onto your hive to hatch it.');
  } else if (key === 'rareEgg') {
    queueEgg('Rare Egg');
    showTutorial('Rare Egg added to your satchel. Drag it onto your hive to hatch it.');
  } else if (key === 'slot') {
    const slot = game.beeSlots.find(s => !s.unlocked);
    if (slot) {
      slot.unlocked = true;
      const slotNum = slot.id.replace(/^slot_0*/i, '') || '1';
      showTutorial(`Slot ${slotNum} unlocked.`);
      updateHiveVisuals();
    } else {
      game.honey += cost;
      showTutorial('All current hex slots are already unlocked.');
    }
  } else if (game.equipment[key]) {
    game.equipment[key].level++;
    if (key === 'boots') game.player.speed = 14 * (1 + 0.06 * game.equipment.boots.level);
    showTutorial(`${item.name} upgraded.`);
  } else if (game.upgrades[key]) {
    game.upgrades[key].level++;
    showTutorial(`${item.name} upgraded.`);
  }
  updateProgressionUI();
}

function buildPanel() {
  const wrap = document.getElementById('upgrades');
  if (!wrap) return;
  wrap.innerHTML = '';
  
  const currentTab = game.ui.shopTab || 'bees';
  let sectionIndex = 0;
  if (currentTab === 'gear') sectionIndex = 1;
  else if (currentTab === 'hive') sectionIndex = 2;
  
  const section = SHOP_SECTIONS[sectionIndex];
  if (!section) return;
  
  for (const item of section.items) {
    const btn = document.createElement('button');
    btn.className = 'upg';
    btn.dataset.key = item.key;
    
    let icon = '❓';
    if (item.key === 'basicEgg') icon = `<img src="${EGG_ICON}" alt="" draggable="false">`;
    else if (item.key === 'workerEgg') icon = '🐝';
    else if (item.key === 'scoutEgg') icon = '⚡';
    else if (item.key === 'rareEgg') icon = '🌌';
    else if (item.key === 'tool') icon = '⚒️';
    else if (item.key === 'pack') icon = '🎒';
    else if (item.key === 'boots') icon = '🥾';
    else if (item.key === 'whistle') icon = '📣';
    else if (item.key === 'magnet') icon = '🧲';
    else if (item.key === 'jar') icon = '🍯';
    else if (item.key === 'scanner') icon = '🔍';
    else if (item.key === 'slot') icon = '⬡';
    else if (item.key === 'refine') icon = '⚙️';
    else if (item.key === 'storage') icon = '📦';
    else if (item.key === 'marketTerminal') icon = '📈';
    
    btn.innerHTML = `
      <div class="shop-item-icon-wrap">${icon}</div>
      <div class="shop-item-details">
        <div class="shop-item-row-top">
          <span class="u-name">${item.name}</span>
          <span class="u-level"></span>
        </div>
        <span class="u-desc">${item.desc}</span>
        <div class="shop-item-meta">
          <span class="shop-item-tag">${item.tag}</span>
          <span class="u-cost"></span>
        </div>
      </div>`;
    btn.addEventListener('click', () => buyShopItem(item.key));
    wrap.appendChild(btn);
  }
}

function rarityClass(rarity) {
  return String(rarity || '').toLowerCase();
}

function beeValue(bee) {
  const rarityMult = bee.rarity === 'Rare' ? 2.6 : bee.rarity === 'Uncommon' ? 1.65 : 1;
  return Math.floor(22 * rarityMult + bee.level * 8 + (bee.gatherPower || 1) * 10);
}

function syncMarketHoldings() {
  for (const asset of game.market.assets) {
    const pos = assetPosition(asset);
    game.playerProfile.marketHoldings[asset.id] = {
      units: pos.owned,
      invested: pos.invested,
      value: pos.value,
      unrealized: pos.unrealized,
      realized: asset.realizedProfit || 0,
    };
  }
}

function updateProfileSnapshot() {
  syncMarketHoldings();
  game.playerProfile.honeyReserve = game.honey;
  game.playerProfile.pollen = game.pollen;
  game.playerProfile.bees = game.lumens.map(b => ({
    id: b.id,
    name: b.name,
    rarity: b.rarity,
    level: b.level,
    role: b.role,
    gatherPower: b.gatherPower,
    speed: b.speed,
    status: b.status,
    hiveSlotId: b.hiveSlotId,
  }));
  game.playerProfile.hiveSlots = game.beeSlots.map(s => ({ ...s }));
  game.playerProfile.equipment = Object.fromEntries(Object.entries(game.equipment).map(([k, v]) => [k, { ...v }]));
  game.playerProfile.perks = Object.fromEntries(Object.entries(game.perks).map(([k, v]) => [k, { level: v.level }]));
  game.playerProfile.netHiveValue = Math.floor(netWorth());
  game.playerProfile.seasonStats.netHiveValue = game.playerProfile.netHiveValue;
  game.playerProfile.seasonStats.honeyFlow = game.hps;
  game.playerProfile.seasonStats.beesOwned = game.lumens.length;
  game.playerProfile.seasonStats.rareBeesOwned = game.lumens.filter(b => b.rarity === 'Rare').length;
}

// ======================== EGG INVENTORY (drag → hatch) ========================
const EGG_ICON = new URL('./assets/basic_egg.png?v=37', document.baseURI).href;
const EGG_ORDER = ['Basic Egg', 'Worker Egg', 'Scout Egg', 'Rare Egg'];
const eggOrderIndex = t => { const i = EGG_ORDER.indexOf(t); return i < 0 ? 99 : i; };

let lastHoveredSlotIndex = -1;

function clearEggDragHover() {
  if (lastHoveredSlotIndex !== -1) {
    if (game.hive.slotMeshes && game.hive.slotMeshes[lastHoveredSlotIndex]) {
      game.hive.slotMeshes[lastHoveredSlotIndex].dragHovered = false;
    }
    lastHoveredSlotIndex = -1;
    updateHiveVisuals();
  }
}

function eggCounts() {
  const counts = {};
  for (const e of game.eggs) counts[e.type] = (counts[e.type] || 0) + 1;
  return counts;
}

// One draggable egg tile for the side satchel.
function makeEggTile(type, count, opts = {}) {
  const tile = document.createElement('div');
  tile.className = 'inv-egg';
  tile.draggable = true;
  tile.dataset.eggType = type;
  tile.title = `${type} ×${count} — drag onto a free hive slot to hatch`;
  tile.innerHTML =
    `<img src="${EGG_ICON}" alt="${type}" draggable="false" decoding="async">` +
    `<span class="inv-egg-name">${type.replace(' Egg', '')}</span>` +
    `<span class="inv-egg-meta">Egg · hatch at hive</span>` +
    (count > 1 ? `<span class="inv-egg-count">${count}</span>` : '');
  tile.addEventListener('dragstart', ev => {
    game.ui.dragEggType = type;
    tile.classList.add('dragging');
    document.body.classList.add('egg-dragging');
    try {
      ev.dataTransfer.setData('text/plain', type);
      ev.dataTransfer.effectAllowed = 'move';
      const img = tile.querySelector('img');
      if (img && ev.dataTransfer.setDragImage) {
        ev.dataTransfer.setDragImage(img, 23, 23);
      }
    } catch (e) {}
    showTutorial('Drop the egg onto your hive while standing in the hive circle.');
  });
  tile.addEventListener('dragend', () => {
    game.ui.dragEggType = null;
    tile.classList.remove('dragging');
    document.body.classList.remove('egg-dragging');
    clearEggDragHover();
    renderInventory();
  });
  if (opts.sidebar) tile.addEventListener('click', () => showTutorial('Drag this egg onto your claimed hive to hatch it.'));
  return tile;
}

function renderInventory() {
  const bar = document.getElementById('inventoryBar');
  const wrap = document.getElementById('invItems');
  const toggle = document.getElementById('inventoryToggle');
  const countBadge = document.getElementById('inventoryCount');
  if (!bar || !wrap || !toggle) return;
  if (game.ui.dragEggType) return;             // never rebuild mid-drag (cancels the drag)
  const available = game.running;
  toggle.classList.toggle('hidden', !available);
  toggle.classList.toggle('drawer-open', available && game.ui.inventoryOpen);
  bar.classList.toggle('hidden', !available || !game.ui.inventoryOpen);
  toggle.setAttribute('aria-expanded', String(available && game.ui.inventoryOpen));
  bar.setAttribute('aria-hidden', String(!available || !game.ui.inventoryOpen));
  if (!available) return;
  const counts = eggCounts();
  if (countBadge) countBadge.textContent = String(game.eggs.length);
  const types = Object.keys(counts).sort((a, b) => eggOrderIndex(a) - eggOrderIndex(b));
  wrap.innerHTML = '';
  if (!types.length) {
    const empty = document.createElement('div');
    empty.className = 'inv-empty';
    empty.textContent = 'No eggs yet. Buy one at the shop.';
    wrap.appendChild(empty);
  } else {
    for (const t of types) wrap.appendChild(makeEggTile(t, counts[t], { sidebar: true }));
  }
  [
    ['Tools', 'sprinklers, stingers, boosts'],
    ['Badges', 'field milestones'],
    ['Collectibles', 'tokens and rare finds'],
  ].forEach(([label, hint]) => {
    const slot = document.createElement('div');
    slot.className = 'inv-placeholder';
    slot.innerHTML = `<span>${label}</span><small>${hint}</small>`;
    wrap.appendChild(slot);
  });
}

function setEggConfirmOpen(open) {
  const modal = document.getElementById('eggConfirmModal');
  if (!modal) return;
  const next = Boolean(open && game.ui.pendingHatch);
  game.ui.eggConfirmOpen = next;
  modal.classList.toggle('hidden', !next);
  if (next) {
    releaseCameraInput();
    const eggName = document.getElementById('eggConfirmName');
    const slotText = document.getElementById('eggConfirmSlot');
    const confirmText = document.getElementById('eggConfirmText');
    const pending = game.ui.pendingHatch;
    if (eggName) eggName.textContent = pending.eggType;
    if (slotText) {
      const slotNum = pending.slotId.replace(/^slot_0*/i, '') || '1';
      slotText.textContent = `Place into Slot ${slotNum}`;
    }
    if (confirmText) confirmText.textContent = `Do you really want to hatch this ${pending.eggType}?`;
  }
}

function closeEggConfirm() {
  game.ui.pendingHatch = null;
  setEggConfirmOpen(false);
}

function requestHatchEggAtHive(type, ev = null) {
  if (game.phase !== 'playing' || !game.hive.claimed) {
    showTutorial('Claim a hive before hatching eggs.');
    return false;
  }
  if (!type || !game.eggs.some(e => e.type === type)) {
    showTutorial('That egg is no longer in your satchel.');
    return false;
  }
  if (distanceToHiveCircle() > T.hive.conversionRadius + 2.8) {
    showTutorial('Stand inside your hive circle, then drop the egg onto the hive.');
    return false;
  }

  let slot = null;
  // Proximity-based slot selection if cursor position is available
  if (ev && game.hive.slotMeshes && game.hive.slotMeshes.length) {
    let bestSlot = null;
    let bestDist = 140; // Pixels threshold in screen-space
    const v3 = new THREE.Vector3();

    game.beeSlots.forEach((s, idx) => {
      if (!s.unlocked || s.beeId) return; // Only empty, unlocked slots
      const cell = game.hive.slotMeshes[idx];
      if (cell && cell.cellWorld) {
        v3.set(cell.cellWorld.x, cell.cellWorld.y, cell.cellWorld.z);
        v3.project(camera);
        const screenX = (v3.x * 0.5 + 0.5) * window.innerWidth;
        const screenY = (-(v3.y * 0.5) + 0.5) * window.innerHeight;
        const dist = Math.hypot(screenX - ev.clientX, screenY - ev.clientY);
        if (dist < bestDist) {
          bestDist = dist;
          bestSlot = s;
        }
      }
    });
    if (bestSlot) slot = bestSlot;
  }

  // Fallback to sequential open slot if not close to any specific valid slot
  if (!slot) slot = openHexSlot();

  if (!slot) {
    showTutorial('No open hive slot. Unlock another Hex Slot in the shop.');
    return false;
  }
  game.ui.pendingHatch = { eggType: type, slotId: slot.id };
  setEggConfirmOpen(true);
  return true;
}

function confirmPendingHatch() {
  const pending = game.ui.pendingHatch;
  if (!pending) return;
  const idx = game.eggs.findIndex(e => e.type === pending.eggType);
  const slotId = pending.slotId;
  game.ui.pendingHatch = null;
  setEggConfirmOpen(false);
  hatchEggIntoSlot(slotId, idx < 0 ? 0 : idx);
}

// Hatch a specific queued egg into a specific hex slot (egg → slot choice).
function hatchEggIntoSlot(slotId, eggIndex = 0) {
  if (game.phase !== 'playing') return;
  const slot = game.beeSlots.find(s => s.id === slotId);
  if (!slot || !slot.unlocked || slot.beeId) { showTutorial('Pick an empty, unlocked hex slot.'); return; }
  if (!game.eggs.length) { showTutorial('Buy an egg in the Hive Shop first.'); return; }
  const idx = clamp(eggIndex, 0, game.eggs.length - 1);
  const egg = game.eggs.splice(idx, 1)[0];
  let forcedType = null;
  if (egg.type === 'Worker Egg') forcedType = 'Worker Bee';
  else if (egg.type === 'Scout Egg') forcedType = 'Scout Bee';
  else if (egg.type === 'Rare Egg') forcedType = 'Celest Lumen';
  const bee = makeLumen(createBeeData(slot.id, forcedType));
  if (bee) {
    game.lumens.push(bee);
    game.stats.eggsHatched++;
    synth.playClaimHive();
    const slotNum = slot.id.replace(/^slot_0*/i, '') || '1';
    showTutorial(`${bee.rarity} ${bee.name} hatched into Slot ${slotNum}.`);
  }
  game.ui.selectedEggIndex = 0;
  updateProgressionUI();
  updateHiveVisuals();
  renderInventory();
}

function buyPerk(key) {
  if (game.phase !== 'playing') {
    showTutorial('Claim your hive before buying perks.');
    return;
  }
  const perk = game.perks[key];
  if (!perk) return;
  const cost = perkCost(key);
  if (!spendHoney(cost)) return;
  perk.level++;
  showTutorial(`${perk.name} increased to level ${perk.level}.`);
  updateProgressionUI();
}

function renderPerkBook() {
  const list = document.getElementById('perkList');
  if (!list) return;
  list.innerHTML = '';
  for (const [key, perk] of Object.entries(game.perks)) {
    const cost = perkCost(key);
    const row = document.createElement('div');
    row.className = 'perk-row';
    row.innerHTML = `
      <h3>${perk.name}</h3>
      <p>${perk.desc}</p>
      <div class="perk-foot">
        <span class="perk-level">Level ${perk.level} | Next ${cost} honey</span>
        <button type="button">BUY PERK</button>
      </div>`;
    const btn = row.querySelector('button');
    btn.disabled = game.phase !== 'playing' || game.honey < cost;
    btn.addEventListener('click', () => buyPerk(key));
    list.appendChild(row);
  }
}

function renderFullMarket() {
  const sidebar = document.getElementById('terminalSidebar');
  const main = document.getElementById('terminalMain');
  if (!sidebar || !main) return;

  // 1. Render Sidebar list of assets
  sidebar.innerHTML = '';
  const assets = game.market.assets;
  const selIdx = game.market.selectedAssetIndex ?? 0;

  assets.forEach((asset, i) => {
    const pct = asset.prev ? ((asset.price - asset.prev) / asset.prev) * 100 : 0;
    const isUp = pct >= 0;
    const pos = assetPosition(asset);

    const item = document.createElement('div');
    item.className = `terminal-asset-item ${i === selIdx ? 'active-asset' : ''}`;
    item.innerHTML = `
      <div class="asset-top-row">
        <span class="asset-ticker-badge">${asset.sym}</span>
        <span class="asset-price-val">${asset.price.toFixed(1)} 🍯</span>
      </div>
      <div class="asset-bottom-row">
        <span class="asset-full-name">${asset.name}</span>
        <span class="asset-pct-chg ${isUp ? 'up' : 'down'}">${isUp ? '▲' : '▼'}${isUp ? '+' : ''}${pct.toFixed(1)}%</span>
      </div>
      <div class="asset-position-badge ${pos.owned > 0 ? 'owned' : 'empty'}">${pos.owned > 0 ? `${pos.owned} held · P/L ${pos.unrealized >= 0 ? '+' : ''}${fmtHoney(pos.unrealized, 1)}` : 'not invested'}</div>
    `;
    item.addEventListener('click', () => {
      game.market.selectedAssetIndex = i;
      renderFullMarket();
    });
    sidebar.appendChild(item);
  });

  // 2. Render Main workspace for the selected asset
  const activeAsset = assets[selIdx];
  if (!activeAsset) return;

  const pct = activeAsset.prev ? ((activeAsset.price - activeAsset.prev) / activeAsset.prev) * 100 : 0;
  const isUp = pct >= 0;
  const pos = assetPosition(activeAsset);
  const buyOrder = tradeOrderInfo(activeAsset, 1);
  const sellOrder = tradeOrderInfo(activeAsset, -1);

  // Let's generate simulated high/low bounds based on history
  const history = activeAsset.hist;
  let min = activeAsset.price * 0.95;
  let max = activeAsset.price * 1.05;
  if (history.length > 0) {
    min = Math.min(...history);
    max = Math.max(...history);
  }

  // Simulated live L2 order book (depth book)
  // Let's generate 4 asks (above price) and 4 bids (below price)
  let orderBookHtml = '';
  const spread = Math.max(0.1, activeAsset.price * activeAsset.vol * 0.2);
  const baseSize = (activeAsset.demand + activeAsset.supply) * 0.05;

  // Asks (descending so highest ask is at top)
  const asks = [];
  for (let k = 4; k >= 1; k--) {
    const askPrice = activeAsset.price + spread * k;
    const askVol = Math.round(baseSize * (1.1 + Math.sin(game.time * 2 + k) * 0.5));
    asks.push({ price: askPrice, size: askVol });
  }

  // Bids
  const bids = [];
  for (let k = 1; k <= 4; k++) {
    const bidPrice = activeAsset.price - spread * k;
    const bidVol = Math.round(baseSize * (1.1 + Math.cos(game.time * 2 + k) * 0.5));
    bids.push({ price: bidPrice, size: bidVol });
  }

  // Compute maximum size for sizing bars
  const maxSize = Math.max(1, ...asks.map(a => a.size), ...bids.map(b => b.size));

  // Render Asks
  asks.forEach(ask => {
    const sizePct = (ask.size / maxSize) * 100;
    orderBookHtml += `
      <div class="l2-ob-row ask">
        <div class="ob-size-fill" style="width: ${sizePct}%"></div>
        <span>${ask.price.toFixed(2)}</span>
        <span>${ask.size}</span>
        <span>${Math.round(ask.price * ask.size)}</span>
      </div>
    `;
  });

  // Spread row
  orderBookHtml += `
    <div class="l2-ob-spread-row">
      <span>SPREAD</span>
      <span>${spread.toFixed(2)} (${((spread / activeAsset.price) * 100).toFixed(2)}%)</span>
      <span>MID: ${activeAsset.price.toFixed(2)}</span>
    </div>
  `;

  // Render Bids
  bids.forEach(bid => {
    const sizePct = (bid.size / maxSize) * 100;
    orderBookHtml += `
      <div class="l2-ob-row bid">
        <div class="ob-size-fill" style="width: ${sizePct}%"></div>
        <span>${bid.price.toFixed(2)}</span>
        <span>${bid.size}</span>
        <span>${Math.round(bid.price * bid.size)}</span>
      </div>
    `;
  });

  main.innerHTML = `
    <!-- Active Ticker Header -->
    <div class="terminal-header">
      <div class="asset-info">
        <h3>${activeAsset.name} <span class="ticker-label">${activeAsset.sym}</span></h3>
      </div>
      <div class="price-panel">
        <span class="live-price">${activeAsset.price.toFixed(2)}</span>
        <span class="pct-badge ${isUp ? 'up' : 'down'}">${isUp ? '▲' : '▼'}${isUp ? '+' : ''}${pct.toFixed(2)}%</span>
      </div>
      <div class="terminal-stats-grid">
        <div class="stat-box">
          <span>24h High</span>
          <b>${max.toFixed(2)}</b>
        </div>
        <div class="stat-box">
          <span>24h Low</span>
          <b>${min.toFixed(2)}</b>
        </div>
        <div class="stat-box">
          <span>Volatility</span>
          <b>${(activeAsset.vol * 100).toFixed(1)}%</b>
        </div>
        <div class="stat-box">
          <span>Net Vol</span>
          <b>${Math.round(activeAsset.supply + activeAsset.demand)}</b>
        </div>
      </div>
    </div>

    <!-- Candlestick Chart Area -->
    <div class="terminal-chart-container">
      <canvas id="largeTerminalChart" class="large-terminal-chart" width="680" height="220"></canvas>
    </div>

    <!-- Lower row: L2 depth and Trade controls -->
    <div class="terminal-lower-grid">
      <!-- Order book -->
      <div class="terminal-subpanel">
        <h4><span>Live Order Book</span><span style="font-size: 8px; color: var(--text-dim)">Luminarium Depth</span></h4>
        <div class="l2-order-book">
          <div class="l2-ob-row" style="color: var(--text-dim); border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 2px;">
            <span>Price (Honey)</span>
            <span>Size</span>
            <span>Total Value</span>
          </div>
          ${orderBookHtml}
        </div>
      </div>

      <!-- Trade Execution Panel -->
      <div class="terminal-subpanel">
        <h4>Holdings & Execution</h4>
        <div class="trading-execution-card">
          <div class="portfolio-holdings-strip">
            <div>
              <span>YOUR BALANCE</span>
              <b style="color: var(--gold)">${Math.floor(game.honey)} 🍯</b>
            </div>
            <div>
              <span>YOUR POSITION</span>
              <b>${pos.owned} ${activeAsset.sym}</b>
            </div>
            <div>
              <span>INVESTED</span>
              <b>${pos.owned > 0 ? fmtHoney(pos.invested, 1) + ' 🍯' : '--'}</b>
            </div>
            <div>
              <span>CURRENT VALUE</span>
              <b>${pos.owned > 0 ? fmtHoney(pos.value, 1) + ' 🍯' : '--'}</b>
            </div>
            <div>
              <span>AVG ENTRY</span>
              <b style="color: var(--cyan)">${pos.owned > 0 ? pos.avgPrice.toFixed(2) : '--'}</b>
            </div>
            <div>
              <span>UNREALIZED P/L</span>
              <b class="${pos.unrealized >= 0 ? 'pl-up' : 'pl-down'}">${pos.owned > 0 ? `${pos.unrealized >= 0 ? '+' : ''}${fmtHoney(pos.unrealized, 1)} (${pos.unrealizedPct >= 0 ? '+' : ''}${pos.unrealizedPct.toFixed(1)}%)` : '--'}</b>
            </div>
            <div>
              <span>REALIZED P/L</span>
              <b class="${(activeAsset.realizedProfit || 0) >= 0 ? 'pl-up' : 'pl-down'}">${activeAsset.realizedProfit ? `${activeAsset.realizedProfit >= 0 ? '+' : ''}${fmtHoney(activeAsset.realizedProfit, 1)}` : '--'}</b>
            </div>
          </div>

          <!-- Trade sizes row -->
          <div class="trade-size-row" style="margin-top: 6px;">
            <span class="trade-size-label">QUANTITY SIZE</span>
            <div class="trade-size-btns" id="terminalTradeSizeBtns">
              <button class="ts-btn ${game.market.tradeQty === 1 ? 'active' : ''}" data-qty="1">×1</button>
              <button class="ts-btn ${game.market.tradeQty === 5 ? 'active' : ''}" data-qty="5">×5</button>
              <button class="ts-btn ${game.market.tradeQty === 25 ? 'active' : ''}" data-qty="25">×25</button>
              <button class="ts-btn ${game.market.tradeQty === 'max' ? 'active' : ''}" data-qty="max">MAX</button>
            </div>
          </div>

          <!-- Buy/Sell Trade Buttons -->
          <div class="terminal-trade-actions">
            <button class="btn-trade-buy" id="termBuyBtn">Buy ${buyOrder.qty} · ${fmtHoney(buyOrder.gross, 1)} honey</button>
            <button class="btn-trade-sell" id="termSellBtn">Sell ${sellOrder.qty} · ${fmtHoney(sellOrder.gross, 1)} honey</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Hook up Buy/Sell buttons
  const termBuyBtn = document.getElementById('termBuyBtn');
  const termSellBtn = document.getElementById('termSellBtn');
  if (termBuyBtn) {
    termBuyBtn.disabled = !buyOrder.can;
    termBuyBtn.title = buyOrder.can ? `Invest ${fmtHoney(buyOrder.gross, 1)} honey` : `Need ${fmtHoney(buyOrder.gross, 1)} honey`;
    termBuyBtn.addEventListener('click', () => tradeAsset(selIdx, 1));
  }
  if (termSellBtn) {
    termSellBtn.disabled = !sellOrder.can;
    termSellBtn.title = sellOrder.can ? `Receive ${fmtHoney(sellOrder.gross, 1)} honey` : 'No owned units to sell';
    termSellBtn.addEventListener('click', () => tradeAsset(selIdx, -1));
  }

  // Hook up Local Trade Size Buttons inside the terminal workspace
  const localSizeBtns = document.getElementById('terminalTradeSizeBtns');
  if (localSizeBtns) {
    localSizeBtns.querySelectorAll('.ts-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        localSizeBtns.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const q = btn.dataset.qty;
        game.market.tradeQty = q === 'max' ? 'max' : (parseInt(q, 10) || 1);
        
        // Sync with sidebar UI quantity indicators
        const globalSizeWrap = document.getElementById('tradeSizeBtns');
        if (globalSizeWrap) {
          globalSizeWrap.querySelectorAll('.ts-btn').forEach(b => {
            if (b.dataset.qty === q) b.classList.add('active');
            else b.classList.remove('active');
          });
        }
        
        // Redraw main terminal to refresh button disable states
        renderFullMarket();
      });
    });
  }

  // Draw large high-precision candlestick chart
  const mainChartCanvas = document.getElementById('largeTerminalChart');
  if (mainChartCanvas) {
    drawCandlesOnCtx(mainChartCanvas.getContext('2d'), 0, 0, mainChartCanvas.width, mainChartCanvas.height, activeAsset.hist);
  }

  game.ui.fullMarketDirty = false;
}

function renderForecastLog() {
  const log = document.getElementById('forecastLog');
  if (!log) return;
  if (!game.market.forecastLog.length) {
    log.innerHTML = '<h3>FORECAST HISTORY</h3><div><span>No forecast contracts yet.</span><b>--</b></div>';
    return;
  }
  log.innerHTML = '<h3>FORECAST HISTORY</h3>';
  for (const entry of game.market.forecastLog.slice(0, 5)) {
    const row = document.createElement('div');
    row.innerHTML = `<span>Risked ${entry.bet} honey at ${entry.multiplier}x</span><b>${entry.change >= 0 ? '+' : ''}${entry.change}</b>`;
    log.appendChild(row);
  }
}

function updateProgressionUI() {
  renderInventory();
  renderPerkBook();
  if (game.ui.fullMarketOpen || game.ui.fullMarketDirty) renderFullMarket();
  renderForecastLog();
  updateProfileSnapshot();
  const nw = document.getElementById('netWorth');
  if (nw) nw.textContent = Math.floor(netWorth());
}

function setInventoryOpen(open) {
  const next = Boolean(open && game.running);
  if (next) {
    setHelpOpen(false);
    releaseCameraInput();
  }
  game.ui.inventoryOpen = next;
  renderInventory();
}

function setHelpOpen(open) {
  const toggle = document.getElementById('helpToggle');
  const drawer = document.getElementById('controlsBar');
  const next = Boolean(open && game.running);
  if (next) {
    setInventoryOpen(false);
    releaseCameraInput();
  }
  game.ui.helpOpen = next;
  if (toggle) {
    toggle.classList.toggle('hidden', !game.running);
    toggle.setAttribute('aria-expanded', String(next));
  }
  if (drawer) {
    drawer.classList.toggle('hidden', !next);
    drawer.setAttribute('aria-hidden', String(!next));
  }
}

function setShopPanelOpen(open) {
  const modal = document.getElementById('shopModal');
  if (!modal) return;
  if (open) {
    closeAllModals();
    modal.classList.remove('hidden');
    game.ui.shopOpen = true;
    buildPanel();
    updateProgressionUI();
  } else {
    modal.classList.add('hidden');
    game.ui.shopOpen = false;
  }
}

function setModalOpen(id, open) {
  const modal = document.getElementById(id);
  if (!modal) return;
  if (open) {
    setHelpOpen(false);
    if (!game.ui.dragEggType) setInventoryOpen(false);
    releaseCameraInput();
    closeAllModals();
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
  syncModalFlags();
  if (open) updateProgressionUI();
}

function syncModalFlags() {
  const vis = id => { const m = document.getElementById(id); return m && !m.classList.contains('hidden'); };
  game.ui.eggConfirmOpen = vis('eggConfirmModal');
  game.ui.perkOpen = vis('perkModal');
  game.ui.fullMarketOpen = vis('fullMarketModal');
  game.ui.shopOpen = vis('shopModal');
}

function closeAllModals() {
  for (const id of ['eggConfirmModal', 'perkModal', 'fullMarketModal', 'shopModal']) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
  }
  game.ui.eggConfirmOpen = false;
  game.ui.pendingHatch = null;
  game.ui.perkOpen = false;
  game.ui.fullMarketOpen = false;
  game.ui.shopOpen = false;
}

function initProgressionControls() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => setModalOpen(btn.dataset.close, false));
  });
  document.querySelectorAll('.modal-screen').forEach(screen => {
    screen.addEventListener('click', e => {
      if (e.target === screen) setModalOpen(screen.id, false);
    });
  });

  const inventoryToggle = document.getElementById('inventoryToggle');
  const inventoryClose = document.getElementById('inventoryClose');
  const helpToggle = document.getElementById('helpToggle');
  const helpClose = document.getElementById('helpClose');
  const eggYes = document.getElementById('eggConfirmYes');
  const eggNo = document.getElementById('eggConfirmNo');
  const eggNoTop = document.getElementById('eggConfirmNoTop');
  if (inventoryToggle) inventoryToggle.addEventListener('click', () => setInventoryOpen(!game.ui.inventoryOpen));
  if (inventoryClose) inventoryClose.addEventListener('click', () => setInventoryOpen(false));
  if (helpToggle) helpToggle.addEventListener('click', () => setHelpOpen(!game.ui.helpOpen));
  if (helpClose) helpClose.addEventListener('click', () => setHelpOpen(false));
  if (eggYes) eggYes.addEventListener('click', confirmPendingHatch);
  if (eggNo) eggNo.addEventListener('click', closeEggConfirm);
  if (eggNoTop) eggNoTop.addEventListener('click', closeEggConfirm);

  document.addEventListener('dragover', ev => {
    if (!game.ui.dragEggType) return;
    if (ev.target && ev.target.closest && ev.target.closest('#inventoryBar')) return;
    ev.preventDefault();
    try { ev.dataTransfer.dropEffect = 'move'; } catch (e) {}

    let hoveredIdx = -1;
    if (game.hive.slotMeshes && game.hive.slotMeshes.length) {
      let bestDist = 140; // Pixels threshold
      const v3 = new THREE.Vector3();

      game.beeSlots.forEach((s, idx) => {
        if (!s.unlocked || s.beeId) return; // Only empty unlocked slots
        const cell = game.hive.slotMeshes[idx];
        if (cell && cell.cellWorld) {
          v3.set(cell.cellWorld.x, cell.cellWorld.y, cell.cellWorld.z);
          v3.project(camera);
          const screenX = (v3.x * 0.5 + 0.5) * window.innerWidth;
          const screenY = (-(v3.y * 0.5) + 0.5) * window.innerHeight;
          const dist = Math.hypot(screenX - ev.clientX, screenY - ev.clientY);
          if (dist < bestDist) {
            bestDist = dist;
            hoveredIdx = idx;
          }
        }
      });
    }

    if (hoveredIdx !== lastHoveredSlotIndex) {
      if (lastHoveredSlotIndex !== -1 && game.hive.slotMeshes[lastHoveredSlotIndex]) {
        game.hive.slotMeshes[lastHoveredSlotIndex].dragHovered = false;
      }
      lastHoveredSlotIndex = hoveredIdx;
      if (hoveredIdx !== -1 && game.hive.slotMeshes[hoveredIdx]) {
        game.hive.slotMeshes[hoveredIdx].dragHovered = true;
      }
      updateHiveVisuals();
    }
  });
  document.addEventListener('drop', ev => {
    if (!game.ui.dragEggType) return;
    if (ev.target && ev.target.closest && ev.target.closest('#inventoryBar')) return;
    ev.preventDefault();
    const type = game.ui.dragEggType || (ev.dataTransfer && ev.dataTransfer.getData('text/plain'));
    game.ui.dragEggType = null;
    document.body.classList.remove('egg-dragging');
    clearEggDragHover();
    if (type) requestHatchEggAtHive(type, ev);
    renderInventory();
  });

  // Shop tabs logic click listeners
  document.querySelectorAll('.shop-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      game.ui.shopTab = btn.dataset.tab;
      buildPanel();
      updateProgressionUI();
    });
  });

  const fullMarketBtn = document.getElementById('fullMarketBtn');
  if (fullMarketBtn) fullMarketBtn.addEventListener('click', () => setModalOpen('fullMarketModal', true));
  
  // Build the shop contents, but keep the popup closed until the player walks up.
  buildPanel();
  setShopPanelOpen(false);
  updateProgressionUI();
}

// ======================== MARKET ========================
function netWorth() {
  let v = game.honey;
  for (const a of game.market.assets) v += a.owned * a.price;
  for (const bee of game.lumens) v += beeValue(bee);
  v += Math.max(0, game.beeSlots.filter(s => s.unlocked).length - 3) * 45;
  for (const eq of Object.values(game.equipment)) v += eq.level * 35;
  for (const up of Object.values(game.upgrades)) v += up.level * 28;
  for (const perk of Object.values(game.perks)) v += perk.level * Math.floor(perk.base * 0.45);
  return v;
}

function fmtHoney(v, digits = 1) {
  if (!Number.isFinite(v)) return '0';
  return v.toFixed(digits);
}

function assetPosition(a) {
  const owned = a.owned || 0;
  const invested = owned > 0 ? Math.max(0, a.costBasis || 0) : 0;
  const value = owned * a.price;
  const unrealized = value - invested;
  const unrealizedPct = invested > 0 ? (unrealized / invested) * 100 : 0;
  const avgPrice = owned > 0 ? invested / owned : 0;
  return { owned, invested, value, unrealized, unrealizedPct, avgPrice };
}

function tradeOrderInfo(a, dir) {
  const qty = resolveTradeQty(a, dir);
  const gross = qty * a.price;
  const can = dir > 0
    ? qty > 0 && game.phase === 'playing' && game.honey + 0.0001 >= gross
    : qty > 0 && game.phase === 'playing' && (a.owned || 0) >= qty;
  return { qty, gross, can };
}

// Resolve how many units a single Buy/Sell click should move, from the trade-size toggle.
function resolveTradeQty(a, dir) {
  const sel = game.market.tradeQty;
  if (sel === 'max') {
    return dir > 0 ? Math.max(0, Math.floor(game.honey / Math.max(0.5, a.price))) : a.owned;
  }
  return sel | 0;
}

function tradeAsset(i, dir) {
  if (game.phase !== 'playing') {
    showTutorial('Claim your hive before trading honey.');
    return;
  }
  const a = game.market.assets[i];
  let qty = resolveTradeQty(a, dir);
  if (qty <= 0) return;
  const gross = qty * a.price;
  if (dir > 0 && game.honey + 0.0001 < gross) {
    showTutorial(`Need ${fmtHoney(gross)} honey to buy ${qty} ${a.sym}. Use MAX for your available balance.`);
    return;
  }
  if (dir < 0 && (a.owned || 0) < qty) {
    showTutorial(`You only own ${a.owned || 0} ${a.sym}.`);
    return;
  }
  // A trade hits the live order book: buying lifts demand + nudges price up via
  // playerPressure (and the reverse for selling). Bigger books absorb more, so the
  // impact scales to the asset's liquidity.
  const liq = (a.demand + a.supply) * 0.5;
  const impact = 0.05 + 0.4 * clamp(a.price / Math.max(1, liq), 0, 0.25);
  let done = qty;
  if (dir > 0) {
    game.honey -= gross;
    a.owned = (a.owned || 0) + qty;
    a.costBasis = (a.costBasis || 0) + gross;
    if (done > 0) {
      a.demand += Math.max(14, liq * 0.02) * done;
      a.playerPressure += impact * 0.05 * done;
      game.market.lastEvent = `Bought ${a.sym}`;
    }
  } else {
    const beforeOwned = a.owned || 0;
    const basisPerUnit = beforeOwned > 0 ? (a.costBasis || 0) / beforeOwned : 0;
    const basisReleased = basisPerUnit * qty;
    game.honey += gross;
    a.owned = Math.max(0, beforeOwned - qty);
    a.costBasis = a.owned > 0 ? Math.max(0, (a.costBasis || 0) - basisReleased) : 0;
    a.lastRealized = gross - basisReleased;
    a.realizedProfit = (a.realizedProfit || 0) + a.lastRealized;
    if (done > 0) {
      a.supply += Math.max(14, liq * 0.02) * done;
      a.playerPressure -= impact * 0.05 * done;
      game.market.lastEvent = `${a.lastRealized >= 0 ? 'Gain' : 'Loss'} ${a.sym}`;
    }
  }
  if (done > 0) {
    game.stats.marketTrades += 1;
    synth.playBell();
    game.market.uiDirty = true;
    game.ui.fullMarketDirty = true;
    syncMarketHoldings();
  }
  updateProgressionUI();
}

const NEWS_POOL = [
  { label:'Solar bloom', text:"SOLAR BLOOM: Sun Honey demand rises across edge fields.", target:'SUNH', drift:0.018, vol:0.025 },
  { label:'Cloud shade', text:"CLOUD SHADE: Glow Honey supply builds faster than demand.", target:'GLWH', drift:-0.012, vol:0.03 },
  { label:'Dew rush', text:"DEW RUSH: Blue Dew contracts draw fresh buyers.", target:'DEWH', drift:0.016, vol:0.035 },
  { label:'Moon reserve', text:"MOON RESERVE: Night-field stock is thin, Moon Honey lifts.", target:'MOON', drift:0.018, vol:0.04 },
  { label:'Royal migration', text:"ROYAL MIGRATION: Royal Honey Fund demand climbs.", target:'RHF', drift:0.018, vol:0.04 },
  { label:'Rare hatch wave', text:"RARE HATCH WAVE: Rare Bee Index catches a bid.", target:'RBI', drift:0.014, vol:0.025 },
  { label:'Dry spell', text:"DRY SPELL: Nectar liquidity slips across honey markets.", target:null, drift:-0.006, vol:0.02 },
  { label:'Calm skies', text:"CALM SKIES: Market makers report steady hive demand.", target:null, drift:0, vol:0 },
];

function updateMarket(dt) {
  const m = game.market;
  m.newsTimer -= dt;
  if (m.newsTimer <= 0) {
    m.newsTimer = rand(12, 18);
    const ev = NEWS_POOL[Math.floor(Math.random()*NEWS_POOL.length)];
    if (ev.target) {
      const asset = m.assets.find(a => a.sym === ev.target);
      if (asset) {
        asset.eventModifier += ev.drift;
        asset.vol = clamp(asset.vol + ev.vol, 0.02, 0.18);
        if (ev.drift > 0) asset.demand += rand(25, 75);
        else asset.supply += rand(25, 75);
      }
    } else if (ev.drift !== 0) {
      for (const asset of m.assets) asset.eventModifier += ev.drift;
    }
    m.lastEvent = ev.label;
    const ticker = document.getElementById('newsText');
    if (ticker) { ticker.textContent = ev.text; ticker.style.animation='none'; ticker.offsetHeight; ticker.style.animation='marquee 22s linear infinite'; }
  }
  m.tick += dt;
  if (m.tick < m.interval) return;
  m.tick -= m.interval;
  // Each tick blends four forces so the chart feels alive AND responds to trades:
  //   1. drift          — the asset's long-term bias
  //   2. momentum       — a simulated crowd that chases recent trends (auto-correlation)
  //   3. mean reversion — pull back toward a slowly drifting fair-value anchor
  //   4. order flow      — net of simulated investors + the real player's buys/sells,
  //                        expressed through the supply/demand book and playerPressure.
  // In multiplayer every player's trades feed the same demand/supply + playerPressure,
  // so the live order book is what makes the market move "by itself" yet react to people.
  for (const a of m.assets) {
    a.prev = a.price;
    if (a.anchor === undefined) a.anchor = a.price;
    if (a.momentum === undefined) a.momentum = 0;

    const valueGap = (a.anchor - a.price) / a.price;          // + => trading below fair value
    // Simulated investor crowd: chase momentum, fade extreme value gaps, react to news.
    const sentiment = a.momentum * 0.45 + clamp(valueGap, -0.3, 0.3) * 0.12 + a.eventModifier;
    a.demand = clamp(a.demand * (1 + sentiment * 0.6 + rand(-0.035, 0.035)), 120, 6000);
    a.supply = clamp(a.supply * (1 - sentiment * 0.45 + rand(-0.035, 0.035)), 120, 6000);

    const imbalance = (a.demand - a.supply) / (a.demand + a.supply);   // -1..1 order-book skew
    let move = a.drift
             + imbalance * 0.055
             + a.playerPressure
             + valueGap * 0.02
             + rand(-a.vol, a.vol);
    move = clamp(move, -0.14, 0.14);
    a.price = Math.max(0.5, a.price * (1 + move));

    a.momentum = a.momentum * 0.72 + move * 0.28;             // smoothed trend memory
    a.anchor = a.anchor * (0.992) + a.price * 0.008 + a.anchor * a.drift * 0.4; // slow fair-value drift
    a.eventModifier *= 0.8;
    a.playerPressure *= 0.86;
    a.vol = clamp(a.vol * 0.99, 0.02, 0.2);

    a.hist.push(a.price);
    if (a.hist.length > 40) a.hist.shift();
    a.priceHistory.push({ time: game.time, price: a.price, supply: a.supply, demand: a.demand, eventModifier: a.eventModifier });
    if (a.priceHistory.length > 90) a.priceHistory.shift();
  }
  m.uiDirty = true;
  game.ui.fullMarketDirty = true;
}

function initMarketHistory() {
  for (const asset of game.market.assets) {
    // Generate organic price history fluctuations for the initial hist array!
    let currentPrice = asset.price;
    for (let i = asset.hist.length - 1; i >= 0; i--) {
      asset.hist[i] = currentPrice;
      const noise = (Math.random() - 0.48) * asset.price * asset.vol * 0.85;
      currentPrice = Math.max(1, currentPrice - noise);
    }
    asset.prev = asset.hist[asset.hist.length - 2] || asset.price;
    asset.price = asset.hist[asset.hist.length - 1] || asset.price;

    if (!asset.priceHistory.length) {
      asset.priceHistory = asset.hist.map((price, i) => ({
        time: -((asset.hist.length - i) * game.market.interval),
        price,
        supply: asset.supply,
        demand: asset.demand,
        eventModifier: 0,
      }));
    }
  }
}

function buildMarket() {
  const list = document.getElementById('mktList');
  list.innerHTML = '';
  game.market.assets.forEach((a, i) => {
    const row = document.createElement('div');
    row.className = 'mkt-row';
    row.innerHTML = `
      <div class="mkt-head">
        <span class="mkt-title">
          <span class="m-sym">${a.sym}</span>
          <span class="m-name">${a.name}</span>
        </span>
        <span class="m-trend"></span>
        <span class="m-price"></span>
        <span class="m-chg"></span>
      </div>
      <canvas class="m-spark" width="340" height="34"></canvas>
      <div class="m-act">
        <div class="m-position">
          <span class="m-own">Not invested</span>
          <span class="m-invested"></span>
          <span class="m-pl"></span>
        </div>
        <div class="m-btns"><button class="m-buy">Buy</button><button class="m-sell">Sell</button></div>
      </div>`;
    row.querySelector('.m-buy').addEventListener('click', () => tradeAsset(i, 1));
    row.querySelector('.m-sell').addEventListener('click', () => tradeAsset(i, -1));
    list.appendChild(row);
  });
  game.market.rows = Array.from(list.querySelectorAll('.mkt-row'));
  game.market.uiDirty = true;
}

function drawCandlesOnCtx(c, sX, sY, w, h, hist) {
  // Clear backing area
  c.fillStyle = 'rgba(0, 0, 0, 0.22)';
  c.fillRect(sX, sY, w, h);

  if (hist.length < 2) return;

  // Gridlines
  c.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  c.lineWidth = 0.7;
  for (let j = 1; j < 4; j++) {
    const yGrid = sY + h * (j / 4);
    c.beginPath();
    c.moveTo(sX, yGrid);
    c.lineTo(sX + w, yGrid);
    c.stroke();
  }

  let min = Infinity, max = -Infinity;
  for (const v of hist) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const rng = (max - min) || 1;
  const py = v => sY + h - 4 - ((v - min) / rng) * (h - 8);

  const numCandles = Math.min(w > 200 ? 20 : 12, hist.length);
  const candleW = w / numCandles;
  const bodyW = Math.max(2.5, candleW - 2.5);

  for (let i = 0; i < numCandles; i++) {
    const start = Math.floor((i / numCandles) * hist.length);
    const end = Math.min(hist.length - 1, Math.floor(((i + 1) / numCandles) * hist.length));
    const slice = hist.slice(start, end + 1);
    if (slice.length === 0) continue;

    const open = slice[0];
    const close = slice[slice.length - 1];
    let high = Math.max(...slice);
    let low = Math.min(...slice);

    if (high === low) {
      high += open * 0.005;
      low -= open * 0.005;
    }

    const cx = sX + (i + 0.5) * candleW;
    const yOpen = py(open);
    const yClose = py(close);
    const yHigh = py(high);
    const yLow = py(low);

    const isBullish = close >= open;
    const color = isBullish ? '#00ff66' : '#ff3366';

    // Wick
    c.strokeStyle = color;
    c.lineWidth = 1.1;
    c.beginPath();
    c.moveTo(cx, yHigh);
    c.lineTo(cx, yLow);
    c.stroke();

    // Body
    const yTop = Math.min(yOpen, yClose);
    const yBottom = Math.max(yOpen, yClose);
    const bodyH = Math.max(1.5, yBottom - yTop);

    c.fillStyle = color;
    c.fillRect(cx - bodyW / 2, yTop, bodyW, bodyH);

    // Volume bar at bottom
    const volH = Math.max(1.5, ((high - low) / rng) * (h * 0.22));
    c.fillStyle = isBullish ? 'rgba(0, 255, 102, 0.15)' : 'rgba(255, 51, 102, 0.15)';
    c.fillRect(cx - bodyW / 2, sY + h - volH, bodyW, volH);
  }
}

function drawSpark(cv, a) {
  const c = cv.getContext('2d'), w = cv.width, h = cv.height;
  c.clearRect(0,0,w,h);
  drawCandlesOnCtx(c, 0, 0, w, h, a.hist);
}

let lastTvScreenUpdate = 0;
function updateTvScreen() {
  if (!tradeModel || !tradeModel.userData.screenCtx) return;
  const ctx = tradeModel.userData.screenCtx;
  const tex = tradeModel.userData.screenTex;
  const W = 512, H = 384;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#08171c');
  bg.addColorStop(1, '#040d10');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Header bar
  ctx.fillStyle = 'rgba(40,215,197,0.10)';
  ctx.fillRect(0, 0, W, 46);
  ctx.fillStyle = '#3df0db';
  ctx.font = 'bold 22px Outfit, Arial, sans-serif';
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText('HONEY EXCHANGE', 18, 31);

  // Market index = average price vs previous, with arrow
  const assets = game.market.assets;
  let idx = 0, pidx = 0;
  for (const a of assets) { idx += a.price; pidx += a.prev; }
  const idxPct = pidx ? (idx - pidx) / pidx * 100 : 0;
  const up = idxPct >= 0;
  const liveOn = 0.5 + Math.sin(game.time * 5) * 0.4;
  ctx.fillStyle = `rgba(40,215,197,${liveOn})`;
  ctx.beginPath(); ctx.arc(W - 130, 23, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6f8189'; ctx.font = '10px sans-serif';
  ctx.fillText('LIVE', W - 118, 27);
  ctx.fillStyle = up ? '#3dffa0' : '#ff5b7a';
  ctx.font = 'bold 17px Outfit, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`${up ? '▲' : '▼'} ${(up ? '+' : '') + idxPct.toFixed(2)}%`, W - 16, 30);
  ctx.textAlign = 'left';

  // Stats strip
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(12, 54, W - 24, 30);
  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#7e9097'; ctx.fillText('CASH', 22, 73);
  ctx.fillStyle = '#ffcf57'; ctx.fillText(Math.floor(game.honey) + '🍯', 64, 73);
  ctx.fillStyle = '#7e9097'; ctx.fillText('NET WORTH', 188, 73);
  ctx.fillStyle = '#3df0db'; ctx.fillText(Math.floor(netWorth()) + '🍯', 270, 73);
  ctx.fillStyle = '#7e9097'; ctx.fillText('NEWS', 392, 73);
  const evLabel = (game.market.lastEvent || 'Calm').toUpperCase();
  ctx.fillStyle = /CRASH|PANIC|SHADE|DRY|SLIP/.test(evLabel) ? '#ff5b7a' : (/BLOOM|RUSH|BULL|BOOM|MIGRA|RESERVE/.test(evLabel) ? '#3dffa0' : '#3df0db');
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(evLabel.slice(0, 14), 430, 73);

  // Asset rows with filled sparkline + end dot
  let y = 104;
  const rowH = 44;
  assets.forEach((a, i) => {
    if (i % 2 === 0) { ctx.fillStyle = 'rgba(255,255,255,0.02)'; ctx.fillRect(12, y - 2, W - 24, rowH - 6); }
    const pct = (a.price - a.prev) / (a.prev || 1) * 100;
    const pos = pct >= 0;
    const col = pos ? '#3dffa0' : '#ff5b7a';

    // hue chip
    ctx.fillStyle = a.hue; ctx.fillRect(18, y + 6, 4, 22);
    // sym + name
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 14px monospace';
    ctx.fillText(a.sym, 30, y + 16);
    ctx.fillStyle = '#76888f'; ctx.font = '10px sans-serif';
    ctx.fillText(a.name, 30, y + 30);
    // price
    ctx.fillStyle = '#ffd84a'; ctx.font = 'bold 15px monospace';
    ctx.fillText(a.price.toFixed(1), 150, y + 20);
    // change
    ctx.fillStyle = col; ctx.font = 'bold 12px monospace';
    ctx.fillText(`${pos ? '▲' : '▼'}${(pos ? '+' : '') + pct.toFixed(1)}%`, 226, y + 20);

    // sparkline (candlestick chart)
    const cW = 150, cH = 30, sX = 326, sY = y - 2;
    drawCandlesOnCtx(ctx, sX, sY, cW, cH, a.hist);
    // holdings
    if (a.owned > 0) {
      ctx.fillStyle = '#9fb0b7'; ctx.font = '10px monospace';
      ctx.textAlign = 'right'; ctx.fillText('×' + a.owned, W - 16, y + 30); ctx.textAlign = 'left';
    }
    y += rowH;
  });

  // Footer countdown
  const tickVal = game.market.tick || 0;
  const intervalVal = game.market.interval || 2.2;
  const progress = clamp(tickVal / intervalVal, 0, 1);
  ctx.fillStyle = '#0e2026'; ctx.fillRect(12, H - 16, W - 24, 6);
  ctx.fillStyle = '#3df0db'; ctx.fillRect(12, H - 16, (W - 24) * progress, 6);
  ctx.fillStyle = '#6f8189'; ctx.font = '10px sans-serif';
  ctx.fillText(`NEXT TICK ${Math.max(0, intervalVal - tickVal).toFixed(1)}s`, 14, H - 22);
  ctx.textAlign = 'right';
  ctx.fillText('WALK UP TO TRADE · BUYS & SELLS MOVE THE MARKET', W - 14, H - 22);
  ctx.textAlign = 'left';

  tex.needsUpdate = true;
}

function updateMarketUI(force = false) {
  const marketPanel = document.getElementById('marketPanel');
  const sidebarVisible = force || !marketPanel || !marketPanel.classList.contains('market-closed');

  const rows = game.market.rows.length ? game.market.rows : Array.from(document.querySelectorAll('.mkt-row'));
  const redrawSparks = force || game.market.uiDirty;
  const cashEl = document.getElementById('marketCash');
  if (cashEl) cashEl.textContent = `${fmtHoney(Math.floor(game.honey), 0)} honey`;
  if (sidebarVisible) {
    game.market.assets.forEach((a,i) => {
      const row = rows[i]; if(!row)return;
      const pos = assetPosition(a);
      const buyOrder = tradeOrderInfo(a, 1);
      const sellOrder = tradeOrderInfo(a, -1);
      row.querySelector('.m-price').textContent = a.price.toFixed(1);
      const pct = (a.price-a.prev)/a.prev*100;
      const chg = row.querySelector('.m-chg');
      chg.textContent = (pct>=0?'+':'')+pct.toFixed(1)+'%';
      chg.className = 'm-chg '+(pct>=0?'up':'down');
      row.classList.toggle('invested', pos.owned > 0);
      row.querySelector('.m-own').textContent = pos.owned > 0 ? `${pos.owned} held` : 'Not invested';
      row.querySelector('.m-invested').textContent = pos.owned > 0
        ? `In ${fmtHoney(pos.invested)} -> ${fmtHoney(pos.value)} honey`
        : `Buy ${buyOrder.qty || 1}: ${fmtHoney(Math.max(a.price, buyOrder.gross || a.price))} honey`;
      const pl = row.querySelector('.m-pl');
      if (pos.owned > 0) {
        pl.textContent = `P/L ${pos.unrealized >= 0 ? '+' : ''}${fmtHoney(pos.unrealized, 1)} (${pos.unrealizedPct >= 0 ? '+' : ''}${pos.unrealizedPct.toFixed(1)}%)`;
        pl.className = `m-pl ${pos.unrealized >= 0 ? 'up' : 'down'}`;
      } else {
        pl.textContent = 'No active position';
        pl.className = 'm-pl flat';
      }
      const buyBtn = row.querySelector('.m-buy');
      const sellBtn = row.querySelector('.m-sell');
      buyBtn.textContent = `Buy ${buyOrder.qty || 0}`;
      sellBtn.textContent = `Sell ${sellOrder.qty || 0}`;
      buyBtn.title = buyOrder.qty > 0 ? `Cost: ${fmtHoney(buyOrder.gross)} honey` : 'No honey available';
      sellBtn.title = sellOrder.qty > 0 ? `Proceeds: ${fmtHoney(sellOrder.gross)} honey` : 'No owned units';
      buyBtn.disabled = !buyOrder.can;
      sellBtn.disabled = !sellOrder.can;
      
      // Update price trend indicators
      const trendEl = row.querySelector('.m-trend');
      if (trendEl) {
        const terminalLvl = game.upgrades.marketTerminal?.level || 0;
        if (terminalLvl > 0) {
          const demandPressure = (a.demand - a.supply) / Math.max(600, (a.demand + a.supply) * 0.5);
          const netDrift = a.drift + a.eventModifier + demandPressure * 0.025 + a.playerPressure;
          if (netDrift > 0.005) {
            trendEl.textContent = '▲';
            trendEl.className = 'm-trend bullish';
          } else if (netDrift < -0.005) {
            trendEl.textContent = '▼';
            trendEl.className = 'm-trend bearish';
          } else {
            trendEl.textContent = '▬';
            trendEl.className = 'm-trend neutral';
          }
        } else {
          trendEl.textContent = '';
          trendEl.className = 'm-trend hidden';
        }
      }

      if (redrawSparks) drawSpark(row.querySelector('.m-spark'), a);
    });
  }
  if (game.ui.fullMarketOpen && (redrawSparks || game.ui.fullMarketDirty)) renderFullMarket();
  const eventEl = document.getElementById('currentEvent');
  if (eventEl) eventEl.textContent = game.market.lastEvent.toUpperCase();
  const nw = document.getElementById('netWorth');
  if (nw) nw.textContent = Math.floor(netWorth());
  game.playerProfile.seasonStats.netHiveValue = Math.floor(netWorth());
  
  // Update the 3D TV screen only when it is useful; repainting a 512px canvas
  // every HUD tick is visible as hitching on lower-end GPUs.
  const nowMs = performance.now();
  const nearTv = dist2(game.player.x, game.player.z, TRADE_POS.x, TRADE_POS.z) < 74;
  if ((force || redrawSparks || nowMs - lastTvScreenUpdate > 280) && (nearTv || game.ui.fullMarketOpen || game.marketPanelOpen)) {
    updateTvScreen();
    lastTvScreenUpdate = nowMs;
  }

  if (redrawSparks) game.market.uiDirty = false;
}

// ======================== SPECULATOR ========================
let isSpinning = false;
function initSpeculator() {
  const spinBtn = document.getElementById('spinBtn');
  const input = document.getElementById('specBetInput');
  const result = document.getElementById('specResult');
  const wheel = document.getElementById('specWheel');

  document.querySelectorAll('.synth-bet-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (isSpinning) return;
      const pct = parseFloat(btn.dataset.pct);
      input.value = Math.max(1, Math.floor(game.honey*(pct/100)));
    });
  });

  spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    if (game.phase !== 'playing') { result.textContent='CLAIM THE HIVE FIRST!'; result.style.color='#ff3366'; return; }
    if (game.honey < 1) { result.textContent='NEED HONEY TO FORECAST!'; result.style.color='#ff3366'; return; }
    let bet = parseInt(input.value);
    if (isNaN(bet)||bet<=0) { result.textContent='INVALID HONEY RISK!'; result.style.color='#ff3366'; return; }
    bet = Math.min(bet, Math.floor(game.honey));
    input.value = bet;
    isSpinning=true; spinBtn.disabled=true; input.disabled=true;
    const sparkBoost = game.tokenBuffs.marketSpark > 0;
    if (sparkBoost) game.tokenBuffs.marketSpark--;
    const instinctBoost = Math.min(10, game.perks.instinct.level);
    const safetyBoost = (sparkBoost ? 8 : 0) + instinctBoost;
    result.textContent=safetyBoost > 0 ? `RUNNING FORECAST... +${safetyBoost}% SAFETY` : 'RUNNING FORECAST...'; result.style.color='#8496b8';
    const rVal=Math.min(99.999, Math.random()*100 + safetyBoost);
    let targetSector=0,mult=0;
    if(rVal<32){targetSector=0;mult=0;}else if(rVal<56){targetSector=1;mult=0.5;}
    else if(rVal<80){targetSector=2;mult=1.2;}else if(rVal<95){targetSector=3;mult=2;}
    else{targetSector=4;mult=5;}
    const sectorAngle=(targetSector*72)+rand(15,57);
    const totalRot=360*6+(360-sectorAngle);
    wheel.style.transition='transform 3s cubic-bezier(0.1,0.85,0.15,1)';
    wheel.style.transform=`rotate(${totalRot}deg)`;
    let ticks=0;
    const tickLoop=delay=>{if(ticks>28)return;setTimeout(()=>{synth.playSpinTick();ticks++;tickLoop(delay*1.13);},delay);};
    tickLoop(50);
    setTimeout(()=>{
      const change=Math.floor(bet*mult)-bet;
      game.honey=Math.max(0,game.honey+change);
      isSpinning=false;spinBtn.disabled=false;input.disabled=false;
      if(mult===0){result.textContent=`LOST: -${bet} HONEY`;result.style.color='#ff3366';synth.playCasino(false);}
      else if(mult===0.5){result.textContent=`HALF: -${Math.floor(bet*0.5)} HONEY`;result.style.color='#ff3366';synth.playCasino(false);}
      else if(mult===1.2){result.textContent=`SAFE: +${Math.floor(bet*0.2)} HONEY`;result.style.color='#00ff66';synth.playCasino(true);}
      else if(mult===2){result.textContent=`DOUBLE: +${bet} HONEY!`;result.style.color='#00ff66';synth.playCasino(true);}
      else{result.textContent=`🌟 JACKPOT 5× +${bet*4} HONEY!`;result.style.color='#ffcc00';synth.playCasino(true);}
      game.market.forecastLog.unshift({ time: game.time, bet, multiplier: mult, change });
      if (game.market.forecastLog.length > 12) game.market.forecastLog.pop();
      game.market.lastEvent = `Forecast ${change >= 0 ? 'gain' : 'loss'}`;
      game.market.uiDirty = true;
      game.ui.fullMarketDirty = true;
      updateProgressionUI();
      wheel.style.transition='none';wheel.style.transform=`rotate(${360-sectorAngle}deg)`;
    },3100);
  });
}

function setMarketPanelOpen(open) {
  game.marketPanelOpen = open;
  const panel = document.getElementById('marketPanel');
  const openBtn = document.getElementById('marketOpenBtn');
  if (!panel || !openBtn) return;
  panel.classList.toggle('market-closed', !open);
  
  const dt2 = dist2(game.player.x, game.player.z, TRADE_POS.x, TRADE_POS.z);
  openBtn.classList.toggle('hidden', open || dt2 >= 14);
  
  if (open) updateMarketUI(true);
}

function initMarketPanelControls() {
  const closeBtn = document.getElementById('marketCloseBtn');
  const openBtn = document.getElementById('marketOpenBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      game.marketManuallyClosed = true;
      setMarketPanelOpen(false);
    });
  }
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      game.marketManuallyClosed = false;
      setMarketPanelOpen(true);
    });
  }

  // Trade-size toggle (×1 / ×5 / ×25 / MAX)
  const sizeWrap = document.getElementById('tradeSizeBtns');
  if (sizeWrap) {
    sizeWrap.querySelectorAll('.ts-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sizeWrap.querySelectorAll('.ts-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const q = btn.dataset.qty;
        game.market.tradeQty = q === 'max' ? 'max' : (parseInt(q, 10) || 1);
        game.market.uiDirty = true;
        game.ui.fullMarketDirty = true;
      });
    });
  }
  setMarketPanelOpen(false);
}

function activeQuest() {
  return QUESTS[Math.min(game.questIndex, QUESTS.length - 1)] || null;
}

function checkQuestProgress() {
  // Quest routing is intentionally paused for the current build. The marker in
  // the HUD is only a muted future egg/progression placeholder.
}

function updateQuestUI() {
  const chip = document.getElementById('objectiveChip');
  if (!chip) return;
  chip.classList.toggle('has-eggs', game.eggs.length > 0);
}

// ======================== UI UPDATES ========================
const el = {
  hps: document.getElementById('hps'),
  honey: document.getElementById('honey'),
  pollen: document.getElementById('pollen'),
  bees: document.getElementById('bees'),
  clock: document.getElementById('clock'),
  bloomBar: document.getElementById('bloomBar'),
  bloomText: document.getElementById('bloomText'),
  bloomFill: document.getElementById('bloomFill'),
  swarmMode: document.getElementById('swarmMode'),
  pollenFill: document.getElementById('pollenFill'),
  interactPrompt: document.getElementById('interactPrompt'),
  promptText: document.getElementById('promptText'),
  tutorialToast: document.getElementById('tutorialToast'),
  tutorialText: document.getElementById('tutorialText'),
};

let hudTick = 0;
function updateHUD(dt) {
  hudTick += dt;
  if (hudTick < 0.08) return;
  hudTick = 0;

  el.hps.textContent = game.hps.toFixed(1);
  el.honey.textContent = Math.floor(game.honey);
  el.pollen.textContent = `${Math.floor(game.pollen)} / ${pollenCap()}`;
  el.bees.textContent = game.lumens.length;
  el.clock.textContent = isNight() ? 'NIGHT' : 'DAY';
  const beesGathering = game.phase === 'playing' && game.player && fieldAtPosition(game.player.x, game.player.z);
  el.swarmMode.textContent = beesGathering ? 'GATHERING' : 'NEARBY';
  el.swarmMode.className = 'swarm-badge mode-swarm';
  const refineryStatus = document.getElementById('refineryStatus');
  if (refineryStatus) refineryStatus.textContent = game.conversionStarted && hiveConversionActive() && conversionWorkAvailable() ? 'CONVERTING' : 'IDLE';

  // Pollen bar
  const pct = pollenCap() > 0 ? (game.pollen / pollenCap()) * 100 : 0;
  el.pollenFill.style.width = pct + '%';

  // Upgrade buttons
  const shopItems = SHOP_SECTIONS.flatMap(s => s.items);
  document.querySelectorAll('.upg').forEach(btn => {
    const item = shopItems.find(i => i.key === btn.dataset.key);
    if (!item) return;
    const c = item.cost();
    const costEl = btn.querySelector('.u-cost');
    costEl.textContent = item.locked ? 'LOCKED' : `${c} 🍯`;
    const ok = !item.locked && game.honey >= c;
    btn.classList.toggle('broke', !ok);
    costEl.classList.toggle('ok', ok);
    costEl.classList.toggle('no', !ok);
    
    // Dynamic level/queue display
    const lvlEl = btn.querySelector('.u-level');
    let lvl = null;
    if (game.equipment[item.key]) lvl = game.equipment[item.key].level;
    else if (game.upgrades[item.key]) lvl = game.upgrades[item.key].level;
    
    if (lvlEl) {
      if (lvl !== null) {
        lvlEl.textContent = `Lv. ${lvl}`;
      } else {
        let eggType = '';
        if (item.key === 'basicEgg') eggType = 'Basic Egg';
        else if (item.key === 'workerEgg') eggType = 'Worker Egg';
        else if (item.key === 'scoutEgg') eggType = 'Scout Egg';
        else if (item.key === 'rareEgg') eggType = 'Rare Egg';
        const eggCount = game.eggs.filter(e => e.type === eggType).length;
        lvlEl.textContent = eggCount > 0 ? `Queue: ${eggCount}` : '';
      }
    }

    // Dynamic description to show stats progression
    const descEl = btn.querySelector('.u-desc');
    if (descEl && lvl !== null) {
      if (item.key === 'tool') {
        const currentRadius = (T.tool.baseRadius + lvl * 0.24).toFixed(1);
        const nextRadius = (T.tool.baseRadius + (lvl + 1) * 0.24).toFixed(1);
        const patternNames = { single: 'single sweep', line: 'line sweep', ring: 'ring sweep', grid: 'grid rake', strongest: 'smart rake' };
        descEl.textContent = `${currentRadius}m -> ${nextRadius}m, ${patternNames[toolPattern()] || 'single sweep'}`;
      } else if (item.key === 'boots') {
        descEl.textContent = `+${(lvl*6)}% -> +${((lvl+1)*6)}% move speed`;
      } else if (item.key === 'whistle') {
        descEl.textContent = `+${(lvl*6)}% -> +${((lvl+1)*6)}% bee speed`;
      } else if (item.key === 'magnet') {
        descEl.textContent = `+${(lvl*0.8).toFixed(1)} -> +${((lvl+1)*0.8).toFixed(1)} radius`;
      } else if (item.key === 'jar') {
        descEl.textContent = `+${(lvl*3)}% -> +${((lvl+1)*3)}% yield, +${(lvl*7)}% -> +${((lvl+1)*7)}% convert speed`;
      } else if (item.key === 'pack') {
        descEl.textContent = `+${(lvl*40)} -> +${((lvl+1)*40)} pack capacity`;
      } else if (item.key === 'scanner') {
        const currentRange = lvl > 0 ? `${18 + lvl * 14}m` : 'off';
        const nextRange = `${18 + (lvl + 1) * 14}m`;
        descEl.textContent = `${currentRange} -> ${nextRange} healthy-flower compass`;
      } else if (item.key === 'refine') {
        descEl.textContent = `${Math.round(lvl * 8)}% -> ${Math.round((lvl + 1) * 8)}% bee conversion rate`;
      } else if (item.key === 'storage') {
        descEl.textContent = `+${(lvl*50)} -> +${((lvl+1)*50)} storage capacity`;
      } else if (item.key === 'marketTerminal') {
        descEl.textContent = lvl > 0 ? 'Trend arrows active' : 'Unlock trend indicators';
      }
    }
  });

  updateMarketUI();
  updateProximityUI();
  checkQuestProgress();
  updateQuestUI();

  updateActiveAbilitiesHUD();

  // Bloom bar
  const bl = game.bloom;
  const afterglow = game.bloomAfterglow;
  if (!bl && !afterglow) { el.bloomBar.classList.add('hidden'); return; }
  el.bloomBar.classList.remove('hidden');
  if (afterglow && !bl) {
    const result = afterglow.perfect ? 'PERFECT BOOST' : 'PARTIAL BOOST';
    el.bloomText.textContent = `${result} ×${afterglow.multiplier.toFixed(1)} — ${Math.ceil(afterglow.timer)}s`;
    el.bloomFill.style.width = `${clamp(afterglow.timer / afterglow.duration, 0, 1) * 100}%`;
    el.bloomFill.style.background = afterglow.perfect ? 'var(--gold)' : 'var(--cyan)';
  } else if (!bl.started) {
    el.bloomText.textContent = 'BLOOM ACTIVE — REACH THE GLOWING BEE';
    el.bloomFill.style.width = `${clamp(bl.readyTimer/T.bloom.readyTimeout,0,1)*100}%`;
    el.bloomFill.style.background = 'var(--cyan)';
  } else {
    el.bloomText.textContent = `×${bl.multiplier.toFixed(1)} — ${bl.order.length}/${bl.eligible.length} LINKED`;
    el.bloomFill.style.width = `${clamp(bl.timer/T.bloom.perTouchTime,0,1)*100}%`;
    el.bloomFill.style.background = 'var(--gold)';
  }
}

function getActiveAbilities() {
  const list = [];

  // 1. Celestial Link (Bloom Chain challenge)
  const bl = game.bloom;
  if (bl) {
    if (!bl.started) {
      list.push({
        id: 'celestial_link_ready',
        title: 'Celestial Link (Ready)',
        iconHtml: '<img src="assets/celestial_link.png" class="active-ability-img-icon" alt="" />',
        color: '#7fd8ff',
        colorRGB: '127, 216, 255',
        timer: bl.readyTimer,
        maxTimer: T.bloom.readyTimeout,
        desc: 'Celestial Link ready! Touch the starting bee to begin the chain challenge.'
      });
    } else {
      list.push({
        id: 'celestial_link_active',
        title: 'Celestial Link (Active)',
        iconHtml: '<img src="assets/celestial_link.png" class="active-ability-img-icon" alt="" />',
        color: '#ffd700',
        colorRGB: '255, 215, 0',
        timer: bl.timer,
        maxTimer: T.bloom.perTouchTime,
        desc: 'Celestial Link active! Touch another glowing bee to extend the chain and reset the timer.'
      });
    }
  }

  // 2. Bloom Boost (Afterglow)
  const afterglow = game.bloomAfterglow;
  if (afterglow) {
    list.push({
      id: 'bloom_afterglow',
      title: afterglow.perfect ? 'Perfect Bloom Boost' : 'Partial Bloom Boost',
      iconHtml: `<img src="assets/celestial_link.png" class="active-ability-img-icon" style="filter: drop-shadow(0 0 2px ${afterglow.perfect ? '#ffe47a' : '#8fddff'}) hue-rotate(${afterglow.perfect ? '50deg' : '0deg'}) saturate(1.5);" alt="" />`,
      color: afterglow.perfect ? '#ffe47a' : '#8fddff',
      colorRGB: afterglow.perfect ? '255, 228, 122' : '143, 221, 255',
      timer: afterglow.timer,
      maxTimer: afterglow.duration,
      desc: `Your bees have a ×${afterglow.multiplier.toFixed(1)} gathering speed multiplier boost!`
    });
  }

  // 3. Royal Glow
  if (game.tokenBuffs.royal > 0) {
    list.push({
      id: 'royal_glow',
      title: 'Royal Glow',
      iconHtml: '<img src="assets/basic_egg.png" class="active-ability-img-icon" style="filter: drop-shadow(0 0 2px #ff7a3a);" alt="" />',
      color: '#ff7a3a',
      colorRGB: '255, 122, 58',
      timer: game.tokenBuffs.royal,
      maxTimer: 45,
      desc: 'Hatch odds for rare and legendary bees are dramatically boosted.'
    });
  }

  // 4. Focus
  if (game.tokenBuffs.focus > 0) {
    list.push({
      id: 'focus_buff',
      title: 'Focus Buff',
      iconHtml: `
        <svg class="active-ability-svg-icon" viewBox="0 0 24 24" width="20" height="20" stroke="#28d7c5" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="6"></circle>
          <circle cx="12" cy="12" r="2" fill="#28d7c5"></circle>
        </svg>
      `,
      color: '#28d7c5',
      colorRGB: '40, 215, 197',
      timer: game.tokenBuffs.focus,
      maxTimer: 20,
      desc: 'Player and bee gather speed is increased by +25% and tool power is boosted.'
    });
  }

  return list;
}

function updateActiveAbilitiesHUD() {
  const container = document.getElementById('activeAbilities');
  if (!container) return;

  const active = getActiveAbilities();
  
  // Track IDs of currently displayed elements
  const currentIds = new Set(active.map(a => a.id));

  // Remove elements that are no longer active
  Array.from(container.children).forEach(child => {
    if (!currentIds.has(child.id)) {
      // Fade out and remove
      child.style.opacity = '0';
      child.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (child.parentNode === container) {
          container.removeChild(child);
        }
      }, 150);
    }
  });

  // Create or update active abilities
  active.forEach(ability => {
    let itemEl = document.getElementById(ability.id);
    if (!itemEl) {
      // Create new ability element
      itemEl = document.createElement('div');
      itemEl.id = ability.id;
      itemEl.className = 'active-ability-item';
      itemEl.style.opacity = '0';
      itemEl.style.transform = 'translateY(10px)';
      
      itemEl.innerHTML = `
        <div class="active-ability-icon" style="color: ${ability.color}; border: 1px solid ${ability.color}40;">
          ${ability.iconHtml}
        </div>
        <div class="active-ability-info">
          <span class="active-ability-name">${ability.title}</span>
          <div class="active-ability-bar-container">
            <div class="active-ability-bar-fill" style="background-color: ${ability.color};"></div>
          </div>
        </div>
        <div class="active-ability-tooltip">
          <div class="active-ability-tooltip-title">${ability.title}</div>
          <div class="active-ability-tooltip-desc">${ability.desc}</div>
          <div class="active-ability-tooltip-time"></div>
        </div>
      `;
      container.appendChild(itemEl);
      
      // Trigger entrance transition
      requestAnimationFrame(() => {
        itemEl.style.opacity = '1';
        itemEl.style.transform = 'translateY(0)';
      });
    }

    // Update existing elements
    const ratio = Math.max(0, Math.min(1, ability.timer / ability.maxTimer));
    const fillEl = itemEl.querySelector('.active-ability-bar-fill');
    if (fillEl) {
      fillEl.style.width = `${ratio * 100}%`;
      // Dim fill opacity
      fillEl.style.opacity = 0.3 + 0.7 * ratio;
    }

    // Update tooltip timer
    const timeEl = itemEl.querySelector('.active-ability-tooltip-time');
    if (timeEl) {
      timeEl.textContent = `${ability.timer.toFixed(1)} seconds remaining`;
    }

    // Dim the color closer to finishing
    const dim = 0.4 + 0.6 * ratio;
    itemEl.style.opacity = itemEl.matches(':hover') ? '1.0' : String(dim);
    itemEl.style.borderColor = `rgba(${ability.colorRGB}, ${0.1 + 0.5 * ratio})`;
    
    const iconEl = itemEl.querySelector('.active-ability-icon');
    if (iconEl) {
      iconEl.style.filter = `brightness(${0.6 + 0.4 * ratio})`;
    }
  });
}

function updateProximityUI() {
  const p = game.player;
  const dh = game.phase === 'playing' ? distanceToHiveCircle() : dist2(p.x, p.z, game.hive.x, game.hive.z);
  const dt2 = dist2(p.x, p.z, TRADE_POS.x, TRADE_POS.z);
  const ds = dist2(p.x, p.z, SHOP_POS.x, SHOP_POS.z);
  const lockedField = FIELD_DEFS.find(f => !fieldUnlocked(f.id) && dist2(p.x, p.z, f.center.x, f.center.z) < f.radius + 2);

  const mktPanel = document.getElementById('marketPanel');
  const mktOpenBtn = document.getElementById('marketOpenBtn');
  const mktStatus = document.getElementById('exchangeStatus');
  const dockBar = document.getElementById('dockStatusBar');
  const dockText = document.getElementById('dockStatusText');
  const otherModal = game.ui.eggConfirmOpen || game.ui.perkOpen || game.ui.fullMarketOpen;

  // Walk-up SHOP popup (hysteresis stops it flickering at the edge)
  if (game.phase === 'playing' && ds < 8 && !otherModal) {
    if (dockBar) dockBar.className = 'dock-status-bar connected';
    if (dockText) dockText.textContent = game.ui.shopOpen ? 'SHOP OPEN' : 'SHOP NEARBY';
  } else if (game.ui.shopOpen && (ds > 9.5 || game.phase !== 'playing')) {
    setShopPanelOpen(false);
  }

  // Walk-up trading terminal — reaching the post opens the FULL popup (not the
  // cramped side panel). Once you dismiss it (X / M) it stays shut until you
  // leave and come back.
  if (dt2 < 14) {
    mktStatus.textContent = 'TERMINAL ACTIVE';
    if (mktOpenBtn) mktOpenBtn.classList.add('hidden');
    if (game.marketPanelOpen) setMarketPanelOpen(false);   // retire the old side panel
    const blockingModal = game.ui.eggConfirmOpen || game.ui.perkOpen || game.ui.shopOpen;
    if (game.ui.fullMarketOpen) {
      game.marketAutoOpened = true;
    } else if (game.marketAutoOpened) {
      // it was auto-opened and the player just closed it — respect that in range
      game.marketAutoOpened = false;
      game.marketManuallyClosed = true;
    } else if (!game.marketManuallyClosed && !blockingModal) {
      setModalOpen('fullMarketModal', true);
      game.marketAutoOpened = true;
    }
  } else {
    mktStatus.textContent = 'MARKET LIVE';
    game.marketManuallyClosed = false;
    if (game.marketAutoOpened && game.ui.fullMarketOpen) setModalOpen('fullMarketModal', false);
    game.marketAutoOpened = false;
    if (mktOpenBtn) { mktOpenBtn.classList.remove('active-dock'); mktOpenBtn.classList.add('hidden'); }
    mktPanel.classList.remove('active-dock');
  }

  // Center prompt — claim a vacant bay, or convert pollen at your own hive
  let promptText = '';
  if (game.phase === 'unclaimed' && nearestBay(7)) {
    promptText = 'Press E to claim this hive';
  } else if (game.phase === 'playing' && lockedField) {
    promptText = `${lockedField.name} needs ${lockedField.gateBees} bees`;
  } else if (game.phase === 'playing' && ds < 8 && !game.ui.shopOpen && !otherModal) {
    promptText = 'Press E to open the Honey Shop';
  } else if (game.phase === 'playing' && dt2 < 14 && !game.ui.fullMarketOpen && !otherModal) {
    promptText = 'Press M to open the Honey Market';
  } else if (game.phase === 'playing' && game.pollen >= pollenCap() && dh >= T.hive.conversionRadius + 1.2) {
    promptText = 'Pollen pack full — return to your hive';
  } else if (game.phase === 'playing' && dh < T.hive.conversionRadius && conversionWorkAvailable() && !game.conversionStarted) {
    promptText = `Press E to convert honey (${Math.floor(queuedPollenForHoney())} pollen)`;
  } else if (game.phase === 'playing' && dh < T.hive.conversionRadius && game.conversionStarted) {
    promptText = `Converting honey… Press E to stop (${Math.floor(queuedPollenForHoney() + conversionPollenInFlight())} pollen)`;
  }

  if (promptText) {
    el.interactPrompt.classList.remove('hidden');
    el.promptText.textContent = promptText;
  } else {
    el.interactPrompt.classList.add('hidden');
  }

}

// ======================== FLASHES & TUTORIALS ========================
function showFlash(text, color) {
  game.flashes.push({ text, color, t: 0, dur: 1.5 });
}

function showTutorial(text) {
  el.tutorialText.textContent = text;
  el.tutorialToast.classList.remove('hidden');
  clearTimeout(game.tutorial._timeout);
  game.tutorial._timeout = setTimeout(() => {
    el.tutorialToast.classList.add('hidden');
  }, 6000);
}

// ======================== DAY/NIGHT CYCLE ========================
const daySkyColor = new THREE.Color(0x6CB4EE);
const nightSkyColor = new THREE.Color(0x0a1025);

function updateDayNight() {
  const nf = nightFactor();

  // Sky color
  scene.background.copy(daySkyColor).lerp(nightSkyColor, nf);
  scene.fog.color.copy(scene.background);

  // Sun light
  sunLight.intensity = lerp(1.3, 0.15, nf);
  sunLight.color.setHSL(0.1, lerp(0.2, 0.5, nf), lerp(0.95, 0.3, nf));

  // Ambient
  ambientLight.intensity = lerp(0.7, 0.2, nf);
  ambientLight.color.setHSL(0.6, 0.2, lerp(0.6, 0.15, nf));

  // Sun position
  if (sunMesh) {
    const angle = dayPhase() * Math.PI * 2;
    sunMesh.position.set(Math.cos(angle) * 80, Math.sin(angle) * 60 + 20, -60);
    sunMesh.visible = nf < 0.7;
  }
}

// ======================== AMBIENT EFFECTS ========================
function updateAmbient(dt) {
  for (const uniform of windUniforms) uniform.value = game.time;
  // Floating motes
  if (game.motes) {
    for (const m of game.motes) {
      m.phase += dt * m.speed;
      m.mesh.position.y = 1.5 + Math.sin(m.phase) * 2;
      m.mesh.position.x += Math.sin(m.phase * 0.3) * 0.01;
    }
  }
  // Lightweight butterflies add field life without growing draw calls much.
  if (game.butterflies) {
    for (const b of game.butterflies) {
      b.phase += dt * b.speed;
      b.flapPhase += dt * 11;
      b.yPhase += dt * 1.7;
      const wobble = Math.sin(b.phase * 2.7) * 0.9;
      const x = b.center.x + Math.cos(b.phase) * b.orbit + Math.sin(b.phase * 3.1) * 0.55;
      const z = b.center.z + Math.sin(b.phase) * (b.orbit * 0.72) + wobble;
      const y = terrainHeightAt(x, z) + 1.15 + Math.sin(b.yPhase) * 0.45;
      b.model.position.set(x, y, z);
      b.model.rotation.y = -b.phase + Math.PI * 0.5;
      const flap = 0.32 + Math.sin(b.flapPhase) * 0.68;
      b.model.userData.wingL.rotation.y = flap;
      b.model.userData.wingR.rotation.y = -flap;
    }
  }
  // Clouds
  for (const c of game.clouds) {
    c.position.x += c.userData.speed * dt;
    if (c.position.x > 120) c.position.x = -120;
  }
  // Hive beacon pulse
  if (game.hive.model && !game.hive.claimed) {
    const beacon = game.hive.model.userData.beacon;
    if (beacon) {
      beacon.material.opacity = 0.3 + Math.sin(game.time * 3) * 0.2;
      beacon.position.y = 6 + Math.sin(game.time * 2) * 0.5;
    }
    game.hive.model.userData.hiveLight.intensity = 0.3 + Math.sin(game.time * 2) * 0.15;
  }
}

// ======================== MAIN LOOP ========================
const FIXED_SIM_STEP = 1 / 60;
const MAX_SIM_STEPS = 5;
let last = performance.now();
let simulationAccumulator = 0;

function simulateStep(dt) {
  game.time += dt;
  updateDeferredRivalClaims(dt);
  updatePlayer(dt);
  updateCamera(dt);

  if (game.phase === 'playing') {
    for (const f of game.flowers) updateFlower(f, dt);
    for (const b of game.lumens) updateLumen(b, dt);
    updatePollenOrbs(dt);
    updateHarvestFX(dt);
    updateAbilityTokens(dt);
    updateTokenBuffs(dt);
    updateHoneyJars(dt);
    updateBloom(dt);
    updateBloomWeb();
    updateMarket(dt);
    updateCombFX(dt);
    updateNeighborBees(dt);
    refineTick(dt);
    updateConversionBeam(dt);
  } else {
    for (const f of game.flowers) updateFlower(f, dt);
  }

  updateDayNight();
  updateAmbient(dt);
  updateHUD(dt);
  autosaveTick(dt);
}

function updateAdaptiveRenderQuality(workMs, elapsed) {
  renderQuality.averageWorkMs = renderQuality.samples === 0
    ? workMs
    : lerp(renderQuality.averageWorkMs, workMs, 0.025);
  renderQuality.samples++;
  // Adaptive DPR protects dense flower/bee scenes from dropping frames. Changes
  // are sampled slowly with a cooldown to avoid visible WebGL canvas blinking.
  if (!renderQuality.adaptive) return;
  renderQuality.cooldown = Math.max(0, renderQuality.cooldown - elapsed);
  if (renderQuality.samples < 120 || renderQuality.cooldown > 0) return;

  let nextDpr = renderQuality.dpr;
  if (renderQuality.averageWorkMs > 16.5) {
    nextDpr = Math.max(renderQuality.minDpr, renderQuality.dpr - 0.12);
  } else if (renderQuality.averageWorkMs < 9.5) {
    nextDpr = Math.min(renderQuality.maxDpr, renderQuality.dpr + 0.08);
  }
  if (Math.abs(nextDpr - renderQuality.dpr) >= 0.01) {
    renderQuality.dpr = nextDpr;
    applyRenderPixelRatio();
    renderQuality.cooldown = 4;
  }
  renderQuality.samples = 0;
}

function frame(now) {
  requestAnimationFrame(frame);
  if (document.hidden || renderQuality.contextLost) {
    last = now;
    simulationAccumulator = 0;
    return;
  }

  const elapsed = Math.min(0.1, Math.max(0, (now - last) / 1000));
  last = now;
  const workStart = performance.now();

  if (game.running) {
    simulationAccumulator = Math.min(
      simulationAccumulator + elapsed,
      FIXED_SIM_STEP * MAX_SIM_STEPS
    );
    let steps = 0;
    while (simulationAccumulator >= FIXED_SIM_STEP && steps < MAX_SIM_STEPS) {
      simulateStep(FIXED_SIM_STEP);
      simulationAccumulator -= FIXED_SIM_STEP;
      steps++;
    }
    if (steps === MAX_SIM_STEPS) simulationAccumulator = 0;
  }

  renderer.render(scene, camera);
  updateAdaptiveRenderQuality(performance.now() - workStart, elapsed);
}

// Drive each comb cell's wax/honey look from its slot state.
function updateHiveVisuals() {
  const cells = game.hive.slotMeshes;
  if (!cells || !cells.length || !cells[0].instances) return;
  const beesBySlot = new Map(game.lumens.map(bee => [bee.hiveSlotId, bee]));

  cells.forEach((cell, i) => {
    const slot = game.beeSlots[i];

    if (!slot || !slot.unlocked) {
      setCombCellVisual(cell, 'locked', 0x80642e, 0xffce4d);
      return;
    }

    const bee = beesBySlot.get(slot.id);
    if (!bee) {
      if (cell.dragHovered) {
        setCombCellVisual(cell, 'empty', 0xffd84d, 0xfff0ad);
      } else {
        setCombCellVisual(cell, 'empty', 0xe0a838, 0xffce4d);
      }
    } else {
      let rimHex = 0xffc24d, glowHex = 0xffce4d;
      const r = (bee.rarity || '').toLowerCase();
      if (r === 'uncommon') { rimHex = 0x4fe0d0; glowHex = 0x66f0e0; }
      else if (r === 'rare') { rimHex = 0xd98cff; glowHex = 0xc77bff; }
      else if (r === 'epic') { rimHex = 0x8a7cff; glowHex = 0x9b8cff; }
      else if (r === 'legendary') { rimHex = 0xff7a3a; glowHex = 0xff944d; }
      setCombCellVisual(cell, 'occupied', rimHex, glowHex);
    }
  });
}

// Living comb: occupied cells shimmer, and a cell flares open as a bee passes through.
function updateCombFX(dt) {
  const cells = game.hive.slotMeshes;
  if (!cells || !cells.length || !cells[0].instances) return;
  let changed = false;
  for (const c of cells) {
    const target = c.transiting ? 1 : 0;
    c._pulse = lerp(c._pulse || 0, target, Math.min(1, dt * 7));
    c.transiting = false;
    const isHovered = c.dragHovered;
    if (c.glowVisible || isHovered) {
      const s = (isHovered ? 1.35 : 1) + c._pulse * 0.4 + Math.sin(game.time * 3 + c.index) * 0.05;
      setCombInstanceTransform(c.instances.glows, c.index, c.local, -0.13, s);
      changed = true;
    }
  }
  if (changed) cells[0].instances.glows.instanceMatrix.needsUpdate = true;
}

// Rival hives' resting bees gently breathe so the apiary feels inhabited.
function updateNeighborBees(dt) {
  const list = game.neighborBees;
  if (!list || !list.length) return;
  for (const nb of list) {
    nb.model.position.y = nb.baseY + Math.sin(game.time * 1.6 + nb.phase) * 0.05;
    const wp = nb.model.userData;
    if (wp && wp.wingPivotL) {
      const f = Math.sin(game.time * 22 + nb.phase) * 0.4;
      wp.wingPivotL.rotation.z = 0.4 + f; wp.wingPivotR.rotation.z = -0.4 - f;
      wp.wingPivotL2.rotation.z = 0.6 + f; wp.wingPivotR2.rotation.z = -0.6 - f;
    }
  }
}

// ======================== SAVE / LOAD ========================
// Persistence foundation. The store is intentionally async so localStorage can
// later be swapped for a server backend (fetch) WITHOUT touching call sites —
// that is the groundwork for cloud saves / multiplayer accounts.
const SAVE_KEY = 'luminhive.save.v1';
const SAVE_VERSION = 1;

const SaveStore = {
  async save(data) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); return true; }
    catch (e) { console.warn('[save] failed', e); return false; }
  },
  async load() {
    try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; }
    catch (e) { console.warn('[load] failed', e); return null; }
  },
  async clear() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} },
  // Synchronous variants for boot hydration and page-unload (async can be cut off).
  loadSync() { try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; } },
  saveSync(data) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) {} },
};

const num = (v, d) => (typeof v === 'number' && isFinite(v)) ? v : d;
const levelsOf = obj => { const o = {}; for (const k in obj) o[k] = obj[k].level || 0; return o; };
const applyLevels = (obj, saved) => { if (!saved) return; for (const k in saved) if (obj[k]) obj[k].level = saved[k] || 0; };

function serializeGame() {
  return {
    v: SAVE_VERSION,
    savedAt: Date.now(),
    honey: game.honey,
    hivePollen: game.hivePollen,
    pollen: game.pollen,
    phase: game.phase,
    bayIndex: game.hive.bayIndex,
    swarmMode: game.swarmMode,
    questIndex: game.questIndex,
    nextBeeId: game.nextBeeId,
    beeSlots: game.beeSlots.map(s => ({ id: s.id, unlocked: s.unlocked, beeId: s.beeId })),
    bees: game.lumens.map(b => ({
      id: b.id, name: b.name, type: b.type, rarity: b.rarity, role: b.role,
      level: b.level, gatherPower: b.gatherPower, speed: b.speed, hue: b.hue,
      conversionRate: b.conversionRate,
      ability: b.ability, abilityName: b.abilityName, accent: b.accent, hiveSlotId: b.hiveSlotId,
    })),
    eggs: game.eggs.map(e => ({ id: e.id, type: e.type })),
    equipment: levelsOf(game.equipment),
    upgrades: levelsOf(game.upgrades),
    perks: levelsOf(game.perks),
    stats: JSON.parse(JSON.stringify(game.stats)),
    market: game.market.assets.map(a => ({ id: a.id, owned: a.owned || 0, costBasis: a.costBasis || 0, price: a.price, prev: a.prev })),
  };
}

// Reconstruct a saved game on top of a freshly-built world (called from boot,
// after initWorld). Returns true if a playing-phase save was restored.
function applySave(data) {
  if (!data || data.v !== SAVE_VERSION) return false;

  game.honey = num(data.honey, game.honey);
  game.hivePollen = num(data.hivePollen, 0);
  game.pollen = num(data.pollen, 0);
  game.swarmMode = 'swarm';   // bee-mode toggle removed; always hover-and-fan-out
  game.questIndex = num(data.questIndex, 0);
  game.nextBeeId = num(data.nextBeeId, game.nextBeeId);
  if (data.stats) Object.assign(game.stats, data.stats);
  applyLevels(game.equipment, data.equipment);
  applyLevels(game.upgrades, data.upgrades);
  applyLevels(game.perks, data.perks);
  game.player.speed = 14 * (1 + 0.06 * (game.equipment.boots.level || 0));

  if (Array.isArray(data.market)) {
    for (const sa of data.market) {
      const a = game.market.assets.find(x => x.id === sa.id);
      if (a) { a.owned = num(sa.owned, 0); a.costBasis = num(sa.costBasis, 0); a.price = num(sa.price, a.price); a.prev = num(sa.prev, a.price); }
    }
  }

  if (data.phase !== 'playing' || data.bayIndex == null || !game.apiary || !game.apiary.bays[data.bayIndex]) return false;

  claimHive(data.bayIndex, true);             // silent: no default bee, no tutorial

  // Restore slot unlock flags, then spawn the saved bees into their slots.
  const slotById = {};
  for (const s of game.beeSlots) { s.beeId = null; slotById[s.id] = s; }
  if (Array.isArray(data.beeSlots)) for (const ss of data.beeSlots) { const s = slotById[ss.id]; if (s) s.unlocked = !!ss.unlocked; }
  if (Array.isArray(data.bees)) {
    for (const bd of data.bees) {
      const slot = slotById[bd.hiveSlotId];
      if (!slot || !slot.unlocked) continue;
      const migratedBee = bd.type === 'Broker Bee'
        ? {
            ...bd,
            name: 'Celest Lumen',
            type: 'Celest Lumen',
            role: 'Weaver',
            hue: '#5fb8ff',
            ability: 'bloomLink',
            abilityName: 'Bloom Chain',
            accent: 'halo'
          }
        : bd;
      const bee = makeLumen({ ...migratedBee });
      if (bee) game.lumens.push(bee);
    }
  }
  game.eggs = Array.isArray(data.eggs) ? data.eggs.map(e => ({ id: e.id, type: e.type })) : [];

  updateHiveVisuals();
  updateProgressionUI();
  return true;
}

let saveTimer = 0;
function autosaveTick(dt) {
  if (game.phase !== 'playing') return;
  saveTimer += dt;
  if (saveTimer >= 8) { saveTimer = 0; SaveStore.save(serializeGame()); }
}
function flushSave() { if (game.phase === 'playing') SaveStore.saveSync(serializeGame()); }

// ======================== BOOT ========================
function boot() {
  initWorld();
  try { window.LUM = game; } catch (e) {}
  try {
    if (['localhost', '127.0.0.1', ''].includes(window.location.hostname)) {
      window.LUM_DEBUG = {
        pollinateNearbyFlowers, spawnAbilityToken, syncFlowerTier, claimHive, nearestBay,
        terrainHeightAt, resolvePlayerCollisions, hiveConversionActive, beeConversionRate, renderQuality, game,
        getRenderStats: () => ({
          calls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          geometries: renderer.info.memory.geometries,
          textures: renderer.info.memory.textures,
          dpr: renderQuality.dpr,
          averageWorkMs: renderQuality.averageWorkMs,
        }),
      };
    }
  } catch (e) {}
  buildPanel();
  initMarketHistory();
  buildMarket();
  initSpeculator();
  initMarketPanelControls();
  initProgressionControls();

  // Restore a previous session (if any) on top of the freshly-built world.
  let resumed = false;
  try { resumed = applySave(SaveStore.loadSync()); } catch (e) { console.warn('[load] restore failed', e); }
  if (window.LUM_DEBUG) {
    window.LUM_DEBUG.saveNow = () => SaveStore.save(serializeGame());
    window.LUM_DEBUG.clearSave = async () => { await SaveStore.clear(); location.reload(); };
    window.LUM_DEBUG.serializeGame = serializeGame;
  }

  updateHiveVisuals();

  // Sound toggle
  const soundBtn = document.getElementById('soundBtn');
  const soundIcon = document.getElementById('soundIcon');
  soundBtn.addEventListener('click', () => {
    synth.init();
    const muted = !soundBtn.classList.contains('muted');
    soundBtn.classList.toggle('muted', muted);
    soundIcon.textContent = muted ? '🔇' : '🔊';
    synth.setMute(muted);
    synth.playBell();
  });

  // Reflect a restored session on the title screen, and offer a clean restart.
  const playBtnEl = document.getElementById('playBtn');
  if (resumed && playBtnEl) {
    playBtnEl.textContent = 'CONTINUE YOUR HIVE';
    const reset = document.createElement('button');
    reset.id = 'resetSaveBtn';
    reset.className = 'reset-save-btn';
    reset.type = 'button';
    reset.textContent = 'Start a fresh hive (erase save)';
    reset.addEventListener('click', () => {
      if (confirm('Erase your saved hive and start over? This cannot be undone.')) {
        game.phase = 'unclaimed';   // stop autosave from rewriting the file before reload
        SaveStore.clear(); location.reload();
      }
    });
    playBtnEl.insertAdjacentElement('afterend', reset);
  }

  // Persist on the way out (tab hidden / closing) — sync so it isn't cut off.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      flushSave();
      releaseCameraInput();
    } else {
      last = performance.now();
      simulationAccumulator = 0;
    }
  });
  window.addEventListener('pagehide', flushSave);
  window.addEventListener('beforeunload', flushSave);

  // Play button
  document.getElementById('playBtn').addEventListener('click', () => {
    synth.init();
    const titleEl = document.getElementById('title');
    titleEl.style.opacity = '0';
    setTimeout(() => titleEl.classList.add('hidden'), 600);
    game.running = true;
    renderInventory();
    setHelpOpen(false);
    last = performance.now();
    simulationAccumulator = 0;

    // Initial camera position — looking toward the hive row in the plaza
    game.player.x = PLAYER_START.x;
    game.player.z = PLAYER_START.z;
    game.player.facing = Math.PI;
    game.camera.yaw = Math.PI;
    game.camera.pitch = 0.83;
    playerModel.position.set(PLAYER_START.x, 0, PLAYER_START.z);
    camera.position.set(PLAYER_START.x, 30, PLAYER_START.z - 36);

    // Show intro tutorial
    setTimeout(() => {
      showTutorial('Hold left mouse near flowers to harvest with your tool. Your bees hover with you and spread out to gather when you enter a field.');
    }, 1000);
  });

  requestAnimationFrame(frame);
}

boot();
})();
