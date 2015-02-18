describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder(arr);
	});

	describe("setColor", function () {

		it("should call construction.setCubeMaterial", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'setCubeMaterial');
			
			// act
			cubeBuilder.setColor();
			
			// assert
			expect(cubeBuilder._construction.setCubeMaterial).toHaveBeenCalled();
		});

	});
});