var mouse, INTERSECTED, intersects, clicked, scene, camera, renderer, raycaster, controls, canvas, matY, matB, matG, matT, c3, objs;
function setup_renderer(){
    mouse = new THREE.Vector2();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(1, 7/5, 1, 10000);
    camera.position.set(0, 500, 700);
    camera.aspect = window.innerWidth / window.innerHeight;
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
    controls.dampingFactor = 0.2;
    controls.rotateSpeed = 0.2;
    controls.enableZoom = true;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2;
    controls.update();
    renderer.setPixelRatio(7/5);
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
    c3 = null;
    objs = [];
    SpawnCar();
    render();
}

function SpawnCar() {
    var objLoader = new THREE.OBJLoader();
    objLoader.load('src/models/sceno1.obj', function(obj) {
    obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
        child.material = matB;
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
    objLoader.load('src/models/text.obj', function(obj) {
    obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
        child.geometry.rotateX(Math.PI / 2);
        child.geometry.center();
        child.material = matT;
        scene.add(child);
        c3 = child;
        }
    });
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function render() {
    if (c3 != null) {
    c3.quaternion.copy(camera.quaternion);
    }
    raycaster.setFromCamera(mouse, camera);
    canvas = $('#location_renderer canvas');
    if (scene.children.length == 3) {
    intersects = raycaster.intersectObjects(objs, true);
    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
        canvas.css('cursor','pointer');
        if (INTERSECTED && clicked != INTERSECTED) INTERSECTED.material = INTERSECTED.currentHex;
        INTERSECTED = intersects[0].object;
        if (INTERSECTED.currentHex != matG) INTERSECTED.currentHex = INTERSECTED.material;
        INTERSECTED.material = matG;
        }
    } else {
        if (INTERSECTED && clicked != INTERSECTED) INTERSECTED.material = INTERSECTED.currentHex;
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
    event.offsetX = event.touches[0].pageX;
    event.offsetY = event.touches[0].pageY - document.getElementById('rendercontainer').offsetTop;
    mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;
}

function onDocumentMouseUp(event) {
    event.preventDefault();
    for (var obj in objs) {
    obj = objs[obj];
    if (obj != clicked) {
        if (obj.parent.materialLibraries[0] == 'sceno1.mtl') { // A CHANGER
        obj.material = matB;
        } else {
        obj.material = matY;
        }
    }
    }
    if (intersects.length > 0) {
    if (intersects[0].object != clicked) {
        clicked = intersects[0].object;
        for (var obj in objs) {
        obj = objs[obj];
        if (obj != clicked) {
            if (obj.parent.materialLibraries[0] == 'sceno1.mtl') { // A CHANGER
            obj.material = matB;
            } else {
            obj.material = matY;
            }
        }
        }
        clicked.material = matG;
        c3.position.set(clicked.geometry.boundingSphere.center.x, clicked.geometry.boundingSphere.center.y + .5, clicked.geometry.boundingSphere.center.z);
        c3.material.opacity = 1;
        c3.material.transparent = false;
    } else {
        console.log('rentrer');
    }
    }
}