import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load Fabric.js library <http://fabricjs.com/>
import { fabric } from 'fabric';

// Load Fabric Brush addon <https://github.com/tennisonchan/fabric-brush/>
import '../../assets/js/fabric-brush.min.js';


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

	// Get canvases from DOM
	drawingCanvas: fabric.Canvas;

	// Create brushes
	sprayBrush: fabric.InkBrush;

	// Variable to hold current brush
	currentBrush: any;


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

		// Set Spray brush (from Fabric Brush addon)
		this.sprayBrush = new fabric.InkBrush(this.drawingCanvas, {
			width: 5,
			inkAmount: 10,
			color: "#ff0000"
		});

		// Set current brush to Spray brush
		this.drawingCanvas.freeDrawingBrush = this.sprayBrush;

		// Prepare canvas for drawing
		this.drawingCanvas.isDrawingMode = true;

		// Update Loading Canvas on button click
        document.getElementById('uploadBtn').addEventListener('click', function() {

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
		
		/*
		const wsIp = '127.0.0.1';
		const wsPort = 8989;

		let connection = new WebSocket('ws://' + wsIp + ':' + wsPort);

		connection.onmessage = function (e) {
			console.log(e.data);
		};
		*/

	} // end of ngAfterViewInit()


	// Function to send the Canvas to the server as a JPG string
	sendVariationToServer(jpgVariation) {

		console.log('Length = ' + jpgVariation.length);
		console.log(jpgVariation);

		// This variable used to pass ourself to event call-backs
		let self:FrameCustomizerComponent = this;

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

	} // end of sendVariationToServer()


	// Function to implement a workaround to the Fabric Brush addon's limitation
	mergeUpperCanvasThenSend() {

		// This variable used to pass ourself to event call-backs
        let self:FrameCustomizerComponent = this;

		// Get canvas size
		let canvasWidth = self.drawingCanvas.width;
		let canvasHeight = self.drawingCanvas.height;	

		// Temporary Canvas that will hold the reassembled frame
		let newFrame = document.createElement('canvas');
		newFrame.width = canvasWidth;
		newFrame.height = canvasHeight;
		let newFrameCtx = newFrame.getContext('2d');

		// Get url of the background frame image
		let canvasBackground = new Image();
		canvasBackground.src = self.frame['path'];

		// Get drawn overlay as JSON (background-image is not included)
		let canvasOverlay = new Image();
		let upperCanvas = <HTMLCanvasElement>document.getElementsByClassName('upper-canvas').item(0);
		let pngOverlay = upperCanvas.toDataURL('image/png');
		canvasOverlay.src = pngOverlay;

		// Build temporary canvas
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

				// Export temporary Canvas as image and send it to the server
				let jpgVariation = newFrame.toDataURL('image/jpg', 0);
				self.sendVariationToServer(jpgVariation);
			};

		};

	} // end of mergeUpperCanvasThenSend()

}