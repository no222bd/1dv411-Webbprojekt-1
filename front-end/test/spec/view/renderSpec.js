describe("Builder.View", function () {
	var view;
	var JQueryElement;

	beforeEach(function () {
		JQueryElement = $("<div style='width: 130px, height: 100px;'></div>");
		var viewSize = 1200;
		var aspectRatio = JQueryElement.width() / JQueryElement.height();
		var builder = new BUILDER.ConstructionArea($("<div></div>"));
		
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