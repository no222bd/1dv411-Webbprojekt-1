describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
		builder._setBase();
	});

	function checkAllVerticesPosition(){
		var vertices = builder._baseGrid.geometry.vertices;
		var numberOfVertices = vertices.length;
		for(var i = 0; i < numberOfVertices; i++){
			if( (vertices[i].z < -builder._baseSize || vertices[i].z > builder._baseSize) || (vertices[i].x < -builder._baseSize || vertices[i].x > builder._baseSize)){
				return false;
			}
		}
		return true;
	}

	describe("setBase", function () {

		it("should have vertices with positions inside of -baseSize and baseSize", function () {
			expect(checkAllVerticesPosition()).toBeTruthy();
		});

		it("should add an Mesh to objects", function(){
			expect(builder._objects.length).toBe(1);
			expect(builder._objects[0].type).toBe("Mesh");
		});

		it("should have an invisible Mesh to objects", function(){
			expect(builder._objects[0].visible).toBeFalsy();
		});

		it("should have an with of baseSize * 2", function(){
			var parameters = builder._objects[0].geometry.parameters;
			expect(parameters.width).toBe(builder._baseSize * 2);
		});

		it("should have an height of baseSize * 2", function(){
			var parameters = builder._objects[0].geometry.parameters;
			expect(parameters.height).toBe(builder._baseSize * 2);
		});

	});
});