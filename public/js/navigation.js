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
			alert.text('Namnet är för kort');
			$("#alert").attr('class', 'sadSmiley');
		} else {
			if (name.length <= 50) {
				if ($(this).text() == 'Hämta') {
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
