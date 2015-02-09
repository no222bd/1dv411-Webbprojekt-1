jQuery(document).ready(function($) {

	var button = $("#menu a");

	//Handles menu events
	button.click(function(event) {
		event.preventDefault();
		var oldhref = "";
		var href = $(this).attr("href");
		var id = $(this).attr("id");

		if (oldhref === href || oldhref === "") {

			if ($(this).hasClass("popup")) {

				viewOrHidePopup();

				if (id == "perspective") {
					viewPerspectives();
				}

				//make sure user can't rotate model if popup is open
				cb.enableOrDisableOrbit();
			}

			if (oldhref === "") {
				oldhref = href;
			} else {
				oldhref = "";
			}
		} else {
			oldhref = "";
			$(this).trigger('click');
		}
	});

	function viewOrHidePopup() {

		var popUp = $("#popUp");

		if (popUp.length)
			popUp.remove();
		else
			$('body').append('<div id="popUp"><div class="container"><div><div>');

	}

	function viewPerspectives() {

		createViewDiv("topView", "topView");
		createViewDiv("blueView", "blueView");
		createViewDiv("redView", "redView");
		createViewDiv("yellowView", "yellowView");
		createViewDiv("greenView", "greenView");

		cb.renderPerspectives();
	}

	function createViewDiv(id, title) {
		var container = $(".container");

		var frame = document.createElement("div");
		frame.className = "view frame";

		var div = document.createElement("div");
		div.className = "view-container";
		div.id = id;

		var titleDiv = document.createElement('div');
		titleDiv.className = 'title';
		titleDiv.innerHTML = title;

		div.appendChild(titleDiv);
		frame.appendChild(div);
		container.append(frame);
	}

});
