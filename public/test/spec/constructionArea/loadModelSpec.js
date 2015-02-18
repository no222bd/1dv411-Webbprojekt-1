describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"));
	});

	describe("loadModel", function () {

		it("should render a model saved as a JSON string", function () {
			// arrange
			var cube = new THREE.Mesh(builder._cubeGeo, builder._cubeMaterial);
			cube.position.x = -25;
			cube.position.y = 25;
			cube.position.z = -25;
			builder._objects[1] = cube;
			var json = builder._saveModel();
			
			builder._views.forEach(function(element, index, array) {
				spyOn(element, 'render');
			});
			
			// act
			builder._loadModel(json);
			
			// assert
			expect(builder._baseSize).toBe(500);
			
			expect(builder._objects.length).toBe(2);
			expect(builder._objects[0].geometry.parameters.width).toBe(builder._baseSize * 2);
			expect(builder._objects[0].geometry.parameters.height).toBe(builder._baseSize * 2);
			expect(builder._objects[1].position.x).toBe(-25);
			expect(builder._objects[1].position.y).toBe(25);
			expect(builder._objects[1].position.z).toBe(-25);
			
			
			// check that views.render have been called
			builder._views.forEach(function(element, index, array) {
				expect(element.render).toHaveBeenCalled();
			});
			
		});
		
	});
});