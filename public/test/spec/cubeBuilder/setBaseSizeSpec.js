describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		cubeBuilder = new BUILDER.CubeBuilder();
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