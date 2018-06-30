import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load custom objects
import { FrameConverter } from '../services/frame-converter.service';

// Load Menu Bar
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css'],
    providers: [ RestApiService ]
})
export class VideoPlayerComponent implements AfterViewInit {

    // Add Menu Bar
    @ViewChild(MenuBarComponent) menu: MenuBarComponent;

    title = 'Adidas Video Hacking';

    // Base server URL
    baseUrl: string;

    // DOM elements
    mainContent: HTMLMainElement;
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;

    // Frames sequencer and array of frames
    frameConv: FrameConverter;
    
    // Object representing the last modified frame
	frame: { id: string, numericId: number, path: string, variationPath: string };

    // Timer used by the resize event
    resizeTimer: number;

    // Observable containing the API request results
    apiRequest: Observable<Object>;

    constructor(private router: Router, private route: ActivatedRoute, private restApiService: RestApiService ) {

        // Get API base URL
        this.baseUrl = restApiService.getBaseUrl();

        // Get URL parameters (info about the most recent variation)
		this.route.queryParams.subscribe(params => {
            if ( (params['id'] != undefined) && (params['path'] != undefined) ) {
                this.frame = {
                    id: params['id'],
                    numericId: parseInt( params['id'].replace('frame', '') ),
                    path: params['path'],
                    variationPath: params['variationPath']
                };
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
        if (this.frame != undefined) {
            this.frameConv = new FrameConverter( this.video, this.canvas, this.frame );
        }
        else {
            this.frameConv = new FrameConverter( this.video, this.canvas  );
        }

        // Get main content wrapper from DOM
        this.mainContent = <HTMLMainElement>document.getElementById('main');

        // Set main content maximum width depending on video size
        this.mainContent.style.maxWidth = this.video.width.toString() + 'px';

        // Add actons to buttons
        document.getElementById('scrollToHome').addEventListener('mousedown', function() {
            let intro = document.getElementById('intro');
            intro.style.top = '-200%';
            intro.style.transition = '.5s all';
            self.video.play();
        });

        document.getElementById("startButton").addEventListener('mousedown', function(){
            self.router.navigate( ['/choose']);
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
