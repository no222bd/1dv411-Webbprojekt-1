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
			id = id.trim().toLowerCase();
			if (!buildings[id] && id != "name4") {
				clearedAll[id] = all[id];
			}
		}
		
		localStorage.removeItem("buildings");
		buildingSaver._saveAllBuildings(clearedAll);
	});

	describe("saveNewBuilding", function () {
		it("should save one more building", function () {
			// act
			var temp = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(temp).length >= 3).toBeTruthy();
			
			// act
			buildingSaver.saveNewBuilding("name4", "qwerty");
			
			// assert
			expect(Object.keys(buildingSaver._getAllBuildings().length == temp.length + 1)).toBeTruthy();
		});
		
		it("should not save with already existing name", function () {
			// act
			var temp = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(temp).length >= 3).toBeTruthy();
			
			// act
			buildingSaver.saveNewBuilding("name2", "qwerty");
			
			// assert
			expect(Object.keys(buildingSaver._getAllBuildings().length == temp.length)).toBeTruthy();
		});
		
		it("should not save with already existing name (case-insensitive)", function () {
			// act
			var temp = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(temp).length >= 3).toBeTruthy();
			
			// act
			buildingSaver.saveNewBuilding("NAME2", "qwerty");
			
			// assert
			expect(Object.keys(buildingSaver._getAllBuildings().length == temp.length)).toBeTruthy();
		});
	});
});