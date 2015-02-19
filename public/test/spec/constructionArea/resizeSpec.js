describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("resize", function () {

		it("should resize model and all views", function () {
			// arrange
			spyOn(builder._renderer, 'setSize');
			spyOn(builder._camera, 'updateProjectionMatrix');
			builder._views.forEach(function(element, index, array) {
				spyOn(element, 'setSize');
				spyOn(element, 'render');
			});
			
			// act
			builder._resize();
			
			// assert
			expect(builder._renderer.setSize).toHaveBeenCalled();
			expect(builder._camera.updateProjectionMatrix).toHaveBeenCalled();
			builder._views.forEach(function(element, index, array) {
				expect(element.setSize).toHaveBeenCalled();
				expect(element.render).toHaveBeenCalled();
			});
			
		});
		
	});
});