describe("Builder.ConstructionArea", function () {
	var camera;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("createCamera", function () {

		it("should return a THREE.Camera object", function () {
			camera = builder._createCamera();
			expect(camera.type).toEqual("PerspectiveCamera");
		});

	});
});