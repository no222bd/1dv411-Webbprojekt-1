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
	var ground = BABYLON.Mesh.CreateGround("ground", (number*BLOCK_SIZE), (number*BLOCK_SIZE), 1, scene, true);
	ground.position.y = BLOCK_SIZE / 2;
	var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
	groundMaterial.emissiveTexture = new BABYLON.Texture("textures/ground.png", scene);
	groundMaterial.emissiveTexture.uScale = number;
	groundMaterial.emissiveTexture.vScale = number;
	ground.material = groundMaterial;

	// Block colors
	var cubeWallMaterial = new BABYLON.StandardMaterial("block", scene);
	cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/block.png", scene);

	// Creating all blocks.
	var numberOfBlocks = number * number * number;
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
			var blockabove = currentBlock.number + (number * number);
			blockabove = blocksArray[blockabove];
			currentBlock.visibility = blockabove.visibility;
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

	//When click event is raised
	window.addEventListener("click", function () {
		// We try to pick an object
		var pickResult = scene.pick(scene.pointerX, scene.pointerY);
		// Check if object exists.
		if(pickResult.pickedMesh){
			var currentBlock = pickResult.pickedMesh;
			var cubeWallMaterial = new BABYLON.StandardMaterial("block", scene);
			cubeWallMaterial.emissiveTexture = new BABYLON.Texture("textures/blockRed.png", scene);
			currentBlock.material = cubeWallMaterial;
			changeBlockVisibility(currentBlock);
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