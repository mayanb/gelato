export function requireIcon(process_icon) {
	img = ''
	switch(process_icon) {
		case "add_inputs_text.png":
			img = require('../resources/assets/system_icons/add_inputs_text.png')
			break;
		case "add_outputs_text.png":
			img = require('../resources/assets/system_icons/add_outputs_text.png')
			break;
		case "inputs.png":
			img = require('../resources/assets/system_icons/inputs.png')
			break;
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
		case "downarrow.png":
			img = require('../resources/assets/downarrow.png')
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
		case "outputs.png":
			img = require('../resources/assets/system_icons/outputs.png')
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
		case "print.png":
			img = require('../resources/assets/system_icons/print.png')
			break;
		case "rcpull.png":
			img = require('../resources/assets/processicons/rcpull.png')
			break;
		case "rightarrow.png":
			img = require('../resources/assets/rightarrow.png')
			break;
		case "rotaryconche.png":
			img = require('../resources/assets/processicons/rotaryconche.png')
			break;
		case "rotaryconchepull.png":
			img = require('../resources/assets/processicons/rotaryconchepull.png')
			break;
		case "search.png":
			img = require('../resources/assets/system_icons/search.png')
			break;
		case "settings.png":
			img = require('../resources/assets/system_icons/settings.png')
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

export function systemIcon(icon) {
	switch(icon) {
		case "more_vert":
			return require('../resources/assets/system_icons/more_vert.png')
		case "close_camera":
			return require('../resources/assets/system_icons/close_camera.png')
		default:
			return require('../resources/assets/system_icons/more_vert.png')
	}
	return ''
}

export function uxIcon(icon) {
	switch(icon) {
		case "edit":
			return require('../resources/assets/editicon.png')
		case "downarrow":
			return require('../resources/assets/downarrow.png')
		default:
			return require('../resources/assets/system_icons/more_vert.png')
	}
	return ''
}
