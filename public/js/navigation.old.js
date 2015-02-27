jQuery(document).ready(function($) {
	var perspectives = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
	var cb = new BUILDER.ConstructionArea($("#ThreeJScontainer"), perspectives);
	cb.renderPerspectives();

	//Represents the current open modal.
	var openModal = null;

	//colorsArray holds all the colors that are awailable in the UI color selector
	var colorsArray = [];

	/**
	 * Populates colorsArray with colors from colorsModal.
	 */
	$('#colorsModal a').each(function( index, link ) {
		if($(link).attr('href') != '#random'){
			colorsArray.push($(link).attr('href'));
		}
	});

	/**
	 * Menu click eventhandler.
	 */
	$('#menu').on('click', 'a', function() {
		event.preventDefault();

		/**
		 * If buildOption class do handleBuildOption, else do handleModalWindow.
		 */
		if ($(this).attr('class') === "buildOption") {
			handleBuildOption($(this));
		} else {
			handleModalWindow($(this));
			//Corrects the size of perspectives!
			cb.renderPerspectives();
		}
	});

	/**
	 * Provides a more intuitive closing of modals.
	 * @param event
	 */
	$("#modal").click(function(event){
		if(event.target.tagName == "DIV"){
			closeModal();
		}
	});

	/**
	 * Modal click eventhandler. Controls which function to use.
	 */
	$('#modal').on('click', 'a', function() {
		event.preventDefault();

		if ($(this).hasClass('color')) {
			setColor($(this));
		} else if ($(this).hasClass('sizeControl')) {
			setSize($(this));
		} else if ($(this).hasClass('perspective')) {
			setPerspective($(this));
		} else {
			if($(this).attr('href') == '#import' || $(this).attr('href') == '#save'){
				handleModalWindow($(this));
			}
		}
	});

	/**
	 * Send GET to /api/{name} where name is model name.
	 * When successful, gets JSON, value with key "data" should be sent to
	 * the model through cb.loadModel();
	 */
	$("#Submit").on('click',function(event) {
		event.preventDefault();
		var name = $("#Name").val();
		if($(this).val() == 'Hämta') {
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
						console.log(result);
						closeModal();
					}
				}
			});
		}else{
			var requestUrl = "api/create";
			var dataString = LZString.decompressFromBase64(cb.saveModel());

			$.ajax({
				type: "POST",
				url: requestUrl,
				data: { name: name, model: dataString },
				statusCode: {
					201: function(result) {
						console.log(result);
					},
					400: function(result) {
						console.log(result);
					},
					503: function(result) {
						console.log(result);
					}
				}
			});
		}
		return false;
	});

	/**
	 * Sets perspective.
	 * @param {jQuery element} element
	 */
	function setPerspective(element) {
		var perspective = element.attr("href");
		cb.perspective(perspective);
		closeModal();
	}

	$(".perspective .canvasWrapper").on("click", function(event) {
		event.preventDefault();
		var target = $("#perspective");
		target.css("background-image", "url(" + this.firstChild.toDataURL() + ")");
		target.removeClass("top red yellow green blue").addClass("chosen-view " + $(this).parents("div").attr("class"));
		$("#menu").data("target", $(this).attr("id"));
	});

	$('#topView').trigger('click');

	$("#ThreeJScontainer").on("updateView", function() {
		var menuTargetId = $("#menu").data("target");
		if(menuTargetId !== undefined) {
			var target = $("#perspective");
			var canvas = $("#" + menuTargetId).children()[0];
			target.css("background-image", "url(" + canvas.toDataURL() + ")");
		}
	});

	/**
	 * Sets base size.
	 * @param {jQuery element} element
	 */
	function setSize(element) {
		var href = element.attr("href");
		var currentSize = cb.getBaseSize();

		switch(href) {
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
		};

		$('#sizePreview').text(currentSize);
		cb.setBaseSize(currentSize);
	}

	/**
	 * Sets color of cube.
	 * @param  {jQuery element} element
	 */
	function setColor(element) {
		var colorHex = element.attr("href");
		//The hex will be "random" if the user selected the random color option
		if (colorHex == "#random") {
			colorHex = chooseRandomColorFromColors();
		}
		cb.setCubeMaterial(colorHex);
		closeModal();
	}

	/**
	 * Sets a resize event handler.
	 */
	$(window).resize(function(event) {
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
			element.toggleClass('chosen');
			$(element.attr('id')).removeClass('chosen');
			cb.toggleBuildMode();
		}
	}

	/**
	 * Opens or closes modal.
	 * @param  {jQuery element} element
	 */
	function handleModalWindow(element) {
		var href = element.attr('href');

		if (href === openModal) {
			closeModal();
		} else {
			closeModal();
			if(href == '#save' || href == '#import'){
				if(href == '#save'){
					$("#Submit").val('Spara');
				}else{
					$("#Submit").val('Hämta');
				}
				href = '#FormModal';
			}

			$('#modal').toggleClass('open');
			$(href).toggleClass('open');
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
	function chooseRandomColorFromColors(){
		return colorsArray[Math.floor((Math.random() * (colorsArray.length-1)))];
	}
});