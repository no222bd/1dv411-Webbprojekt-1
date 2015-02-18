describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		cubeBuilder = new BUILDER.CubeBuilder();
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