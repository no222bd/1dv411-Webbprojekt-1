describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		cubeBuilder = new BUILDER.CubeBuilder();
	});

	describe("clearCubes", function () {

		it("should call construction.clearCubes", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'clearCubes');
			
			// act
			cubeBuilder.clearCubes();
			
			// assert
			expect(cubeBuilder._construction.clearCubes).toHaveBeenCalled();
		});

	});
});