(function(outerWindow){
	"use strict";

	outerWindow.BUILDER = outerWindow.BUILDER || {};
	var BUILDER = outerWindow.BUILDER;
	
	/**
	 * Handles saving and loading buildings to localStorage. 
	 */
	BULDER.BuildingSaver = function() {
		
		var self = this;
		var keyLocalStorage = "buildings";
		
		/**
		 * Checks that all stored building have valid dates.
		 * 
 		 * @param Object all A object with all saved buildings in localStorage
 		 * @return Object An object with all the valid buildings
		 */
		function checkDate(all) {
			var ret = []; 
			for (id in all) {
				var created = new Date(all[id].date);
				// 30 days in milliseconds = 60 * 60 * 24 * 30 * 1000
				var validUntil = new Date(created.getTime() + 2592000000);
				var counter = 0;

				if (validUntil >= Date.now()) {
					if (counter >= 250) { break; } // size limit in localStorage
					ret[id] = all[id];
					counter += 1;
				}
			}
			return ret;
		};
		
		/**
		 * Returns an object with all buildings in localStorage.
		 * 
		 * @return Object An object with all buildings in localStorage
		 */
		function getAllBuildings() {
			return JSON.parse(localStorage[keyLocalStorage]);
		};
		
		/**
		 * JSON stringifies and stores an object of buildings in localStorage. 
		 * 
		 * @param Object all An object with all buildings to be stored in localStorage
		 * @return Void
		 */
		function saveAllBuildings(all) {
			localStorage[keyLocalStorage] = JSON.stringify(all);
		}
		
		/**
		 * Check if name alrady exists in localStorage.
		 *
		 * @param String name 
		 * @return Boolean TRUE if building already exists
		 */
		function checkIfBuildingExists(name) {
			var all = self.getAllBuildings();
			for (id in all) {
				if (id == name) { return true; }
			};
			return false;
		}
		
		/**
		 * Adds one building in localStorage
		 *
		 * @param Object building An object with properties "model" and "date", property name is the name of the building
		 * @return Void 
		 */
		this.saveBuilding = function(building) {
			var all = self.getAllBuildings();
			
			for (id in building) {
				if (!self.checkIfBuildingExists(id)) {
					all[id] = building[id];
				}
			};
			
			// checks dates before saving
			self.saveAllBuildings(self.checkDate(all));
		};
		
		/**
		 * Fetches a building from localStorage.
		 *
		 * @param String id Name of the building to fetch
		 * @return Object Return the building as an object or undefined 
		 */
		this.getBuilding = function(id) {
			var building;
			var all = self.getAllBuildings();
			return all[id];
		};
	};

}(window));