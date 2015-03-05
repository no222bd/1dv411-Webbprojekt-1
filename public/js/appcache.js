jQuery(document).ready(function() {
	$(window.applicationCache).bind("updateready", function(event) {
		window.applicationCache.swapCache();
	});
});
