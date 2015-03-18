jQuery(document).ready(function() {
	$(window.applicationCache).on("updateready", function(event) {
		window.applicationCache.swapCache();
	});
});
