import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';


@Component({
	selector: 'app-frame-sharing',
    templateUrl: './frame-sharing.component.html',
    styleUrls: ['./frame-sharing.component.css'],
	providers: [ RestApiService ]
})
export class FrameSharingComponent {

	title = 'Share the frame!';

	// Object representing the current frame
	frame: { id :string, path: string };

	// Get canvas from DOM
	canvasCtx: CanvasRenderingContext2D;


    constructor(private route: ActivatedRoute, private restApiService: RestApiService) {

		// Get URL parameters (info about the current frame)
		this.route.queryParams.subscribe(params => {
			this.frame = { id: params['id'] , path: params['path'] };
		});

	}


    ngAfterViewInit() {
		
		// This variable used to pass ourself to event call-backs
        let self:FrameSharingComponent = this;

		// Create Fabric Drawing Canvas from DOM
		this.canvasCtx = (<HTMLCanvasElement>document.getElementById('showingCanvas')).getContext('2d');

	} // end of ngAfterViewInit()

}