// Setup web sockets
const socket = io();

socket.on('data', function(data) {
	let doc = document.getElementById(data.id);

	if (doc) {
		if (data.id == "background") {
			doc.style.backgroundColor = data.value
		} else {
			doc.innerHTML = data.value
		}
	}
})

// Send command to receiver
function send(command) {
	socket.emit(command);
}
