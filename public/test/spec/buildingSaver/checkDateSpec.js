describe("Builder.BuildingSaver", function () {
	var buildings;
	var buildingSaver;

	// Update dates every month
	beforeEach(function () {
		buildingSaver = new BUILDER.BuildingSaver();
		buildings = {
			name1: { date: "2015-03-03" },
			name2: { date: "2015-03-03" },
			name3: { date: "2015-01-30" }
		};
	});

	describe("checkDate", function () {
		it("should remove one building", function () {
			// act
			var checkedBuildings = buildingSaver._checkDate(buildings);
			
			// assert
			expect(Object.keys(buildings).length).toBe(3);
			expect(Object.keys(checkedBuildings).length).toBe(2);
		});
	});
});