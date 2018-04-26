import moment from 'moment'

export default class Print {
	constructor() {}

	static generateHTML(svg, task) {
	let { process_type, product_type, display, created_at } = task
	let m = 1.2

	// adjust m for scaling, adjust .containerouter height and width for label size 
	let styles = `<style>
	.containerouter {
		min-height: 60vh; 
  	min-width: 100vw;
  	height: 60vh;
  	width: 100vw;
	}
	.container {
	min-width: ${420*m}px;
  min-height: ${300*m}px;
  width: ${420*m}px;
  height: ${300*m}px;
  font-family: monospace;
  font-size: ${13*m}px;
  transform: rotate(90deg); 
  transform-origin: top left;
  margin-left: ${252*m}px;
}

.main {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.info-extended {
  margin-top: ${13*m}px;
}

.info-extended > span {
  display: block;
  font-size: ${19*m}px;
  font-weight: bold;
}

.info-extended > span.info-words {
   font-weight: normal;
   font-size: ${15*m}px;
   display: block;
   margin-top: ${13*m}px;
} 

.lot-code {
  font-size: ${25*m}px;
  margin-left: ${13*m}px;
  font-weight: bold;
  
}</style>`
	return `${styles}<div class='containerouter'><div class='container'>
	  <div class='main'>
	     ${svg}
	     <div class='info-extended'>
	       <span>${process_type.code}</span>
	       <span>${product_type.code}</span>
	       <span>${moment(created_at).format('MMM DD YYYY')}</span>
	       <span class="info-words">${process_type.name} ${product_type.name}</span>
	     </div>
	  </div>
	  <div class='bar'>
	    ---LOT CODE-----------------------------
	  </div>
	  <div class='lot-code'>
	    ${display}
	  </div>
	</div></div>`
}


}
