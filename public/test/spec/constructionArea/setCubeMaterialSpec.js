describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
	});

	describe("setCubeMaterial", function () {

		it("should have color of FED06F after init", function () {
			expect(builder._cubeMaterial.ambient.getHexString()).toBe('fed06f');
		});

		it("should have new color of E60012", function () {
			builder._setCubeMaterial('#E60012');
			expect(builder._cubeMaterial.color.getHexString()).toBe('e60012');
			expect(builder._cubeMaterial.ambient.getHexString()).toBe('e60012');
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