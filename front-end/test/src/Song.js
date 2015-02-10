function Song() {
}

function testBoolean(value){
	if(value === true || value === false){
		return true;
	}
	return false;
}

Song.prototype.persistFavoriteStatus = function(value) {
	if(testBoolean(value)) {
		this.favorite = value;
	}
};

Song.prototype.setStatus = function(status){
	this.isPlayed = status;
};

Song.prototype.isPlayedNow = function(){
	return this.isPlayed;
};

Song.prototype.setSongNumber = function(number){
	if(isNaN(number)){
		throw new Error("Not a Song number");
	}
	this.number = number;
};

Song.prototype.getSongNumber = function(){
	return this.number;
};