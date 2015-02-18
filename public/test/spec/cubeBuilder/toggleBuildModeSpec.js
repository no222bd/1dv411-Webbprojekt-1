describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder(arr);
	});

	describe("toggleBuildMode", function () {

		it("should call construction.toggleBuildMode", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'toggleBuildMode');
			
			// act
			cubeBuilder.toggleBuildMode();
			
			// assert
			expect(cubeBuilder._construction.toggleBuildMode).toHaveBeenCalled();
		});

	});
});