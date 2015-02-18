describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder(arr);
	});

	describe("setBaseSize", function () {

		it("should call construction.setBaseSize", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'setBaseSize');
			
			// act
			cubeBuilder.setBaseSize();
			
			// assert
			expect(cubeBuilder._construction.setBaseSize).toHaveBeenCalled();
		});

	});
});