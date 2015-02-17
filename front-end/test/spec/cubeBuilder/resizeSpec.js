describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		cubeBuilder = new BUILDER.CubeBuilder();
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