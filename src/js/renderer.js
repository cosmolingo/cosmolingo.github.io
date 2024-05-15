var mouse, INTERSECTED, intersects, clicked, scene, camera, renderer, raycaster, controls, canvas, matY, matB, matG, matT, objs;

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
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();
    renderer.setSize(700, 500);
    renderer.domElement.addEventListener("click", onclick, true);
    window.addEventListener('resize', onWindowResize, false);

    canvas = $('#location_renderer').append(renderer.domElement);
    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('click', onDocumentMouseUp, false);
    renderer.domElement.addEventListener("touchstart", onDocumentTouch, false);
    renderer.domElement.addEventListener("touchmove", onDocumentTouch, false);
    renderer.domElement.addEventListener("touchend", onDocumentMouseUp, false);
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
    objLoader.load('src/models/sceno2.obj', function(obj) {
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
    raycaster.setFromCamera(mouse, camera);
    canvas = $('#location_renderer canvas');
    if (scene.children.length == 2) {
        intersects = raycaster.intersectObjects(objs, true);
        if (intersects.length > 0) {
            if (INTERSECTED != intersects[0].object) {
                canvas.css('cursor','pointer');
                if (INTERSECTED && clicked != INTERSECTED){
                    INTERSECTED.material = INTERSECTED.currentHex;
                }
                INTERSECTED = intersects[0].object;
                if (INTERSECTED.currentHex != matG){
                    INTERSECTED.currentHex = INTERSECTED.material;
                }
                INTERSECTED.material = matG;
            }
        } else {
            if (INTERSECTED && clicked != INTERSECTED){
                INTERSECTED.material = INTERSECTED.currentHex;
            }
            INTERSECTED = null;
            canvas.css('cursor','grab');
        }
    }
    window.requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
}

function onDocumentTouch(event) {
    event.preventDefault();
    //event.offsetX = event.touches[0].pageX;
    //event.offsetY = event.touches[0].pageY - document.getElementById('location_renderer').offsetTop;
    mouse.x = (event.touches[0].pageX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.touches[0].pageY / renderer.domElement.clientHeight) * 2 + 1;
}

function onDocumentMouseUp(event) {
    event.preventDefault();
    for (var obj of objs) {
        if (obj != clicked) {
            obj.material = matY;
        }
    }
    if (intersects.length > 0 && intersects[0].object != clicked) {
        clicked = intersects[0].object;
        for (var obj of objs) {    
            if (obj != clicked) {
                obj.material = matY;
            }
        }
        clicked.material = matG;
    }
}