describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		cubeBuilder = new BUILDER.CubeBuilder();
	});

	describe("saveModel", function () {

		it("should call construction.saveModel", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'saveModel');
			
			// act
			cubeBuilder.saveModel();
			
			// assert
			expect(cubeBuilder._construction.saveModel).toHaveBeenCalled();
		});

	});
});