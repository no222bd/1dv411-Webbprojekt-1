describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"));
	});

	describe("clearCubes", function () {

		beforeEach(function() {
			var cube = new THREE.Mesh(builder._cubeGeo, builder._cubeMaterial);
			cube.position.x = -25;
			cube.position.y = 25;
			cube.position.z = -25;
			builder._objects[1] = cube;

			var cube2 = new THREE.Mesh(builder._cubeGeo, builder._cubeMaterial);
			cube2.position.x = -30;
			cube2.position.y = 30;
			cube2.position.z = -30;
			builder._objects[2] = cube2;
		});

		it("should remove all cubes from objects", function () {
			// act
			builder._clearCubes();

			// assert
			expect(builder._objects.length).toBe(1);
		});

		it("should remove all cubes from scene", function () {
			// act
			builder._clearCubes();

			// assert
			expect(builder._scene.children.length).toBe(8);
		});
		
	});
});