function CubeBuilder() {
	// DOM-element to place canvas
	var JQueryThreeContainer = $("#ThreeJScontainer");
	
	// private members
	var objects = [];
	
	// Size of base plane. Size of object is -500 to +500 in all directions.
	var size = 500;
	
	// Size of cubes
	var step = 50;
	
	// Used by event handlers
	var cubeGeo = new THREE.BoxGeometry(step, step, step);
	var cubeMaterial = createCubeMaterial();
	var raycaster = new THREE.Raycaster();
	var mouseposition = new THREE.Vector2();
	var mouse = new THREE.Vector2();
	
	// Used by createScene and event handlers
	var plane = createPlane();
	
	// Used when rendering the object
	var camera = createCamera();
	var renderer = createRenderer();
	var scene = createScene();
	
	
	
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
	
	// This method chould be used to create view cameras also
	function createCamera() {
		var camera = new THREE.PerspectiveCamera(45, JQueryThreeContainer.width() / JQueryThreeContainer.height(), 1, 10000);
		camera.position.set(500, 800, 1300);
		camera.lookAt(new THREE.Vector3());
		var controls = new THREE.OrbitControls(camera);
		controls.noPan = true;
		
		return camera;
	}
	
	// Detect if WebGL is supported. Else uses canvasRenderer
	function createRenderer() {
		var renderer = Detector.webgl ? new THREE.WebGLRenderer({ antialias : true }) : new THREE.CanvasRenderer();
		renderer.setClearColor(0xc0c0c0);
		renderer.setPixelRatio(window.devicePixelRatio || 1);
		// change window.innerWidth and window.inner.Height to #ThreeJScontainer.innerWidth and #ThreeJScontainer.innerHeight
		renderer.setSize(JQueryThreeContainer.width(), JQueryThreeContainer.height());
		
		return renderer;
	}
	
	// Creates color and texture of cubes.
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
	
	// The visible base grid
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
	
	// Invisible plane over grid
	function createPlane() {
		var geo = new THREE.PlaneBufferGeometry(1000, 1000);
		geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		var plane = new THREE.Mesh(geo);
		plane.visible = false;
		
		return plane;
	}
	
	// Creates lights nd shadows
	function createDirectionalLight() {
		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 0.75, 0.5).normalize();
		
		return directionalLight;
	}
	
	// Hanldes both mousedown and mouseup
	function onDocumentMouseTouch(event) {
		event.preventDefault();
		
		var elementOffsetX = JQueryThreeContainer.offset().left;
		var elementOffsetY = JQueryThreeContainer.offset().top;
		var elementWidth = JQueryThreeContainer.width();
		var elementHeight = JQueryThreeContainer.height();
		var eventElementPosition = getEventPositionInDiv(elementOffsetX, elementOffsetY, event.pageX, event.pageY);

		if (event.type === "mousedown") {
			// save mouse position
			mouseposition.x = eventElementPosition.x;
			mouseposition.y = eventElementPosition.y;
		} else if (event.type === "mouseup") {
			if (mouseposition.x != eventElementPosition.x || mouseposition.y != eventElementPosition.y) {
				// if mouse has moved since mousedown event
				return;
			} else {
				mouse.set((eventElementPosition.x / elementWidth ) * 2 - 1, -(eventElementPosition.y / elementHeight ) * 2 + 1);
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
	
	function getEventPositionInDiv(elementX, elementY, eventPageX, eventPageY) {
		var eventElementX = eventPageX - elementX;
		var eventElementY = eventPageY - elementY;
		
		return { x: eventElementX, y: eventElementY };
	}

	// Rerenders when size changes 
	function onWindowResize(event) {
		camera.aspect = JQueryThreeContainer.width() / JQueryThreeContainer.height();
		camera.updateProjectionMatrix();
		renderer.setSize(JQueryThreeContainer.width(), JQueryThreeContainer.height());
	}

	// Checks if cube can be added and adds cube
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

	// Checks is cube can be removed and removes cube
	function removeCube(intersect) {
		if (intersect.object != plane) {
			scene.remove(intersect.object);
			objects.splice(objects.indexOf(intersect.object), 1);
		}
	}
	
	// Called to render object
	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	
	// Constructor code. Adds eventhandlers and DOM-element
	$("#ThreeJScontainer").append(renderer.domElement);
	document.getElementById("ThreeJScontainer").addEventListener("mousedown", onDocumentMouseTouch);
	document.getElementById("ThreeJScontainer").addEventListener("mouseup", onDocumentMouseTouch);
	window.addEventListener("resize", onWindowResize);

	// Renders object
	render();
}