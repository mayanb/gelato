export function requireIcon(process_icon) {
	img = ''
	switch(process_icon) {
		case "roast.png":
			img = require('../resources/assets/processicons/roast.png')
			break;
		case "melange.png":
			img = require('../resources/assets/processicons/melange.png')
			break;
		case "ballmill.png":
			img = require('../resources/assets/processicons/ballmill.png')
			break;
		case "breakandwinnow.png":
			img = require('../resources/assets/processicons/breakandwinnow.png')
			break;
		case "conche.png":
			img = require('../resources/assets/processicons/conche.png')
			break;	
		case "foil.png":
			img = require('../resources/assets/processicons/foil.png')
			break;
		case "grind.png":
			img = require('../resources/assets/processicons/grind.png')
			break;
		case "hold.png":
			img = require('../resources/assets/processicons/hold.png')
			break;
		case "label.png":
			img = require('../resources/assets/processicons/label.png')
			break;
		case "melangerpull.png":
			img = require('../resources/assets/processicons/melangerpull.png')
			break;
		case "move.png":
			img = require('../resources/assets/processicons/move.png')
			break;
		case "pack.png":
			img = require('../resources/assets/processicons/pack.png')
			break;
		case "package.png":
			img = require('../resources/assets/processicons/package.png')
			break;	
		case "prep.png":
			img = require('../resources/assets/processicons/prep.png')
			break;
		case "prerefine.png":
			img = require('../resources/assets/processicons/prerefine.png')
			break;
		case "rcpull.png":
			img = require('../resources/assets/processicons/rcpull.png')
			break;
		case "rotaryconche.png":
			img = require('../resources/assets/processicons/rotaryconche.png')
			break;
		case "rotaryconchepull.png":
			img = require('../resources/assets/processicons/rotaryconchepull.png')
			break;
		case "ship.png":
			img = require('../resources/assets/processicons/ship.png')
			break;		
		case "temper.png":
			img = require('../resources/assets/processicons/temper.png')
			break;
		case "winnow.png":
			img = require('../resources/assets/processicons/winnow.png')
			break;				
		default:
			img = require('../resources/assets/processicons/default.png')
	}
	return img

}