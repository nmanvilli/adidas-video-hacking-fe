import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';
import { Observable } from 'rxjs';

// Load custom objects
import { FrameConverter } from './frame-converter';


@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css'],
    providers: [ RestApiService ]
})
export class VideoPlayerComponent implements AfterViewInit {

    title = 'Adidas Video Hacking - Video playback';

    // Base server URL
    baseUrl: string;

    // DOM elements
    mainContent: HTMLMainElement;
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    startButton: HTMLButtonElement

    // Frames sequencer and array of frames
    frameConv: FrameConverter;
    frameVariations: Array<{ jpg: string }> = [];

    // Timer used by the resize event
    resizeTimer: number;

    // Observable containing the API request results
    apiRequest: Observable<Object>;

    constructor(private route: ActivatedRoute, private restApiService: RestApiService ) {

        this.baseUrl = restApiService.getBaseUrl();

        // Get URL parameters (info about the most recent variation)
		this.route.queryParams.subscribe(params => {
            if ( (params['id'] != undefined) && (params['path'] != undefined) ) {

                // Add current frame to array of variations
                let variation = { id: params['id'] , variationPath: params['path'] };
                this.frameVariations[variation.id] = { jpg: variation.variationPath };
            }
        });

    }


    ngAfterViewInit() {

        // This variable used to pass ourself to event call-backs
        let self:VideoPlayerComponent = this;

        // Get HTML5 video from DOM (note: the video MUST have explicit width and height attributes)
        this.video = <HTMLVideoElement>document.getElementById('sourceVideo');

        // Get playing canvas from DOM
        this.canvas = <HTMLCanvasElement>document.getElementById('playingCanvas');

        // Create frameConverter object
        this.frameConv = new FrameConverter( this.video, this.canvas, this.frameVariations );

        // Get main content wrapper from DOM
        this.mainContent = <HTMLMainElement>document.getElementById('main');

        // Set main content maximum width depending on video size
        this.mainContent.style.maxWidth = this.video.width.toString() + 'px';

        document.getElementById('scrollToHome').addEventListener('click', function() {
            let intro = document.getElementById('intro');
            intro.style.top = '-200%';
            intro.style.transition = '.5s all';
            self.video.play();
        });

        // Make canvas responsive (using a resize timer to avoid viewport size inconsistencies)
        this.resizeTimer = window.setTimeout(
            function () { self.resizeCanvas(); },
            20
        );
        window.onresize = function() {
            self.resizeTimer = window.setTimeout(
                function () { self.resizeCanvas(); },
                20
            );
        };
        this.resizeCanvas();

    } // end of ngAfterViewInit()


    resizeCanvas() {
        // Resize canvas
        let currentWidth = this.mainContent.clientWidth;
        let currentHeight = this.mainContent.clientHeight;

        let currentRatio = currentWidth / currentHeight;
        let videoRatio = this.video.width / this.video.height;

        let newVideoWidth;
        let newVideoHeight;
        if (videoRatio > currentRatio) {
            newVideoHeight = currentHeight;
            newVideoWidth = newVideoHeight * videoRatio;
            this.canvas.style.top = '0';
            this.canvas.style.left = (-(newVideoWidth - currentWidth) / 2).toString() + 'px';
        }
        else {
            newVideoWidth = currentWidth;
            newVideoHeight = newVideoWidth / videoRatio;
            this.canvas.style.top = (-(newVideoHeight - currentHeight) / 2).toString() + 'px';
            this.canvas.style.left = '0';
        }
        this.video.setAttribute( 'width', newVideoWidth.toString()+'px' );
        this.video.setAttribute( 'height', newVideoHeight.toString()+'px' );
        this.canvas.setAttribute( 'width', newVideoWidth.toString()+'px' );
        this.canvas.setAttribute( 'height', newVideoHeight.toString()+'px' );

        // Re-render current frame
        this.frameConv.renderFrame();
    }

}
