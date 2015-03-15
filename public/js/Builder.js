(function(outerWindow){
	"use strict";

outerWindow.BUILDER = outerWindow.BUILDER || {};
var BUILDER = outerWindow.BUILDER;

/**
 * Three.js object for application.
 * @param jQueryContainer
 * @constructor
 */
BUILDER.ConstructionArea = function(jQueryContainer, perspectivesContainer, colorChoices) {
	/* Private members */

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
		UIevent,
	    buildMode = true,
		self = this,
		colors = colorChoices || [],
		textures = {},
		materials = {},
		renderCount = 0,
		stats,
		texturePath = {
			extention: '.png',
			path: 'public/img/textures/'
		};


	/**
	 * Init is a constructor for this object.
	 */
	function init() {// TODO - Make this public ?
		if(!(jQueryContainer instanceof jQuery)){
			throw new Error();
		}
		for(var i = 0; i < perspectivesContainer.length; i++) {
			if(!(perspectivesContainer[i] instanceof jQuery)){
				throw new Error();
			}
		}
		colors.forEach(function(colorValue){		
			requestAnimationFrame(function(){
				THREE.ImageUtils.loadTexture(texturePath.path+colorValue.toUpperCase().substring(1)+texturePath.extention, undefined, function(texture){
					textures[colorValue] = texture;
				});
			});	
		});
		self.setCubeMaterial('#FBE430');

		UIevent = jQuery.Event("updateView") ;

		step = 50;
		objects = [];
		views = [];
		cubeGeo = new THREE.BoxGeometry(step, step, step);

		raycaster = new THREE.Raycaster();
		mouseposition = new THREE.Vector2();
		mouse = new THREE.Vector2();

		baseSize = 250;
		//( step/2 ) * antal block i bredd
		setBase();

		scene = createScene();
		camera = createCamera();
		renderer = createRenderer(jQueryContainer, true);
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.noPan = true;
		setZoom();
		stats = new Stats();
		stats.setMode(1); // 0: fps, 1: ms

		// align top-left
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		stats.domElement.style["z-index"] = 1000;

		document.body.appendChild( stats.domElement );
		jQueryContainer.append(renderer.domElement);
		//jQueryContainer.on( "mousedown", onDocumentMouseTouch);
		jQueryContainer[0].addEventListener("mousedown", onDocumentMouseTouch);
		//jQueryContainer.on( "mouseup", onDocumentMouseTouch);
		jQueryContainer[0].addEventListener("mouseup", onDocumentMouseTouch);

		createPerspectives();
		setTimeout(function(){
			render();	
		}, 1000);
	}

	/* Public functions */

	/**
	 * perspective of view in menubar
	 * @param perspective
	 */
	this.perspective = function(perspective) {
		//green, blue, top, yellow, red
	};

	/**
	 * Clears all cubes from scene and objects array to create an empty base.
	 */
	this.clearCubes = function() {
		for(var i = 1; i < objects.length; i++) {
			scene.remove(objects[i]);
		}
		objects.splice(1, objects.length);
		updateCounter();
	};

	/**
	 * Enable or disable camera rotating and zooming
	 * @param setting
	 * @returns {boolean}
	 */
	this.enableOrDisableOrbit = function(setting) {
		if(typeof setting === 'boolean'){
			controls.enabled = setting;
			return true;
		}
		return false;
	};

	/**
	 * Load model from JSON
	 * @param jsonString
	 */
	this.loadModel = function(jsonString) {
		var model;
		var voxel;
		var material;

		if(typeof jsonString === "object"){
			model = jsonString;
		} else {
			model = JSON.parse(jsonString);
		}
		model = JSON.parse(LZString.decompressFromBase64(model.model));
		
		objects = [];
		baseSize = model.baseSize * (step / 2);

		setBase();
		scene = createScene();
		for(var i = 0, cubes = model.cubes.length; i < cubes; i++) {
			if(Detector.webgl) {
				material = new THREE.MeshBasicMaterial({
					map:textures[model.cubes[i].color.toUpperCase()] || THREE.ImageUtils.loadTexture(texturePath.path+model.cubes[i].color.toUpperCase()+texturePath.extention)
				});
			}else{
				material = new THREE.MeshBasicMaterial({
					color: '#'+model.cubes[i].color
				});
			}

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

		/* OBS! This is code for testing purpose only. Do not use in applicatoin!!! */
		// TODO: Remove before deploying

		this._objects = objects;

		/* End of testing code */
	};

	/**
	 * Renders model perspectives
	 */
	this.renderPerspectives = function() {
		views.forEach(function(element, index, array) {
            element.setSize();
            element.render();
        });
	};

	/**
	 * Updates camera and renderer settings to new element sizes.
	 */
	this.resize = function() {
		camera.aspect = jQueryContainer.width() / jQueryContainer.height();
		camera.updateProjectionMatrix();
		renderer.setSize(jQueryContainer.width(), jQueryContainer.height());

		// Updates perspective views
		self.renderPerspectives();
	};

	/**
	 * Save model to JSON
	 * @returns {*}
	 */
	this.saveModel = function() {
		function Cube(color, x, y, z) {
			this.color = color;
			this.x = x;
			this.y = y;
			this.z = z;
		}

		var model = {
			baseSize: objects[0].geometry.parameters.height / step,
			cubes: [],
			step: (step/2)
		};


		for(var i = 1; i < objects.length; i++) {
			var color = objects[i].material.map.sourceFile;
			color = color.replace("public/img/textures/", "");
			color = color.replace(".png", "");
			model.cubes.push(
				new Cube(
					color,
					objects[i].position.x,
					objects[i].position.y,
					objects[i].position.z
				)
			);
		}

		return LZString.compressToBase64(JSON.stringify(model));
	};

	/**
	 * Changes the size of the base and creates new scene
	 * @param size
	 * @returns {boolean}
	 */
	this.setBaseSize = function(size) {
		if(!isNaN(size) && size >= 1 && size <= 10) {
			baseSize = (step / 2) * size;
			objects = [];
			setBase();
			setZoom();
			scene = createScene();
			createPerspectives();
			updateCounter();

			/* OBS! This is code for testing purpose only. Do not use in applicatoin!!! */
			/* Remove before deploy! */

			this._baseSize = baseSize;

			/* End of testing code */

			return true;
		}

		return false;
	};

	/**
	 * returns base size
	 * @return {int} number of cubes on one side
	 */
	this.getBaseSize = function() {
		var size = baseSize / (step/2);
		return size;
	};

	/**
	 * set material for cube
	 * @param colorHex
	 * @returns {boolean}
	 */
	this.setCubeMaterial = function(colorHex) {
		var pattern = new RegExp("^#([A-Fa-f0-9]{6})$");
		if(pattern.test(colorHex)) {
			if(Detector.webgl) {
				if(materials[colorHex] == undefined){
					cubeMaterial = new THREE.MeshBasicMaterial({
						//Either take it from the hash, but we can't know if it's there yet
						//Or just load the texture right here, if it's missing
						map: textures[colorHex.toUpperCase()] || THREE.ImageUtils.loadTexture(texturePath.path + colorHex.toUpperCase().substring(1) + texturePath.extention)
					});
					materials[colorHex] = cubeMaterial;	
				} else {
					cubeMaterial = materials[colorHex];
				}
			}else{
				if(materials[colorHex] == undefined){
					cubeMaterial = new THREE.MeshBasicMaterial({
						color: colorHex
					});
					materials[colorHex] = cubeMaterial;	
				} else {
					cubeMaterial = materials[colorHex];
				}
			}
			/* OBS! This is code for testing purpose only. Do not use in applicatoin!!! */
			// TODO: Remove before deploying

			this._cubeMaterial = cubeMaterial;
			/* End of testing code */
			return true;
		}
		return false;
	};

	/**
	 * BuildMode Add or Remove cube
	 */
	this.toggleBuildMode = function() {
		buildMode = !buildMode;

		/* OBS! This is code for testing purpose only. Do not use in applicatoin!!! */
		// TODO: Remove before deploying

		this._buildMode = buildMode;

		/* End of testing code */
	};

	/* Private functions */

	/**
	 * Sets zoom on control using baseSize.
	 */
	function setZoom() {
		controls.maxDistance = (baseSize/2) * 20;
		controls.minDistance = baseSize;
		controls.reset();
	}

	/**
	 * Checks if cube can be added and adds cube
	 * @param intersect
	 */
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
			var facenormal = intersect.face.normal.clone().multiplyScalar(step/2);
			voxel.position.copy(intersect.point).add(facenormal);
			// checks if basePlane have uneven number of cubes...
			if((baseSize / (step/2)) % 2 !== 0) {
				var y = voxel.position.y;
				voxel.position.divideScalar(step).round().multiplyScalar(step);
				voxel.position.y = Math.abs(Math.floor(y / step) * step + (step / 2));
			} else {
				voxel.position.divideScalar(step).floor().multiplyScalar(step).addScalar(step / 2);
			}
			if(voxel.position.y > 0 && !cubeExists(voxel.position)) {
				scene.add(voxel);
				objects.push(voxel);
				renderCount = 6;
				setTimeout(function(){
					updateCounter();	
				}, 0);
				
			}
		}
	}
	/**
	 * Checks if a cube already are in a position.
	 * @param voxelPosition
	 * @returns {boolean}
	 */
	function cubeExists(voxelPosition){
		for(var i= 1; i < objects.length; i++){
			if( voxelPosition.equals(objects[i].position)
			){
				return true;
			}
		}
		return false;
	}

	/**
	 * Creating camera
	 * @returns {THREE.PerspectiveCamera}
	 */
	function createCamera() {
		var camera = new THREE.PerspectiveCamera(45, jQueryContainer.width() / jQueryContainer.height(), 1, 10000);
		camera.position.set(500, 800, 1300);
		camera.lookAt(new THREE.Vector3());

		return camera;
	};

	/**
	 * Creating color lines round base.
	 * @returns {Array}
	 */
	function createColorLines() {
		var lines = [];
		var gridOffset = baseSize / 7;

		// green line
		var line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(baseSize + gridOffset, 0 / 2, baseSize));
		line.vertices.push(new THREE.Vector3(baseSize + gridOffset, 0 / 2, -baseSize));
		var material = new THREE.LineBasicMaterial({
			color : 0x009944, linewidth: 2
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// pink line
		var line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(-(baseSize + gridOffset), 0, baseSize));
		line.vertices.push(new THREE.Vector3(-(baseSize + gridOffset), 0, -baseSize));
		material = new THREE.LineBasicMaterial({
			color : 0xE27BFE, linewidth: 2
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// blue line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(baseSize, 0, baseSize + gridOffset));
		line.vertices.push(new THREE.Vector3(-baseSize, 0, baseSize + gridOffset));
		material = new THREE.LineBasicMaterial({
			color : 0x0068B7, linewidth: 2
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		// yellow line
		line = new THREE.Geometry();
		line.vertices.push(new THREE.Vector3(baseSize, 0, -(baseSize + gridOffset)));
		line.vertices.push(new THREE.Vector3(-baseSize, 0, -(baseSize + gridOffset)));
		material = new THREE.LineBasicMaterial({
			color : 0xF39800, linewidth: 2
		});
		lines.push(new THREE.Line(line, material, THREE.LinePieces));

		return lines;
	};

	/**
	 * Creating five views for model.
	 */
	function createPerspectives() {
		function createView(x,y,z, view){
			var viewSize = 1200;
			var aspectRatio = view.width() / view.height();
			var cam = new THREE.OrthographicCamera(aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, viewSize / 2, -viewSize / 2);
			cam.position.set(x,y,z);
			cam.lookAt(new THREE.Vector3(0, baseSize, 0));
			var ren = createRenderer(view);
			return new BUILDER.View(ren, cam, view, scene, baseSize);
		}

		views = []; //If this turns out to be a problem, use views.length = 0;
		views.push(createView(0, 1600, 0, perspectivesContainer[0]));
		views.push(createView(0, baseSize, baseSize, perspectivesContainer[1]));
		views.push(createView(-baseSize, baseSize, 0, perspectivesContainer[2]));
		views.push(createView(0, baseSize, -baseSize, perspectivesContainer[3]));
		views.push(createView(baseSize, baseSize, 0, perspectivesContainer[4]));
		if(perspectivesContainer[5]) views.push(createView(0, 1600, 0, perspectivesContainer[5]));

		views.forEach(function(element, index, array) {
			element.init();
		});
	}

	/**
	 * Creating rendering for all views.
	 * @param JQueryElement
	 * @param checkWebGL
	 * @returns {*}
	 */
	function createRenderer(JQueryElement, checkWebGL) {
		checkWebGL = checkWebGL || false;
		var renderer;

		if (checkWebGL) {
			renderer = Detector.webgl ? new THREE.WebGLRenderer({
				antialias : true,
				alpha: true,
				preserveDrawingBuffer: true
			}) : new THREE.CanvasRenderer({alpha: true});
		} else {
			renderer = new THREE.CanvasRenderer({alpha: true});
		}
		// E9F9FF
		renderer.setClearColor( 0x000000, 0 );
		renderer.setPixelRatio(window.devicePixelRatio || 1);
		renderer.setSize(JQueryElement.width(), JQueryElement.height());
		return renderer;
	};

	/**
	 * Creating scene for cameras and views.
	 * @returns {THREE.Scene}
	 */
	function createScene() {
		var scene = new THREE.Scene();

		scene.add(baseGrid);
		scene.add(basePlane);

		createColorLines().forEach(function(element, index, array) {
			scene.add(element);
		});

		return scene;
	};

	/**
	 * Checks is cube can be removed and removes cube
	 * @param intersect
	 */
	function removeCube(intersect) {
		if (intersect.object != basePlane) {
			scene.remove(intersect.object);
			objects.splice(objects.indexOf(intersect.object), 1);

			setTimeout(function(){
				updateCounter();	
			}, 0);
		}
	}

	/**
	 * Called to render object
	 */
	function render() {
		requestAnimationFrame(render);
		stats.update();
		renderer.render(scene, camera);
	};

	/**
	 * Change base size.
	 */
	function setBase() {
		// create foundation
		//var geo = new THREE.PlaneBufferGeometry(baseSize * 2, baseSize * 2);
		//geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		//var m = new THREE.MeshBasicMaterial({
		// color : 0xA0E0B9
		//});
		//var f = new THREE.Mesh(geo, m);
		//foundation = f;

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

		/**
		 * * Green foundation * *
		 * Does not work with canvas renderer and is therefore turned off
		 * by being commented away. In later iterations this might get
		 * implemented but it needs another solution since the commented
		 * line only fixes the big model cube (webgl/canvas) and not the
		 * cube displayed in perspective views (canvas).
		 */
		var geo = new THREE.PlaneBufferGeometry(baseSize * 2, baseSize * 2);
		geo.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
		var plane = new THREE.Mesh(geo);
		if(Detector.webgl) {
			plane.visible = false;//plane.material = new THREE.MeshBasicMaterial({color: 0xa0e0b9});
		}else{
			plane.visible = false;
		}

		objects[0] = plane;
		basePlane = plane;
	};

	/**
	 * Updates counter if there's a counter element.
	 */
	function updateCounter() {
		var count = objects.length == 1 ? "0" : objects.length - 1;
		var counter = $("#counter");
		if (counter.length) {
			counter.text(count);
		}
	}

	/* Event handlers */

	/**
	 * Handels both mousedown and mouseup
	 * @param event
	 */
	function onDocumentMouseTouch(event) {
		event.preventDefault();

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
	init();
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[0].render();
	            renderCount -= 1;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {

	        if (renderCount > 0) {
	            views[1].render();
	            renderCount -= 1;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[2].render();
	            renderCount -= 1;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[3].render();
	            renderCount -= 1;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[4].render();
	            renderCount -= 1;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[5].render();
	            renderCount -= 1;
	        }
	    });
	}, 400);
	/* OBS. For testing only! Do not use in application!!! */
	// TODO: Remove before deploying

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
	this._buildMode = buildMode;
	this._texturePath = texturePath;

	// functions
	this._init = init;
	this._onDocumentMouseTouch = onDocumentMouseTouch;
	this._addCube = addCube;
	this._removeCube = removeCube;
	this._setCubeMaterial = this.setCubeMaterial;
	this._createScene = createScene;
	this._createRenderer = createRenderer;
	this._createCamera = createCamera;
	this._setBase = setBase;
	this._createColorLines = createColorLines;
	this._updateCounter = updateCounter;
	this._render = render;
	this._renderPerspectives = this.renderPerspectives;
	this._enableOrDisableOrbit = this.enableOrDisableOrbit;
	this._saveModel = this.saveModel;
	this._loadModel = this.loadModel;
	this._toggleBuildMode = this.toggleBuildMode;
	this._createPerspectives = createPerspectives;
	this._clearCubes = this.clearCubes;
	this._resize = this.resize;
	this._perspective = this.perspective;
	this._clearCubes = this.clearCubes;
	this._setZoom = setZoom;
	this._cubeExists = cubeExists;

	/* End of testing code */
};

/**
 * View object
 * @param renderer
 * @param camera
 * @param JQueryElement
 * @param scene
 * @constructor
 */
BUILDER.View = function(renderer, camera, JQueryElement, scene, baseSize) {
	/**
	 * Renders scene.
	 */
	this.render = function() {
		renderer.render(scene, camera);
	};

	/**
	 * Set size for camera.
	 */
	this.setSize = function() {
		var viewSite = baseSize * 2 - 10;
		if (JQueryElement.attr("id") == "topView") {
			viewSite = baseSize * 2 + baseSize / 20;
		} else if (JQueryElement.attr("id") == "preview") {
			viewSite = baseSize * 2 + baseSize / 2;
		}
		var aspectRatio = JQueryElement.width() / JQueryElement.height();
		renderer.setSize(JQueryElement.width(), JQueryElement.height());

		camera.left = aspectRatio * viewSite / 2;
		camera.right = -aspectRatio * viewSite / 2;
		camera.top = viewSite / 2;
		camera.bottom = -viewSite / 2;
		camera.updateProjectionMatrix();
	};

	/**
	 * Init view.
	 */
	this.init = function() {
		JQueryElement.empty();
		JQueryElement.append(renderer.domElement);
	};

	/* OBS. For testing only! Do not use in application!!! */
	// TODO: Remove before deploying

	// members
	this._renderer = renderer;
	this._camera = camera;
	this._JQueryElement = JQueryElement;
	this._scene = scene;
	this._baseSize = baseSize;
	/* End of testing code */
};

}(window));
