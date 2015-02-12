describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"));
	});

	describe("enableOrDisableOrbit", function () {

		it("should disable orbit control", function () {
			// arrange
			builder._controls.enabled = true;
			
			// act
			builder._enableOrDisableOrbit();
			
			// assert
			expect(builder._controls.enabled).toBe(false);
		});
		
		it("should enable orbit control", function () {
			// arrange
			builder._controls.enabled = false;
			
			// act
			builder._enableOrDisableOrbit();
			
			// assert
			expect(builder._controls.enabled).toBe(true);
		});
		
	});
});