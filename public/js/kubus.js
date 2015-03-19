jQuery(document).ready(function ($) {
	var perspectives = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView"), $("#preview")];

	//colorsArray holds all the colors that are awailable in the UI color selector
	var colorsArray = [];

	/**
	 * Populates colorsArray with colors from colorsModal.
	 */
	$('#colorsModal a').each(function (index, link) {
		if ($(link).attr('href') != '#random') {
			colorsArray.push($(link).attr('href'));
		}
	});

	var cb = new BUILDER.ConstructionArea($("#ThreeJScontainer"), perspectives, colorsArray);
	cb.renderPerspectives();

	//Represents the current open modal.
	var openModal = null;

	//Represents the chosen color.
	var chosenColor;

	/**
	 * Generates random cube colors per cube placed.
	 */
	document.querySelector("#ThreeJScontainer").addEventListener("mousedown", function () {
		if (chosenColor == "#random") {
			cb.setCubeMaterial(chooseRandomColorFromColors());
		}
	});

	/**
	 * Toggles counter to hide/show it.
	 */
	$('#toggleCounter').on('click', function(event){
		event.preventDefault();
		if ($('#toggleArrow').text() === "→") {
			$('#toggleArrow').text("←");
			$('.counter').show();
		} else if ($('#toggleArrow').text() === "←") {
			$('#toggleArrow').text("→");
			$('.counter').hide();
		}
	});

	/**
	 * Menu click eventhandler.
	 */
	$('#menu').on('click', 'a', function (event) {
		event.preventDefault();

		/**
		 * If buildOption class do handleBuildOption, else do handleModalWindow.
		 */
		if ($(this).hasClass("buildOption")) {
			handleBuildOption($(this));
		} else {
			handleModalWindow($(this));
			//Corrects the size of perspectives!
			cb.renderPerspectives();
		}
	});

	/**
	 * Prevent link tags in perspectivs container from working
	 */
	$('#perspectives').on('click', 'a', function(event) {
		event.preventDefault();
	});

	/**
	 * Creates functionality for hiding perspectives
	 */
	$('#togglePerspectiveLandscape').on('click', function(event) {
		event.preventDefault();
		var toggleElement = $('#togglePerspectiveLandscape');
		var perspectivesContainer = $('#perspectives');

		if(toggleElement.hasClass('open')) {
			perspectivesContainer.hide();
			cb.shouldRenderPerspectives(false);
			toggleElement.attr('class', 'close');
			toggleElement.text("←");
		} else {
			perspectivesContainer.show();
			cb.shouldRenderPerspectives(true);
			toggleElement.attr('class', 'open');
			toggleElement.text("→");
		}
	});

	$('#togglePerspectivePortrait').on('click', function(event) {
		event.preventDefault();
		var toggleElement = $('#togglePerspectivePortrait');
		var perspectivesContainer = $('#perspectives');

		if(toggleElement.hasClass('open')) {
			perspectivesContainer.hide();
			cb.shouldRenderPerspectives(false);
			toggleElement.attr('class', 'close');
			toggleElement.text("↑");
		} else {
			perspectivesContainer.show();
			cb.shouldRenderPerspectives(true);
			toggleElement.attr('class', 'open');
			toggleElement.text("↓");
		}
	});

	/**
	 * Provides a more intuitive closing of modals.
	 * @param event
	 */
	$("#modal").click(function (event) {
		if (event.target.tagName == "DIV") {
			closeModal();
		}
	});

	/**
	 * Modal click eventhandler. Controls which function to use.
	 */
	$('#modal').on('click', 'a', function (event) {
		event.preventDefault();

		if ($(this).hasClass('color')) {
			setColor($(this));
		} else if ($(this).hasClass('sizeControl')) {
			setSize($(this));
		} else if ($(this).hasClass('perspective')) {
			setPerspective($(this));
		} else {
			if ($(this).attr('href') == '#import' || $(this).attr('href') == '#save') {
				handleModalWindow($(this));
				$("#Name").focus();
			}
			if($(this).attr('href') == '#print'){
				closeModal();
				window.print();
			}
			if ($(this).attr('href') == '#reset') {
				cb.clearCubes();
				cb.renderPerspectives();
				$('#ThreeJScontainer').trigger('updateView');
				closeModal();
			}
			if ($(this).attr('href') == '#help') {
				handleModalWindow($(this));
			}
		}
	});

	/**
	 * Hides offline info in save/import form if online
	 */
	if (navigator.onLine) {
		$('#formOfflineInfo').hide();
	}

	/**
	 * Hides offline info in save/import form if going online
	 */
	$(window).on('online', function(event) {
		$('#formOfflineInfo').hide();
	});

	/**
	 * Shows offline info in save/import form if going offline
	 */
	$(window).on('offline', function(event) {
		$('#formOfflineInfo').show();
	});

	/**
	 * Trigging submit event on form. 
	 */
	$("#Submit").on('click', function (event) {
		event.preventDefault();
		$("#saveImportForm").submit();
	});

	/**
	 * Send GET to /api/{name} where name is model name.
	 * When successful, gets JSON, value with key "data" should be sent to
	 * the model through cb.loadModel();
	 */
	$("#saveImportForm").on('submit', function (event) {	
		event.preventDefault();
		var name = $.trim($("#Name").val());
		var buildingSaver = new BUILDER.BuildingSaver();
		var alert = $('#alert');
		if (name == '' || name == null || name == undefined) {
			alert.text('Namnet är för kort');
			$("#alert").attr('class', 'sadSmiley');
		} else {
			if (name.length <= 50) {
				if ($('#Submit').text() == 'Hämta') {
					if (navigator.onLine) {
						// check api first
						var requestUrl = "api/" + name;
						$.ajax({
							type: "GET",
							url: requestUrl,
							statusCode: {
								200: function (result) {
									buildingSaver.saveNewBuilding(name, result.data.model, false);
									cb.loadModel(result.data);
									closeModal();
								},
								400: function (result) {
									// check in localStorage
									var result = buildingSaver.getBuilding(name);
									if (result) {
										cb.loadModel(result);
										closeModal();
									} else {
										alert.text('Byggnaden hittades inte');
										$("#alert").attr('class', 'sadSmiley');
									}
								},
								404: function (result) {
									alert.text('Ett fel inträffade, försök igen');
									$("#alert").attr('class', 'sadSmiley');
								},
								500: function (result) {
									alert.text('Ett fel inträffade, försök igen');
									$("#alert").attr('class', 'sadSmiley');
								},
								503: function (result) {
									alert.text('Ett fel inträffade, försök igen');
									$("#alert").attr('class', 'sadSmiley');
								}
							}
						});
						// if offline
					} else {
						var result = buildingSaver.getBuilding(name);
						if (result) {
							cb.loadModel(result);
							closeModal();
						} else {
							alert.text('Byggnaden hittades inte');
							$("#alert").attr('class', 'sadSmiley');
						}
					}
				} else {
					var requestUrl = "api/create";
					var dataString = LZString.decompressFromBase64(cb.saveModel());

					if (navigator.onLine) {
						$.ajax({
							type: "POST",
							url: requestUrl,
							data: {name: name, model: dataString},
							statusCode: {
								201: function (result) {
									// save in localStorage
									buildingSaver.saveBuildings(JSON.parse(result.data));
									alert.text('Byggnaden sparades');
									$("#alert").attr('class', 'happySmiley');
									$("#Name").val('');
								},
								400: function (result) {
									alert.text('Namnet finns redan');
									$("#alert").attr('class', 'sadSmiley');
								},
								404: function (result) {
									alert.text('Ett fel inträffade, försök igen');
									$("#alert").attr('class', 'sadSmiley');
								},
								500: function (result) {
									alert.text('Ett fel inträffade, försök igen');
									$("#alert").attr('class', 'sadSmiley');
								},
								503: function (result) {
									alert.text('Ett fel inträffade, försök igen');
									$("#alert").attr('class', 'sadSmiley');
								}
							}
						});
						// if offline
					} else {
						// save building in localStorage
						if (buildingSaver.saveNewBuilding(name, dataString, true)) {
							alert.text('Byggnaden sparades lokalt');
							$("#alert").attr('class', 'happySmiley');
							$("#Name").val('');
						} else {
							alert.text('Namnet finns redan');
							$("#alert").attr('class', 'sadSmiley');
						}
					}
				}
			}else{
				alert.text('Namnet är för långt');
				$("#alert").attr('class', 'sadSmiley');
			}
		}
		return false;
	});

	/**
	 * Sets base size.
	 * @param {jQuery element} element
	 */
	function setSize(element) {
		var href = element.attr("href");
		var currentSize = cb.getBaseSize();

		switch (href) {
			case "#up":
				if (currentSize < 10) {
					currentSize = parseInt(currentSize) + 1;
				} else {
					return;
				}
				break;
			case "#down":
				if (currentSize > 1) {
					currentSize = parseInt(currentSize) - 1;
				} else {
					return;
				}
				break;
		}
		;

		$('#sizePreview').text(currentSize);
		cb.setBaseSize(currentSize);
		cb.renderPerspectives();
		$('#ThreeJScontainer').trigger('updateView');
	}

	/**
	 * Sets color of cube.
	 * @param  {jQuery element} element
	 */
	function setColor(element) {
		var colorHex = element.attr("href");
		if(chosenColor != undefined){
			$('#cube').removeClass('color-'+chosenColor.substring(1));
		}
		chosenColor = colorHex;
		$('#cube').addClass('color-'+chosenColor.substring(1));
		//The hex will be "random" if the user selected the random color option
		if (colorHex == "#random") {
			colorHex = chooseRandomColorFromColors();
		}
		cb.setCubeMaterial(colorHex);
		handleBuildOption($('#cube'));
		closeModal();
	}

	/**
	 * Sets a resize event handler.
	 */
	$(window).resize(function (event) {
		cb.resize();
	});

	/**
	 * Handles build option.
	 * @param  {jQuery element} element
	 */
	function handleBuildOption(element) {
		closeModal();
		if (element.hasClass('chosen')) {
			return;
		} else {
			$('.buildOption').removeClass('chosen');
			element.toggleClass('chosen');
			cb.toggleBuildMode();
		}
	}

	/**
	 * Opens or closes modal.
	 * @param  {jQuery element} element
	 */
	function handleModalWindow(element) {
		var href = element.attr('href');
		var areOpen = href !== openModal;

		closeModal();
		if (areOpen) {
			if (href == '#save' || href == '#import') {
				if (href == '#save') {
					$("#Submit").text('Spara');
				} else {
					$("#Submit").text('Hämta');
				}
				href = '#FormModal';

				if( navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i) ) {
			        // Position modal absolute and bump it down to the scrollPosition
			        $('#modal')
			            .css({
			                position: 'absolute',
			                marginTop: $(window).scrollTop() + 'px',
			                bottom: 'auto'
			            });
			        // Position backdrop absolute and make it span the entire page
			        //
			        // Also dirty, but we need to tap into the backdrop after Boostrap
			        // positions it but before transitions finish.
			        //
			        setTimeout( function() {
			            $('#modal').css({
			                height: Math.max(
			                    document.body.scrollHeight, document.documentElement.scrollHeight,
			                    document.body.offsetHeight, document.documentElement.offsetHeight,
			                    document.body.clientHeight, document.documentElement.clientHeight
			                ) + 'px'
			            });
			        }, 0);
			    }
			}
			if (href == '#help') {
				href = '#helpModal';
			}
			$('#modal').toggleClass('open');
			$(href).toggleClass('open');
			$('#alert').text('');
			$(".modalOption").toggleClass('faded');
			element.removeClass('faded');
			openModal = href;
			cb.enableOrDisableOrbit(false);
		}
	}

	/**
	 * Closes all modals and enables orbit again.
	 */
	function closeModal() {
		$(openModal).removeClass('open');
		$('#modal').removeClass('open');
		$('.modalOption').removeClass('faded');
		$('#alert').removeClass('sadSmiley');
		$('#alert').removeClass('happySmiley');

		$("#Name").val("");

		openModal = null;
		cb.enableOrDisableOrbit(true);
	}

	/*
	 * Chooses a color from the colorsArray that holds all available colors.
	 */
	function chooseRandomColorFromColors() {
		return colorsArray[Math.floor((Math.random() * (colorsArray.length - 1)))];
	}

	/*
	 * Show infomessage about using iOS7
	 */
	if(navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)) {
		$('<div style="font-weight:bold;margin-bottom:2%">P.g.a. iOS7 kan du uppleva problem med funktionerna Spara/Hämta.</div>').insertBefore( $('#formOfflineInfo') );
	}
});
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

		jQueryContainer.append(renderer.domElement);
		//jQueryContainer.on( "mousedown", onDocumentMouseTouch);
		jQueryContainer[0].addEventListener("mousedown", onDocumentMouseTouch);
		//jQueryContainer.on( "mouseup", onDocumentMouseTouch);
		jQueryContainer[0].addEventListener("mouseup", onDocumentMouseTouch);

		createPerspectives();
		setTimeout(function(){
			render();	
		}, 300);
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
		var temp = cubeMaterial;

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
			var hexColor = "#" + model.cubes[i].color;			
			self.setCubeMaterial(hexColor);

			voxel = new THREE.Mesh(cubeGeo, materials[hexColor]);
			voxel.position.x = model.cubes[i].x;
			voxel.position.y = model.cubes[i].y;
			voxel.position.z = model.cubes[i].z;

			scene.add(voxel);
			objects.push(voxel);
		}

		updateCounter();
		createPerspectives();
		self.renderPerspectives();
		
		cubeMaterial = temp;
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
			return true;
		}
		return false;
	};

	/**
	 * BuildMode Add or Remove cube
	 */
	this.toggleBuildMode = function() {
		buildMode = !buildMode;
	};

	this.shouldRenderPerspectives = function(should){
		views.forEach(function(view){
			view.shouldRender(should);
		});
		//Ugly fix
		views[5].shouldRender(true);
		if(should){
			renderCount = 6;
		}
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

			renderCount = 6;

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
	            views[0].render() && renderCount--;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[1].render() && renderCount--;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[2].render() && renderCount--;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[3].render() && renderCount--;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[4].render() && renderCount--;
	        }
	    });
	}, 400);
	setInterval(function() {
	    requestAnimationFrame(function() {
	        if (renderCount > 0) {
	            views[5].render() && renderCount--;
	        }
	    });
	}, 400);
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
	var renderView = true;
	/**
	 * Renders scene.
	 */
	this.render = function() {
		if(renderView){
			renderer.render(scene, camera);	
			return true;
		} 
		return false;
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

	this.shouldRender = function(_boolean){
		renderView = _boolean;
	};
};

}(window));
jQuery(document).ready(function() {
	$(window.applicationCache).on("updateready", function(event) {
		window.applicationCache.swapCache();
	});
});
(function(outerWindow){
	"use strict";

	outerWindow.BUILDER = outerWindow.BUILDER || {};
	var BUILDER = outerWindow.BUILDER;
	
	/**
	 * Handles saving and loading buildings to localStorage. 
	 */
	BUILDER.BuildingSaver = function() {
		
		var keyLocalStorage = "buildings";
		var self = this;
		
		/**
		 * Checks that all stored building have valid dates.
		 * 
 		 * @param Object all A object with all saved buildings in localStorage
 		 * @return Object An object with all the valid buildings
		 */
		function checkDate(all) {
			var ret = {};
			var counter = 0;
			
			for (var id in all) {
				var created = new Date(all[id].date);
				// 30 days in milliseconds = 60 * 60 * 24 * 30 * 1000
				var validUntil = new Date(created.getTime() + 2592000000);
				var now = new Date();
				now.setHours(0, 0, 0, 0);
				
				if (validUntil >= now.getTime()) {
					if (counter >= 250) { break; } // size limit for localStorage
					ret[id] = all[id];
					counter += 1;
				}
			}
			return ret;
		};
		
		/**
		 * Check if name alrady exists in localStorage.
		 *
		 * @param String name 
		 * @return Boolean TRUE if building already exists
		 */
		function checkIfBuildingExists(name, all) {
			for (var id in all) {
				id = id.trim().toLowerCase();
				name = name.trim().toLowerCase();
				if (id == name) { return true; }
			};
			return false;
		};
		
		/**
		 * Creates a date (now) in format YYYY-MM-DD
		 * @return String Ex: 1999-12-31
		 */
		function createDateString(date) {
			var dd = date.getDate();
			if ( dd < 10 ) { 
				dd = '0' + dd;
			}
			var mm = date.getMonth() + 1;
			if ( mm < 10 ) { 
				mm = '0' + mm;
			}
			var yyyy = date.getFullYear();
			
			return yyyy + "-" + mm + "-" + dd;
		};
		
		/**
		 * Returns an object with all buildings in localStorage.
		 * 
		 * @return Object {"building":{"model":"qwerty","date":"1999-12-31"}} or FALSE
		 */
		function getAllBuildings() {
			if (localStorage.getItem(keyLocalStorage)) {
				return JSON.parse(localStorage.getItem(keyLocalStorage));
			} else {
				return false;
			}
		};
		
		/**
		 * JSON stringifies and stores an object of buildings in localStorage. 
		 * 
		 * @param Object all An object with all buildings to be stored in localStorage
		 * @return Void
		 */
		function saveAllBuildings(all) {
			localStorage.setItem(keyLocalStorage, JSON.stringify(all));
		};
		
		/**
		 * Fetches a building from localStorage.
		 *
		 * @param String id Name of the building to fetch
		 * @return Object {"building":{"model":"qwerty","date":"1999-12-31"}} or false
		 */
		this.getBuilding = function(id) {
			var building, all = getAllBuildings();
			id = id.trim().toLowerCase();
			if (all) {
				return all[id];
			} else {
				return false;
			}
		};
		
		/**
		 * Adds one building in localStorage
		 *
		 * @param Object building {"building":{"model":"qwerty","date":"1999-12-31"}}
		 * @return Void 
		 */
		this.saveBuildings = function(buildings) {
			var all = getAllBuildings() || {};
			
			for (var id in buildings) {
				id = id.trim().toLowerCase();
				
				if (!checkIfBuildingExists(id, all)) {
					all[id] = buildings[id];
				}
			};
			
			// checks dates before saving
			saveAllBuildings(checkDate(all));
		};
		
		this.saveNewBuilding = function(name, model, compress) {
			var name = name.trim().toLowerCase();
			if (checkIfBuildingExists(name, getAllBuildings())) {
				return false;
			}
			
			var building = {};
			if (compress) {
				var model = LZString.compressToBase64(model);
			}
			var now = createDateString(new Date());
			building[name] = { model: model, date: now };
			self.saveBuildings(building);
			return true;
		};
	};

}(window));