describe("Builder.ConstructionArea", function () {
	var builder;
	var children;
	var scene

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
		scene = builder._createScene();
		children = scene.children;
	});

	describe("createScene", function () {

		function typeExists(children, type){
			for(var i= 0; i < children.length; i++){
				if(children[i].type == type){
					return true;
				}
			}
			return false;
		}

		function numOfType(children, type){
			var count = 0;
			for(var i= 0; i < children.length; i++){
				if(children[i].type == type){
					count++;
				}
			}
			return count;
		}

		it("should have an Ambient Light", function () {
			expect(typeExists(children, 'AmbientLight')).toBeTruthy();
		});

		it("should have an Directional Light", function () {
			expect(typeExists(children, 'DirectionalLight')).toBeTruthy();
		});

		it("should have lines", function () {
			expect(numOfType(children, 'Line')).toEqual(5);
		});

	});
});