import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load Fabric.js library <http://fabricjs.com/>
import { fabric } from 'fabric';

// Load Frame Customizer Controls object
import { FrameCustomizerControls } from './frame-customizer-controls';

@Component({
	selector: 'app-frame-customizer',
    templateUrl: './frame-customizer.component.html',
    styleUrls: ['./frame-customizer.component.css'],
	providers: [ RestApiService ]
})
export class FrameCustomizerComponent {

	title = 'Customize the frame!';

	// Object representing the current frame
	frame: { id :string, path: string };

	// Fabric Canvas for drawing
	drawingCanvas: fabric.Canvas;

	// Upper Canvas added by Fabric Brush addon
	upperCanvas: HTMLCanvasElement;

	doneButton: HTMLButtonElement;
	resetButton: HTMLButtonElement;

	// Tools and color controls
	controls: FrameCustomizerControls;


    constructor(private route: ActivatedRoute, private restApiService: RestApiService) {

		// Get URL parameters (info about the current frame)
		this.route.queryParams.subscribe(params => {
			this.frame = { id: params['id'] , path: params['path'] };
		});

	}


    ngAfterViewInit() {
		
		// This variable used to pass ourself to event call-backs
        let self:FrameCustomizerComponent = this;

		// Create Fabric Drawing Canvas from DOM
		this.drawingCanvas = new fabric.Canvas('drawingCanvas');
		(<HTMLCanvasElement>document.getElementsByClassName('canvas-container').item(0)).style.margin = '0 auto';

		// Get Frame Brush Addon canvas
		this.upperCanvas = <HTMLCanvasElement>document.getElementsByClassName('upper-canvas').item(0);

		// Get "Done" button from DOM
		this.doneButton = <HTMLButtonElement>document.getElementById('doneBtn');
		this.resetButton = <HTMLButtonElement>document.getElementById('resetBtn');

		// Load frame image as Canvas background
		this.drawBackground();

		// Create drawing controls
		this.controls = new FrameCustomizerControls(this.drawingCanvas);

		// Prepare canvas for drawing
		this.drawingCanvas.isDrawingMode = true;

		// Drawing complete button
        this.doneButton.addEventListener('click', function() {

			/* IMPORTANT NOTE:
			 *
			 *	The correct way to export the Fabric canvas to a JPG string and send it to
			 *	the server would be:
			 *
			 * 		let jpgVariation = self.drawingCanvas.toDataURL('image/jpg', 0);
			 *		self.sendVariationToServer(jpgVariation);
			 *
			 * 	Unfortunately the way the Fabric Brush addon is implemented prevents this.
			 *	The creators of the addon will probably fix it in the future, in the
			 *	meantime we have implemented a workaround in mergeUpperCanvasThenSend()
			 *
			 */
			self.mergeUpperCanvasThenSend();

		});
		
		// Drawing clear button
		this.resetButton.addEventListener('click', function() {

			// Clear canvas
			self.drawingCanvas.clear();
			self.drawBackground();

			/* IMPORTANT NOTE:
			 *
			 *	The following two lines of code are needed because the
			 *	Fabric Brush addon works on an overlaying canvas.
			 */
			let upperCtx = self.upperCanvas.getContext('2d');
			upperCtx.clearRect(0, 0, self.upperCanvas.width, self.upperCanvas.height);

		});

		/*
		const wsIp = '127.0.0.1';
		const wsPort = 8989;

		let connection = new WebSocket('ws://' + wsIp + ':' + wsPort);

		connection.onmessage = function (e) {
			console.log(e.data);
		};
		*/

	} // end of ngAfterViewInit()


	
	drawBackground() {

		// This variable used to pass ourself to event call-backs
		let self:FrameCustomizerComponent = this;

		// Load frame image as Canvas background
		fabric.Image.fromURL(this.frame['path'], function(img) {
			self.drawingCanvas.setBackgroundImage(
				img,
				self.drawingCanvas.renderAll.bind( self.drawingCanvas ),
				{
					scaleX: self.drawingCanvas.width / img.width,
					scaleY: self.drawingCanvas.height / img.height
				}
			);
		});
	}

	// Function to send the Canvas to the server as a JPG string
	sendVariationToServer(jpgVariation) {

		console.log(jpgVariation);

/*
		// Create Loading Canvas
		let loadingCanvasCtx = (<HTMLCanvasElement>document.getElementById('loadingCanvas')).getContext('2d');
		let canvasWidth = loadingCanvasCtx.canvas.width;
		let canvasHeight = loadingCanvasCtx.canvas.height;

		// Clear Loading Canvas
		loadingCanvasCtx.clearRect(
			0, 0,
			canvasWidth, canvasHeight
		);

		// Draw variation on the Loading Canvas
		let loadingImg = new Image();
		loadingImg.src = jpgVariation;
		loadingImg.onload = function() {

			loadingCanvasCtx.drawImage(
				loadingImg,
				0, 0,
				canvasWidth, canvasHeight
			);

		};
*/

	} // end of sendVariationToServer()


	// Function to implement a workaround to the Fabric Brush addon's limitation
	mergeUpperCanvasThenSend() {

		// This variable used to pass ourself to event call-backs
        let self:FrameCustomizerComponent = this;

		// Get canvas size
		let canvasWidth = self.drawingCanvas.width;
		let canvasHeight = self.drawingCanvas.height;	

		// Temporary Canvas that will hold the reassembled variation
		let newFrame = document.createElement('canvas');
		newFrame.width = canvasWidth;
		newFrame.height = canvasHeight;
		let newFrameCtx = newFrame.getContext('2d');

		// Get url of the background frame image
		let canvasBackground = new Image();
		canvasBackground.src = self.frame['path'];

		// Get drawn overlay as PNG (background-image is not included)
		let canvasOverlay = new Image();
		canvasOverlay.src = this.upperCanvas.toDataURL('image/png');

		canvasBackground.onload = function() {
			// Draw background on temporary Canvas
			newFrameCtx.drawImage(
				canvasBackground,
				0, 0,
				canvasWidth, canvasHeight
			);

			// Draw overlay on temporary Canvas
			canvasOverlay.onload = function() {
				newFrameCtx.drawImage(
					canvasOverlay,
					0, 0,
					canvasWidth, canvasHeight
				);

				// Export temporary Canvas as JPG and send it to the server
				let jpgVariation = newFrame.toDataURL('image/jpeg', 1);
				self.sendVariationToServer(jpgVariation);
			};

		};

	} // end of mergeUpperCanvasThenSend()

}