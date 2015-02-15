describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		cubeBuilder = new BUILDER.CubeBuilder();
	});

	describe("renderPerspectives", function () {

		it("should call construction.renderPerspectives", function () {
			// arrange
			spyOn(cubeBuilder._construction, 'renderPerspectives');
			
			// act
			cubeBuilder.renderPerspectives();
			
			// assert
			expect(cubeBuilder._construction.renderPerspectives).toHaveBeenCalled();
		});

	});
});