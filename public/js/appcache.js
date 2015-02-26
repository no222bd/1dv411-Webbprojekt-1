jQuery(document).ready(function() {
	 
	
	$(window.applicationCache).bind("checking", function(event) {
		console.log(event);
	});
	
	$(window.applicationCache).bind("updateready", function(event) {
		window.applicationCache.swapCache();
	});
});
