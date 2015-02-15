describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div id='ThreeJScontainer' style='height: 1000px; width: 1000px;'></div>"));
	});

	describe("createRenderer", function () {

		it("should create WebGLRenderer if supported by browser and checkWebGL is true", function () {
			// act
			var supportsWebGL = Detector.webgl;
			var renderer = builder._createRenderer($("#ThreeJScontainer"), supportsWebGL);
			
			// assert
			if (supportsWebGL) {
				expect(renderer instanceof THREE.WebGLRenderer).toBeTruthy();
			} else {
				expect(renderer instanceof THREE.CanvasRenderer).toBeTruthy();
			}
		});
		
		it("should create CanvasRenderer if checkWebGL is undefined", function () {
			// act
			var renderer = builder._createRenderer($("#ThreeJScontainer"));
			
			// assert
			expect(renderer instanceof THREE.CanvasRenderer).toBeTruthy();
		});
		
		it("should create CanvasRenderer if checkWebGL is false", function () {
			// act
			var renderer = builder._createRenderer($("#ThreeJScontainer"), false);
			
			// assert
			expect(renderer instanceof THREE.CanvasRenderer).toBeTruthy();
		});
		
	});
});