// heightloader.js 
Heightloader = {
    // set z-depth value for vertices in PlaneBufferGeometry, return geometry
    attachHeight: function (geometry, data) {
        // return position vertices in geometry.
        
        var vertices = geometry.attributes.position.array;
        if (data instanceof Array && data.byteLength < 1) return;
        if (!Array.isArray(data)) return;

        console.log('bufferGeom Position Array length: '+ vertices.length/3.0, 
            "random fetch height from center of data: " + data[data.byteLength/2]);
        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
            if (!data[i]) {
                break;
            } else {
                // set z-depth value namely height
                vertices[ j-1 ] = data[i] * 0.1;
            }
        }
        console.log('height attach finished...');
        // return geometry;
    },

    // load height from image url. return geometry.
    loadHeight: function (url, width, height) {
        /*var fileContain = document.getElementById('heightFile');*/
        var geometry = new THREE.PlaneBufferGeometry(width, height, width, height);
        var canvas = document.createElement("canvas");
        canvas.style.display = "none";
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);

        // Malloc memory for Array length with 1024*1024, storing uint8(0~255)
        var data = new Uint8Array(height*width);
        context = canvas.getContext('2d');
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );

        var img = new Image();
        // add listener to load event.
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
            Heightloader.attachHeight(geometry, data);
            // loadTexture();
        }
        // get image from url, attach height and return geometry with height.
        img.src = url;
        return geometry;
    },

    // load height from Mapbox Terran data.
    // inTile contain ImageData Array from canvas context.
    tiledata: function (inTile) {
            var dataArray = new Float32Array(65536);
            for (var i=0;i<inTile.array.length/4;i++) {
                var tDataVal = -10000 + ((inTile.array[i * 4] * 256 * 256 + inTile.array[i * 4 + 1] * 256 + inTile.array[i * 4 + 2]) * 0.1);

                var alpha;

                if (tDataVal > color_filter) {
                    alpha = 0;
                } else {
                    alpha = 100;
                }
                inTile.array[i * 4] = 10;
                inTile.array[i*4+1] = 20;
                inTile.array[i*4+2] = 200;
                inTile.array[i*4+3] = alpha;

                dataArray[i] = tDataVal;
            }
            self.postMessage({
                'data':{
                    'tileUID':inTile.tileUID,
                    'array':inTile.array},
                    'type':'tiledata'},
                [inTile.array.buffer]
            );
            delete inTile.array;
            tileData[inTile.tileUID] = dataArray;
        }
}

