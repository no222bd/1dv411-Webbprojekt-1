describe("Builder.BuildingSaver", function () {
	var buildings;
	var oneMoreBuilding;
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
		oneMoreBuilding = {
			name4: { model: "qwerty", date: "2015-03-03" }
		};
		
		buildingSaver.saveBuildings(buildings);
	});
	
	// remove objects from localStorage
	afterEach(function () {
		var all = buildingSaver._getAllBuildings();
		var clearedAll = {};
		
		for (var id in all) {
			id = id.trim().toLowerCase();
			if (!buildings[id] && !oneMoreBuilding[id]) {
				clearedAll[id] = all[id];
			}
		}
		
		localStorage.removeItem("buildings");
		buildingSaver._saveAllBuildings(clearedAll);
	});

	describe("saveBuildings", function () {
		it("should save one more building", function () {
			// act
			var temp = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(temp).length >= 3).toBeTruthy();
			
			// act
			buildingSaver.saveBuildings(oneMoreBuilding);
			
			// assert
			expect(Object.keys(buildingSaver._getAllBuildings().length == temp.length + 1)).toBeTruthy();
		});
		
		it("should not save already existing building", function () {
			// act
			var temp = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(temp).length >= 3).toBeTruthy();
			
			// act
			buildingSaver.saveBuildings({name2: { model: "qwerty", date: "2015-03-03" }});
			
			// assert
			expect(Object.keys(buildingSaver._getAllBuildings().length == temp.length)).toBeTruthy();
		});
		
		it("should not save already existing building (case-insensitive)", function () {
			// act
			var temp = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(temp).length >= 3).toBeTruthy();
			
			// act
			buildingSaver.saveBuildings({NAME2: { model: "qwerty", date: "2015-03-03" }});
			
			// assert
			expect(Object.keys(buildingSaver._getAllBuildings().length == temp.length)).toBeTruthy();
		});
	});
});