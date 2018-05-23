import { Component } from '@angular/core';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load custom objects
import { FrameConverter } from './frame-converter';
import { VideoControls } from './video-controls';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css'],
    providers: [ RestApiService ]
})
export class VideoPlayerComponent {

    title = 'Adidas Video Hacking - Video playback';

    // DOM elements
    mainContent: HTMLMainElement;
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;

    // Frames sequencer and array of frames
    frameConv: FrameConverter;
    frameVariations: Array<{ json: string }> = [];

    // Timer used by the resize event
    resizeTimer: number;


    constructor( private restApiService: RestApiService ) {
        
        restApiService.getAllVariations()
            .subscribe( (data:Array<{ json:string }>) => {
                this.frameVariations = data;
            });

    }

    ngAfterViewInit() {

        // This variable used to pass ourself to event call-backs
        let self:VideoPlayerComponent = this;

        // Get HTML5 video from DOM (note: the video MUST have explicit width and height attributes)
        this.video = <HTMLVideoElement>document.getElementById('sourceVideo');

        // Get playing canvas from DOM
        this.canvas = <HTMLCanvasElement>document.getElementById('playingCanvas');

        // Get play/pause button from DOM
        let playButton:HTMLButtonElement = <HTMLButtonElement>document.getElementById('playPause');

        // Get time slider from DOM
        let seekBar:HTMLInputElement = <HTMLInputElement>document.getElementById('seekBar');

        // Create videoControls object
        let vidCtrl:VideoControls = new VideoControls( this.video, this.canvas, playButton, seekBar );

        // Create frameConverter object
        this.frameConv = new FrameConverter( this.video, this.canvas, this.frameVariations );

        // Get main content wrapper from DOM
        this.mainContent = <HTMLMainElement>document.getElementById('main');

        // Set main content maximum width depending on video size
        this.mainContent.style.maxWidth = this.video.width.toString() + 'px';

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

    } // end of ngAfterViewInit()


    resizeCanvas() {
        // Resize canvas
        let currentWidth = this.mainContent.clientWidth;
        this.canvas.setAttribute( 'width', currentWidth.toString() );
        this.canvas.setAttribute( 'height', (currentWidth * this.video.height / this.video.width).toString() );

        // Re-render current frame
        this.frameConv.renderFrame();
    }

}