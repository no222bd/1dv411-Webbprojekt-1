describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("createColorLines", function () {
		var lines = [];

		beforeEach(function () {
			lines = builder._createColorLines();
		});

		it("should create four lines", function () {
			expect(lines.length).toBe(4);
		});

		describe("lines should have correct colors and positions", function () {

			it("should be green and have correct position", function () {
				var line = lines[0];

				var Vector3 = new THREE.Vector3((builder._baseSize + 20), 0, builder._baseSize);
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.z = -Vector3.z;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

			it("should be red and have correct position", function () {
				var line = lines[1];

				var Vector3 = new THREE.Vector3(-(builder._baseSize + 20), 0, builder._baseSize);
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.z = -Vector3.z;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

			it("should be blue and have correct position", function () {
				var line = lines[2];

				var Vector3 = new THREE.Vector3(builder._baseSize, 0, (builder._baseSize + 20));
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.x = -Vector3.x;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

			it("should be yellow and have correct position", function () {
				var line = lines[3];

				var Vector3 = new THREE.Vector3(builder._baseSize, 0, -(builder._baseSize + 20));
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.x = -Vector3.x;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

		});
	});
});