(function(outerWindow){
	"use strict";

outerWindow.BUILDER = outerWindow.BUILDER || {};
var BUILDER = outerWindow.BUILDER;

BUILDER.CubeBuilder = function() {
	var construction = new BUILDER.ConstructionArea($("#ThreeJScontainer"));

	//public members

	//perspective of view in menubar
	this.perspective = function(perspective) {
		//green, blue, top, yellow, red
	};

	//public functions

	//reset
	this.reset = function() {
	};

	//size of base plane - size: width of base
	this.setBaseSize = function(size) {
		return construction.setBaseSize(size);
	};

	// set color
	this.setColor = function(colorHex) {
		construction.setCubeMaterial(colorHex);
	};

	// set action for mouse up
	this.setMouseUpAction = function() {
	};

	//render all perspectives in menu
	this.renderPerspectives = function() {
		construction.renderPerspectives();
	};

	// Freeze model if popup menu is open
	this.enableOrDisableOrbit = function(setting) {
		construction.enableOrDisableOrbit(setting);
	};

	// Toggle buildMode Add/Remove
	this.toggleBuildMode = function() {
		construction.toggleBuildMode();// = construction.buildMode === true ? false : true;
	};

	// Save model to JSON string
	this.saveModel = function() {
		var jsonString = construction.saveModel();
		console.log(jsonString); // Temp
	};

	// Load model from JSON string
	this.loadModel = function(jsonString) {
		construction.loadModel(jsonString);
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
	    //foundation,
	    baseGrid,
	    basePlane,
	    controls,
	    views,
	    stats,
	    buildMode = true,
		self = this;

	// BuildMode Add or Remove cube
	//this.buildMode = true;
	this.toggleBuildMode = function(){
		buildMode = !buildMode;
	}
	function init() {// TODO - Make this public ?
		self.setCubeMaterial('#FED06F');

		stats = new Stats();
		stats.setMode(1); // 0: fps, 1: ms

		// align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';

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
		renderer = createRenderer(jQueryContainer, true);
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.noPan = true;

		jQueryContainer.append(renderer.domElement);
		jQueryContainer.on( "mousedown", onDocumentMouseTouch);
		jQueryContainer.on( "mouseup", onDocumentMouseTouch);
		window.addEventListener("resize", onWindowResize);
		document.body.appendChild( stats.domElement );

		createPerspectives();
		render();
	}

	function createPerspectives() {
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
						console.log(buildMode);
						// left mouse button adds cube if buildMode == true, removes if false
						buildMode ? addCube(intersect) : removeCube(intersect);
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
				views.forEach(function(element, index, array) {
					element.render();
				});
			}
		}
	}

	// Checks is cube can be removed and removes cube
	function removeCube(intersect) {
		if (intersect.object != basePlane) {
			scene.remove(intersect.object);
			objects.splice(objects.indexOf(intersect.object), 1);
			updateCounter();
			views.forEach(function(element, index, array) {
				element.render();
			});
		}
	}

	function createScene() {
		var scene = new THREE.Scene();
		//scene.add(foundation);
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

		renderer.setClearColor(0xE1F5FF);
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
		// create foundation
		//var geo = new THREE.PlaneBufferGeometry(baseSize * 2, baseSize * 2);
		//geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		//var m = new THREE.MeshBasicMaterial({
		//	color : 0xA0E0B9
		//});
		//var f = new THREE.Mesh(geo, m);
		//foundation = f;

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
		var gridOffset = 20;

		// green line
		var line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(baseSize + gridOffset, 0, baseSize));
		line.vertices.push(new THREE.Vector3(baseSize + gridOffset, 0, -baseSize));
		var material = new THREE.LineBasicMaterial({
			color : 0x009944
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// red line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(-(baseSize + gridOffset), 0, baseSize));
		line.vertices.push(new THREE.Vector3(-(baseSize + gridOffset), 0, -baseSize));
		material = new THREE.LineBasicMaterial({
			color : 0xE60012
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// blue line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(baseSize, 0, baseSize + gridOffset));
		line.vertices.push(new THREE.Vector3(-baseSize, 0, baseSize + gridOffset));
		material = new THREE.LineBasicMaterial({
			color : 0x0068B7
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// yellow line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(baseSize, 0, -(baseSize + gridOffset)));
		line.vertices.push(new THREE.Vector3(-baseSize, 0, -(baseSize + gridOffset)));
		material = new THREE.LineBasicMaterial({
			color : 0xF39800
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
		stats.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	};

	// set material for cube
	this.setCubeMaterial = function(colorHex) {
		cubeMaterial = new THREE.MeshLambertMaterial({
			color: colorHex,
			specular: 0x009900,
			shininess: 30,
			shading: THREE.FlatShading
		});
		cubeMaterial.ambient = cubeMaterial.color;

		/* OBS! This is code for testing purpose only. Do not use in applicatoin!!! */
		/* Remove before deploy! */

		this._cubeMaterial = cubeMaterial;

		/* End of testing code */
	};

	this.renderPerspectives = function() {
		views.forEach(function(element, index, array) {
            element.setSize();
            element.render();
        });
	};

	this.enableOrDisableOrbit = function(setting) {
		controls.enabled = setting;
	};

	// Save model to JSON
	this.saveModel = function() {
		function Cube(color, x, y, z) {
			this.color = color;
			this.x = x;
			this.y = y;
			this.z = z;
		}

		var model = {
			baseSize: objects[0].geometry.parameters.height / step,
			cubes: []
		};

		for(var i = 1; i < objects.length; i++) {
			model.cubes.push(
				new Cube(
					objects[i].material.color.getHexString(),
					objects[i].position.x,
					objects[i].position.y,
					objects[i].position.z
				)
			);
		}

		return JSON.stringify(model);
	};

	// Load model from JSON
	this.loadModel = function(jsonString) {
		var model;
		var voxel;
		var material;

		if(typeof jsonString === "object"){
			model = jsonString
		}else {
			model = JSON.parse(jsonString);
		}

		objects = [];
		baseSize = model.baseSize * (step / 2);

		setBase();
		scene = createScene();

		for(var i = 0, cubes = model.cubes.length; i < cubes; i++) {
			material = new THREE.MeshLambertMaterial({specular: 0x009900, shininess: 30, shading: THREE.FlatShading});	//Dependency
			material.color.setHex('0x' + model.cubes[i].color);
			material.ambient = material.color;

			voxel = new THREE.Mesh(cubeGeo, material);
			voxel.position.x = model.cubes[i].x;
			voxel.position.y = model.cubes[i].y;
			voxel.position.z = model.cubes[i].z;

			scene.add(voxel);
			objects.push(voxel);
		}

		updateCounter();

		views.forEach(function(element, index, array) {
			element.render();
		});
	};
	// Changes the size of the base and creates new scene
	this.setBaseSize = function(size) {
		if($.isNumeric(size) && size >= 2 && size <= 20) {
			baseSize = (step / 2) * size;
			objects = [];
			setBase();
			updateCounter();
			scene = createScene();

			return true;
		}

		return false;
	};

	init();

	/* OBS. For testing only! Do not use in application!!! */
	/* Remove before deploying */

	// members
	this._jQueryContainer = jQueryContainer;
	this._step = step;
	this._baseSize = baseSize;
	this._objects = objects;
	this._cubeGeo = cubeGeo;
	this._scene = scene;
	this._camera = camera;
	this._renderer = renderer;
	this._cubeMaterial = cubeMaterial;
	this._raycaster = raycaster;
	this._mouseposition = mouseposition;
	this._mouse = mouse;
	this._baseGrid = baseGrid;
	this._basePlane = basePlane;
	this._controls = controls;
	this._views = views;
	this._self = self;

	// functions
	this._init = init;
	this._onWindowResize = onWindowResize;
	this._onDocumentMouseTouch = onDocumentMouseTouch;
	this._addCube = addCube;
	this._removeCube = removeCube;
	this._setCubeMaterial = this.setCubeMaterial;
	this._createScene = createScene;
	this._createRenderer = createRenderer;
	this._createCamera = createCamera;
	this._setBase = setBase;
	this._createColorLines = createColorLines;
	this._createLights = createLights;
	this._updateCounter = updateCounter;
	this._render = render;
	this._renderPerspectives = this.renderPerspectives;
	this._enableOrDisableOrbit = this.enableOrDisableOrbit;

	/* End of testing code */
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
		JQueryElement.empty();
		JQueryElement.append(renderer.domElement);
	};
};

}(window))