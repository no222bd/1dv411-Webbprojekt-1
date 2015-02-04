var CUBEBUILDER = CUBEBUILDER || {};

CUBEBUILDER = {
	mouse : new THREE.Vector2(),
	
	mouseposition : new THREE.Vector2(),
	
	init : function() {

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
		this.camera.position.set(500, 800, 1300);
		this.camera.lookAt(new THREE.Vector3());

		this.controls = new THREE.OrbitControls(this.camera);
		this.controls.noPan = true;
		this.scene = new THREE.Scene();

		// cubes
		this.cubeGeo = new THREE.BoxGeometry(50, 50, 50);
		this.cubeMaterial = new THREE.MeshLambertMaterial({
			color : 0xFFD52D,
			specular : 0x009900,
			shininess : 30,
			shading : THREE.FlatShading
		});
		this.cubeMaterial.ambient = this.cubeMaterial.color;

		// grid
		var geometry = new THREE.Geometry();

		for (var i = -this.size; i <= this.size; i += this.step) {
			geometry.vertices.push(new THREE.Vector3(-this.size, 0, i));
			geometry.vertices.push(new THREE.Vector3(this.size, 0, i));
			geometry.vertices.push(new THREE.Vector3(i, 0, -this.size));
			geometry.vertices.push(new THREE.Vector3(i, 0, this.size));
		}

		var material = new THREE.LineBasicMaterial({
			color : 0x000000,
			opacity : 0.2,
			transparent : true
		});
		
		var line = new THREE.Line(geometry, material, THREE.LinePieces);
		this.scene.add(line);

		this.raycaster = new THREE.Raycaster();

		var geometry = new THREE.PlaneBufferGeometry(1000, 1000);
		geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

		this.plane = new THREE.Mesh(geometry);
		this.plane.visible = false;
		this.scene.add(this.plane);
		this.objects.push(this.plane);

		// Lights
		var ambientLight = new THREE.AmbientLight(0x606060);
		this.scene.add(ambientLight);

		var directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 0.75, 0.5).normalize();
		this.scene.add(directionalLight);

		this.renderer = Detector.webgl ? new THREE.WebGLRenderer({
			antialias : true
		}) : new THREE.CanvasRenderer();
		this.renderer.setClearColor(0xc0c0c0);
		this.renderer.setPixelRatio(window.devicePixelRatio || 1);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		$("#ThreeJScontainer").append(this.renderer.domElement);

		document.getElementById("ThreeJScontainer").addEventListener("mousedown", this.onDocumentMouseTouch);
		document.getElementById("ThreeJScontainer").addEventListener("mouseup", this.onDocumentMouseTouch);
		window.addEventListener("resize", this.onWindowResize);
	},

	onDocumentMouseTouch : function(event) {
		event.preventDefault();

		if (event.type === "mousedown") {
			// save mouse position
			CUBEBUILDER.mouseposition.x = event.clientX;
			CUBEBUILDER.mouseposition.y = event.clientY;
		} else if (event.type === "mouseup") {
			
			if (CUBEBUILDER.mouseposition.x != event.clientX || CUBEBUILDER.mouseposition.y != event.clientY) {
				// if mouse has moved since mousedown event
				return;
			} else {
				CUBEBUILDER.mouse.set((event.clientX / window.innerWidth ) * 2 - 1, -(event.clientY / window.innerHeight ) * 2 + 1);
				CUBEBUILDER.raycaster.setFromCamera(CUBEBUILDER.mouse, CUBEBUILDER.camera);
				var intersects = CUBEBUILDER.raycaster.intersectObjects(CUBEBUILDER.objects);

				if (intersects.length > 0) {
					// if click was inside 3D object
					var intersect = intersects[0];
					switch(event.button) {
					case 0:
						// left mouse button adds cube
						CUBEBUILDER.addCube(intersect);
						break;
					case 2:
					 	// right mouse button removes cube
						CUBEBUILDER.removeCube(intersect);
						break;
					}
				}
			}
		}
	},

	onWindowResize : function(event) {
		CUBEBUILDER.camera.aspect = window.innerWidth / window.innerHeight;
		CUBEBUILDER.camera.updateProjectionMatrix();
		CUBEBUILDER.renderer.setSize(window.innerWidth, window.innerHeight);
	},

	addCube : function(intersect) {
		// Checks if cubes positon will be outside of the plane or higher then allowed.
		if (Math.round(intersect.point.z) < this.size && Math.round(intersect.point.z) > (0 - this.size) && Math.round(intersect.point.x) < this.size && Math.round(intersect.point.x) > (0 - this.size) && Math.round(intersect.point.y) < (this.step * (this.size / (this.step / 2)))) {
			var voxel = new THREE.Mesh(this.cubeGeo, this.cubeMaterial);
			voxel.position.copy(intersect.point).add(intersect.face.normal);
			voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
			this.scene.add(voxel);
			this.objects.push(voxel);
		}
	},

	removeCube : function(intersect) {
		if (intersect.object != this.plane) {
			CUBEBUILDER.scene.remove(intersect.object);
			CUBEBUILDER.objects.splice(CUBEBUILDER.objects.indexOf(intersect.object), 1);
		}
	},

	animate : function() {
		requestAnimationFrame(CUBEBUILDER.animate);
		CUBEBUILDER.render();
	},

	render : function() {
		// monitored code goes here
		this.renderer.render(this.scene, this.camera);
	}
};

CUBEBUILDER.controls;
CUBEBUILDER.camera, CUBEBUILDER.scene, CUBEBUILDER.renderer;
CUBEBUILDER.plane, CUBEBUILDER.cubeGeo, CUBEBUILDER.cubeMaterial;
CUBEBUILDER.raycaster = false;
CUBEBUILDER.objects = [];
CUBEBUILDER.size = 500, CUBEBUILDER.step = 50;

CUBEBUILDER.init();
CUBEBUILDER.animate();
