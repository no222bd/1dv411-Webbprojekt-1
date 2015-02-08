jQuery(document).ready(function ($) {
	
	var button =  $("#menu a");
	
	function viewOrHidePopup(){
		
		var popUp =  $("#popUp");
		
		if (popUp.length) 
			popUp.remove(); 	
		else  
		$('body').append('<div id="popUp"><div class="container"><div><div>'); 
		 
	}
	
	function viewPerspective() {
		console.log("perspective");
		var container =  $(".container");

		container.append('<div class="view frame"><div class="view-container" id="top-view"><div><div class="title">TOP VIEW<div><div>');
		
		var topView = $("#top-view");
		
		cb.renderPerspective(topView);
	}

	button.click(function (event) {
		event.preventDefault();
		var oldhref = "";
		var href = $(this).attr("href");
		if (oldhref === href || oldhref === "") {
			
			if ( $(this).hasClass( "popup" )) {
				
				viewOrHidePopup();
					
				viewPerspective();
				
				//make sure user can't rotate model if popup is open
				cb.enableOrDisableOrbit();
			}
			if (oldhref === "") {
				oldhref = href;
			} else {
				oldhref = ""; 
			}
		}else{
			oldhref = "";
			$(this).trigger('click');
		}
	});
	
});
