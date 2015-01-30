var controls;
var container;
var camera, scene, renderer;
var plane, cube;
var mouse, raycaster, isShiftDown = false;
var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;
var stats;
var objects = [];
var mouseposition;
var fov = 45;
var size = 500, step = 50;

init();
animate();

function init() {

	container = document.createElement('div');
	document.getElementById("ThreeJScontainer").appendChild(container);

	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms
	// align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';
	document.body.appendChild(stats.domElement);

	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(500, 800, 1300);
	camera.lookAt(new THREE.Vector3());

	controls = new THREE.OrbitControls(camera);
	controls.maxPolarAngle = Math.PI/2 * 85/90;
	scene = new THREE.Scene();
	mouseposition = new THREE.Vector2();

	// roll-over helpers
	rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
	rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
	rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
	scene.add(rollOverMesh);

	// cubes
	cubeGeo = new THREE.BoxGeometry(50, 50, 50);
	cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xFFD52D, specular: 0x009900, shininess: 30, shading: THREE.FlatShading } );
	cubeMaterial.ambient = cubeMaterial.color;

	// grid
	var geometry = new THREE.Geometry();

	for (var i = -size; i <= size; i += step) {
		geometry.vertices.push(new THREE.Vector3(-size, 0, i));
		geometry.vertices.push(new THREE.Vector3(size, 0, i));
		geometry.vertices.push(new THREE.Vector3(i, 0, -size));
		geometry.vertices.push(new THREE.Vector3(i, 0, size));
	}

	var material = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2, transparent: true});
	var line = new THREE.Line(geometry, material, THREE.LinePieces);
	scene.add(line);

	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
	geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

	plane = new THREE.Mesh(geometry);
	plane.visible = false;
	scene.add(plane);
	objects.push(plane);

	// Lights
	var ambientLight = new THREE.AmbientLight(0x606060);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight(0xffffff);
	directionalLight.position.set(1, 0.75, 0.5).normalize();
	scene.add(directionalLight);

	renderer = Detector.webgl ? new THREE.WebGLRenderer({antialias: true}) : new THREE.CanvasRenderer();
	renderer.setClearColor(0xc0c0c0);
	renderer.setPixelRatio(window.devicePixelRatio || 1);
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('mouseup', onDocumentMouseDown, false);
	document.addEventListener('keydown', onDocumentKeyDown, false);
	document.addEventListener('keyup', onDocumentKeyUp, false);
	document.addEventListener('mousedown', function (event) {
		mouseposition.x = event.x;
		mouseposition.y = event.y;
	});
	//
	window.addEventListener('resize', onWindowResize, false);
	console.log("We get here 6");
}
function onWindowResize(event) {
	console.log(window.innerWidth, window.innerHeight);
	console.log(event);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
function onDocumentMouseMove(event) {
	event.preventDefault();
	mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(objects);
	if (intersects.length > 0) {
		var intersect = intersects[0];
		rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
		//console.log(rollOverMesh);
		rollOverMesh.position.divideScalar(50);
		rollOverMesh.position.floor().multiplyScalar(50).addScalar(25);
	}
	//render();
}
function onDocumentMouseDown(event) {
	console.log(mouseposition, event);
	if (mouseposition.x != event.x || mouseposition.y != event.y) {
		return;
	}
	event.preventDefault();
	mouse.set(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1);
	raycaster.setFromCamera(mouse, camera);
	var intersects = raycaster.intersectObjects(objects);
	if (intersects.length > 0) {
		var intersect = intersects[0];
		// delete cube
		if (event.button == 2) {
			if (intersect.object != plane) {
				scene.remove(intersect.object);
				objects.splice(objects.indexOf(intersect.object), 1);
			}
			// create cube
		} else if (event.button == 0) {
				// Checks if cubes positon will be outside of the plane or higher then allowed.
				if( Math.round(intersect.point.z) < size
					&& Math.round(intersect.point.z) > (0 - size)
					&& Math.round(intersect.point.x) < size
					&& Math.round(intersect.point.x) > (0 - size)
					&& Math.round(intersect.point.y) < (step * (size / (step/2)))
				) {
					var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
					voxel.position.copy(intersect.point).add(intersect.face.normal);
					voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
					scene.add(voxel);
					objects.push(voxel);
				}

		}
		//render();
	}
}
function onDocumentKeyDown(event) {
	switch (event.keyCode) {
		case 16:
			isShiftDown = true;
			break;
	}
}
function onDocumentKeyUp(event) {
	switch (event.keyCode) {
		case 16:
			isShiftDown = false;
			break;
	}
}
function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}
function render() {
	// monitored code goes here
	renderer.render(scene, camera);
}
/*
function log(){
	console.log(arguments);
}*/