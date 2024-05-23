var mouse, INTERSECTED, intersects, clicked, scene, camera, renderer, raycaster, controls, canvas, matY, matB, matG, matT, objs, n_touches, Plane, target,
Ball, raycasterBall, ShadowBall, targetBall, simulate_physics = false,base_cam_pos;

function setup_renderer(){
    mouse = new THREE.Vector2();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(1, 7/5, 1, 10000);
    camera.position.set(0, 500, 400);
    base_cam_pos = camera.position.clone();
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
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
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
    Plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    target = new THREE.Vector3();

    Ball = new THREE.SphereGeometry(.3, 32, 32);
    Ball = new THREE.Mesh(Ball, matG);
    Ball.position.set(0, 5, 0);
    scene.add(Ball);

    ShadowBall = new THREE.SphereGeometry(.3, 32, 32);
    ShadowBall = new THREE.Mesh(ShadowBall, matB);
    ShadowBall.position.set(0, 5, 0);
    scene.add(ShadowBall);

    Ball = [Ball,new THREE.Vector3(0,0,0)];
    raycasterBall = new THREE.Raycaster();
    raycasterBall.near = .01;
    raycasterBall.far = .3;
    targetBall = new THREE.Vector3();

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

    var circle = new THREE.RingGeometry(.3,.35, 32);
    circle = new THREE.Mesh(circle, matB);
    circle.rotation.x = -Math.PI/2;
    scene.add(circle);
    objs.push(circle);

    var objLoader = new THREE.OBJLoader();
    objLoader.load('src/models/empty_cube.obj', function(obj) {
        obj.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.material = matY;
                child.position.y += 1.0;
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
    simulate_ball();
    window.requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

function simulate_ball(){
    if (!simulate_physics){
        return;
    }
    //SOUTH DIR
    var is_intersecting = false;
    raycasterBall.set(Ball[0].position, Ball[1],near=.01,far=.3);
    var intersect_objects = raycasterBall.intersectObjects(objs.slice(2));
    if (intersect_objects.length > 0){
        is_intersecting = true;
        Ball[1] = intersect_objects[0].face.normal.clone().multiplyScalar(Ball[1].length()*.6);
    }
    else{
        raycasterBall.ray.intersectPlane(Plane, targetBall);
        if (targetBall != null && Ball[0].position.distanceTo(targetBall) < .3){
            is_intersecting = true;
            Ball[1].y = Math.abs(Ball[1].y*.6);
        }
        else{
            Ball[1].y -= .01;
        }
    }
    Ball[0].position.set(Ball[0].position.x + Ball[1].x, Ball[0].position.y + Ball[1].y, Ball[0].position.z + Ball[1].z);
    Ball[1].multiplyScalar(.99);
    if (Ball[1].length() < .01 && is_intersecting){
        Ball[1] = new THREE.Vector3(0,0,0);
        simulate_physics = false;
    }
}

function raycast(){
    if (arguments.length == 0){
        raycaster.setFromCamera(mouse, camera);
    }
    else{
        raycaster.set(arguments[0], arguments[1]);
    }
    raycaster.ray.intersectPlane(Plane, target);
    var intersect_objects = raycaster.intersectObjects(objs.slice(2));
    if (intersect_objects.length > 0){
        if (intersect_objects[0].face.normal.y > 0.5){
            objs[0].position.set(intersect_objects[0].point.x, intersect_objects[0].point.y, intersect_objects[0].point.z);
            objs[1].position.set(intersect_objects[0].point.x, intersect_objects[0].point.y+.05, intersect_objects[0].point.z);
            ShadowBall.position.set(intersect_objects[0].point.x, intersect_objects[0].point.y + 5, intersect_objects[0].point.z);
        }
        else{
            var new_pt = new THREE.Vector3().addVectors(intersect_objects[0].point, intersect_objects[0].face.normal.clone().multiplyScalar(.05));
            raycast(new_pt, new THREE.Vector3(0,-1,0));
        }
    }
    else{
        objs[0].position.set(target.x, 0, target.z);
        objs[1].position.set(target.x, 0, target.z);
        ShadowBall.position.set(target.x, 5, target.z);
    }
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    base_cam_pos = camera.position.clone();
}

function onDocumentMouseUp(event) {
    event.preventDefault();
    if (base_cam_pos.distanceTo(camera.position) < 10){
        simulate_physics = true;
        Ball[1].y = -0.01;
        Ball[0].position.set(ShadowBall.position.x, ShadowBall.position.y, ShadowBall.position.z);
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    if (n_touches <= 1){
        mouse.x =  (event.offsetX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
        raycast();
    }
}

function onDocumentTouchMove(event) {
    event.preventDefault();
    event.offsetX = event.touches[0].pageX - document.getElementById('location_renderer').offsetLeft;
    event.offsetY = event.touches[0].pageY - document.getElementById('location_renderer').offsetTop;
    //setTouches(event);
    //onDocumentMouseMove(event);
}

function onDocumentTouchStart(event) {
    event.preventDefault();
    controls.enableRotate = false;
    event.offsetX = event.touches[0].pageX - document.getElementById('location_renderer').offsetLeft;
    event.offsetY = event.touches[0].pageY - document.getElementById('location_renderer').offsetTop;
    //onDocumentMouseMove(event);
    //n_touches = event.touches.length;
}

function onDocumentTouchEnd(event) {
    event.preventDefault();
    event.offsetX = event.touches[0].pageX - document.getElementById('location_renderer').offsetLeft;
    event.offsetY = event.touches[0].pageY - document.getElementById('location_renderer').offsetTop;
    mouse.x =  (event.offsetX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
    raycast();
    //setTouches(event);
    onDocumentMouseUp(event);
}

function setTouches(event){
    event.preventDefault();
    n_touches = event.touches.length;
    //$('.locations h2').text(n_touches);
    if (n_touches == 1){
        controls.enableRotate = false;
    }
    else{
        controls.enableRotate = true;
        //dispatchEvent(new Event('touchstart'));
    }
    controls.update();
}