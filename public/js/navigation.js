jQuery(document).ready(function($) {
	var perspectives = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
	window.cb = new BUILDER.ConstructionArea($("#ThreeJScontainer"), perspectives);
	cb.renderPerspectives();
	var openModal = null;
	var chosenColor;
	//colorsArray holds all the colors that are awailable in the UI color selector
	var colorsArray = [];
    $('#colorsModal a').each(function( index, link ) {
    	if($(link).attr('href') != '#random'){
    		colorsArray.push($(link).attr('href'));	
    	}
    });
    $("#ThreeJScontainer").on("mousedown", function(){
    	if(chosenColor == "#random"){
    		cb.setCubeMaterial(chooseRandomColorFromColors());	
    	}
    });
	$("#modal").click(function(event){
		if(event.target.tagName == "DIV"){
			closeModal();	
		}
	});
	$("#resetConfirmModal").hide();
	$("#formSaveModal").hide();
	$("#formOpenModal").hide();

	$("#confirm").click(function(){
		cb.clearCubes();
		closeModal();
	});

	$("#decline").click(function(){
		$("#resetConfirmModal").hide();
		$("#baseModal").show();
		closeModal();
	});

	$(".perspective .canvasWrapper").on("click", function(event) {
		event.preventDefault();
		var canvas = this.firstChild;
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

	// skicka GET till /api/{name} där name = modellens namn
	// vid success får en json, värdet under key "data" skall skickas till modellen
	// anropa cb.loadModel(JSON-strängen)
	$("#importForm").submit(function(event) {
		event.preventDefault();

		var name = $("#importName").val();
		var requestUrl = "api/" + name;

		$.ajax({
			type: "GET",
			url: requestUrl,
			statusCode: {
				200: function(result) {
					cb.loadModel(result.data);
					closeModal();
				},
				400: function(result) {
					console.log(result);
					closeModal();
				}
			}
		});
	});

	// för att få ut json-strängen cb.saveModel() för att få ut en json-sträng
	// skicka POST till /api med variblerna name="modellens namn" och model="json-strängen"
	$("#saveForm").submit(function(event) {
		event.preventDefault();

		var name = $("#saveName").val();
		var requestUrl = "api";
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
	});

	$(".modalOption").click(function (event) {
		event.preventDefault();
		var href = $(this).attr("href");

		if (href === openModal) {
			closeModal();
		} else {
			closeModal();

			var id = $(this).attr("id");

			$('#modal').toggleClass('open');
			$(href).toggleClass('open');
			$(".modalOption").toggleClass('faded');
			$(this).removeClass('faded');
			openModal = href;
			cb.enableOrDisableOrbit(false);
		}
	});

	$(".buildOption").click(function (event) {
		event.preventDefault();

		if ($(this).hasClass('chosen')) {
			return;
		}

		var href = $(this).attr("href");
		var id = $(this).attr("id");

		//Switches function to call depending on the id of the chosen menu link.
		switch(id) {
			case "cube":
				$(this).toggleClass('chosen');
				$('#erase').removeClass('chosen');
				cb.toggleBuildMode();
				break;
			case "erase":
				$(this).toggleClass('chosen');
				$('#cube').removeClass('chosen');
				cb.toggleBuildMode();
				break;
			default:
		};
	});

	/**
	 * Add click event for buttons in settings modal
	 */
	$("#settingsModal").click(function (event) {
		event.preventDefault();
		var href = $(event.target).attr("href");

		switch(href) {
			case "#save":
				$("#settingsModal").hide();
				$("#formSaveModal").show();
				break;
			case "#import":
				$("#settingsModal").hide();
				$("#formImportModal").show();
				break;
		};
	});

	/**
	 * Add click event handler for reset button (in modal #baseContainer)
	 */
	$("#reset").click(function (event) {
		event.preventDefault();
		$("#baseModal").hide();
		$("#resetConfirmModal").show();
	});

	/**
	 * Add click event handler for sizeControl buttons (in modal #baseContainer)
	 */
	$(".sizeControl").click(function (event) {
		event.preventDefault();
		var href = $(this).attr("href");
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
	});

	/**
	 * Sets a resize event handler.
	 */
	$(window).resize(function(event) {
		cb.resize();
	});

	function closeModal() {
		$(openModal).removeClass('open');
		$('#modal').removeClass('open');
		$('.modalOption').removeClass('faded');

		$("#resetConfirmModal").hide();
		$("#baseModal").show();

		$("#settingsModal").show();
		$("#formSaveModal").hide();
		$("#saveName").val("");

		$("#settingsModal").show();
		$("#formImportModal").hide();
		$("#importName").val("");

		openModal = null;
		cb.enableOrDisableOrbit(true);
	}

	/**
	 * Function for handling users choice of perspective.
	 */
	$(".perspective").click(function (event) {
			event.preventDefault();
			var perspective = $(this).attr("href");
			cb.renderPerspectives();
			cb.perspective(perspective);
			closeModal();
		});

	/**
	 * Function for handling users choice of color.
	 */
	$(".color").click(function (event) {
			event.preventDefault();
			var colorHex = $(this).attr("href");
			chosenColor = colorHex;
			//The hex will be "random" if the user selected the random color option
			if(colorHex == "#random"){
				colorHex = chooseRandomColorFromColors();
			}
			cb.setCubeMaterial(colorHex);
			closeModal();
		});
	//Fantastic name, isn't it?
	/*
	*	Chooses a color from the colorsArray that holds all available colors
	*/
	function chooseRandomColorFromColors(){
	    return colorsArray[Math.floor((Math.random() * (colorsArray.length-1)))];
 	}	
});