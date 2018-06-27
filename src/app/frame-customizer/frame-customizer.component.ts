import { Component, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load Fabric.js library <http://fabricjs.com/>
import { fabric } from 'fabric';

// Load custom objects
import { FrameCustomizerControls } from './frame-customizer-controls';

@Component({
	selector: 'app-frame-customizer',
    templateUrl: './frame-customizer.component.html',
    styleUrls: ['./frame-customizer.component.css'],
	providers: [ RestApiService ]
})
export class FrameCustomizerComponent implements AfterViewInit {

	title = 'Customize the frame!';

	// Object representing the current frame
	frame: { id :string, path: string };

	// Main content wrapper
	mainContent: HTMLElement;

	// Fabric Canvas for drawing
	drawingCanvas: fabric.Canvas;

	// Upper Canvas added by Fabric Brush addon
	canvasContainer: HTMLElement;
	upperCanvas: HTMLCanvasElement;

	resetButton: HTMLButtonElement;
	doneButton: HTMLButtonElement;

	// Tools and color controls
	controls: FrameCustomizerControls;

	// Timer used by the resize event
    resizeTimer: number;


    constructor(private router: Router, private route: ActivatedRoute, private restApiService: RestApiService) {

		// Get URL parameters (info about the current frame)
		this.route.queryParams.subscribe(params => {
			this.frame = { id: params['frame'] , path: params['path'] };
		});

	}


    ngAfterViewInit() {

		// This variable used to pass ourself to event call-backs
        let self:FrameCustomizerComponent = this;

		// Get main content wrapper from DOM
		this.mainContent = document.getElementById('main');

		// Create Fabric Drawing Canvas from DOM
		this.resizeCanvas();
		this.drawingCanvas = new fabric.Canvas('drawingCanvas');
		(<HTMLCanvasElement>document.getElementsByClassName('canvas-container').item(0)).style.margin = '0 auto';

		// Get Frame Brush Addon canvas
		this.upperCanvas = <HTMLCanvasElement>document.getElementsByClassName('upper-canvas').item(0);

		// Get "Done" button from DOM
		this.resetButton = <HTMLButtonElement>document.getElementById('resetBtn');
		this.doneButton = <HTMLButtonElement>document.getElementById('doneBtn');

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
			 * 		let jpgVariation = self.drawingCanvas.toDataURL('image/jpg', 1);
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

	} // end of ngAfterViewInit()


	
	drawBackground() {

		// This variable used to pass ourself to event call-backs
		let self:FrameCustomizerComponent = this;

		// Load frame image as Canvas background
		fabric.Image.fromURL(this.frame['path'], function(img) {
			console.log(self.frame['path']);
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

		this.restApiService.saveVariation(jpgVariation, this.frame.id).then(
			data => {
				let fileName = data;

				// Redirect to Frame Sharing afterwards
				this.router.navigate( ['/share-from-store'],{queryParams:
					{id: this.frame.id, path: this.frame.path, variationPath: fileName}
				});

			}
		);

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
		newFrame.width = 1920;
		newFrame.height = 817;
		let newFrameCtx = newFrame.getContext('2d');

		// Get url of the background frame image
		let canvasBackground = new Image();
		canvasBackground.crossOrigin = 'anonymous';
		canvasBackground.src = self.frame['path'];

		canvasBackground.onload = function() {
			// Draw background on temporary Canvas
			newFrameCtx.drawImage(
				canvasBackground,
				0, 0,
				1920, 817
			);

			// Draw overlay on temporary Canvas
			// Get drawn overlay as PNG (background-image is not included)
			let canvasOverlay = new Image();
			canvasOverlay.crossOrigin = 'anonymous';
			canvasOverlay.src = self.upperCanvas.toDataURL('image/png');

			canvasOverlay.onload = function() {
				newFrameCtx.drawImage(
					canvasOverlay,
					0, 0,
					1920, 817
				);

				// Export temporary Canvas as JPG and send it to the server
				let jpgVariation = newFrame.toDataURL('image/jpeg', 1);
				self.sendVariationToServer(jpgVariation);
			};

		};

	} // end of mergeUpperCanvasThenSend()

	resizeCanvas() {
		let canvas = <HTMLCanvasElement>document.getElementById('drawingCanvas');

        // Resize canvas
        let currentWidth = this.mainContent.clientWidth;
		let currentHeight = this.mainContent.clientHeight;

        let currentRatio = currentWidth / currentHeight;
        let canvasRatio = 1920 / 817;

        let newCanvasWidth;
        let newCanvasHeight;
        if (canvasRatio > currentRatio) {
			newCanvasWidth = currentWidth;
            newCanvasHeight = newCanvasWidth / canvasRatio;
        }
        else {
            newCanvasHeight = currentHeight;
            newCanvasWidth = newCanvasHeight * canvasRatio;
		}

		canvas.setAttribute( 'width', newCanvasWidth.toString()+'px' );
		canvas.setAttribute( 'height', newCanvasHeight.toString()+'px' );
    }

}