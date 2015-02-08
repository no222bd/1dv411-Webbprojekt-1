"use strict";

var BUILDER = BUILDER || {};

BUILDER.CubeBuilder = function() {

	//public members

	//perspective of view in menubar
	this.perspective

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

};

BUILDER.ConstructionArea = function(jQueryContainer) {

	//private members

	// Size of cubes
	var step = 50;

	//size of base plane
	var baseSize;

	var objects = [];

	var cubeGeo = new THREE.BoxGeometry(step, step, step);

	// material for cube
	var cubeMaterial;

	// set material for cube
	this.setCubeMaterial = function(colorHex) {
	};

	//mouse
	//this.mouseUpAction

	var raycaster = new THREE.Raycaster();
	var mouseposition = new THREE.Vector2();
	var mouse = new THREE.Vector2();

	// base and plane
	var baseGrid;
	var basePlane;

	var camera = createCamera();
	var renderer = createRenderer();
	var scene = createScene();

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
	
	function createRenderer() {
		var renderer = Detector.webgl ? new THREE.WebGLRenderer({ antialias : true }) : new THREE.CanvasRenderer();
		//var renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0xc0c0c0);
		renderer.setPixelRatio(window.devicePixelRatio || 1);
		renderer.setSize(jQueryContainer.width(), jQueryContainer.height());
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

		baseGrid = grid;

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

		var line = new THREE.Geometry();

		var material = new THREE.LineBasicMaterial();

		// green line
		line.vertices.push(new THREE.Vector3(520, 0, 500));
		line.vertices.push(new THREE.Vector3(520, 0, -500));
		material.color = 0x00ff00;
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// red line
		line.vertices = [];
		line.vertices.push(new THREE.Vector3(-520, 0, 500));
		line.vertices.push(new THREE.Vector3(-520, 0, -500));
		material = new THREE.LineBasicMaterial({
			color : 0xff0000
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// blue line
		line.vertices = [];
		line.vertices.push(new THREE.Vector3(500, 0, 520));
		line.vertices.push(new THREE.Vector3(-500, 0, 520));
		material.color = 0x0000ff;
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// yellow line
		line.vertices = [];
		line.vertices.push(new THREE.Vector3(500, 0, -520));
		line.vertices.push(new THREE.Vector3(-500, 0, -520));
		material.color = 0xffff00;
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		return lines;

	};

	// Creates lights and shadows
	function createLights() {
		var lights = [];

		lights.push(THREE.AmbientLight(0x606060));

		var directionalLight = new THREE.DirectionalLight(0xffffff);

		directionalLight.position.set(1, 0.75, 0.5).normalize();

		lights.push(directionalLight);

		return lights;
	};
	
	// Called to render object
	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		
	/*	views.forEach(function(element, index, array) {
			element.render();
	}); */
	};
	
	render();

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
