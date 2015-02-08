"use strict";

var BUILDER = BUILDER || {};

BUILDER.CubeBuilder = function() {
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
	var camera = createCamera();
	var renderer = createRenderer(JQueryThreeContainer);
	var scene = createScene();
	
	//Used by init (orbitControl)
	var controls;
	var views = [];
	
	// private functions
	function createScene() {
		var scene = new THREE.Scene();
		scene.add(createGrid());
		
		var lines = createColorLines();
		lines.forEach(function(element, index, array) {
			scene.add(element);
		});
		
		scene.add(plane);
		objects.push(plane);
		scene.add(new THREE.AmbientLight(0x606060));
		//scene.add(());

		return scene;
	}	
	
	// This method chould be used to create view cameras also
	function createCamera() {
		var camera = new THREE.PerspectiveCamera(45, JQueryThreeContainer.width() / JQueryThreeContainer.height(), 1, 10000);
		camera.position.set(500, 800, 1300);
		camera.lookAt(new THREE.Vector3()); 
		return camera;
	}
	
	// Detect if WebGL is supported. Else uses canvasRenderer
	function createRenderer(JQueryElement) {
		//var renderer = Detector.webgl ? new THREE.WebGLRenderer({ antialias : true }) : new THREE.CanvasRenderer();
		var renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0xc0c0c0);
		renderer.setPixelRatio(window.devicePixelRatio || 1);
		renderer.setSize(JQueryElement.width(), JQueryElement.height());
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
	
	function createColorLines() {
		var lines = [];
		
		// green line
		var line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(520, 0, 500));
		line.vertices.push(new THREE.Vector3(520, 0, -500));
		var material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
		lines.push( new THREE.Line(line, material, THREE.LinePieces));
		
		// red line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(-520, 0, 500));
		line.vertices.push(new THREE.Vector3(-520, 0, -500));
		material = new THREE.LineBasicMaterial({ color: 0xff0000 });
		lines.push( new THREE.Line(line, material, THREE.LinePieces));
		
		// blue line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(500, 0, 520));
		line.vertices.push(new THREE.Vector3(-500, 0, 520));
		material = new THREE.LineBasicMaterial({ color: 0x0000ff });
		lines.push( new THREE.Line(line, material, THREE.LinePieces));
		
		// yellow line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(500, 0, -520));
		line.vertices.push(new THREE.Vector3(-500, 0, -520));
		material = new THREE.LineBasicMaterial({ color: 0xffff00 });
		lines.push( new THREE.Line(line, material, THREE.LinePieces));
		
		return lines;
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
		
		views.forEach(function(element, index, array) {
			element.setSize();
		});
		
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
			updateCounter();
		}
	}

	// Checks is cube can be removed and removes cube
	function removeCube(intersect) {
		if (intersect.object != plane) {
			scene.remove(intersect.object);
			objects.splice(objects.indexOf(intersect.object), 1);
			updateCounter();
		}
	}
	
	// Called to render object
	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		
		views.forEach(function(element, index, array) {
			element.render();
		});
		
	}

	function updateCounter() {
		var count = objects.length == 1 ? "0" : objects.length - 1;
		var counter = $("#counter");
		counter.text(count);
	}
	
	// public functions
	
	this.enableOrDisableOrbit = function() {
		
		if (controls.enabled) 		
			controls.enabled = false;
		else
			controls.enabled = true;
	},
	
	this.renderPerspective = function(element) {
	
		// creating view
		var viewSize = 1200;
		var aspectRatio = element.width() / element.height();
		var cam = new THREE.OrthographicCamera( -aspectRatio * viewSize / 2, aspectRatio * viewSize / 2, -viewSize / 2, viewSize / 2 );
		cam.position.set(0, 500, 0);
		cam.lookAt(new THREE.Vector3());
		var ren = createRenderer(element);
		views.push(new BUILDER.View(ren, cam, element, scene));
	
		views.forEach(function(element, index, array) {
			console.log(element.id);
			element.init();
		});
	},
	
	this.init = function() {
		// rendering the model
		JQueryThreeContainer.append(renderer.domElement);
		
		//Creating orbit controller
		controls = new THREE.OrbitControls(camera);
		controls.noPan = true;
		
		/*// creating the top-view
		var element = $("#top-view");
		console.log(element);
		var viewSize = 1200;
		var aspectRatio = element.width() / element.height();
		var cam = new THREE.OrthographicCamera( -aspectRatio * viewSize / 2, aspectRatio * viewSize / 2, -viewSize / 2, viewSize / 2 );
		cam.position.set(0, 500, 0);
		cam.lookAt(new THREE.Vector3());
		var ren = createRenderer(element);
		views.push(new BUILDER.View(ren, cam, element, scene));*/
		
		/*
		// creating the blue-view
		element = $("#blue-view");
		viewSize = 1200;
		aspectRatio = element.width() / element.height();
		cam = new THREE.OrthographicCamera( aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2 );
		cam.position.set(0, 500, -500);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(element);
		views.push(new BUILDER.View(ren, cam, element, scene));
		
		// creating the red-view
		element = $("#red-view");
		viewSize = 1200;
		aspectRatio = element.width() / element.height();
		cam = new THREE.OrthographicCamera( aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2 );
		cam.position.set(500, 500, 0);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(element);
		views.push(new BUILDER.View(ren, cam, element, scene));
		
		// creating the yellow-view
		element = $("#yellow-view");
		viewSize = 1200;
		aspectRatio = element.width() / element.height();
		cam = new THREE.OrthographicCamera( aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2 );
		cam.position.set(0, 500, 500);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(element);
		views.push(new BUILDER.View(ren, cam, element, scene));
		
		// creating the green-view
		element = $("#green-view");
		viewSize = 1200;
		aspectRatio = element.width() / element.height();
		cam = new THREE.OrthographicCamera( aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2 );
		cam.position.set(-500, 500, 0);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(element);
		views.push(new BUILDER.View(ren, cam, element, scene));
		*/
		document.getElementById("ThreeJScontainer").addEventListener("mousedown", onDocumentMouseTouch);
		document.getElementById("ThreeJScontainer").addEventListener("mouseup", onDocumentMouseTouch);
		window.addEventListener("resize", onWindowResize);
	
	/*	views.forEach(function(element, index, array) {
			console.log(element.id);
			element.init();
	}); */
		updateCounter();
		render();
	};
};

BUILDER.View = function(renderer, camera, JQueryElement, scene) {
	this.render = function() {
		renderer.render(scene, camera);
	};
	
	this.setSize = function() {
		renderer.setSize(JQueryElement.width(), JQueryElement.height());
	};
	
	this.init = function() {
		JQueryElement.append(renderer.domElement);
	};
};
