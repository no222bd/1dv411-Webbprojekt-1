describe("Builder.ConstructionArea", function () {
	var builder;
	var lights;
	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
		lights = builder._createLights();
	});

	describe("createLights", function () {

		function typeExists(type){
			for(var i= 0; i < lights.length; i++){
				if(lights[i].type == type){
					return true;
				}
			}
			return false;
		}

		it("should have an Ambient Light", function () {
			expect(typeExists("AmbientLight")).toBeTruthy();
		});

		it("should have a Directional Light", function () {
			expect(typeExists("DirectionalLight")).toBeTruthy();
		});

	});
});