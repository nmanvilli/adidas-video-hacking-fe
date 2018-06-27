import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

@Component({
	selector: 'app-frame-qr',
    templateUrl: './frame-qr.component.html',
    styleUrls: ['./frame-qr.component.css'],
	providers: [ RestApiService ]
})
export class FrameQRComponent implements AfterViewInit {

	title = 'Share the frame!';

	// URL for the QR code
	shareUrl: string;

	// Object representing the current frame
	frame: { id: string, path: string, variationPath: string };

	// Get canvas from DOM
	canvas: HTMLCanvasElement;
	canvasCtx: CanvasRenderingContext2D;


    constructor(private route: ActivatedRoute, private restApiService: RestApiService) {
		// Get URL parameters (info about the current frame and variation)
		this.route.queryParams.subscribe(params => {
			this.frame = { id: params['id'], path: params['path'], variationPath: params['variationPath'] };
			this.shareUrl = 'http://nmanvilli.com/';
		});
	}


    ngAfterViewInit() {

		// This variable used to pass ourself to event call-backs
        let self:FrameQRComponent = this;

		// Get Canvas from DOM
		this.canvas = <HTMLCanvasElement>document.getElementById('showingCanvas');
		this.canvasCtx = this.canvas.getContext('2d');

		this.resizeCanvas();
		this.drawVariation();
		console.log(this.frame['variationPath']);

	} // end of ngAfterViewInit()

	resizeCanvas() {
		let newCanvasWidth = this.canvas.clientWidth;

		this.canvas.setAttribute( 'width', newCanvasWidth + 'px' );
		this.canvas.setAttribute( 'height', (newCanvasWidth * 817 / 1920) + 'px' );
    }


	drawVariation() {

		// This variable used to pass ourself to event call-backs
		let self:FrameQRComponent = this;

		let canvasImage = new Image();
		canvasImage.crossOrigin = 'anonymous';
		canvasImage.src = this.frame['variationPath'];

		canvasImage.onload = function() {
			
			self.canvasCtx.drawImage(
				canvasImage,
				0, 0,
				self.canvas.clientWidth, self.canvas.clientHeight
			);
		}
	}

}