import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Static JS loader service
import { StaticScriptsService } from '../services/static-scripts.service';

@Component({
	selector: 'app-frame-qr',
    templateUrl: './frame-qr.component.html',
    styleUrls: ['./frame-qr.component.css'],
	providers: [ RestApiService ]
})
export class FrameQRComponent {

	title = 'Share the frame!';

	// URL for the QR code
	shareUrl: string;

	// Object representing the current frame
	frame: { id: string, path: string, variationPath: string };

	// Get canvas from DOM
	canvasCtx: CanvasRenderingContext2D;


    constructor(private route: ActivatedRoute, private restApiService: RestApiService) {
		// Get URL parameters (info about the current frame and variation)
		this.route.queryParams.subscribe(params => {
			this.frame = { id: params['id'], path: params['path'], variationPath: params['variationPath'] };
			this.shareUrl = 'http://nmanvilli.com/';
		});
	}


    ngAfterViewInit() {
		
		//StaticScriptsService.loadJs('pleaserotate.min.js');

		// This variable used to pass ourself to event call-backs
        let self:FrameQRComponent = this;

		// Create Fabric Drawing Canvas from DOM
		this.canvasCtx = (<HTMLCanvasElement>document.getElementById('showingCanvas')).getContext('2d');

	} // end of ngAfterViewInit()

}