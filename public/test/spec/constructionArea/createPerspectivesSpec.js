describe("Builder.ConstructionArea", function () {
	var builder;

	beforeEach(function () {
		var arr = [$("#topView"), $("#blueView"), $("#redView"), $("#yellowView"), $("#greenView")];
		builder = new BUILDER.ConstructionArea($("<div style='height: 1000px; width: 1000px;'></div>"), arr);
	});

	describe("createPerspectives", function () {

		it("should create five views after init", function () {
			expect(builder._views.length).toBe(5);
		});
		
		it("should be five views after calling createPerspectives", function () {
			builder._createPerspectives();
			expect(builder._views.length).toBe(5);
		});
		
		describe("views should have correct renderer, camera, JQueryElement and scene", function() {
			
			it("topView should have correct camera position and correct members", function() {
				// renderer
				expect(builder._views[0]._renderer instanceof THREE.CanvasRenderer).toBeTruthy();
				// camera
				expect(builder._views[0]._camera instanceof THREE.OrthographicCamera).toBeTruthy();
				expect(builder._views[0]._camera.position).toEqual(new THREE.Vector3(0, 1600, 0));
				// JQueryElement
				// TODO: add tests för jqueryelement when dependency in builder.js is fixed
				// scene
				expect(builder._views[0]._scene).toEqual(builder._scene);
			});
			
			it("blueView should have correct camera position and correct members", function() {
				// renderer
				expect(builder._views[1]._renderer instanceof THREE.CanvasRenderer).toBeTruthy();
				// camera
				expect(builder._views[1]._camera instanceof THREE.OrthographicCamera).toBeTruthy();
				expect(builder._views[1]._camera.position).toEqual(new THREE.Vector3(0, 250, 250));
				// JQueryElement
				// TODO: add tests för jqueryelement when dependency in builder.js is fixed
				// scene
				expect(builder._views[1]._scene).toEqual(builder._scene);
			});
			
			it("redView should have correct camera position and correct members", function() {
				// renderer
				expect(builder._views[2]._renderer instanceof THREE.CanvasRenderer).toBeTruthy();
				// camera
				expect(builder._views[2]._camera instanceof THREE.OrthographicCamera).toBeTruthy();
				expect(builder._views[2]._camera.position).toEqual(new THREE.Vector3(-250, 250, 0));
				// JQueryElement
				// TODO: add tests för jqueryelement when dependency in builder.js is fixed
				// scene
				expect(builder._views[2]._scene).toEqual(builder._scene);
			});
			
			it("yellowView should have correct camera position and correct members", function() {
				// renderer
				expect(builder._views[3]._renderer instanceof THREE.CanvasRenderer).toBeTruthy();
				// camera
				expect(builder._views[3]._camera instanceof THREE.OrthographicCamera).toBeTruthy();
				expect(builder._views[3]._camera.position).toEqual(new THREE.Vector3(0, 250, -250));
				// JQueryElement
				// TODO: add tests för jqueryelement when dependency in builder.js is fixed
				// scene
				expect(builder._views[3]._scene).toEqual(builder._scene);
			});
			
			it("greenView should have correct camera position and correct members", function() {
				// renderer
				expect(builder._views[4]._renderer instanceof THREE.CanvasRenderer).toBeTruthy();
				// camera
				expect(builder._views[4]._camera instanceof THREE.OrthographicCamera).toBeTruthy();
				expect(builder._views[4]._camera.position).toEqual(new THREE.Vector3(250, 250, 0));
				// JQueryElement
				// scene
				expect(builder._views[4]._scene).toEqual(builder._scene);
			});
		});
	});
});