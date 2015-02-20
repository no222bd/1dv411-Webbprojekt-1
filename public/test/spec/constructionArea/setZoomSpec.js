describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("setZoom", function () {

		it("should set minDistance and maxDistance", function () {
			// arrange
			builder.setBaseSize(5);

			builder._setZoom();

			// assert
			expect(builder._controls.maxDistance).toBe(builder._controls.minDistance * 6);
			expect(builder._controls.minDistance).toBe(builder._baseSize);
		});

	});
});