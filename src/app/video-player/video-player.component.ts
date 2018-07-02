import { Component, ViewChild, AfterViewInit, OnInit, Compiler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GlobalsService } from '../services/globals.service';

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
    providers: [ RestApiService, GlobalsService ]
})
export class VideoPlayerComponent implements AfterViewInit, OnInit {

    isInStore: boolean;

    // Add Menu Bar
    @ViewChild(MenuBarComponent) menu: MenuBarComponent;

    // HTML title
    title = 'Adidas Video Hacking';

    // Base server URL (used in template)
    baseUrl: string;

    // DOM elements
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;

    // Frame sequencer and array of frames
    frameConv: FrameConverter;
    
    // Object representing the last modified frame
	frame: {
        id: string,
        numericId: number,
        path: string,
        variationPath: string
    };

    // Timer used by the resize event
    resizeTimer: number;


    constructor(private router: Router, private route: ActivatedRoute, private restApiService: RestApiService, private runtimeCompiler: Compiler, private globalsService: GlobalsService ) {

        this.isInStore = globalsService.INSTORE;

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

    
    ngOnInit() {
        this.runtimeCompiler.clearCache();
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
        // Get window size
        let currentWidth = window.innerWidth;
        let currentHeight = window.innerHeight;

        // Get ratios
        let currentRatio = currentWidth / currentHeight;
        let videoRatio = this.video.width / this.video.height;

        // Calculate new dimensions for the video
        let newVideoWidth;
        let newVideoHeight;
        if (videoRatio > currentRatio) {
            // Video is "more landscape" than window
            newVideoHeight = currentHeight;
            newVideoWidth = newVideoHeight * videoRatio;
            this.canvas.style.top = '0';
            this.canvas.style.left = (-(newVideoWidth - currentWidth) / 2).toString() + 'px';
        }
        else {
            // Video is "less landscape" than window
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
