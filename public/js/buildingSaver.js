(function(outerWindow){
	"use strict";

	outerWindow.BUILDER = outerWindow.BUILDER || {};
	var BUILDER = outerWindow.BUILDER;
	
	/**
	 * Handles saving and loading buildings to localStorage. 
	 */
	BUILDER.BuildingSaver = function() {
		
		var keyLocalStorage = "buildings";
		
		/**
		 * Checks that all stored building have valid dates.
		 * 
 		 * @param Object all A object with all saved buildings in localStorage
 		 * @return Object An object with all the valid buildings
		 */
		function checkDate(all) {
			var ret = {};
			var counter = 0;
			
			for (var id in all) {
				var created = new Date(all[id].date);
				// 30 days in milliseconds = 60 * 60 * 24 * 30 * 1000
				var validUntil = new Date(created.getTime() + 2592000000);
				var now = new Date();
				now.setHours(0, 0, 0, 0);
				
				if (validUntil >= now.getTime()) {
					if (counter >= 250) { break; } // size limit for localStorage
					ret[id] = all[id];
					counter += 1;
				}
			}
			return ret;
		};
		
		/**
		 * Check if name alrady exists in localStorage.
		 *
		 * @param String name 
		 * @return Boolean TRUE if building already exists
		 */
		function checkIfBuildingExists(name, all) {
			for (var id in all) {
				if (id == name) { return true; }
			};
			return false;
		};
		
		/**
		 * Returns an object with all buildings in localStorage.
		 * 
		 * @return Object {"building":{"model":"qwerty","date":"1999-12-31"}} or FALSE
		 */
		function getAllBuildings() {
			if (localStorage.getItem(keyLocalStorage)) {
				return JSON.parse(localStorage.getItem(keyLocalStorage));
			} else {
				false;
			}
		};
		
		/**
		 * JSON stringifies and stores an object of buildings in localStorage. 
		 * 
		 * @param Object all An object with all buildings to be stored in localStorage
		 * @return Void
		 */
		function saveAllBuildings(all) {
			localStorage.setItem(keyLocalStorage, JSON.stringify(all));
		};
		
		/**
		 * Fetches a building from localStorage.
		 *
		 * @param String id Name of the building to fetch
		 * @return Object {"building":{"model":"qwerty","date":"1999-12-31"}} or false
		 */
		this.getBuilding = function(id) {
			var building, all = getAllBuildings();
			if (all) {
				return all[id];
			} else {
				return false;
			}
		};
		
		/**
		 * Adds one building in localStorage
		 *
		 * @param Object building {"building":{"model":"qwerty","date":"1999-12-31"}}
		 * @return Void 
		 */
		this.saveBuildings = function(buildings) {
			var all = getAllBuildings();
			if (typeof all != "object") {
				all = {};
			}
			
			for (var id in buildings) {
				if (!checkIfBuildingExists(id, all)) {
					all[id] = buildings[id];
				}
			};
			
			// checks dates before saving
			saveAllBuildings(checkDate(all));
		};
		
		// OBS!!! For testing purpose only!!! Do not use in application!!!
		// TODO: Remove before deploy!
		this._checkDate = checkDate;
		this._checkIfBuildingExists = checkIfBuildingExists;
		this._getAllBuildings = getAllBuildings;
		this._saveAllBuildings = saveAllBuildings;
		// End
	};

}(window));