describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
	});

	describe("setCubeMaterial", function () {

		it("should have color of FFD52D after init", function () {
			expect(builder._cubeMaterial.ambient.getHexString()).toBe('ffd52d');
		});

		it("should have new color of 0000ff", function () {
			builder._setCubeMaterial('0x0000FF');
			expect(builder._cubeMaterial.color.getHexString()).toBe('0000ff');
			expect(builder._cubeMaterial.ambient.getHexString()).toBe('0000ff');
		});
	});
});