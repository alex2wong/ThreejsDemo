/* heightLoader.js
 * load z-value for Object3d- Geometry(x, y ,z) from height.png
 */

//var THREE = require('THREE');

var uvs = [];
var zArr = [];
var geometry = new THREE.Geometry();

function addVertice(geometry, x , y, z) {
    geometry.vertices.push(new THREE.Vector3(x, y, z));
    return geometry;
}

function addFace(geometry, verticesArr) {
    if (verticesArr instanceof Array && verticesArr.length === 3) {
        geometry.faces.push(new THREE.Face3());
    }
    return geometry;
}

/*
 * @param img: input height.png  type:
 * return THREE.Geometry()
*/
function loadHeight(img) {
    
}

