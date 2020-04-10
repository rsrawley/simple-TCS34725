let cmd = require('node-cmd');
let i2c = {
	queue : []
};

// Define parameters for communication with TCS34725
let TCS34725 = {
	calibration : {black:[],white:[]},

	address : 0x29, // The I2C address of this module

	moduleID : 0x44, // The ID that should always be returned by this module

	commands : {
		COMMAND_BIT : 0x80, // The command to signal that we're command it to do something
		SPECIAL_COMMAND : 0xA0, // To read two bytes sequentially with auto-increment
	},

	registers : {	
		GET_MODULE_ID : 0x012, // The command to read the module ID
		
		ENABLE : 0x00, // Enable operations
		ENABLE_PON : 0x01, // Power on
		ENABLE_AEN : 0x02, // RGBC Enable
		ENABLE_AIEN : 0x10, /* RGBC Interrupt Enable */
		//DISABLE_AIEN : 0x10, /* RGBC Interrupt Enable */

		ATIME : 0x01, // Amount of time for ADC integration

		CONTROL : 0x0F, // Set the gain level

		// These are two bytes long each and need special command to read
		CDATAL : 0x14, // Clear channel data
		RDATAL : 0x16, // Red channel data
		GDATAL : 0x18, // Green channel data
		BDATAL : 0x1A // Blue channel data
	}
}

// To check valid integration times
TCS34725.validIntegrationTimes = {
  2.4 : 0xFF, /**<  2.4ms - 1 cycle    - Max Count: 1024  */
  24 : 0xF6, /**<  24ms  - 10 cycles  - Max Count: 10240 */
  50 : 0xEB, /**<  50ms  - 20 cycles  - Max Count: 20480 */
  101 : 0xD5, /**<  101ms - 42 cycles  - Max Count: 43008 */
  154 : 0xC0, /**<  154ms - 64 cycles  - Max Count: 65535 */
  300 : 0x00, /**<  700ms - 256 cycles - Max Count: 65535 */
};

// To check valid gains
TCS34725.validGains = {
  1 : 0x00, /**<  No gain  */
  4 : 0x01, /**<  2x gain  */
  16 : 0x02, /**<  16x gain */
  60 : 0x03, /**<  60x gain */
};


// Set up web server
const express = require('express'); // Web server
const app = express();
const server = require('http').createServer(app);
server.listen(9000); // Start the webserver on port 9000
app.use(express.static(__dirname + '/html')); // Tell the server location of the static web pages

// Web socket server
io = require('socket.io').listen(server);

io.on('connection', function(socket){
  socket.on('getColors', async function() {		
		let data = await readColors().htmlColorHex;
		socket.emit('data',{id:"background", value: data});
		socket.emit('data',{id:"colorHex", value: data});				
  })
})


async function readColors(){	
	// Turn light on
	await write("ENABLE",TCS34725.registers.ENABLE_PON | TCS34725.registers.ENABLE_AEN);
	
	// Read clear and color channels
	let channels = ["CDATAL","RDATAL","GDATAL","BDATAL"];
	let result = [];
	for (let i = 0; i < channels.length; i++) {
		result.push(await read(channels[i],2))
	}

	// Turn off the light
	await write("ENABLE",TCS34725.registers.ENABLE_PON | TCS34725.registers.ENABLE_AEN | TCS34725.registers.ENABLE_AIEN);

//if (TCS34725.calibration.white.length > 0) {console.log("Read colors, raw:",result)}

	let htmlColorHex = "#";
	for (let i=1; i<result.length; i++) {

		if (TCS34725.calibration.white.length > 0) { // There is calibration data
			// This will map the uncalibrated range to the calibrated range
			result[i] = Math.round((result[i] - TCS34725.calibration.black[i]) / (TCS34725.calibration.white[i] - TCS34725.calibration.black[i]) * 0xffff)
			if (result[i] < 0) {
				result[i] = 0;
			}
		}

		htmlColorHex += Math.round(result[i]/0xffff*0xff).toString(16).padStart(2,"0") // Express color as fraction of clear channel and change the scale from 65535 to 255 maximum
		//htmlColorHex += Math.round(result[i]/result[0]*0xff).toString(16).padStart(2,"0") // Express color as fraction of clear channel and change the scale from 65535 to 255 maximum
		//htmlColorHex += Math.round(parseInt(result[i],16)/0xffff*0xff).toString(16).padStart(2,"0") // Change the scale from 65535 to 255 maximum (16 bit to 8 bit)
	}

//if (TCS34725.calibration.white.length > 0) {console.log("Read colors, calibrated:",result)}
	
	return {htmlColorHex: htmlColorHex, allColors: result}
}


initialize();
// Set up basic functions for sensor
async function initialize() {
	// Turn on oscillator and turn on ADC chip (essentially activates the sensor)
	await write("ENABLE",TCS34725.registers.ENABLE_PON | TCS34725.registers.ENABLE_AEN)
	console.log("ADC active")

	// Set integration time
	await write("ATIME", TCS34725.validIntegrationTimes[24])
	console.log("Integration time set")
	
	// Set gain level
	await write("CONTROL", TCS34725.validGains[60])
	console.log("Gain level set")
			
	await calibrateBlack(); 	
	setTimeout(calibrateWhite,5000);

	console.log("Timer fired for white")
}


async function calibrateBlack() {
	console.log("Calibrating black...");

	// Need to throw away first read before getting accurate values
	await readColors();
	await readColors();
	
	let colors = await readColors();
	TCS34725.calibration.black = colors.allColors.map(function(color) { return color });
	
	console.log("Calibration black values:",TCS34725.calibration.black);
}


async function calibrateWhite() {
	console.log("Calibrating white...");

	let colors = await readColors();
	TCS34725.calibration.white = colors.allColors.map(function(color) { return color });
	
	console.log("Calibration white values:",TCS34725.calibration.white);

	continuousRead();
}


function continuousRead() {
	setInterval(async function(){
		let colors = await readColors();
		console.log("Reading:",colors.allColors)
		io.emit('data',{id:"background", value: colors.htmlColorHex});
		io.emit('data',{id:"colorHex", value: colors.htmlColorHex});		
	},1000)
}


// Read from sensor
async function read(address,numBytes) {
	if (!(address in TCS34725.registers)) { // Valid address ?
		return console.log("Incorrect read address : " + address)
	}

	let commands;
	if (numBytes == 2) { // Read two bytes (high byte first, then low byte)
		commands = [
			`i2cset -y 1 0x${TCS34725.address.toString(16)} 0x${(TCS34725.commands.COMMAND_BIT | (TCS34725.registers[address])+1).toString(16)}`,
			`i2cget -y 1 0x${TCS34725.address.toString(16)}`,
			`i2cset -y 1 0x${TCS34725.address.toString(16)} 0x${(TCS34725.commands.COMMAND_BIT | TCS34725.registers[address]).toString(16)}`,
			`i2cget -y 1 0x${TCS34725.address.toString(16)}`
		]
	} else {
		commands = [
			`i2cset -y 1 0x${TCS34725.address.toString(16)} 0x${(TCS34725.commands.COMMAND_BIT | TCS34725.registers[address]).toString(16)}`,
			`i2cget -y 1 0x${TCS34725.address.toString(16)}`
		]
	}
	return await shell(commands);
}

// Write to sensor
async function write(address,value) {
	if (!(address in TCS34725.registers)) { // Valid address ?
		return console.log("Incorrect write address : " + address)
	}

	return await shell([
		`i2cset -y 1 0x${TCS34725.address.toString(16)} 0x${(TCS34725.commands.COMMAND_BIT | TCS34725.registers[address]).toString(16)}`,
		`i2cset -y 1 0x${TCS34725.address.toString(16)} 0x${value.toString(16)}`
	]);
}
//shell('i2cset -y 1 0x29 0x80') // The message to send that signals we have a command to send
//shell('i2cget -y 1 0x29 0x00')


// Give an array of shell commands and give output in callback
async function shell(commands) {
	if (i2c.queue.length > 100) { // Drop incoming commands -- too many in queue
		return console.log("Warning! Shell commands coming too fast, can't keep up!")
	}

	i2c.queue.push({commands: commands});

	// The following creates a promise that can be resolved externally by assigning resolve() and reject() Promise parameters to properties of the Promise itself ... clever !	
	if (i2c.queue.length > 1) { // Other commands executing since we're not in number 1 spot, so create a promise
		i2c.queue[i2c.queue.length - 1].next = ( () => {
			let res, rej;

			let promise = new Promise((resolve, reject) => {
				res = resolve;
				rej = reject;
			});

			promise.resolve = res;
			promise.reject = rej;

			return promise
		})()

		await i2c.queue[i2c.queue.length - 1].next; // Commands in the queue are being executed, we gotta wait
	}

	// Process each command -- use await with promises to wait for each command to be done
	let response = ""; // Each command's output will be concatenated into response
	for (let i = 0; i < i2c.queue[0].commands.length; i++) {
		response += await new Promise(function(resolve, reject) {
			cmd.get(i2c.queue[0].commands[i], function(err,data) {
				if (!err) {
					data = data.match(/[0-9a-f]{2}/); // Search for just the hexadecimal part of 0x??
					if (data == null) {
						data = ""
					}
					resolve(data);
				} else {
					console.log("rejected")
					reject(err)
				}
			})
		})
	}
	
	i2c.queue.shift(); // Remove command from queue
	if (i2c.queue.length > 0) { // Other commands waiting
		i2c.queue[0].next.resolve(); // Resolve the Promise that is holding up the next command so that it can proceed
	}
	
	return parseInt(response,16) // Make into hexadecimal number						
}

// protocol is not standard I2C
// write to command register first to tell it where which address you want to read/write
// i2cset (-y means no user prompt) (1 means i2c register 1) (0x29 is hex address of TCS3472 on i2c bus) (command)
// command is i2cset -y 1 0x29 0x80 | [address in hex] , which is 10000000 OR address
// for example, to read device id at address 0x12:
// i2cset -y 1 0x29 0x92
// i2cget -y 1 0x29
// returns 0x44 (id for TCS34721)

// to write at address 0x00
// i2cset -y 1 0x29 0x80
// i2cset -y 1 0x29 0x03 (00000011 in binary)
// returns 0x44 (id for TCS34721)

// to read colors there are two consecutive bytes to read, so you will have to set field parameter 01 to auto-increment address on successive read (I think...)
// not so sure based on examples of code i saw...

// can you tie the clear (so lux intensity -- clear for "no colour) interrupt to something like zero so that it shuts off the LED?
// and then "clear" (remove) the clear interrupt to turn led on?
// set interrupts to enable and turn on aen and pon on address 0x00 (0x13)
// THIS IS NOT NECESSARY -- set Clear interrupt high threshold low byte (address 0x06) to 01 (more than 00) --
// and to reactive light, deactive interrupts on address 0x00 (0x03)

/*
raspberry pi tutorial series -- ref : https://www.waveshare.com/wiki/Raspberry_Pi_Tutorial_Series:_I2C
TCS3472 data sheet -- https://cdn-shop.adafruit.com/datasheets/TCS34725.pdf
decimal to hex converter -- https://www.rapidtables.com/convert/number/decimal-to-hex.html
github repo for python adafruit code -- https://github.com/adafruit/Adafruit_TCS34725/blob/master/Adafruit_TCS34725.cpp


*/
