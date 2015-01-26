var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var number = 5;
var blocksArray = [];

var createScene = function () {
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color4(1,0,0,0);

	var BLOCK_SIZE = 10;

	// Camera
	var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 90, BABYLON.Vector3.Zero(), scene);
	camera.lowerBetaLimit = 0.1;
	camera.upperBetaLimit = (Math.PI / 2) * 0.9;
	camera.lowerRadiusLimit = BLOCK_SIZE*10;
	camera.upperRadiusLimit = camera.lowerRadiusLimit * 2;
	camera.radius = camera.upperRadiusLimit;
	camera.attachControl(canvas, true);

	// Ground
	var ground = BABYLON.Mesh.CreateGround("ground", (number*BLOCK_SIZE), (number*BLOCK_SIZE), 1, scene);
	ground.position.y = BLOCK_SIZE / 2;
	var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	groundMaterial.emissiveTexture = new BABYLON.Texture("textures/ground.png", scene);
	groundMaterial.emissiveTexture.uScale = number;
	groundMaterial.emissiveTexture.vScale = number;
	if(number % 2 === 0){
		ground.position.x += BLOCK_SIZE / 2;
		ground.position.z += BLOCK_SIZE / 2;
		groundMaterial.emissiveTexture.vOffset = 0.5 / number;
		groundMaterial.emissiveTexture.uOffset = 0.5 / number;
	}
	ground.material = groundMaterial;

	// Block colors
	var cubeWallMaterial = new BABYLON.StandardMaterial("block", scene);
	cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/block.png", scene);

	// Creating all blocks.
	var numberOfBlocks = Math.pow(number, 3);
	for(var i = 0; i < numberOfBlocks; i++){
		var cube = BABYLON.Mesh.CreateBox("cube", BLOCK_SIZE, scene);
		cube.material = cubeWallMaterial;
		cube.visibility = false;
		cube.number = i;
		blocksArray.push(cube);
	}

	var level = 1;
	var middle = 0;
	if((number % 2) === 0){
		middle = number / 2;
	}else{
		middle = (number -1) / 2;
	}
	var currentBlock = 0;
	for(level; level <= number; level++){
		var y = 0;
		y -= (middle * BLOCK_SIZE);
		if((number % 2) === 0){
			y+= BLOCK_SIZE;
		}
		for(y; y <= (middle*BLOCK_SIZE); y+= BLOCK_SIZE) {
			var  x = 0;
			x -= (middle * BLOCK_SIZE);
			if((number % 2) === 0){
				x+= BLOCK_SIZE;
			}
			for (x; x <= (middle * BLOCK_SIZE); x += BLOCK_SIZE) {
				blocksArray[currentBlock].position = new BABYLON.Vector3(x, (level * BLOCK_SIZE), y);
				currentBlock++;
			}
		}
	}

	function changeBlockVisibility(currentBlock){
		if(currentBlock.visibility){
			// Check if block above is visible.
			var blockAbove = currentBlock.number + (number * number);
			if(blockAbove > Math.pow(number, 3)){
				currentBlock.visibility = false;
			}else {
				blockAbove = blocksArray[blockAbove];
				currentBlock.visibility = blockAbove.visibility;
			}
		}else{
			var blockBelow = currentBlock.number - (number * number);
			if(blockBelow < 0){
				currentBlock.visibility = true;
			}else{
				// Check if block beneath is visible.
				blockBelow = blocksArray[blockBelow];
				currentBlock.visibility = blockBelow.visibility;
				if(!blockBelow.visibility){
					changeBlockVisibility(blockBelow);
				}
			}
		}
	}

	// Stores camera postion before mouse been clicked
	var cameraBeforeClick  = [];

	// Adding camera x,y,z position to cameraBeforeClick array on mouse down.
	window.addEventListener("mousedown", function() {
		cameraBeforeClick[0] = camera.position.x;
		cameraBeforeClick[1] = camera.position.y;
		cameraBeforeClick[2] = camera.position.z;
	});

	// Function checks if camera position have changed.
	function cameraPositionHaveChanged(){
		// Check if camera x position have changed.
		var cameraPositionXChanged = cameraBeforeClick[0] !== camera.position.x;
		// Check if camera y position have changed.
		var cameraPositionYChanged = cameraBeforeClick[1] !== camera.position.y;
		// Check if camera z position have changed.
		var cameraPositionZChanged = cameraBeforeClick[2] !== camera.position.z;

		// Check if camera position have changed.
		return cameraPositionXChanged && cameraPositionYChanged && cameraPositionZChanged;
	}

	//When click event is raised
	window.addEventListener("click", function () {
		// Checks if camera have been rotated or not.
		if(!cameraPositionHaveChanged()) {
			// We try to pick an object
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			// Check if object exists.
			if (pickResult.pickedMesh) {
				var currentBlock = pickResult.pickedMesh;
				var cubeWallMaterial = new BABYLON.StandardMaterial("block", scene);
				cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/blockRed.png", scene);
				currentBlock.material = cubeWallMaterial;
				changeBlockVisibility(currentBlock);
			}
		}
	});

	return scene;
};


var scene = createScene();

engine.runRenderLoop(function () {
	scene.render();
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});