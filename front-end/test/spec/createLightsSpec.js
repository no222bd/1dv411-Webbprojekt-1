describe("Builder.ConstructionArea", function () {
	var builder;
	var lights;
	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
		lights = builder._createLights();
	});

	describe("createLights", function () {

		it("should have an Ambient Light", function () {
			var light = lights[0];
			expect(light.type).toEqual("AmbientLight")
		});

		it("should have an Directional Light", function () {
			var light = lights[1];
			expect(light.type).toEqual("DirectionalLight")
		});

	});
});