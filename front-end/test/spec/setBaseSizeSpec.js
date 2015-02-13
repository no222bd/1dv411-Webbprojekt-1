describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
	});

	describe("setBaseSize", function () {

		it("should be 500 after init", function () {
			// assert
			expect(builder._baseSize).toBe(500);
		});

		it("should be 250", function () {
			// act
			builder._baseSize(250);
			
			// assert
			expect(builder._baseSize).toBe(250);
		});
		
		it("should still be 250 when trying to set 111", function () {
			// act
			builder._baseSize(111);
			
			// assert
			expect(builder._baseSize).toBe(250);
		});
		
		it("should still be 250 when trying to set NaN", function () {
			// act
			var ret = builder._baseSize("Donald Duck");
			
			// assert
			expect(builder._baseSize).toBe(250);
		});
		
		it("should return true/false", function () {
			// act
			var ret1 = builder._baseSize("200");
			var ret2 = builder._baseSize("Donald Duck");
			
			// assert
			expect(ret1).toBeTruthy();
			expect(ret2).toBeFalsy();
		});
	});
});