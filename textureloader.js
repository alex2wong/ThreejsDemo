// instantiate a loader
var loader = new THREE.TextureLoader();
var scene = new THREE.Scene();

var renderer = new THREE.WebGLRenderer();
renderer.setSize(1024, 768);
document.body.appendChild(renderer.domElement);

var cam = new THREE.PerspectiveCamera(41, window.innerWidth / window.innerHeight, 1, 100000);
cam.position.set(34, -721, 277);
cam.lookAt(new THREE.Vector3(-34, -921, 0));
scene.add(cam);

var camHelper = new THREE.CameraHelper(cam);
scene.add(camHelper);

var trackControl = new THREE.TrackballControls(cam, renderer.domElement);
trackControl.minDistance = 10;
trackControl.maxDistance = 10000;

var planeGeom = new THREE.PlaneGeometry(40, 40);

// add init plane
var planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(40, 40),
                    new THREE.MeshBasicMaterial({color: 0x88eeff, side: THREE.DoubleSide}));
planeMesh.receiveShadow = true;
// scene.add(planeMesh);

cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
        new THREE.MeshLambertMaterial({color: 0x00ff00}));
cube.position.x = 2;
cube.castShadow = true;
// scene.add(cube);

// create BufferPlaneGeometry
var bufferWidth = 1023;
var bufferPlane = bufferPlaneGeom(bufferWidth, bufferWidth, bufferWidth, bufferWidth);

var ambientlight = new THREE.AmbientLight(0xffffff);
scene.add(ambientlight);

requestAnimationFrame(draw);

function draw() {
    trackControl.update();
    camHelper.update();
    renderer.render(scene, cam);
    requestAnimationFrame(draw);
}

// add material for bufferPlane and customBufferPlane.
function addTexture(texture) {    
    texture.mapping = THREE.CubeReflectionMapping;
    console.log('texture loaded. mapping type is : '+ texture.mapping);
    var material = new THREE.MeshLambertMaterial( {
        map: texture,
        side: THREE.DoubleSide
     } );

    wireMaterial = new THREE.MeshLambertMaterial({
        color: 0x88eeff,
        wireframe: true
    });
    var planeMesh = new THREE.Mesh(planeGeom, material);
    
    var customBufferPlane = customGeom(256, 256, 256);
    // console.log('bufferPlane has faces number: ' + customMesh.faces.length);
    var bufferPlaneMesh = new THREE.Mesh(bufferPlane, material);
    bufferPlaneMesh.position.set(0,0,10);
    scene.add(bufferPlaneMesh);
    // scene.add(new THREE.Mesh(customBufferPlane, wireMaterial));
    renderer.render(scene, cam);
}

function customObj3d() {
    var mesh = new THREE.Object3D();

    mesh.add( new THREE.LineSegments(

        new THREE.Geometry(),

        new THREE.LineBasicMaterial( {
            color: 0xffffff,
            transparent: true,
            opacity: 0.5
        } )

    ) );

    mesh.add( new THREE.Mesh(

        new THREE.Geometry(),

        new THREE.MeshPhongMaterial( {
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading
        } )

    ) );
    return mesh;
}
function bufferPlaneGeom(width, height, xseg, yseg) {
    var geometry = new THREE.PlaneBufferGeometry( width, height, xseg, yseg);
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide, wireframe: true} );
    var plane = new THREE.Mesh( geometry, material );
    plane.position.set(0, 0, -10);

    return geometry;
}

// set z-depth value for vertices in geometry
function attachHeight(geometry, data) {
    // return position vertices in geometry.
    var vertices = geometry.attributes.position.array;
    console.log('bufferGeom Position Array length: '+ vertices.length/3.0);
    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        if (!data[i]) {
            break;
        } else {
            // set z-depth value namely height
            vertices[ j-1 ] = data[i] * 0.1;
        }
    }
    console.log('height attach finished...');
    return geometry;
}

function generateHeight( width, height ) {

    var size = width * height, data = new Uint8Array( size ),
    perlin = new ImprovedNoise(), quality = 1, z = Math.random();

    for ( var j = 0; j < 4; j ++ ) {

        for ( var i = 0; i < size; i ++ ) {

            var x = i % width, y = ~~ ( i / width );
            data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );

        }

        quality *= 5;

    }
    console.log('return generateHeight data');
    return data;
}



// xlen means width of this geometry, interval means segment..
function customGeom(xlen, ylen, segment) {
    var startX = 0;
    var endX = startX + xlen;
    var startY = 0;
    var endY = startY + ylen;
    var inter = parseInt(xlen/segment);
    var geometry = new THREE.Geometry();
    for (let i = 0; i < xlen; i++) {        
        for (let k = 0; k < ylen; k++) {
            geometry.vertices.push(new THREE.Vector3(startX, startY + k * inter, Math.random()*0.5));
        }
        startX += inter;
    }

    var vertices = geometry.vertices;
    console.log('custom geometry, vertices number:' + vertices.length);
    for (let j = 0; j < vertices.length-segment-1; j++) {
        if ((j+1) % segment == 0 ) {
            continue;
        }
        // console.log('down Triangle: '+ j, j+1, (j+segment));
        // console.log('up Triangle: ' + (j+segment+1), j+1, (j+segment));
        geometry.faces.push(new THREE.Face3(j, j+segment, j+segment+1));
        geometry.faces.push(new THREE.Face3(j+segment+1, j+1, j));
    }
    // Face3 means a 3points- Patch consists vertice (index in vertices Arr)
    // geometry.faces.push(new THREE.Face3(0,1,2));
    // geometry.faces.push(new THREE.Face3(0,1,3));
    // geometry.faces.push(new THREE.Face3(0,2,3));
    // geometry.faces.push(new THREE.Face3(1,2,3));
    return geometry;
}

(function loadHeight() {
    /*var fileContain = document.getElementById('heightFile');*/
    var canvas = document.getElementById('height');
    var width = height = 1024;
    // Malloc memory for Array length with 1024*1024, storing uint8(0~255)
    var data = new Uint8Array(height*width);
    canvas.width = 1024;
    canvas.height = 1024;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    var img = new Image();
    img.onload = function() {
        context.drawImage(img, 0, 0);

        image = context.getImageData( 0, 0, width, height );
        imageData = image.data;
        console.log('image data length: '+ imageData.length);
        // get the band4 value from height source image.
        for (var i = 0, j = 0, l = imageData.length; i < l; j++, i+=4) {
            data[j] = imageData[i];
        }
        // attach height to bufferPlane geometry.
        attachHeight(bufferPlane, data);
        loadTexture();
    }
    img.src = 'img/height.png';
    return data;
})()


function loadTerrain(){
    var width = 256
    var geometry = Heightloader.loadHeight('img/9.428.213.png', width, width);

    scene.add(new THREE.Mesh(geometry, wireMaterial));
    renderer.render(scene, cam);
}

// load a resource
function loadTexture(){ 
    loader.load(
        // resource URL
        'img/1.jpg',
        // Function when resource is loaded
        addTexture,
        // Function called when download progresses
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // Function called when download errors
        function ( xhr ) {
            console.log( 'An error happened' );
        }
    );
}
