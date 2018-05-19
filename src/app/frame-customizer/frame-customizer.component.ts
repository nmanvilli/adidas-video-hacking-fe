import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { ActivatedRoute } from '@angular/router';

// Load Fabric.js library <http://fabricjs.com/>
import 'fabric';
declare const fabric: any;

// Load Fabric Brush <https://github.com/tennisonchan/fabric-brush/>
import '../../assets/js/fabric-brush.min.js';


@Component({
    selector: 'app-frame-customizer',
    templateUrl: './frame-customizer.component.html',
    styleUrls: ['./frame-customizer.component.css'],
    providers: [ RestApiService ]
})
export class FrameCustomizerComponent {
    title = 'Customize the frame!';
	apiService: RestApiService;
	frame = [];
	sprayBrush: any;

    constructor(private route: ActivatedRoute, private restApiService: RestApiService) {
        this.apiService = restApiService;
    }

    ngAfterViewInit() {

		// Get URL parameters (information about the current frame)
		this.route.queryParams.subscribe(params => {
			this.frame['id'] = params['id'];
			this.frame['path'] = params['path'];
		});

		// Get canvas from DOM
		var canvas = document.getElementById('drawingCanvas');
		//var ctx = (<HTMLCanvasElement>canvas).getContext('2d');

		// Set up Fabric.js canvas
		var fabricCanvas = new fabric.Canvas('drawingCanvas', { isDrawingMode: true });
		//fabricCanvas.setBackgroundColor(null, fabricCanvas.renderAll.bind(fabricCanvas));
		fabric.Object.prototype.transparentCorners = false;

		// Set up spray brush
/*
		var sprayBrush = new fabric.SprayBrush(fabricCanvas);
		sprayBrush.density = 20;
		sprayBrush.dotWidth = 1;
		sprayBrush.dotWidthVariance = 1;
		sprayBrush.optimizeOverlapping = true;
		sprayBrush.randomOpacity = false;
		sprayBrush.width = 30;
		fabricCanvas.freeDrawingBrush = sprayBrush;
*/
		this.sprayBrush = new fabric.InkBrush(fabricCanvas, {
			width: 5,
			inkAmount: 10
		});
		fabricCanvas.freeDrawingBrush = this.sprayBrush;

		// Load image as Canvas background
		fabric.Image.fromURL(this.frame['path'], function(img) {
			fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
			   scaleX: fabricCanvas.width / img.width,
			   scaleY: fabricCanvas.height / img.height
			});
		});

 		// Get Loading Canvas
		var loadingCanvas = document.getElementById('loadingCanvas');
		var loadingCtx = (<HTMLCanvasElement>loadingCanvas).getContext('2d');
		var fabricLoadingCanvas = new fabric.Canvas('loadingCanvas');

		// Update Loading Canvas on button click
        document.getElementById('loadVariationButton').addEventListener('click', function() {

            // Clear loading canvas
            loadingCtx.clearRect(
                0, 0,
                (<HTMLCanvasElement>loadingCtx.canvas).width, (<HTMLCanvasElement>loadingCtx.canvas).height
            );

            // Get drawing canvas as SVG
			var jsonVariation = (<HTMLCanvasElement>canvas).toDataURL('image/jpg', 0.1);
            console.log(jsonVariation.length);

            // Show JSON canvas inside loading canvas
            var loadingImg = new Image();
            loadingImg.onload = function() {
                loadingCtx.drawImage(
                    loadingImg,
                    0, 0,
                    loadingCtx.canvas.width, loadingCtx.canvas.height
				);
			};
			loadingImg.src = jsonVariation;

		});
		
		/*
		const wsIp = '127.0.0.1';
		const wsPort = 8989;

		var connection = new WebSocket('ws://' + wsIp + ':' + wsPort);

		connection.onmessage = function (e) {
			console.log(e.data);
		};
		*/

    }; // end of ngAfterViewInit()
}