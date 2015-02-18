describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder(arr);
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