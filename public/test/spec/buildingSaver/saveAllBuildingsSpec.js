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

	describe("saveAllBuildings", function () {
		it("should save all buildings in object", function () {
			// act
			var temp = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(temp).length >= 3).toBeTruthy();
			
			// act
			localStorage.removeItem("buildings");
			
			// assert
			expect(buildingSaver._getAllBuildings()).toBeFalsy();
			
			// act
			buildingSaver._saveAllBuildings(temp); // save old buildings again
			
			// assert
			expect(Object.keys(buildingSaver._getAllBuildings()).length >= 3).toBeTruthy();
		});
	});
});