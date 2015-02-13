describe("Builder.ConstructionArea", function () {

	describe("constructor", function () {

		it("should return ConstructionArea instance if argument is JQuery element", function () {
			// act
			var builder = new BUILDER.ConstructionArea($("<div></div>"));
			
			// assert
			expect(builder instanceof BUILDER.ConstructionArea).toBeTruthy();
		});

		it("should throw exception if argument is not JQuery element", function () {
			// assert
			expect(new BUILDER.ConstructionArea("<div></div>")).toThrowError();
		});

	});
});