var mouse, INTERSECTED, intersects, clicked, scene, camera, renderer, raycaster, controls, canvas, matY, matB, matG, matT, objs, n_touches;

function setup_renderer(){
    mouse = new THREE.Vector2();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(1, 7/5, 1, 10000);
    camera.position.set(0, 500, 400);
    camera.updateProjectionMatrix();
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    raycaster = new THREE.Raycaster();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.05;
    controls.enableZoom = false;
    controls.enableRotate = true;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();

    n_touches = 0;

    renderer.setSize(700, 500);
    renderer.domElement.addEventListener("click", onclick, true);
    window.addEventListener('resize', onWindowResize, false);

    canvas = $('#location_renderer').append(renderer.domElement);
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('click', onDocumentMouseUp, false);
    renderer.domElement.addEventListener("touchstart", onDocumentTouchStart, false);
    renderer.domElement.addEventListener("touchmove", onDocumentTouchMove, false);
    renderer.domElement.addEventListener("touchend", onDocumentTouchEnd, false);
    canvas.id = "render";

    matY = new THREE.MeshBasicMaterial({
        color: 'pink',
        side: THREE.DoubleSide
    });
    matB = new THREE.MeshBasicMaterial({
        color: 'black',
        side: THREE.DoubleSide
    });
    matG = new THREE.MeshBasicMaterial({
        color: 'cyan',
        side: THREE.DoubleSide
    });
    matT = new THREE.MeshBasicMaterial({
        color: 'cyan',
        side: THREE.DoubleSide,
        opacity: 0,
        transparent: true
    });
    objs = [];
    SpawnCar();
    render();
    onWindowResize();
}

function SpawnCar() {
    var line = new THREE.Geometry();
    line.vertices.push(new THREE.Vector3(0, 0, 0));
    line.vertices.push(new THREE.Vector3(0, 5, 0));
    line = new THREE.Line(line, matB);
    const material = new THREE.LineDashedMaterial( {
        color: 'rgb(0,0,0)',
        scale: 1,
        dashSize: .3,
        gapSize: .1,
    } );
    line.computeLineDistances();
    line.material = material;
    scene.add(line);
    objs.push(line);
    var objLoader = new THREE.OBJLoader();
    objLoader.load('src/models/empty_cube.obj', function(obj) {
        obj.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
            child.material = matY;
            objs.push(child);
            }
        });
        scene.add(obj);
    });
}

function onWindowResize() {
    if (window.innerWidth < 700/.9){
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth*.9, window.innerWidth*.9*5/7);
    }
    else{
        camera.updateProjectionMatrix();
        renderer.setSize(700, 500);
    }
}

function render() {
    window.requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

function raycast(){
    raycaster.setFromCamera(mouse, camera);
    canvas = $('#location_renderer canvas');
    var Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    var target = new THREE.Vector3();
    intersects = raycaster.ray.intersectPlane(Plane, target);
    objs[0].position.set(target.x, 0, target.z);
}

function onDocumentMouseUp(event) {
    event.preventDefault();
    raycast();
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    if (n_touches == 1){
        mouse.x =  (event.offsetX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
        raycast();
    }
}

function onDocumentTouchMove(event) {
    event.preventDefault();
    event.offsetX = event.touches[0].pageX - document.getElementById('location_renderer').offsetLeft;
    event.offsetY = event.touches[0].pageY - document.getElementById('location_renderer').offsetTop;
    setTouches(event);
    onDocumentMouseMove(event);
}

function onDocumentTouchStart(event) {
    event.preventDefault();
    event.offsetX = event.touches[0].pageX - document.getElementById('location_renderer').offsetLeft;
    event.offsetY = event.touches[0].pageY - document.getElementById('location_renderer').offsetTop;
    onDocumentMouseMove(event);
    n_touches = event.touches.length;
}

function onDocumentTouchEnd(event) {
    event.preventDefault();
    setTouches(event);
}

function setTouches(event){
    event.preventDefault();
    $('.locations h2').text(event.touches.length);
    if (n_touches == 1){
        controls.enableRotate = false;
    }
    else{
        controls.enableRotate = true;
        //dispatchEvent(new Event('touchstart'));
    }
    controls.update();
}