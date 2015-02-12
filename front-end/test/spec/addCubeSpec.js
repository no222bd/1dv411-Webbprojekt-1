describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"));
	});

	describe("addCube", function () {

		it("should add new cube when click on base", function () {
			// arrange
			builder._mouse = new THREE.Vector2(0, 0);
			builder._raycaster.setFromCamera(builder._mouse, builder._camera);
			var intersects = builder._raycaster.intersectObjects(builder._objects);
			var intersect = intersects[0];
			
			// act
			builder._addCube(intersect);
			
			// assert
			expect(builder._objects.length).toBe(2);
		});
		
	});
});