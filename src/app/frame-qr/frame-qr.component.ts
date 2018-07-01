import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load Menu Bar
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

// Load custom objects
import { FrameConverter } from '../services/frame-converter.service';
import { VideoControls } from './video-controls';

// Load Modals script
import '../../assets/js/modals.js';

@Component({
	selector: 'app-frame-qr',
    templateUrl: './frame-qr.component.html',
    styleUrls: ['./frame-qr.component.css'],
	providers: [ RestApiService ]
})
export class FrameQRComponent implements AfterViewInit {

	// HTML title
	title = 'Share the frame!';

	// Add Menu Bar
	@ViewChild(MenuBarComponent) menu: MenuBarComponent;

	// Base server URL
	baseUrl: string;

	// URL for the QR code
	shareUrl: string;

	// Get canvas from DOM
	canvas: HTMLCanvasElement;
	canvasCtx: CanvasRenderingContext2D;

	// Video DOM elements
	video: HTMLVideoElement;
	playVideoCanvas: HTMLCanvasElement;

	// Video controls controller and DOM elements
	videoControls: VideoControls;
	seekbar: HTMLInputElement;
	mark: HTMLElement;

	// Frames sequencer and array of frames
	frameConv: FrameConverter;

	// Object representing the last modified frame
	frame: {
		id: string,
		numericId: number,
		path: string,
		variationPath: string
	};

	// String of GET parameters to be applied to home links, to keep last modified frame
	backHomeUrlParams: string;

    constructor( private route: ActivatedRoute, private restApiService: RestApiService ) {

		// Get API base URL
		this.baseUrl = restApiService.getBaseUrl();

		// Get URL parameters (info about the current frame and variation)
		this.route.queryParams.subscribe(params => {
			this.frame = {
				id: params['id'],
				numericId: parseInt( params['id'].replace('frame', '') ),
				path: params['path'],
				variationPath: params['variationPath']
			};
			this.backHomeUrlParams = '?id=' + params['id'] + '&path=' + params['path'] + '&variationPath=' + params['variationPath'];
			this.shareUrl = 'http://nmanvilli.com/';
		});
	}


    ngAfterViewInit() {

		// This variable used to pass ourself to event call-backs
        let self:FrameQRComponent = this;

		// Get Canvas from DOM
		this.canvas = <HTMLCanvasElement>document.getElementById('showingCanvas');
		this.canvasCtx = this.canvas.getContext('2d');

		// Get HTML5 video from DOM (note: the video MUST have explicit width and height attributes)
        this.video = <HTMLVideoElement>document.getElementById('sourceVideo');

        // Get playing canvas from DOM
        this.playVideoCanvas = <HTMLCanvasElement>document.getElementById('playingCanvas');

		// Calculate size for the Canvases
		this.resizeCanvases();
		this.drawVariation();

        // Create frameConverter object
        this.frameConv = new FrameConverter( this.video, this.playVideoCanvas, this.frame );

		// Get video controls from DOM and start the controller
		this.seekbar = <HTMLInputElement>document.getElementById('seekBar');
		this.mark = <HTMLElement>document.getElementById("mark");
		this.videoControls = new VideoControls( this.video, this.playVideoCanvas, this.seekbar, this.mark, this.frame.numericId );

	} // end of ngAfterViewInit()



	resizeCanvases() {
		let leftCol = document.getElementById('leftInner');
		let rightCol = document.getElementById('rightInner');

		let newPlayVideoCanvasWidth = leftCol.clientWidth;
		let newCanvasWidth = rightCol.clientWidth;

		console.log(newPlayVideoCanvasWidth);

		this.canvas.setAttribute( 'width', newCanvasWidth + 'px' );
		this.canvas.setAttribute( 'height', (newCanvasWidth * 817 / 1920) + 'px' );

		this.video.setAttribute( 'width', newPlayVideoCanvasWidth + 'px' );
		this.video.setAttribute( 'height', (newPlayVideoCanvasWidth * 817 / 1920) + 'px' );
		this.playVideoCanvas.setAttribute( 'width', newPlayVideoCanvasWidth + 'px' );
		this.playVideoCanvas.setAttribute( 'height', (newPlayVideoCanvasWidth * 817 / 1920) + 'px' );
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