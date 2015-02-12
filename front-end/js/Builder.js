"use strict";

var BUILDER = BUILDER || {};

BUILDER.CubeBuilder = function() {

	//public members

	//perspective of view in menubar
	//this.perspective = function() {};

	//public functions

	//reset
	this.reset = function() {
	};

	//size of base plane
	this.setBaseSize = function() {
		// är det delbart med step/2?
	};

	// set color
	this.setColor = function() {
	};

	// set action for mouse up
	this.setMouseUpAction = function() {
	};

	var construction = new BUILDER.ConstructionArea($("#ThreeJScontainer"));

	//render all perspectives in menu
	this.renderPerspectives = function(element) {
		construction.renderPerspectives(element);
	};

	// Freeze model if popup menu is open
	this.enableOrDisableOrbit = function() {
		construction.enableOrDisableOrbit();
	};
};

BUILDER.ConstructionArea = function(jQueryContainer) {
	var step,
	    baseSize,
	    objects,
	    cubeGeo,
	    scene,
	    camera,
	    renderer,
	    cubeMaterial,
	    raycaster,
	    mouseposition,
	    mouse,
	    baseGrid,
	    basePlane,
	    controls,
	    views,
		self = this;

	function init() {// TODO - Make this public ?
		self.setCubeMaterial('FFD52D');

		step = 50;
		objects = [];
		views = [];
		cubeGeo = new THREE.BoxGeometry(step, step, step);

		raycaster = new THREE.Raycaster();
		mouseposition = new THREE.Vector2();
		mouse = new THREE.Vector2();

		baseSize = 500;
		//( step/2 ) * antal block i bredd
		setBase();

		scene = createScene();
		camera = createCamera();
		controls = new THREE.OrbitControls(camera);
		controls.noPan = true;
		renderer = createRenderer(jQueryContainer, true);

		jQueryContainer.append(renderer.domElement);
		jQueryContainer.on( "mousedown", onDocumentMouseTouch);
		jQueryContainer.on( "mouseup", onDocumentMouseTouch);
		window.addEventListener("resize", onWindowResize);

		render();
	}

	// Rerenders when size changes
	function onWindowResize(event) {
		camera.aspect = jQueryContainer.width() / jQueryContainer.height();
		camera.updateProjectionMatrix();

		views.forEach(function(element, index, array) {
			element.setSize();
		});

		renderer.setSize(jQueryContainer.width(), jQueryContainer.height());
	}

	// Hanldes both mousedown and mouseup
	function onDocumentMouseTouch(event) {
		event.preventDefault();
		//FUNGERAR INTE

		var targetPosition = {
			x : event.pageX - jQueryContainer.offset().left,
			y : event.pageY - jQueryContainer.offset().top
		};

		if (event.type === "mousedown") {
			// save mouse position
			mouseposition.x = targetPosition.x;
			mouseposition.y = targetPosition.y;
		} else if (event.type === "mouseup") {
			if (mouseposition.x != targetPosition.x || mouseposition.y != targetPosition.y) {
				// if mouse has moved since mousedown event
				return;
			} else {
				mouse.set((targetPosition.x / jQueryContainer.width() ) * 2 - 1, -(targetPosition.y / jQueryContainer.height() ) * 2 + 1);
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

	// Checks if cube can be added and adds cube
	function addCube(intersect) {
		// Checks if cubes positon will be outside of the plane or higher then allowed.
		if (
			Math.round(intersect.point.z) < baseSize
			&& Math.round(intersect.point.z) > (0 - baseSize)
			&& Math.round(intersect.point.x) < baseSize
			&& Math.round(intersect.point.x) > (0 - baseSize)
			&& Math.round(intersect.point.y) < (step * (baseSize / (step / 2)))
		) {
			var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
			voxel.position.copy(intersect.point).add(intersect.face.normal);
			voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
			if(voxel.position.y > 0) {
				scene.add(voxel);
				objects.push(voxel);
				updateCounter();
			}
		}
	}

	// Checks is cube can be removed and removes cube
	function removeCube(intersect) {
		if (intersect.object != basePlane) {
			scene.remove(intersect.object);
			objects.splice(objects.indexOf(intersect.object), 1);
			updateCounter();
		}
	}

	// set material for cube
	this.setCubeMaterial = function(colorHex) {
		cubeMaterial = new THREE.MeshLambertMaterial({
			color : parseInt(colorHex, 16),
			specular : 0x009900,
			shininess : 30,
			shading : THREE.FlatShading
		});
		cubeMaterial.ambient = cubeMaterial.color;
	};

	function createScene() {
		var scene = new THREE.Scene();
		scene.add(baseGrid);
		scene.add(basePlane);

		createColorLines().forEach(function(element, index, array) {
			scene.add(element);
		});

		createLights().forEach(function(element, index, array) {
			scene.add(element);
		});

		return scene;
	};

	function createRenderer(JQueryElement, checkWebGL) {
		checkWebGL = checkWebGL || false;
		var renderer;

		if (checkWebGL) {
			renderer = Detector.webgl ? new THREE.WebGLRenderer({
				antialias : true
			}) : new THREE.CanvasRenderer();
		} else {
			renderer = new THREE.CanvasRenderer();
		}

		renderer.setClearColor(0xc0c0c0);
		renderer.setPixelRatio(window.devicePixelRatio || 1);
		renderer.setSize(JQueryElement.width(), JQueryElement.height());
		return renderer;
	};

	function createCamera() {
		var camera = new THREE.PerspectiveCamera(45, jQueryContainer.width() / jQueryContainer.height(), 1, 10000);
		camera.position.set(500, 800, 1300);
		camera.lookAt(new THREE.Vector3());

		return camera;
	};

	function setBase() {
		//create grid
		var grid = new THREE.Geometry();

		for (var i = -baseSize; i <= baseSize; i += step) {
			grid.vertices.push(new THREE.Vector3(-baseSize, 0, i));
			grid.vertices.push(new THREE.Vector3(baseSize, 0, i));
			grid.vertices.push(new THREE.Vector3(i, 0, -baseSize));
			grid.vertices.push(new THREE.Vector3(i, 0, baseSize));
		}

		var material = new THREE.LineBasicMaterial({
			color : 0x000000,
			opacity : 0.2,
			transparent : true
		});

		baseGrid = new THREE.Line(grid, material, THREE.LinePieces);

		// create plane
		var geo = new THREE.PlaneBufferGeometry(baseSize * 2, baseSize * 2);
		geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		var plane = new THREE.Mesh(geo);
		plane.visible = false;

		objects[0] = plane;
		basePlane = plane;
	};

	function createColorLines() {
		var lines = [];

		// green line
		var line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(520, 0, 500));
		line.vertices.push(new THREE.Vector3(520, 0, -500));
		var material = new THREE.LineBasicMaterial({
			color : 0x00ff00
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// red line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(-520, 0, 500));
		line.vertices.push(new THREE.Vector3(-520, 0, -500));
		material = new THREE.LineBasicMaterial({
			color : 0xff0000
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// blue line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(500, 0, 520));
		line.vertices.push(new THREE.Vector3(-500, 0, 520));
		material = new THREE.LineBasicMaterial({
			color : 0x0000ff
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// yellow line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(500, 0, -520));
		line.vertices.push(new THREE.Vector3(-500, 0, -520));
		material = new THREE.LineBasicMaterial({
			color : 0xffff00
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		return lines;
	};

	// Creates lights and shadows
	function createLights() {
		var lights = [];
		lights.push(new THREE.AmbientLight(0x606060));

		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 0.75, 0.5).normalize();

		lights.push(directionalLight);
		return lights;
	};

	//Updates counter if there's a counter element.
	function updateCounter() {
		var count = objects.length == 1 ? "0" : objects.length - 1;
		var counter = $("#counter");
		if (counter.length) {
			counter.text(count);
		}
	}

	// Called to render object
	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);

		views.forEach(function(element, index, array) {
			element.render();
		});
	};

	this.renderPerspectives = function() {
		var topView = $("#topView");
		var blueView = $("#blueView");
		var redView = $("#redView");
		var yellowView = $("#yellowView");
		var greenView = $("#greenView");

		// creating the top-view
		var aspectRatio = topView.width() / topView.height();
		var viewSize = 1200;
		var cam = new THREE.OrthographicCamera(-aspectRatio * viewSize / 2, aspectRatio * viewSize / 2, -viewSize / 2, viewSize / 2);
		cam.position.set(0, 500, 0);
		cam.lookAt(new THREE.Vector3());
		var ren = createRenderer(topView);
		views.push(new BUILDER.View(ren, cam, topView, scene));

		// creating the blue-view
		cam = new THREE.OrthographicCamera(aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2);
		cam.position.set(0, 500, -500);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(blueView);
		views.push(new BUILDER.View(ren, cam, blueView, scene));

		// creating the red-view
		cam = new THREE.OrthographicCamera(aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2);
		cam.position.set(500, 500, 0);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(redView);
		views.push(new BUILDER.View(ren, cam, redView, scene));

		// creating the yellow-view
		cam = new THREE.OrthographicCamera(aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2);
		cam.position.set(0, 500, 500);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(yellowView);
		views.push(new BUILDER.View(ren, cam, yellowView, scene));

		// creating the green-view
		cam = new THREE.OrthographicCamera(aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2);
		cam.position.set(-500, 500, 0);
		cam.lookAt(new THREE.Vector3(0, 500, 0));
		ren = createRenderer(greenView);
		views.push(new BUILDER.View(ren, cam, greenView, scene));

		views.forEach(function(element, index, array) {
			element.init();
		});
	};

	this.enableOrDisableOrbit = function() {

		if (controls.enabled)
			controls.enabled = false;
		else
			controls.enabled = true;
	};

	init();
};

BUILDER.View = function(renderer, camera, JQueryElement, scene) {
	this.render = function() {
		renderer.render(scene, camera);
	};

	this.setSize = function() {
		var viewSite = 1200;
		var aspectRation = JQueryElement.width() / JQueryElement.height();
		renderer.setSize(JQueryElement.width(), JQueryElement.height());

		camera.left = aspectRation * viewSite / 2;
		camera.right = -aspectRation * viewSite / 2;
		camera.top = viewSite / 2;
		camera.bottom = -viewSite / 2;
		camera.updateProjectionMatrix();
	};

	this.init = function() {
		JQueryElement.append(renderer.domElement);
	};
};
