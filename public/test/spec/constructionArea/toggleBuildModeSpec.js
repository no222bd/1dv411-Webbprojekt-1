describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
	});

	describe("toggleBuildMode", function () {

		it("should be true after init", function () {
			expect(builder._buildMode).toBeTruthy();
		});
		
		it("should be false after calling toggleBuildMode", function () {
			builder._toggleBuildMode();
			expect(builder._buildMode).toBeFalsy();
		});

		it("should be true after calling toggleBuildMode twice", function(){
			builder._toggleBuildMode();
			expect(builder._buildMode).toBeFalsy();
			builder._toggleBuildMode();
			expect(builder._buildMode).toBeTruthy();
		});

	});
});