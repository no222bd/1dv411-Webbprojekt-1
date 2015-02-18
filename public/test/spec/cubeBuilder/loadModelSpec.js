describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder(arr);
	});

	describe("loadModel", function () {

		it("should call construction.loadModel", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'loadModel');
			
			// act
			cubeBuilder.loadModel();
			
			// assert
			expect(cubeBuilder._construction.loadModel).toHaveBeenCalled();
		});

	});
});