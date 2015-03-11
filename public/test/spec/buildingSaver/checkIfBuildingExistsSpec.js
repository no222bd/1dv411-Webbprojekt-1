describe("Builder.BuildingSaver", function () {
	var buildings;
	var buildingSaver;

	// Update dates every month
	beforeEach(function () {
		buildingSaver = new BUILDER.BuildingSaver();
		buildings = {
			name1: { date: "2015-03-03" },
			name2: { date: "2015-03-02" },
			name3: { date: "2015-03-01" }
		};
	});

	describe("checkIfBuildingExsists", function () {
		it("should find existing building", function () {
			// act
			var result = buildingSaver._checkIfBuildingExists("name2", buildings);
			
			// assert
			expect(result).toBeTruthy();
		});
		
		it("should find existing building case-insensitive", function () {
			// act
			var result = buildingSaver._checkIfBuildingExists("NAME2", buildings);
			
			// assert
			expect(result).toBeTruthy();
		});
		
		it("should not find unexisting building", function () {
			// act
			var result = buildingSaver._checkIfBuildingExists("name4", buildings);
			
			// assert
			expect(result).toBeFalsy();
		});
	});
});