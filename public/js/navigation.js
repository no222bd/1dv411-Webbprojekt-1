jQuery(document).ready(function($) {
	var perspectives = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
	var cb = new BUILDER.ConstructionArea($("#ThreeJScontainer"), perspectives);
	var openModal = null;
	
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

	$(".perspective .canvasWrapper").on("click", function() {
        var canvas = this.firstChild;
        var target = $("#perspective");
        target.css("background-image", "url(" + this.firstChild.toDataURL() + ")");
        target.removeClass("top red yellow green blue").addClass("chosen-view " + $(this).parents("div").attr("class"));
        $("#menu").data("target", $(this).attr("id"));
    });
    
    $("#ThreeJScontainer").on("updateView", function() {
        var menuTargetId = $("#menu").data("target");
        var target = $("#perspective");
        var canvas = $("#" + menuTargetId).children()[0];
        target.css("background-image", "url(" + canvas.toDataURL() + ")");
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
		var dataString = cb.saveModel();
		
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
			openModal = href;

			//Switches function to call depending on the id of the chosen menu link.
			switch(id) {
				case "perspective":
					cb.renderPerspectives();
					perspective();
					break;
				case "base":
					break;
				case "settings":
					break;
				case "colors":
					colors();
					break;
				default:
			};
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
		var currentSize = $('#sizePreview').text();

		switch(href) {
			case "#up":
				if (currentSize < 20) {
					currentSize = parseInt(currentSize) + 1;
				}
				break;
			case "#down":
				if (currentSize > 2) {
					currentSize = parseInt(currentSize) - 1;
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
	function perspective() {
		$(".perspective").click(function (event) {
			event.preventDefault();
			var perspective = $(this).attr("href");
			cb.perspective(perspective);
			closeModal();
		});
	}

	/**
	 * Function for handling users choice of color.
	 */
	function colors() {
		$(".color").click(function (event) {
			event.preventDefault();
			var colorHex = $(this).attr("href");
			cb.setCubeMaterial(colorHex);
			closeModal();
		});
	}
});