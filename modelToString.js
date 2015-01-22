// Function to test function below.
var randomColor = function() {
	switch (Math.floor((Math.random() * 6) + 1)){
		case 1:
			return 'Gul';
			break;
		case 2:
			return 'Röd';
			break;
		case 3:
			return 'Lilla';
			break;
		case 4:
			return 'Blå';
			break;
		case 5:
			return '';
			break;
		case 6:
			return 'Orange';
			break;
	}
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
