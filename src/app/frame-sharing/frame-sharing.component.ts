import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

@Component({
	selector: 'app-frame-sharing',
    templateUrl: './frame-sharing.component.html',
    styleUrls: ['./frame-sharing.component.css'],
	providers: [ RestApiService ]
})
export class FrameSharingComponent implements AfterViewInit {

	@ViewChild(MenuBarComponent) menu: MenuBarComponent;

	title = 'Share the frame!';

	// Object representing the current frame
	frame: { id: string, path: string, variationPath: string };

	// Get canvas from DOM
	canvas: HTMLCanvasElement;
	canvasCtx: CanvasRenderingContext2D;


    constructor(private router: Router, private route: ActivatedRoute, private restApiService: RestApiService) {
		// Get URL parameters (info about the current frame and variation)
		this.route.queryParams.subscribe(params => {
			this.frame = { id: params['id'], path: params['path'], variationPath: params['variationPath'] };
		});
	}


    ngAfterViewInit() {

		// This variable used to pass ourself to event call-backs
        let self:FrameSharingComponent = this;

		// Get Canvas from DOM
		this.canvas = <HTMLCanvasElement>document.getElementById('showingCanvas');
		this.canvasCtx = this.canvas.getContext('2d');

		this.resizeCanvas();
		this.drawVariation();

	} // end of ngAfterViewInit()


	resizeCanvas() {
		let newCanvasWidth = this.canvas.clientWidth;

		this.canvas.setAttribute( 'width', newCanvasWidth + 'px' );
		this.canvas.setAttribute( 'height', (newCanvasWidth * 1080 / 1920) + 'px' );
    }


	drawVariation() {

		// This variable used to pass ourself to event call-backs
		let self:FrameSharingComponent = this;

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