describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
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

			// act
			builder._loadModel({model: json});
			
			// assert
			expect(builder._baseSize).toBe(250);
			
			expect(builder._objects.length).toBe(2);
			expect(builder._objects[0].geometry.parameters.width).toBe(builder._baseSize * 2);
			expect(builder._objects[0].geometry.parameters.height).toBe(builder._baseSize * 2);
			expect(builder._objects[1].position.x).toBe(-25);
			expect(builder._objects[1].position.y).toBe(25);
			expect(builder._objects[1].position.z).toBe(-25);

		});
		
	});
});