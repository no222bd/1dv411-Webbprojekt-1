describe("Testing", function() {
	var builder;
	
	beforeEach(function() {
		builder = new BUILDER.ConstructionArea($("<div></div>"));
		
		console.log(builder._step);
	});
	
	it("contains spec with an expectation", function() {
    	expect(true).toBe(true);
  	});
});