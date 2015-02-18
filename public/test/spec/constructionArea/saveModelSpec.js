describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("saveModel", function () {

		it("should save model as JSON string with correct values", function () {
			// arrange
			var cube = new THREE.Mesh(builder._cubeGeo, builder._cubeMaterial);
			cube.position.x = -25;
			cube.position.y = 25;
			cube.position.z = -25;
			builder._objects[1] = cube;
			
			// act
			var json = builder._saveModel();
			var parsedJSON = JSON.parse(json);
			
			// assert
			expect(parsedJSON['baseSize']).toBe(20);
			expect(parsedJSON['cubes'][0].color).toBe("fed06f");
			expect(parsedJSON['cubes'][0].x).toBe(-25);
			expect(parsedJSON['cubes'][0].y).toBe(25);
			expect(parsedJSON['cubes'][0].z).toBe(-25);
		});
		
	});
});