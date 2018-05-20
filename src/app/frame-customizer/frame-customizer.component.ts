import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { ActivatedRoute } from '@angular/router';

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

	frame: { id :string, path: string };

	drawingCanvas: fabric.Canvas;
	loadingCanvasCtx: CanvasRenderingContext2D;

	sprayBrush: fabric.InkBrush;
	currentBrush: any;


    constructor(private route: ActivatedRoute, private restApiService: RestApiService) {

		// Get URL parameters (information about the current frame)
		this.route.queryParams.subscribe(params => {
			this.frame = { id: params['id'] , path: params['path'] };
		});

	}


    ngAfterViewInit() {
		
		// This variable used to pass ourself to event call-backs
        let self:FrameCustomizerComponent = this;

		// Create Fabric Drawing Canvas from DOM
		this.drawingCanvas = new fabric.Canvas('drawingCanvas');

		// Load image as Canvas background
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

		// Set spray brush (from Fabric Brush addon)
		this.sprayBrush = new fabric.InkBrush(this.drawingCanvas, {
			width: 5,
			inkAmount: 10,
			color: "#ff0000"
		});
		this.drawingCanvas.freeDrawingBrush = this.sprayBrush;

		// Prepare canvas for drawing
		this.drawingCanvas.isDrawingMode = true;

		// Create Fabric Loading Canvas
		this.loadingCanvasCtx = (<HTMLCanvasElement>document.getElementById('loadingCanvas')).getContext('2d');

		// Update Loading Canvas on button click
        document.getElementById('loadVariationButton').addEventListener('click', function() {

			// Get canvas size
			let canvasWidth = self.loadingCanvasCtx.canvas.width;
			let canvasHeight = self.loadingCanvasCtx.canvas.height;	

			// Clear loading canvas
			self.loadingCanvasCtx.clearRect(
				0, 0,
				canvasWidth, canvasHeight
			);

			// Get drawn overlay as JSON (background-image is not included)
			let upperCanvas = <HTMLCanvasElement>document.getElementsByClassName('upper-canvas').item(0);
			let jsonOverlay = upperCanvas.toDataURL('image/png');

			// Show inside loading canvas
			let loadingBackground = new Image();
			loadingBackground.src = self.frame['path'];
			loadingBackground.onload = function() {
				self.loadingCanvasCtx.drawImage(
					loadingBackground,
					0, 0,
					canvasWidth, canvasHeight
				);

				let loadingOverlay = new Image();
				loadingOverlay.src = jsonOverlay;
				loadingOverlay.onload = function() {
					self.loadingCanvasCtx.drawImage(
						loadingOverlay,
						0, 0,
						canvasWidth, canvasHeight
					);

					let jsonVariation = self.loadingCanvasCtx.canvas.toDataURL('image/jpg', 0);
					console.log('Length = ' + jsonVariation.length);
					console.log(jsonVariation);

				};

			};

		});
		
		/*
		const wsIp = '127.0.0.1';
		const wsPort = 8989;

		let connection = new WebSocket('ws://' + wsIp + ':' + wsPort);

		connection.onmessage = function (e) {
			console.log(e.data);
		};
		*/

    }; // end of ngAfterViewInit()
}