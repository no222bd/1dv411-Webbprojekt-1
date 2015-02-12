describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
	});

	describe("createColorLines", function () {
		var lines = [];

		beforeEach(function () {
			lines = builder._createColorLines();
		});

		it("should create four lines", function () {
			expect(lines.length).toBe(4);
		});

		describe("lines have correct colors and positions", function () {

			it("should green and have correct position", function () {
				var line = lines[0];

				var color = new THREE.Color(0,1,0);
				expect(line.material.color).toEqual(color);

				var Vector3 = new THREE.Vector3((builder._baseSize + 20), 0, builder._baseSize);
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.z = -Vector3.z;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

			it("should red and have correct position", function () {
				var line = lines[1];

				var color = new THREE.Color(1,0,0);
				expect(line.material.color).toEqual(color);

				var Vector3 = new THREE.Vector3(-(builder._baseSize + 20), 0, builder._baseSize);
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.z = -Vector3.z;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

			it("should blue and have correct position", function () {
				var line = lines[2];

				var color = new THREE.Color(0,0,1);
				expect(line.material.color).toEqual(color);

				var Vector3 = new THREE.Vector3(builder._baseSize, 0, (builder._baseSize + 20));
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.x = -Vector3.x;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

			it("should yellow and have correct position", function () {
				var line = lines[3];

				var color = new THREE.Color(1,1,0);
				expect(line.material.color).toEqual(color);

				var Vector3 = new THREE.Vector3(builder._baseSize, 0, -(builder._baseSize + 20));
				expect(line.geometry.vertices[0]).toEqual(Vector3);
				Vector3.x = -Vector3.x;
				expect(line.geometry.vertices[1]).toEqual(Vector3);
			});

		});
	});
});