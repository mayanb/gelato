import moment from 'moment'
import { getUser } from 'react-native-authentication-helpers'

export default class Print {
	constructor() {}

	static generateHTML(svg, task) {
		let { process_type, product_type, display, created_at } = task
		let m = 1.2 // adjust m for scaling, adjust .containerouter height and width for label size
		const { task_label_type } = getUser()

		let labelTypeStyling = '' // task_label_type === '0' gets default styling
		if (task_label_type === '1') {
			labelTypeStyling = `#product {white-space: nowrap; margin-top: -${m*8}px; font-size: ${m*64}px;} #description {font-size: ${m*14}px;}`
		} else if (task_label_type === '2') {
			labelTypeStyling = `#process {white-space: nowrap; margin-top: -${m*8}px; font-size: ${m*64}px;} #description {font-size: ${m*14}px;}`
		}
		let styles = `<style>
		.containerouter {
		min-height: 60vh;
		min-width: 100vw;
		height: 60vh;
		width: 100vw;
	}
	.container {
		min-width: ${m*420}px;
		min-height: ${m*300}px;
		width: ${m*420}px;
		height: ${m*300}px;
		font-family: monospace;
		font-size: ${m*13}px;
			transform: rotate(90deg); 
		transform-origin: top left;
		margin-left: ${m*252}px;
	}
	
	.main {
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
	}
	
	.info-extended {
		margin-top: ${m*15}px;
	}
	
	.info-extended > span {
		display: block;
		font-size: ${m*26}px;
		font-weight: bold;
	}
	
	#description {
		font-weight: normal;
		font-size: ${m*15}px;
		display: block;
		margin-top: ${m*13}px;
	}
	
	${labelTypeStyling}
	
	.bottom-half {
		margin-left: ${m*13}px;
		margin-top: ${m*4}px;
	}
	.lot-code {
		white-space: nowrap;
		font-size: ${m*32}px;
		font-weight: bold;
	}
	
	.bar {
		margin-bottom: ${m*8}px;
		font-size: ${m*14}px;
	}</style>`

		return `${styles}
		<div class='containerouter'>
			<div class='container'>
					<div class='main'>
						<div class='svg-container'>
							${svg}
						 </div>
						 <div class=${'info-extended'}>
							 <span id="process">${process_type.code}</span>
							 <span id="product">${product_type.code}</span>
							 <span id="date">${moment(created_at).format('MMM DD YYYY')}</span>
							 <span id="description">${process_type.name} ${product_type.name}</span>
						 </div>
					</div>
					<div class="bottom-half">
						<div class='bar'>
							--- LOT CODE ----------------------------------
						</div>
						<div class='lot-code'>
							${display}
						</div>
					</div>
				</div>
		</div>`
	}
}
