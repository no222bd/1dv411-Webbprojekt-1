describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("setCubeMaterial", function () {

		it("should have color of FED06F after init", function () {
			expect(builder._cubeMaterial.map.sourceFile.match(/FED06F/g).length > 0).toBeTruthy();
		});

		it("should have new color of E60012", function () {
			builder._setCubeMaterial('#E60012');
			expect(builder._cubeMaterial.map.sourceFile.match(/E60012/g).length > 0).toBeTruthy();
		});

		it("should only accept hex value with an #", function(){
			expect(builder._setCubeMaterial('#E60012')).toBeTruthy();
			expect(builder._setCubeMaterial('E60012')).toBeFalsy();
			expect(builder._setCubeMaterial('hej')).toBeFalsy();
			expect(builder._setCubeMaterial(false)).toBeFalsy();
			expect(builder._setCubeMaterial({})).toBeFalsy();
			expect(builder._setCubeMaterial(null)).toBeFalsy();
			expect(builder._setCubeMaterial(undefined)).toBeFalsy();
			expect(builder._setCubeMaterial(15)).toBeFalsy();
		});
	});
});