let cmd = require('node-cmd');

let TCS34725 = {};

// Define parameters for communication with TCS34725
TCS34725 = {
	ADDRESS : 0x29, // The I2C address of this module
	MODULE_ID : 0x44, // The ID that should always be returned by this module
	GET_ID : 0x012, // The command to read the module ID
	COMMAND_BIT : 0x80, // The command to signal that we're command it to do something
	SPECIAL_COMMAND : 0xA0, // To read two bytes sequentially with auto-increment

	ENABLE : 0x00, // Enable operations
	ENABLE_PON : 0x01, // Power on
	ENABLE_AEN : 0x02, // RGBC Enable
	ENABLE_AIEN : 0x10, /* RGBC Interrupt Enable */

	ATIME : 0x01, // Amount of time for ADC integration

	CONTROL : 0x0F, // Set the gain level

	// These are two bytes long each and need special command to read
	CDATAL : 0x14, // Clear channel data
	RDATAL : 0x16, // Red channel data
	GDATAL : 0x18, // Green channel data
	BDATAL : 0x1A // Blue channel data
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



shell('i2cset -y 1 0x29 0x80') // The message to send that signals we have a command to send
shell('i2cget -y 1 0x29 0x00')



function shell(command) {
	cmd.get(command,function(err,data,stderr){
		console.log(command)
		console.log(data)
	})
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
