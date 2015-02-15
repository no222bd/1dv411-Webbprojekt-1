describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
		$("body").append("<div id='counter' style='display: none;'></div>");
	});

	describe("updateCounter", function () {

		it("should be 0 in beginning", function () {
			builder._updateCounter();
			expect($('#counter').text()).toBe('0');
		});


		it("should be 1 when adding a cube", function () {
			var cube = new THREE.Mesh(builder._cubeGeo, builder._cubeMaterial);
			cube.position = new THREE.Vector3(-25, 25, -25);
			builder._objects.push(cube);
			builder._updateCounter();
			expect($('#counter').text()).toBe('1');
		});
	});
});