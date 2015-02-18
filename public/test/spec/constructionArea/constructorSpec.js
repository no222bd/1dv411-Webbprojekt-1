describe("Builder.ConstructionArea", function () {

	describe("constructor", function () {

		it("should return ConstructionArea instance if argument is JQuery element", function () {
			// act
			var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
			var builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
			
			// assert
			expect(builder instanceof BUILDER.ConstructionArea).toBeTruthy();
		});

		it("should throw exception if argument is not JQuery element", function () {
			// assert
			expect(function(){
				new BUILDER.ConstructionArea("<div></div>", [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")])
			}).toThrowError();
		});

		it("should throw exception if perspectives-argument is not JQuery element", function () {
			// act
			var arr = [$("#topView"), "#blueView", $("#redView"), $("#yellowView"), $("#greenView")];

			// assert
			expect(function(){
				new BUILDER.ConstructionArea("<div></div>", arr)
			}).toThrowError();
		});

	});
});