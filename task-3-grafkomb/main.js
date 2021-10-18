let scene, camera, controls, renderer, light, cube, mouse, raycaster, CLICKED, CLICKEDcolor, INTERSECTED, intersects, colorRandom;
let colors = ["#506a36", "#ec6d2b", "#9b5cf3", "#7aea53", "#028d5c", "#3288e2", "#b41c41", "#bbc6a1", "#b4e9d6", "#ce3bcd", "#023283", "#e4ab69", "#c3b201", "#f32418"];
let objectsCount = 0, score = 0, time = 2000;
let sizes = {
    width: window.innerWidth - 100,
    height: window.innerHeight - 150,
};

function main() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x928987);

    camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 1, 1000);
    camera.position.x = 50;
    camera.position.z = 50;

    light = new THREE.AmbientLight(0xffffff);
    light.position.set(0, 0, 10);
    scene.add(light);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(sizes.width, sizes.height);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    renderer.render(scene, camera, controls);


    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('click', onClick, false);
    window.addEventListener('resize', onWindowResize);

    createObject();
    mainLoop();
};

function createObject() {
    console.log("masuk");
    if (objectsCount < 50) {
        colorRandom = new THREE.Color();
        colorRandom.setStyle(colors[Math.floor(Math.random() * colors.length)]);
        cube = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshStandardMaterial({
                color: colorRandom
            })
        );
        scene.add(cube);
        cube.position.x = (Math.random() * 40) - 20;
        cube.position.y = (Math.random() * 40) - 20;
        cube.position.z = (Math.random() * 40) - 20;

        objectsCount++;
        console.log(objectsCount);
        if (time) time -= 100;
        document.getElementById("object").innerHTML = objectsCount;
        console.log(time);
        setTimeout(createObject, time);
    } else {
        time = 5000;
    }
};

function onMouseMove(event) {
    mouse.x = (event.offsetX / sizes.width) * 2 - 1;
    mouse.y = -(event.offsetY / sizes.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xffffff);
        }
    } else {
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;
    }
};

function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length != 0) {
        if (CLICKED != null) {
            if (CLICKEDcolor == intersects[0].object.material.color.getHex() && CLICKED != intersects[0].object) {
                scene.remove(CLICKED);
                scene.remove(intersects[0].object);
                if (objectsCount == 50) setTimeout(createObject, time);
                objectsCount -= 2;
                score += 10;
                CLICKED = null;
                document.getElementById("color").style.background = 'black';
                document.getElementById("score").innerHTML = score;
                document.getElementById("object").innerHTML = objectsCount;
                console.log(objectsCount);
            } else {
                CLICKED.material.color.setHex(CLICKEDcolor);
                CLICKED = null;
                CLICKEDcolor = null;
                document.getElementById("color").style.background = 'black';
            }
        } else {
            document.getElementById("color").style.background = '#' + intersects[0].object.material.color.getHexString();
            CLICKED = intersects[0].object;
            CLICKEDcolor = CLICKED.material.color.getHex();
            CLICKED.material.color.setHex(0xffffff);

        }
    }
    console.log(CLICKED);
};

function onWindowResize() {
    sizes.width = window.innerWidth - 100;
    sizes.height = window.innerHeight - 150;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
};



function mainLoop() {
    renderer.render(scene, camera, controls);
    requestAnimationFrame(mainLoop);
};