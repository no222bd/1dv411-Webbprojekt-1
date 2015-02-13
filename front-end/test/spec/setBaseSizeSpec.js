describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
	});

	describe("setBaseSize", function () {

		it("baseSize should be 500 after init", function () {
			expect(builder._baseSize).toBe(500);
		});

		it("baseSize should be 250", function () {
			var ret = builder._baseSize(250);
			
			expect(ret).toBeTruthy();
			expect(builder._baseSize).toBe(250);
		});
		
		it("baseSize should still be 250", function () {
			var ret = builder._baseSize(111);
			
			expect(ret).toBeFalsy();
			expect(builder._baseSize).toBe(250);
		});
	});
});