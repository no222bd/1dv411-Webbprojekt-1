describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder($("#ThreeJScontainer"), arr);
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