describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder($("#ThreeJScontainer"), arr);
	});

	describe("enableOrDisableOrbit", function () {

		it("should call construction.enableOrDisableOrbit", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'enableOrDisableOrbit');
			
			// act
			cubeBuilder.enableOrDisableOrbit();
			
			// assert
			expect(cubeBuilder._construction.enableOrDisableOrbit).toHaveBeenCalled();
		});

	});
});