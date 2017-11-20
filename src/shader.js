function init() {
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("canv")
  });
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setClearColor(0xffffff);
  renderer.setSize(width, height);

  // 创建场景
  const scene = new THREE.Scene();

  // 原点
  const origin = new THREE.Vector3(0, 0, 0);

  // 创建照相机
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  camera.position.set(0, 0, 20);
  camera.lookAt(origin);
  scene.add(camera);

  // 创建光源
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(10, 10, 10);
  scene.add(light);

  // 创建基本材质的球体
  const baseSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 20, 20),
    new THREE.MeshBasicMaterial({
      color: 0xff0000
    })
  );
  // scene.add(baseSphere);

  var trackControl = new THREE.TrackballControls(camera, renderer.domElement);
  trackControl.minDistance = 10;
  trackControl.maxDistance = 200;



  var material = new THREE.ShaderMaterial({
    vertexShader: `
      // come from context and the Geometry vertex..
      uniform vec3 color;
      uniform vec3 light;

      varying vec3 vColor;
      varying vec3 vNormal;
      varying vec3 vLight;

      void main()
      {
        // pass the color settings to fs
        vColor = color;
        vNormal = normalize(normalMatrix * normal);

        vec4 viewLight = viewMatrix * vec4(light, 1.0);
        // get vec3 from vec4
        vLight = viewLight.xyz;

        // default params in webgl..receive vertex info from geometry.
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying vec3 vNormal;
      varying vec3 vLight;

      void main()
      {
        float diffuse = dot(normalize(vLight), vNormal);
        if (diffuse > 0.95) {
            diffuse = 1.0;
        }
        else if (diffuse > 0.6) {
            diffuse = 0.6;
        }
        else if (diffuse > 0.3) {
            diffuse = 0.4;
        }
        else {
            diffuse = 0.2;
        }
        gl_FragColor = vec4(vColor * diffuse, 1.0);
      }
    `,
    uniforms: {
      color: {   // 传入 vertexShader 的参数
        type: 'v3',
        value: new THREE.Color('#ff0000')
      },
      light: {
        type: 'v3',
        value: light.position // 光源位置
      }
    }
  });

  light.position.set(0, 10, 20);

  const hello = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 20),
      material
  );
  hello.position.set(0, 1, 0);
  scene.add(hello);

  function draw(){
    trackControl.update();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
  }
  draw();
}

init();
