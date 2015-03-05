describe("Builder.View", function () {
	var view;
	var JQueryElement;

	beforeEach(function () {
		JQueryElement = $("<div></div>");
		JQueryElement.width(130);
		JQueryElement.height(100);
		var aspectRatio = JQueryElement.width() / JQueryElement.height();
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		var builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
		
		view = new BUILDER.View(
			new THREE.CanvasRenderer(), 
			new THREE.OrthographicCamera(
				aspectRatio * 600 / 2, -aspectRatio * 600 / 2, 
				600 / 2, -600 / 2
			),
			JQueryElement,
			builder._createScene(),
			builder._baseSize
		);
			
	});

	describe("setSize", function () {

		it("should change camera settings and call renderer.setSize", function () {
			// arrange
			spyOn(view._renderer, 'setSize');
			JQueryElement.width(80);
			var aspectRatio = JQueryElement.width() / JQueryElement.height();
			var viewSite = (view._baseSize / 2) * 5;

			// act
			view.setSize();
			
			// assert
			expect(view._renderer.setSize).toHaveBeenCalled();
			
			expect(view._camera.left).toBe(aspectRatio * viewSite / 2);
			expect(view._camera.right).toBe(-aspectRatio * viewSite / 2);
			expect(view._camera.top).toBe(viewSite / 2);
			expect(view._camera.bottom).toBe(-viewSite / 2);
		});

	});
});