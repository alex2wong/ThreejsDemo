// index.js

ThreeShp = {
  r:new THREE.WebGLRenderer(),
  s:new THREE.Scene(),
  loader :null,
  c:new THREE.PerspectiveCamera(41, window.innerWidth / window.innerHeight, 1, 100000)
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var displayName; // current display Name
var objLabels = [];

ThreeShp.init = function(){        
  // set the canvas width and length
  this.r.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(this.r.domElement);
  // THREE data struct.. Scene.add(Mesh)/Object3D
  this.loader = new THREE.SHPLoader();
  // 照相机在三维空间中的位置。 
  this.c.position.z = 50;
  this.c.position.y = -30;
  this.c.position.x = 0;
  this.s.add(this.c);

  // 添加鼠标交互空间
  this.controls = new THREE.TrackballControls(this.c, this.r.domElement);
  this.controls.minDistance = 10;
  this.controls.maxDistance = 1000;
}
ThreeShp.rendershp = function(res) {
  // res is shp.js defined shpobj.
  console.log('parse shpfile finished', res);
  // // parsedShp = res;
  // var loader = new THREE.SHPLoader();
  // m instanceof THREE.Object3D, createModel(shp, SphereOrNot)
  var m = ThreeShp.loader.createModel(res, false);
  m.scale.set(1.01, 1.01, 1.01);
  console.log('created model', m);
  var compressed = ThreeShp.loader.compress(res);
  //save(compressed, '110m_land.i12d6')
  var n = ThreeShp.loader.loadCompressed(compressed, false);
  n.scale.set(1.01,1.01,1.01);
  n.position.z = 10;
  n.receiveShadow = true;
  
  ThreeShp.s.add(m);
  ThreeShp.s.add(n);

  // Openlayer.View alike  -- PerspectiveCamera... Scene is needed!!.and Camera added to Scene!!!
  // // Camera(fov, aspect, near, far)

          
  //lookAt control the angle, right..
  ThreeShp.c.lookAt(new THREE.Vector3(0,0,0));
  ThreeShp.r.render(ThreeShp.s, ThreeShp.c);
  //addmouseMove();          
}

function err(res){ console.log('error', res); }

var parsedShp = null;
ThreeShp.init();
SHPParser.load("110m_land.shp",ThreeShp.rendershp,err);
//ThreeShp.s.add(createRect(60, 40, 20));
var phOpt = {
  rad: 10, segWitdh:40, segHeight:40
};
// xlen: Math.PI, ylen:Math.PI/2, ystart: Math.PI/2 
var suntexture = THREE.ImageUtils.loadTexture('./img/earth.jpg', function(){
  ThreeShp.r.render(ThreeShp.s, ThreeShp.c);        
})

var sun = createSphere(phOpt);
sun.name = 'Sun';
sun.volume = 20;
sun.position.set(0, -10 ,15);
sun.rotation.x += Math.PI/2;
ThreeShp.s.add(sun);

var newIco = createIcosahedronGeom(5, 1);
newIco.position.x += 60;
var newIcoFrames = createIcosahedronFrames(5, 1);
newIcoFrames.position.x += 60;
ThreeShp.s.add(newIco);
ThreeShp.s.add(newIcoFrames);

ThreeShp.s.add(createPlane(20));

var targetObj =  customGeom();
// targetObj.position.set(-10, 0, 10);
ThreeShp.s.add(targetObj);
ThreeShp.r.shadowMap.enabled = true;
ThreeShp.r.shadowMap.type = THREE.PCFSoftShadowMap;
// SHPParser.load("cpdmpop2010_poly_wgs.shp",ThreeShp.rendershp,err);


var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame; 
window.requestAnimationFrame = requestAnimationFrame;

var rotate1 = function(t) {
  newIco.rotation.y += 0.001 * Math.PI*2;
  newIcoFrames.rotation.y += 0.001 * Math.PI*2;
  ThreeShp.r.render(ThreeShp.s, ThreeShp.c);
  requestAnimationFrame(rotate1);
}
requestAnimationFrame(rotate1);

function createRect(xlen, ylen, zdepth, color) {
  var cube = new THREE.Mesh(          
    // SphereGeometry(radius, detail)
    // PlaneGeometry(xlen, ylen)
    new THREE.CubeGeometry(xlen, ylen, zdepth),
    new THREE.MeshLambertMaterial({color: color})
  )
  cube.castShadow = true;
  return cube;
}


function createSphere(opt) {
  var xstart = opt.xstart? opt.xstart:0;
  var xlen = opt.xlen? opt.xlen:Math.PI*2;
  var ystart = opt.ystart? opt.ystart:0;
  var ylen = opt.ylen? opt.ylen:Math.PI*2;
  var sphereGeom = new THREE.SphereGeometry(opt.rad, opt.segWitdh, opt.segHeight, xstart,xlen,ystart, ylen);
  var sphereMesh = new THREE.Mesh(sphereGeom,
    new THREE.MeshPhongMaterial({
      //color: 0x00ff88, 
      wireframe: false,
      emissive: 0xdd4422,
      map: suntexture
    })
  );
  return sphereMesh;
}

function createIcosahedronGeom(rad, detail) {
  var mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(rad, detail),
    // new THREE.MeshBasicMaterial({color:0x882233,
    //   wireframe: true})
    phong
  );
  return mesh;
}
function createIcosahedronFrames(rad, detail) {
  var mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(rad, detail),
    new THREE.MeshBasicMaterial({color:0xffff00,
      wireframe: true})
  );
  return mesh;
}

function customGeom() {
  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(30,0,20));
  geometry.vertices.push(new THREE.Vector3(40,0,20));
  geometry.vertices.push(new THREE.Vector3(35,25,20));

  geometry.vertices.push(new THREE.Vector3(35,8,25))

  // Face3 means a 3points- Patch consists vertice (index in vertices Arr)
  geometry.faces.push(new THREE.Face3(0,1,2));
  geometry.faces.push(new THREE.Face3(0,1,3));
  geometry.faces.push(new THREE.Face3(0,2,3));
  geometry.faces.push(new THREE.Face3(1,2,3));
  var mesh = new THREE.Mesh(geometry,
    new THREE.MeshLambertMaterial({
      color: 0x4080ff,
      side: THREE.DoubleSide,
      opacity: 0.5
      //wireframe: true
    }));
  mesh.castShadow = true;
  return mesh;
}

animate();
function animate() {
  requestAnimationFrame(animate);
  ThreeShp.controls.update();
  ThreeShp.r.render( ThreeShp.s, ThreeShp.c );
}

// !important PhongMatetial means mirror reflect!!
// load texture mapping to Mesh face.
function createPlane(xlen) {
  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(xlen, xlen),
    new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide
    })
  );
  plane.position.set(0, 0, 12);
  plane.receiveShadow = true;
  console.log('create plane geometry');
  return plane;
}

ThreeShp.s.add(createPlane(80));

// var light = new THREE.DirectionalLight(0xffffff);
var ambient = new THREE.AmbientLight(0xeeeeee);
ThreeShp.s.add(ambient);

// SpotLight(color, intensity)
var light = new THREE.SpotLight(0xffffffFFF, 1.5);
light.position.set(20, 10, 50);
light.angle = Math.PI/4;
light.decay = 2;
light.distance = 100;
light.penumbra = 0;
// light.target = targetObj;

light.castShadow = true;
light.shadow.camera.near = 1;
light.shadow.camera.far = 100;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

var lightHelper = new THREE.SpotLightHelper(light);

ThreeShp.s.add(light);
ThreeShp.s.add(lightHelper);

var lightViz = createRect(10, 10, 10, 0x4080ff);
lightViz.name = 'BoxGeom';
lightViz.volume = 10;
lightViz.position.set(10, 5, 20);
ThreeShp.s.add(lightViz);

var BoxGeom = createRect(10, 5, 3, 0x2040aa);
BoxGeom.name = 'Bricks';
BoxGeom.volume = 3;
BoxGeom.position.set(-10, 5, 20);
ThreeShp.s.add(BoxGeom);

var rotateAnimate = function() {
  lightViz.rotation.z += 0.01;
  ThreeShp.r.render(ThreeShp.s, ThreeShp.c);
  requestAnimationFrame(rotateAnimate);
}
requestAnimationFrame(rotateAnimate);

var floatUp = true;
// only One RequestAnimation may perform better...
var floatAnimate = function() {
  if (BoxGeom.position.z < 25 && floatUp){
    BoxGeom.position.z += 0.1;
  } else if (BoxGeom.position.z > 15) {
    BoxGeom.position.z -= 0.1;
    floatUp = false;
  } else {
    BoxGeom.position.z += 0.1;
    floatUp = true;
  }

  // for display Label
  raycaster.setFromCamera( mouse, ThreeShp.c ); 
  /*交汇点对像*/
  var intersects = raycaster.intersectObjects( ThreeShp.s.children );
  if( intersects.length > 0 ){
    var obj = intersects[0].object;
    if (obj.name) {
      objLabels.forEach(label => {
        if (obj.name === label.name && 
          obj.name !== displayName.name){
          displayName.visible = false;
          label.visible = true;
          displayName = label;
          console.log('Label: trigger displayName');
        }
      })
    }
  }

  ThreeShp.r.render(ThreeShp.s, ThreeShp.c); 
  requestAnimationFrame(floatAnimate);       
}
floatAnimate();


drawAxes(ThreeShp.s);


var lamber = new THREE.MeshLambertMaterial({
  // reflect color and emissive color.
  color: 0xaaaaaa,
  emissive: 0xff0000,
  map: texture
  // ambient: effective when AmbientLight is set.
});

var phong = new THREE.MeshPhongMaterial({
  // mirror reflect color
  specular: 0xaaaaaa,
  shininess: 50,
  map: texture
}) 


var material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    wireframe: true
});

// load font options: helvetiker, optimer, gentilis, droid_sans, droid_serif
var loader = new THREE.FontLoader();
loader.load('http://threejs.org/examples/fonts/optimer_regular.typeface.json', function(res) {
    var font = res;
    displayObjName(font);
});

// init textGeom for each Obj
function displayObjName(font) {
  console.log('init displayObjName');
  var objs = ThreeShp.s.children;
  var objsNum = 0;
  objs.forEach(obj => {
    let objName = obj.name? obj.name:'unknown';
    let objLabel = new THREE.Mesh(
      new THREE.TextGeometry(obj.name, {
        font: font,
        size: 3,
        height: 0.1
      }), 
      new THREE.MeshPhongMaterial( { color: 0xaaaaaa, side: THREE.DoubleSide} ));
    // copy is shallow copy... refer to source.
    objLabel.position.x = obj.position.x;
    objLabel.position.y = obj.position.y;
    objLabel.position.z = obj.position.z;

    objLabel.position.z += 10;
    // objLabel.rotation.y += Math.PI/2;
    objLabel.name = obj.name;
    objLabel.volume = obj.volume? obj.volume:10;
    objLabel.visible = true;
    // objLabel.castShadow = true;

    displayName = objLabel;
    objLabels.push(objLabel);
    ThreeShp.s.add(objLabel);
    if(obj.name) objsNum += 1;
  });
  console.log(objsNum + ' objs has Name');
}


var texture = new THREE.TextureLoader().load('img/grass.jpg');
/* texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(4, 4);*/

// load texture mapping to Mesh face.
/*function createPlane(xlen) {
  var plane = new THREE.Mesh(
    new THREE.PlaneGeometry(xlen, xlen),
    new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide
    })
  );
  return plane;
}*/

      
function drawAxes(scene) {
  // x-axis
  var xGeo = new THREE.Geometry();
  xGeo.vertices.push(new THREE.Vector3(0, 0, 0));
  xGeo.vertices.push(new THREE.Vector3(1, 0, 0));
  var xMat = new THREE.LineBasicMaterial({
      color: 0xff0000
  });
  // Line, Mesh...
  var xAxis = new THREE.Line(xGeo, xMat);
  scene.add(xAxis);
  
  // y-axis
  var yGeo = new THREE.Geometry();
  yGeo.vertices.push(new THREE.Vector3(0, 0, 0));
  yGeo.vertices.push(new THREE.Vector3(0, 1, 0));
  var yMat = new THREE.LineBasicMaterial({
      color: 0x00ff00
  });
  var yAxis = new THREE.Line(yGeo, yMat);
  scene.add(yAxis);
  
  // z-axis
  var zGeo = new THREE.Geometry();
  zGeo.vertices.push(new THREE.Vector3(0, 0, 0));
  zGeo.vertices.push(new THREE.Vector3(0, 0, 1));
  var zMat = new THREE.LineBasicMaterial({
      color: 0x00ccff
  });
  var zAxis = new THREE.Line(zGeo, zMat);
  scene.add(zAxis);
}