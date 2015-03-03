describe("Builder.BuildingSaver", function () {
	var buildings;
	var buildingSaver;

	// Update dates every month
	// add objects to locaStorage
	beforeEach(function () {
		buildingSaver = new BUILDER.BuildingSaver();
		buildings = {
			name1: { model: "qwerty", date: "2015-03-03" },
			name2: { model: "qwerty", date: "2015-03-02" },
			name3: { model: "qwerty", date: "2015-03-01" }
		};
		
		buildingSaver.saveBuildings(buildings);
	});
	
	// remove objects from localStorage
	afterEach(function () {
		var all = buildingSaver._getAllBuildings();
		var clearedAll = {};
		
		for (var id in all) {
			if (!buildings[id]) {
				clearedAll[id] = all[id];
			}
		}
		
		localStorage.removeItem("buildings");
		buildingSaver._saveAllBuildings(clearedAll);
	});

	describe("getBuilding", function () {
		it("should get one building", function () {
			// act
			var result = buildingSaver.getBuilding("name2");
			
			// assert
			expect(typeof result == "object").toBeTruthy();
		});
		
		it("should not get unexisting building", function () {
			// act
			var result = buildingSaver.getBuilding("name6");
			
			// assert
			expect(typeof result == "object").toBeFalsy();
		});
	});
});