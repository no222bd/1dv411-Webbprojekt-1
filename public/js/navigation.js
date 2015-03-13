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

	$("#Name").on('focus', function(event) {
		$(".modal").toggleClass('focusedModal');
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
		console.time("start click");
		if (chosenColor == "#random") {
			cb.setCubeMaterial(chooseRandomColorFromColors());
		}
	});

	/**
	 * Toggles counter to hide/show it.
	 */
	$('#toggleCounter').on('click', function(event){
		event.preventDefault();
		if ($('#toggleArrow').text() === ">") {
			$('#toggleArrow').text("<");
			$('.counter').show();
		} else if ($('#toggleArrow').text() === "<") {
			$('#toggleArrow').text(">");
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
	$('#togglePerspective').on('click', function(event) {
		event.preventDefault();
		var toggleElement = $('#togglePerspective');
		var perspectivesContainer = $('#perspectives');
		
		if(toggleElement.hasClass('open')) {
			perspectivesContainer.hide();
			toggleElement.attr('class', 'close');
			toggleElement.text("<");
		} else {
			perspectivesContainer.show();
			toggleElement.attr('class', 'open');
			toggleElement.text(">");
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
		}
	});

	/**
	 * Send GET to /api/{name} where name is model name.
	 * When successful, gets JSON, value with key "data" should be sent to
	 * the model through cb.loadModel();
	 */
	$("#Submit").on('click', function (event) {
		event.preventDefault();
		var name = $.trim($("#Name").val());
		var buildingSaver = new BUILDER.BuildingSaver();
		var alert = $('#alert');
		if (name == '' || name == null || name == undefined) {
			alert.text('Namnet är för kort :(');
		} else {
			if (name.length <= 50) {
				if ($(this).val() == 'Hämta') {
					if (navigator.onLine) {
						// check api first
						var requestUrl = "api/" + name;
						$.ajax({
							type: "GET",
							url: requestUrl,
							statusCode: {
								200: function (result) {
									cb.loadModel(result.data);
									closeModal();
								},
								400: function (result) {
									// check in localStorage
									var result = buildingSaver.getBuilding(name);
									if (result) {
										//console.log(result);
										cb.loadModel(result);
										closeModal();
									} else {
										console.log("Could not find that building.");
										alert.text('Byggnaden hittades inte :(');
									}
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
							alert.text('Byggnaden hittades inte :(');
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
									closeModal();
								},
								400: function (result) {
									alert.text('Namnet finns redan :(');
								},
								503: function (result) {
									alert.text('Ett fel inträffade, försök igen :(');
								}
							}
						});
						// if offline
					} else {
						// save building in localStorage
						if (buildingSaver.saveNewBuilding(name, dataString)) {
							closeModal();
						} else {
							alert.text('Namnet finns redan :(');
						}
					}
				}
			}else{
				alert.text('Namnet är för långt :(');
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
		alert("RESIZE :)");
		cb.resize();
	});

	/**
	 * Handles build option.
	 * @param  {jQuery element} element
	 */
	function handleBuildOption(element) {
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
					$("#Submit").val('Spara');
				} else {
					$("#Submit").val('Hämta');
				}
				href = '#FormModal';
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
});