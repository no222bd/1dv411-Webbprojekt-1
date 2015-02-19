describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
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

		it("should not accept an string", function () {
			// arrange
			builder._controls.enabled = false;

			// act
			builder._enableOrDisableOrbit('hej');

			// assert
			expect(builder._controls.enabled).toBeFalsy();
		});


		it("should not accept a number", function () {
			// arrange
			builder._controls.enabled = false;

			// act
			builder._enableOrDisableOrbit(5);

			// assert
			expect(builder._controls.enabled).toBeFalsy();

			// act
			builder._enableOrDisableOrbit(0);

			// assert
			expect(builder._controls.enabled).toBeFalsy();
		});

		it("should return true/false", function(){
			expect(builder._enableOrDisableOrbit(5)).toBeFalsy();
			expect(builder._enableOrDisableOrbit(false)).toBeTruthy();
		});

	});
});