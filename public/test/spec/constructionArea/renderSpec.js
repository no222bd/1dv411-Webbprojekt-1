describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("render", function () {

		it("should call render on renderer with scene and camera", function () {
			spyOn(builder._renderer, 'render');
			builder._render();
			expect(builder._renderer.render).toHaveBeenCalledWith(builder._scene, builder._camera);
		});
		
	});
});