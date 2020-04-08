// Translate parameters to useful info
let translate = {
  "listeningMode" : LMtoWords
  ,"playingListeningMode" : PLMtoWords
  ,"toneBypass" : toneBypass
	,"bassStatus" : bassTreble
	,"trebleStatus" : bassTreble
	,"frontDisplay" : frontDisplay
 }

// Translate tone bypass integer into words
function toneBypass(status) {
	return ["BYPASS", "ON"][status]
}

// Translate bass and treble level into decibels
function bassTreble(level) {
	let dB = 6 - level; 	// Convert volume from integer (0-12) to dB (from +6dB to -6dB)
	return dB.toFixed(1) + " dB" // One decimal place -- watch out, returns string
}

// Translate input selection from number to words
function inputSelection(selection) {
  let inputList = {
    "04": "DVD"
    ,"25": "BD"
    ,"05": "TV/SAT"
    ,"15": "DVR/BDR"
    ,"10": "VIDEO 1"
    ,"14": "VIDEO 2"
    ,"19": "HDMI 1"
    ,"20": "HDMI 2"
    ,"21": "HDMI 3"
    ,"22": "HDMI 4"
    ,"23": "HDMI 5"
    ,"26": "HOME MEDIA GALLERY(Internet Radio)"
    ,"17": "iPod/USB"
    ,"18": "XM RADIO"
    ,"01": "CD"
    ,"03": "CD-R/TAPE"
    ,"02": "TUNER"
    ,"00": "PHONO"
    ,"12": "MULTI CH IN"
    ,"33": "ADAPTER PORT"
    ,"27": "SIRIUS"
    ,"31": "HDMI (cyclic)"
  }
  
  if (selection in inputList) {
    return inputList[selection]
  } else {
    return selection // Not in input list
  }
}

// Translate listening mode number into words
function LMtoWords(listeningMode) {
	let listeningModeList = {
    "0001": "STEREO (cyclic)"
    ,"0009": "STEREO (direct set)"
    ,"0151": "Auto Level Control (A.L.C.)"
    ,"0003": "Front Stage Surround Advance Focus"
    ,"0004": "Front Stage Surround Advance Wide"
    ,"0153": "RETRIEVER AIR"
    ,"0010": "STANDARD mode"
    ,"0011": "(2ch source)"
    ,"0013": "PRO LOGIC2 MOVIE"
    ,"0018": "PRO LOGIC2x MOVIE"
    ,"0014": "PRO LOGIC2 MUSIC"
    ,"0019": "PRO LOGIC2x MUSIC"
    ,"0015": "PRO LOGIC2 GAME"
    ,"0020": "PRO LOGIC2x GAME"
    ,"0031": "PRO LOGIC2z Height"
    ,"0032": "WIDE SURROUND MOVIE"
    ,"0033": "WIDE SURROUND MUSIC"
    ,"0012": "PRO LOGIC"
    ,"0016": "Neo:6 CINEMA"
    ,"0017": "Neo:6 MUSIC"
    ,"0028": "XM HD SURROUND"
    ,"0029": "NEURAL SURROUND"
    ,"0021": "(Multi ch source)"
    ,"0022": "(Multi ch source)+DOLBY EX"
    ,"0023": "(Multi ch source)+PRO LOGIC2x MOVIE"
    ,"0024": "(Multi ch source)+PRO LOGIC2x MUSIC"
    ,"0034": "(Multi-ch Source)+PRO LOGIC2z HEIGHT"
    ,"0035": "(Multi-ch Source)+WIDE SURROUND MOVIE"
    ,"0036": "(Multi-ch Source)+WIDE SURROUND MUSIC"
    ,"0025": "DTS-ES Neo:6"
    ,"0026": "DTS-ES matrix"
    ,"0027": "DTS-ES discrete"
    ,"0030": "DTS-ES 8ch discrete"
		,"0100": "ADVANCED SURROUND (cyclic)"
    ,"0101": "ACTION"
    ,"0103": "DRAMA"
    ,"0102": "SCI-FI"
    ,"0105": "MONO FILM"
    ,"0104": "ENTERTAINMENT SHOW"
    ,"0106": "EXPANDED THEATER"
    ,"0116": "TV SURROUND"
    ,"0118": "ADVANCED GAME"
    ,"0117": "SPORTS"
    ,"0107": "CLASSICAL"
    ,"0110": "ROCK/POP"
    ,"0109": "UNPLUGGED"
    ,"0112": "EXTENDED STEREO"
    ,"0113": "PHONES SURROUND"
    ,"0050": "THX (cyclic)"
    ,"0051": "PROLOGIC + THX CINEMA"
    ,"0052": "PL2 MOVIE + THX CINEMA"
    ,"0053": "Neo:6 CINEMA + THX CINEMA"
    ,"0054": "PL2x MOVIE + THX CINEMA"
    ,"0092": "PL2z HEIGHT + THX CINEMA"
    ,"0055": "THX SELECT2 GAMES"
    ,"0068": "THX CINEMA (for 2ch)"
    ,"0069": "THX MUSIC (for 2ch"
    ,"0070": "THX GAMES (for 2ch)"
    ,"0071": "PL2 MUSIC + THX MUSIC"
    ,"0072": "PL2x MUSIC + THX MUSIC"
    ,"0093": "PL2z HEIGHT + THX MUSIC"
    ,"0073": "Neo:6 MUSIC + THX MUSIC"
    ,"0074": "PL2 GAME + THX GAMES"
    ,"0075": "PL2x GAME + THX GAMES"
    ,"0094": "PL2z HEIGHT + THX GAMES"
    ,"0076": "THX ULTRA2 GAMES"
    ,"0077": "PROLOGIC + THX MUSIC"
    ,"0078": "PROLOGIC + THX GAMES"
    ,"0056": "THX CINEMA (for multi ch"
    ,"0057": "THX SURROUND EX (for multi ch)"
    ,"0058": "PL2x MOVIE + THX CINEMA (for multi ch)"
    ,"0095": "PL2z HEIGHT + THX CINEMA (for multi ch)"
    ,"0059": "ES Neo:6 + THX CINEMA (for multi ch)"
    ,"0060": "ES MATRIX + THX CINEMA (for multi ch)"
    ,"0061": "ES DISCRETE + THX CINEMA (for multi ch)"
    ,"0067": "ES 8ch DISCRETE + THX CINEMA (for multi ch)"
    ,"0062": "THX SELECT2 CINEMA (for multi ch)"
    ,"0063": "THX SELECT2 MUSIC (for multi ch)"
    ,"0064": "THX SELECT2 GAMES (for multi ch)"
    ,"0065": "THX ULTRA2 CINEMA (for multi ch)"
    ,"0066": "THX ULTRA2 MUSIC (for multi ch)"
    ,"0079": "THX ULTRA2 GAMES (for multi ch)"
    ,"0080": "THX MUSIC (for multi ch)"
    ,"0081": "THX GAMES (for multi ch)"
    ,"0082": "PL2x MUSIC + THX MUSIC (for multi ch)"
    ,"0096": "PL2z HEIGHT + THX MUSIC (for multi ch)"
    ,"0083": "EX + THX GAMES (for multi ch)"
    ,"0097": "PL2z HEIGHT + THX GAMES (for multi ch)"
    ,"0084": "Neo:6 + THX MUSIC (for multi ch)"
    ,"0085": "Neo:6 + THX GAMES (for multi ch)"
    ,"0086": "ES MATRIX + THX MUSIC (for multi ch)"
    ,"0087": "ES MATRIX + THX GAMES (for multi ch)"
    ,"0088": "ES DISCRETE + THX MUSIC (for multi ch)"
    ,"0089": "ES DISCRETE + THX GAMES (for multi ch)"
    ,"0090": "ES 8CH DISCRETE + THX MUSIC (for multi ch)"
    ,"0091": "ES 8CH DISCRETE + THX GAMES (for multi ch)"
    ,"0005": "AUTO SURR/STREAM DIRECT (cyclic)"
    ,"0006": "AUTO SURROUND"
    ,"0152": "OPTIMUM SURROUND"
    ,"0151": "Auto Level Control (A.L.C.)"
    ,"0007": "DIRECT"
    ,"0008": "PURE DIRECT"
    ,"0212": "ECO MODE 1" // I added this
    ,"0213": "ECO MODE 2" // I added this
    ,"0037": "NEO:X CINEMA" // I added this
    ,"0038": "NEO:X MUSIC" // I added this
    ,"0039": "NEO:X GAME" // I added this
  }

	if (listeningMode in listeningModeList) {
		return listeningModeList[listeningMode]
	} else {
		return listeningMode // Not in input list
	}
}

// Translate playing listening mode number into words
function PLMtoWords(listeningMode) {
let playingListeningModeList = {
    "0001": "STEREO"
    ,"0002": "F.S.SURR FOCUS"
    ,"0003": "F.S.SURR WIDE"
    ,"0004": "RETRIEVER AIR"
    ,"0101": "[)(]PLIIx MOVIE"
    ,"0102": "[)(]PLII MOVIE"
    ,"0103": "[)(]PLIIx MUSIC"
    ,"0104": "[)(]PLII MUSIC"
    ,"0105": "[)(]PLIIx GAME"
    ,"0106": "[)(]PLII GAME"
    ,"0107": "[)(]PROLOGIC"
    ,"0108": "Neo:6 CINEMA"
    ,"0109": "Neo:6 MUSIC"
    ,"010a": "XM HD Surround"
    ,"010b": "NEURAL SURR"
    ,"010c": "2ch Straight Decode"
    ,"010d": "[)(]PLIIz HEIGHT"
    ,"010e": "WIDE SURR MOVIE"
    ,"010f": "WIDE SURR MUSIC"
    ,"1101": "[)(]PLIIx MOVIE"
    ,"1102": "[)(]PLIIx MUSIC"
    ,"1103": "[)(]DIGITAL EX"
    ,"1104": "DTS +Neo:6 / DTS-HD +Neo:6"
    ,"1105": "ES MATRIX"
    ,"1106": "ES DISCRETE"
    ,"1107": "DTS-ES 7.1"
    ,"1108": "multi ch Straight Decode"
    ,"1109": "[)(]PLIIz HEIGHT"
    ,"110a": "WIDE SURR MOVIE"
    ,"110b": "WIDE SURR MUSIC"
    ,"0201": "ACTION"
    ,"0202": "DRAMA"
    ,"0203": "SCI-FI"
    ,"0204": "MONOFILM"
    ,"0205": "ENT.SHOW"
    ,"0206": "EXPANDED"
    ,"0207": "TV SURROUND"
    ,"0208": "ADVANCEDGAME"
    ,"0209": "SPORTS"
    ,"020a": "CLASSICAL"
    ,"020b": "ROCK/POP"
    ,"020c": "UNPLUGGED"
    ,"020d": "EXT.STEREO"
    ,"020e": "PHONES SURR."
    ,"0301": "[)(]PLIIx MOVIE +THX"
    ,"0302": "[)(]PLII MOVIE +THX"
    ,"0303": "[)(]PL +THX CINEMA"
    ,"0304": "Neo:6 CINEMA +THX"
    ,"0305": "THX CINEMA"
    ,"0306": "[)(]PLIIx MUSIC +THX"
    ,"0307": "[)(]PLII MUSIC +THX"
    ,"0308": "[)(]PL +THX MUSIC"
    ,"0309": "Neo:6 MUSIC +THX"
    ,"030a": "THX MUSIC"
    ,"030b": "[)(]PLIIx GAME +THX"
    ,"030c": "[)(]PLII GAME +THX"
    ,"030d": "[)(]PL +THX GAMES"
    ,"030e": "THX ULTRA2 GAMES"
    ,"030f": "THX SELECT2 GAMES"
    ,"0310": "THX GAMES"
    ,"0311": "[)(]PLIIz +THX CINEMA"
    ,"0312": "[)(]PLIIz +THX MUSIC"
    ,"0313": "[)(]PLIIz +THX GAMES"
    ,"1301": "THX Surr EX"
    ,"1302": "Neo:6 +THX CINEMA"
    ,"1303": "ES MTRX +THX CINEMA"
    ,"1304": "ES DISC +THX CINEMA"
    ,"1305": "ES7.1 +THX CINEMA"
    ,"1306": "[)(]PLIIx MOVIE +THX"
    ,"1307": "THX ULTRA2 CINEMA"
    ,"1308": "THX SELECT2 CINEMA"
    ,"1309": "THX CINEMA"
    ,"130a": "Neo:6 +THX MUSIC"
    ,"130b": "ES MTRX +THX MUSIC"
    ,"130c": "ES DISC +THX MUSIC"
    ,"130d": "ES7.1 +THX MUSIC"
    ,"130e": "[)(]PLIIx MUSIC +THX"
    ,"130f": "THX ULTRA2 MUSIC"
    ,"1310": "THX SELECT2 MUSIC"
    ,"1311": "THX MUSIC"
    ,"1312": "Neo:6 +THX GAMES"
    ,"1313": "ES MTRX +THX GAMES"
    ,"1314": "ES DISC +THX GAMES"
    ,"1315": "ES7.1 +THX GAMES"
    ,"1316": "[)(]EX +THX GAMES"
    ,"1317": "THX ULTRA2 GAMES"
    ,"1318": "THX SELECT2 GAMES"
    ,"1319": "THX GAMES"
    ,"131a": "[)(]PLIIz +THX CINEMA"
    ,"131b": "[)(]PLIIz +THX MUSIC"
    ,"131c": "[)(]PLIIz +THX GAMES"
    ,"0401": "STEREO"
    ,"0402": "[)(]PLII MOVIE"
    ,"0403": "[)(]PLIIx MOVIE"
    ,"0404": "Neo:6 CINEMA"
    ,"0405": "AUTO SURROUND Straight Decode"
    ,"0406": "[)(]DIGITAL EX"
    ,"0407": "[)(]PLIIx MOVIE"
    ,"0408": "DTS +Neo:6"
    ,"0409": "ES MATRIX"
    ,"040a": "ES DISCRETE"
    ,"040b": "DTS-ES 7.1"
    ,"040c": "XM HD Surround"
    ,"040d": "NEURALSURR"
    ,"040e": "RETRIEVER AIR"
    ,"0501": "STEREO"
    ,"0502": "[)(]PLII MOVIE"
    ,"0503": "[)(]PLIIx MOVIE"
    ,"0504": "Neo:6 CINEMA"
    ,"0505": "ALC Straight Decode"
    ,"0506": "[)(]DIGITAL EX"
    ,"0507": "[)(]PLIIx MOVIE"
    ,"0508": "DTS +Neo:6"
    ,"0509": "ES MATRIX"
    ,"050a": "ES DISCRETE"
    ,"050b": "DTS-ES 7.1"
    ,"050c": "XM HD Surround"
    ,"050d": "NEURAL SURR"
    ,"050e": "RETRIEVER AIR"
    ,"0601": "STEREO"
    ,"0602": "[)(]PLII MOVIE"
    ,"0603": "[)(]PLIIx MOVIE"
    ,"0604": "Neo:6 CINEMA"
    ,"0605": "STREAM DIRECT NORMAL Straight Decode"
    ,"0606": "[)(]DIGITAL EX"
    ,"0607": "[)(]PLIIx MOVIE"
    ,"0609": "ES MATRIX"
    ,"060a": "ES DISCRETE"
    ,"060b": "DTS-ES 7.1"
    ,"0701": "STREAM DIRECT PURE 2ch"
    ,"0702": "[)(]PLII MOVIE"
    ,"0703": "[)(]PLIIx MOVIE"
    ,"0704": "Neo:6 CINEMA"
    ,"0705": "STREAM DIRECT PURE Straight Decode"
    ,"0706": "[)(]DIGITAL EX"
    ,"0707": "[)(]PLIIx MOVIE"    
    ,"0709": "ES MATRIX"
    ,"070a": "ES DISCRETE"
    ,"070b": "DTS-ES 7.1"
    ,"0881": "OPTIMUM"
    ,"0e01": "HDMI THROUGH"
    ,"0f01": "MULTI CH IN"
    ,"020f": "F. S. SURROUND" // I added this
    ,"0212": "ECO MODE 1" // I added this
    ,"0213": "ECO MODE 2" // I added this
    ,"0110": "STEREO" // I added this
    ,"0111": "NEO:X CINEMA" // I added this
    ,"0112": "NEO:X MUSIC" // I added this
    ,"0113": "NEO:X GAME" // I added this
  }

  if (listeningMode in playingListeningModeList) {
    return playingListeningModeList[listeningMode]
  } else {
    return listeningMode // Not in input list
  }
}


// Translate the front display characters
function frontDisplay(data) {
	let chars = "";
	let matrix = { // For special characters		
		5 : "[)",
		6 : "(]",
		7 : "I",
		8 : "II",
		13 : ".0",
		14 : ".5",
		32 : " "
	}

	for (let pos=0; pos<data.length; pos=pos+2) {
		let asciiCode = parseInt(data.substr(pos,2),16); // Grab two characters and convert the resulting hex into decimal
//console.log(asciiCode,String.fromCharCode(asciiCode))
		if (asciiCode >= 33 && asciiCode <=126 ) { // Only printable ASCII codes		
			chars += String.fromCharCode(asciiCode)
		} else if (asciiCode in matrix) { // Special characters
			chars += matrix[asciiCode]
		} else {
			chars += " " // Change unrecognized symbol to a space
		}
	}

	if (chars.length > 15) { // Some special characters take up two characters, so pad the end with an extra space
		chars += " "
	}

	chars = chars.replace(/ /g,"&nbsp;") // Replace all spaces with HTML spaces
	return chars
}