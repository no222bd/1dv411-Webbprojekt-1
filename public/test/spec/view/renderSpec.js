describe("Builder.View", function () {
	var view;
	var JQueryElement;

	beforeEach(function () {
		JQueryElement = $("<div></div>");
		JQueryElement.width(130);
		JQueryElement.height(100);
		var viewSize = 1200;
		var aspectRatio = JQueryElement.width() / JQueryElement.height();
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		var builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
		
		view = new BUILDER.View(
			new THREE.CanvasRenderer(), 
			new THREE.OrthographicCamera(
				aspectRatio * viewSize / 2, -aspectRatio * viewSize / 2, 
				viewSize / 2, -viewSize / 2
			),
			JQueryElement,
			builder._createScene()
		);
			
	});

	describe("render", function () {

		it("should call renderer.render", function () {
			// arrange
			spyOn(view._renderer, 'render');
			
			// act
			view.render();
			
			// assert
			expect(view._renderer.render).toHaveBeenCalledWith(view._scene, view._camera);
		});

	});
});