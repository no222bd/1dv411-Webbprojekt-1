describe("Builder.CubeBuilder", function () {
	var cubeBuilder;
	
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		cubeBuilder = new BUILDER.CubeBuilder($("#ThreeJScontainer"), arr);
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