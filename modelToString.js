// Function to test function below.
var randomColor = function() {
	var colorToReturn = ['Gul', 'Röd', 'Lilla', 'Blå', '', 'Orange'];
	var number = Math.floor((Math.random() * 5));
	return colorToReturn[number];
};

// Function to creating a url string.
var modelToString = function(modelArray){
	var output = '';
	var quantity = 1;

	for(var i = 0; i < modelArray.length; i++){
		if(modelArray[i+1] == modelArray[i]){
			quantity++;
		}else{
			if(quantity > 1){
				output += quantity;
				quantity = 1;
			}
			if(modelArray[i] === ''){
				output += 'E';
			}else {
				output += modelArray[i].charAt(0);
			}
		}
	}
	return output;
};

// Function to creating a color array from url string.
var stringToModel = function(modelString){
	var output = [];
	for(var i = 0; i < modelString.length; i++){
		var next = i;
		var quantity = 0;
		while(!isNaN(modelString.charAt(next))){
			if(quantity > 0) {
				quantity = "" + quantity + modelString.charAt(next);
			}else{
				quantity = +modelString.charAt(next);
			}
			next++;
		}
		// Checks if quantity is 0
		if(quantity === 0){
			quantity = 1;
		// Else adding number of chars that have been past to i.
		}else{
			i += next - i;
		}

		// Fetching color with char.
		var toPush = getColorFromChar(modelString.charAt(next));
		// Pushing number of colors that are in row.
		for(var x = 1; x <= +quantity; x++ ){
			output.push(toPush);
		}
	}
	return output;
};

// Function to switching char to color.
function getColorFromChar(char){
	var returnChar = '';
	switch (char){
		case 'G':
			returnChar = 'Gul';
			break;
		case  'R':
			returnChar = 'Röd';
			break;
		case  'L':
			returnChar = 'Lilla';
			break;
		case  'B':
			returnChar = 'Blå';
			break;
		case  "E":
			returnChar = '';
			break;
		case  'O':
			returnChar = 'Orange';
			break;
	}
	return returnChar;
}

// Function to get cubes side length.
function calcSideByVolume(colorArray){
	return Math.cbrt(colorArray.length);
}

// Code to run test.
var input = [];
for(i = 0; i < 125;i++){
	input.push(randomColor());
}

input = ['Gul', 'Gul', '', 'Lilla', 'Röd', 'Blå', '', 'Orange'];
// Should be 2GELRBEO
console.log(modelToString(input));
// Should be ['Gul', 'Gul', '', 'Lilla', 'Röd', 'Blå', '', 'Orange']
console.log(stringToModel(modelToString(input)));
// Should be 2
console.log(calcSideByVolume(input));