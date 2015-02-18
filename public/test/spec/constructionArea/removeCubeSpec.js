describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"));
	});

	describe("removeCube", function () {

		beforeEach(function() {
			var cube = new THREE.Mesh(builder._cubeGeo, builder._cubeMaterial);
			cube.position.x = -25;
			cube.position.y = 25;
			cube.position.z = -25;
			builder._objects[1] = cube;
		});

		it("should remove cube from objects when click on cube", function () {
			// arrange
			builder._mouse = new THREE.Vector2(0, 0);
			builder._raycaster.setFromCamera(builder._mouse, builder._camera);
			var intersects = builder._raycaster.intersectObjects(builder._objects);
			var intersect = intersects[0];
			
			// act
			builder._removeCube(intersect);
			
			// assert
			expect(builder._objects.length).toBe(1);
		});

		it("should remove cube from scene when click on cube", function () {
			// arrange
			builder._mouse = new THREE.Vector2(0, 0);
			builder._raycaster.setFromCamera(builder._mouse, builder._camera);
			var intersects = builder._raycaster.intersectObjects(builder._objects);
			var intersect = intersects[0];
			
			// act
			builder._removeCube(intersect);
			
			// assert
			expect(builder._scene.children.length).toBe(8);
		});
		
	});
});