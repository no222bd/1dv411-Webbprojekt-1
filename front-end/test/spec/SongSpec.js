describe("Song", function () {
	var player;
	var song;

	beforeEach(function () {
		player = new Player();
		song = new Song();
	});

	describe("Song playing status", function () {
		it("tells if a song is played right now", function () {
			spyOn(song, "setStatus");
			player.play(song);
			expect(song.setStatus).toHaveBeenCalledWith(true);
		});
	});

	describe("Song number", function(){
		it("sets a song number", function () {
			song.setSongNumber(1);
			expect(song.number).toBe(1);
		});

		it("to get song number", function(){
			song.setSongNumber(1);
			var number = song.getSongNumber();
			expect(number).toBe(1);
		});

		it("throws an error if it is not a number", function () {
			expect(function () {
				song.setSongNumber("tio");
			}).toThrowError("Not a Song number");
		});
	});


});