describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("cubeExists", function () {

		it("should return true if a cube positions exists", function () {
			// arrange
			builder._mouse = new THREE.Vector2(0, 0);
			builder._raycaster.setFromCamera(builder._mouse, builder._camera);
			var intersects = builder._raycaster.intersectObjects(builder._objects);
			var intersect = intersects[0];
			
			// act
			builder._addCube(intersect);
			
			// assert
			expect(builder._cubeExists(builder._objects[1].position)).toBeTruthy();
		});

		it("should return false if a cube position doesn't exist", function () {
			// arrange
			builder._mouse = new THREE.Vector2(0, 0);
			builder._raycaster.setFromCamera(builder._mouse, builder._camera);
			var intersects = builder._raycaster.intersectObjects(builder._objects);
			var intersect = intersects[0];

			// act
			builder._addCube(intersect);

			// assert
			var position = builder._objects[1].position;
			var object = new THREE.Vector3(position.x - builder._step, position.y - builder._step, position.z - builder._step);
			expect(builder._cubeExists(object)).toBeFalsy();
		});
		
	});
});