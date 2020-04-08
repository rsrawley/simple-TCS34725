// ***** MAIN CODE *****

// These are the inputs that interest me
let onlyInputs = [
	["01","02","05","23","25"], // Input source designation number
	["01","02"] // Zone
];
let currentInputSelection = [onlyInputs[0][0],onlyInputs[1][0]]; // Need to setup defaults

// Setup buttons for inputs with default names
for (let i=0; i<onlyInputs.length; i++) {
	let zoneButtons = document.getElementById("zone" + (i+1) + "InputSeletion");
	
	for (let j=0; j<onlyInputs[i].length; j++) {
		let button = document.createElement("button");
		button.id = "zone" + (i+1) + onlyInputs[i][j];

		button.onclick = (function(input,zoneCode){
			return function() {send(input + zoneCode)}
		}(onlyInputs[i][j],["FN","ZS"][i]));

		zoneButtons.appendChild(button);
	}
}


// Listening mode buttons
document.getElementById("optimum").onclick = (function (){
	return createButtonList({
		"AUTO" : "0006",
		"MOVIE" : "0101",
		"MUSIC" : "0112",
		"GAME" : "0118"
	})
})()

document.getElementById("direct").onclick = (function (){
	return createButtonList({
		"AUTO SURROUND" : "0006",
		"ALC" : "0151",
		"DIRECT" : "0007",
		"PURE DIRECT" : "0008",
		"F.S. SURR FOCUS" : "0003",
		"DRAMA" : "0103",
		"ACTION" : "0101",
		"CLASSICAL" : "0107",
		"ROCK/POP" : "0110",
		"EXTENDED STEREO" : "0112",
		"ADVANCED GAME" : "0118",
		"SPORTS" : "0117"
	})
})()

document.getElementById("other").onclick = (function (){
	return createButtonList({
		"AUTO SURR/ ALC/STREAM DIRECT" : "0005",
		"STANDARD" : "0010",
		"ADVANCED SURROUND" : "0100"
	})
})()


function createButtonList(list) {
	let HTMLobject = document.createElement("DIV");
	for (let button in list) {
		let buttonElement = document.createElement("BUTTON");
		buttonElement.innerHTML = button;
		buttonElement.className = "smallButton"
		buttonElement.onclick = function(){
			send(list[button] + "SR")
			send("?S"); // Query actual listening mode (otherwise get cyclic command repeated)
		};
		HTMLobject.appendChild(buttonElement);
		HTMLobject.appendChild(document.createElement("BR"))
	}

	return function() {
		document.getElementById("listeningOptions").replaceChild(HTMLobject,document.getElementById("listeningOptions").firstChild)
	}
}


// Attach event listeners to buttons

// Power and mute buttons for both zones
(function() {
	let ids = {
		"zone1PowerButton": ["PF","PO"]
		,"zone1MuteButton": ["MF","MO"]
		,"zone2PowerButton": ["APF","APO"]
		,"zone2MuteButton": ["Z2MF","Z2MO"]
	};
	for (let key in ids) {
		document.getElementById(key).onclick = (function(idTag,code) {
			return function() {
				let powerStatus = document.getElementById(idTag);

				if (powerStatus.style.backgroundColor == "lime") {
					send(code[0])
				} else {
					send(code[1])
				}
			}
		}(key,ids[key]));
	}
}());

// Volume and bass/treble buttons
(function() {
	let ids = {
		"zone1VolumeMinus1": "VD"
		,"zone1VolumePlus1": "VU"
		,"zone2VolumeMinus1": "ZD"
		,"zone2VolumePlus1": "ZU"
		,"bassMinus1": "BD"
		,"bassPlus1": "BI"
		,"trebleMinus1": "TD"
		,"treblePlus1": "TI"
	};
	for (let key in ids) {
		document.getElementById(key).onclick = (function(code) {
			return function () {send(code)}
		}(ids[key]));
	}
}());

// Zone 1 and 2 2.5dB buttons
(function() {
	let ids = {
		"zone1VolumeMinus5": "VD"
		,"zone1VolumePlus5": "VU"
		,"zone2VolumeMinus5": "ZD"
		,"zone2VolumePlus5": "ZU"
	};
	for (let key in ids) {
		document.getElementById(key).onclick = (function(code) {
			return function () {
				for (let i=0; i<=4; i++) {
					setTimeout(function(){send(code)},i*100)
				}	
			}
		}(ids[key]));
	}
}());

// Add an onclick event listener for the custom command button
document.getElementById("cmd").onkeyup = function (event) {
	if (event.key == "Enter") {
		send(document.getElementById("cmd").value)
	}
}


// Setup web sockets
const socket = io();

socket.on('data', function(data) {
	let item = document.getElementById(data.id);

	if (data.id == "zone1Power" || data.id == "zone2Power") {
		document.getElementById(data.id + "Button").style.backgroundColor = ["","lime"][1-data.value]; // Invert button colour

	} else if (data.id == "zone1Mute" || data.id == "zone2Mute") {
		document.getElementById(data.id + "Button").style.backgroundColor = ["","lime"][1-data.value]; // Invert button colour

	} else if (data.id == "zone1Volume" || data.id == "zone2Volume") {
		let zone = data.id.substring(4,5); // Extract zone number
		document.getElementById("zone" + zone + "Volume").innerHTML = (data.value*0.5 - 80.5).toFixed(1) + "dB";
		document.getElementById("zone" + zone + "VolumeBar").value = data.value;
	
	} else if (data.id == "RGB") {
		// Go through value object and rename the inputs on the buttons for both zones
		for (let input in data.value) {
			for (let zone=1; zone<=2; zone++) {
				let button = document.getElementById("zone" + zone + input);

				if (button != null) {
					button.innerHTML = data.value[input]
				}
			}
		}
	
	} else if (data.id == "zone1Input" || data.id == "zone2Input") {
		let zone = data.id.substring(4,5); // Extract zone number
		let oldSelection = document.getElementById("zone" + zone + currentInputSelection[zone-1])
		if (oldSelection != null) {
			oldSelection.style.backgroundColor = ""; // Deselect old input
		}

		currentInputSelection[zone-1] = data.value;
		let newSelection = document.getElementById("zone" + zone + currentInputSelection[zone-1])
		if (newSelection != null) {
			newSelection.style.backgroundColor = "lime"; // Highlight new input
		}

	} else if (item != null && data.id in translate) {
		// Avoid displaying "cyclic" listening modes
		//if (!(data.id == "listeningMode" && (listeningModes.indexOf(data.value) != -1))) {
			item.innerHTML = translate[data.id](data.value)
		//}
	}
})

// Receive response from receiver
socket.on('response', function (data) {
  document.getElementById("response").innerHTML = data;
})

// Send command to receiver
function send(command) {
	socket.emit('command',command);
}