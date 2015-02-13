describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"));
	});

	describe("enableOrDisableOrbit", function () {

		it("should disable when orbit control is enabled", function () {
			// arrange
			builder._controls.enabled = true;
			
			// act
			builder._enableOrDisableOrbit(false);
			
			// assert
			expect(builder._controls.enabled).toBeFalsy();
		});
		
		it("should enable when orbit control is disabled", function () {
			// arrange
			builder._controls.enabled = false;
			
			// act
			builder._enableOrDisableOrbit(true);
			
			// assert
			expect(builder._controls.enabled).toBeTruthy();
		});
		
	});
});