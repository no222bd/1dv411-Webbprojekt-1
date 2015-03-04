describe("Builder.BuildingSaver", function () {
	var buildingSaver;

	// Update dates every month
	beforeEach(function () {
		buildingSaver = new BUILDER.BuildingSaver();
	});

	describe("createDateString", function () {
		it("should create date '2000-01-01'", function () {
			// act
			var dateString = buildingSaver._createDateString(new Date(2000, 0, 1, 0, 0, 0, 0));
			
			// assert
			expect(dateString).toBe("2000-01-01");
		});
	});
});