function CubeBuilder() {
	// private members
	var objects = [];
	var size = 500;
	var step = 50;
	var mouseposition = new THREE.Vector2();
	var mouse = new THREE.Vector2();
	
	var camera = createCamera();
	var cubeGeo = new THREE.BoxGeometry(step, step, step);
	var cubeMaterial = createCubeMaterial();
	var renderer = createRenderer();
	var raycaster = new THREE.Raycaster();
	var scene = createScene();
	var plane = createPlane();
	
	// private functions
	function createScene() {
		var scene = new THREE.Scene();

		scene.add(createGrid());

		scene.add(plane);
		objects.push(plane);

		scene.add(new THREE.AmbientLight(0x606060));
		scene.add(createDirectionalLight());

		return scene;
	}	
	
	function createCamera() {
		var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.set(500, 800, 1300);
		camera.lookAt(new THREE.Vector3());
		controls = new THREE.OrbitControls(camera);
		controls.noPan = true;
		
		return camera;
	}
	
	function createRenderer() {
		var renderer = Detector.webgl ? new THREE.WebGLRenderer({ antialias : true }) : new THREE.CanvasRenderer();
		renderer.setClearColor(0xc0c0c0);
		renderer.setPixelRatio(window.devicePixelRatio || 1);
		renderer.setSize(window.innerWidth, window.innerHeight);
		
		return renderer;
	}
	
	function createCubeMaterial() {
		var cubeMaterial = new THREE.MeshLambertMaterial({
			color : 0xFFD52D,
			specular : 0x009900,
			shininess : 30,
			shading : THREE.FlatShading
		});
		cubeMaterial.ambient = cubeMaterial.color;
		
		return cubeMaterial;
	}
	
	function createGrid() {
		var grid = new THREE.Geometry();

		for (var i = -size; i <= size; i += step) {
			grid.vertices.push(new THREE.Vector3(-size, 0, i));
			grid.vertices.push(new THREE.Vector3(size, 0, i));
			grid.vertices.push(new THREE.Vector3(i, 0, -size));
			grid.vertices.push(new THREE.Vector3(i, 0, size));
		}
		
		var material = new THREE.LineBasicMaterial({
			color : 0x000000,
			opacity : 0.2,
			transparent : true
		});
		
		return new THREE.Line(grid, material, THREE.LinePieces);
	}
	
	function createPlane() {
		var geo = new THREE.PlaneBufferGeometry(1000, 1000);
		geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		var plane = new THREE.Mesh(geo);
		plane.visible = false;
		
		return plane;
	}
	
	function createDirectionalLight() {
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 0.75, 0.5).normalize();
		
		return directionalLight;
	}
	
	function onDocumentMouseTouch(event) {
		event.preventDefault();

		if (event.type === "mousedown") {
			// save mouse position
			mouseposition.x = event.clientX;
			mouseposition.y = event.clientY;
		} else if (event.type === "mouseup") {
			
			if (mouseposition.x != event.clientX || mouseposition.y != event.clientY) {
				// if mouse has moved since mousedown event
				return;
			} else {
				mouse.set((event.clientX / window.innerWidth ) * 2 - 1, -(event.clientY / window.innerHeight ) * 2 + 1);
				raycaster.setFromCamera(mouse, camera);
				var intersects = raycaster.intersectObjects(objects);

				if (intersects.length > 0) {
					// if click was inside 3D object
					var intersect = intersects[0];
					switch(event.button) {
					case 0:
						// left mouse button adds cube
						addCube(intersect);
						break;
					case 2:
					 	// right mouse button removes cube
						removeCube(intersect);
						break;
					}
				}
			}
		}
	}

	function onWindowResize(event) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function addCube(intersect) {
		// Checks if cubes positon will be outside of the plane or higher then allowed.
		if (Math.round(intersect.point.z) < size && Math.round(intersect.point.z) > (0 - size) && Math.round(intersect.point.x) < size && Math.round(intersect.point.x) > (0 - size) && Math.round(intersect.point.y) < (step * (size / (step / 2)))) {
			var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
			voxel.position.copy(intersect.point).add(intersect.face.normal);
			voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
			scene.add(voxel);
			objects.push(voxel);
		}
	}

	function removeCube(intersect) {
		if (intersect.object != plane) {
			scene.remove(intersect.object);
			objects.splice(objects.indexOf(intersect.object), 1);
		}
	}
	
	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	
	// constructor code
	$("#ThreeJScontainer").append(renderer.domElement);

	document.getElementById("ThreeJScontainer").addEventListener("mousedown", onDocumentMouseTouch);
	document.getElementById("ThreeJScontainer").addEventListener("mouseup", onDocumentMouseTouch);
	window.addEventListener("resize", onWindowResize);
	
	//console.log(camera);
	//console.log(renderer);
	//console.log(raycaster);
	//console.log(scene);
	
	render();
}