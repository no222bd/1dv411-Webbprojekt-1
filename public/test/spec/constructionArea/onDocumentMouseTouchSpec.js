describe("Builder.ConstructionArea", function () {
	var builder;
	var event;
	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
		event = {
			pageX: 500,
			pageY: 500,
			type: 'mouseup',
			button: 0,
			preventDefault: function(){}
		}
	});

	describe("onDocumentMouseTouch", function () {

		it("should set mouseposition on mousedown", function () {
			event.type = 'mousedown';
			builder._onDocumentMouseTouch(event);
			expect(builder._mouseposition.x).toEqual(500);
			expect(builder._mouseposition.y).toEqual(500);
		});

		it("should not remove or add cube if camera have been moved", function () {
			spyOn(builder._raycaster, 'setFromCamera');
			builder._mouseposition.x = 10;
			builder._mouseposition.y = 10;
			builder._onDocumentMouseTouch(event);
			expect(builder._raycaster.setFromCamera).not.toHaveBeenCalled();
		});

		it("should add cube", function () {
			builder._mouseposition.x = 500;
			builder._mouseposition.y = 500;
			builder._onDocumentMouseTouch(event);
			// Testing addCube have been called.
			expect(builder._objects.length).toEqual(2);
		});

		it("should not addCube outside of base", function () {
			event.pageX = 1;
			event.pageY = 1;
			builder._mouseposition.x = 1;
			builder._mouseposition.y = 1;
			builder._onDocumentMouseTouch(event);
			// Testing intersect length.
			expect(builder._objects.length).toEqual(1);
		});

		it("should remove cube", function () {
			builder._mouseposition.x = 500;
			builder._mouseposition.y = 500;
			builder._onDocumentMouseTouch(event);
			expect(builder._objects.length).toEqual(2);
			builder.toggleBuildMode();
			builder._onDocumentMouseTouch(event);
			// Testing removeCube have been called.
			expect(builder._objects.length).toEqual(1);
		});

		it("should remove cube when right mouse button is clicked", function () {
			builder._mouseposition.x = 500;
			builder._mouseposition.y = 500;
			builder._onDocumentMouseTouch(event);
			expect(builder._objects.length).toEqual(2);
			event.button = 2;
			builder._onDocumentMouseTouch(event);
			// Testing removeCube have been called.
			expect(builder._objects.length).toEqual(1);
		});

	});
});