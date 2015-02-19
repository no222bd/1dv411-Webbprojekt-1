describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("setBaseSize", function () {

		it("should be 500 after init", function () {
			// assert
			expect(builder._baseSize).toBe(500);
		});

		it("should be 250", function () {
			// act
			builder.setBaseSize(10);
			
			// assert
			expect(builder._baseSize).toBe(250);
		});
		
		it("should still be 500 when trying to set 21", function () {
			// act
			builder.setBaseSize(21);
			
			// assert
			expect(builder._baseSize).toBe(500);
		});
		
		it("should still be 500 when trying to set NaN", function () {
			// act
			var ret = builder.setBaseSize("Donald Duck");
			
			// assert
			expect(builder._baseSize).toBe(500);
		});
		
		it("should return true/false", function () {
			// act
			var ret1 = builder.setBaseSize("20");
			var ret2 = builder.setBaseSize("Donald Duck");
			
			// assert
			expect(ret1).toBeTruthy();
			expect(ret2).toBeFalsy();
		});
	});
});