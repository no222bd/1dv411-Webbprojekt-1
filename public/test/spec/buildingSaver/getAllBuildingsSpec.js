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

	describe("getAllBuildings", function () {
		it("should return all existing buildings", function () {
			// act
			var result = buildingSaver._getAllBuildings();
			
			// assert
			expect(Object.keys(result).length >= 3).toBeTruthy(); // can be more buildings from before the test.
		});
	});
});