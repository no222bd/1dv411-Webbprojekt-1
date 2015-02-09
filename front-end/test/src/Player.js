function Player() {
}
Player.prototype.play = function (song) {
	this.currentlyPlayingSong = song;
	this.isPlaying = true;
	this.currentlyPlayingSong.setStatus(this.isPlaying);
};

Player.prototype.pause = function () {
	this.isPlaying = false;
	this.currentlyPlayingSong.setStatus(this.isPlaying);
};

Player.prototype.resume = function () {
	if (this.isPlaying) {
		throw new Error("song is already playing");
	}

	this.isPlaying = true;
	this.currentlyPlayingSong.setStatus(this.isPlaying);
};

Player.prototype.makeFavorite = function () {
	this.currentlyPlayingSong.persistFavoriteStatus(true);
};