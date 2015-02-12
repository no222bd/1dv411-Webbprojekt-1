describe("Builder.ConstructionArea", function () {
	var builder;
	var supportsWebGL;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div id='ThreeJScontainer' style='height: 1000px; width: 1000px;'></div>"));
		supportsWebGL = Detector.webgl;
	});

	describe("createRenderer", function () {

		beforeEach(function() {
			supportsWebGL = Detector.webgl;
		});

		it("should create WebGLRenderer if supported by browser and checkWebGL is true", function () {
			// act
			var renderer = builder._createRenderer($("#ThreeJScontainer"), supportsWebGL);
			
			// assert
			if (supportsWebGL) {
				expect(renderer.type).toEqual("WebGLRenderer");
			} else {
				expect(renderer.type).toEqual("CanvasRenderer");	
			}
			
		});
		
		it("should create CanvasRenderer if checkWebGL is undefined", function () {
			// act
			var renderer = builder._createRenderer($("#ThreeJScontainer"));
			
			// assert
			expect(renderer.type).toEqual("CanvasRenderer");
		});
		
		it("should create CanvasRenderer if checkWebGL is false", function () {
			// act
			var renderer = builder._createRenderer($("#ThreeJScontainer"), false);
			
			// assert
			expect(renderer.type).toEqual("CanvasRenderer");
		});
		
	});
});