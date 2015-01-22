// Function to test function below.
var randomColor = function() {
	var colorToReturn = ['Gul', 'Röd', 'Lilla', 'Blå', '', 'Orange'];
	var number = Math.floor((Math.random() * 5));
	return colorToReturn[number];
};

// Function to creating a url string.
var modelToString = function(cubeArray){
	var output = '';
	var quantity = 1;

	for(i = 0; i < input.length; i++){
		if(input[i+1] == input[i]){
			quantity++;
		}else{
			if(quantity > 1){
				output += quantity;
				quantity = 1;
			}
			if(input[i] === ''){
				output += '0';
			}else {
				output += input[i].charAt(0);
			}
		}
	}
	return output;
};

// Code to run test.
var input = [];
for(i = 0; i < 125;i++){
	input.push(randomColor());
}

console.log(input);
console.log(modelToString(input));
