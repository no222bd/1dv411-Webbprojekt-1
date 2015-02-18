describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder($("#ThreeJScontainer"), arr);
	});

	describe("resize", function () {

		it("should call construction.resize", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'resize');
			
			// act
			cubeBuilder.resize();
			
			// assert
			expect(cubeBuilder._construction.resize).toHaveBeenCalled();
		});

	});
});