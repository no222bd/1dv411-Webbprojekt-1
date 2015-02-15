describe("Builder.View", function () {
	var view;
	var JQueryElement;

	beforeEach(function () {
		JQueryElement = $("<div></div>");
		JQueryElement.width(130);
		JQueryElement.height(100);
		var aspectRatio = JQueryElement.width() / JQueryElement.height();
		var builder = new BUILDER.ConstructionArea($("<div></div>"));
		
		view = new BUILDER.View(
			new THREE.CanvasRenderer(), 
			new THREE.OrthographicCamera(
				aspectRatio * 1200 / 2, -aspectRatio * 1200 / 2, 
				1200 / 2, -1200 / 2
			),
			JQueryElement,
			builder._createScene()
		);
			
	});

	describe("setSize", function () {

		it("should change camera settings and call renderer.setSize", function () {
			// arrange
			spyOn(view._renderer, 'setSize');
			JQueryElement.width(80);
			var aspectRatio = JQueryElement.width() / JQueryElement.height();

			// act
			view.setSize();
			
			// assert
			expect(view._renderer.setSize).toHaveBeenCalled();
			
			expect(view._camera.left).toBe(aspectRatio * 1200 / 2);
			expect(view._camera.right).toBe(-aspectRatio * 1200 / 2);
			expect(view._camera.top).toBe(1200 / 2);
			expect(view._camera.bottom).toBe(-1200 / 2);
		});

	});
});