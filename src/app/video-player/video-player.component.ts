import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

import { FrameConverter } from '../component-objects/frame-converter';
import { VideoControls } from '../component-objects/video-controls';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css'],
    providers: [ RestApiService ]
})
export class VideoPlayerComponent {
    title = 'Adidas Video Hacking - Video playback';
    frameVariations = [];
    resizeTimer;
    mainContent;
    video;
    canvas;
    frameConv;

    constructor( private restApiService: RestApiService ) {
        this.frameVariations = restApiService.getAllVariations()
    }

    ngAfterViewInit() {

        // Get HTML5 video from DOM (note: the video MUST have explicit width and height attributes)
        this.video = document.getElementById('sourceVideo');

        // Get playing canvas from DOM
        this.canvas = document.getElementById('playingCanvas');

        // Get play/pause button from DOM
        let playButton = document.getElementById('playPause');

        // Get time slider from DOM
        let seekBar = document.getElementById('seekBar');

        // Create videoControls object
        let vidCtrl = new VideoControls( this.video, this.canvas, playButton, seekBar );

        // Create frameConverter object
        this.frameConv = new FrameConverter( this.video, this.canvas, this.frameVariations );

        // Get main content wrapper from DOM
        this.mainContent = document.getElementById('main');

        // Set main content maximum width depending on video size
        this.mainContent.style.maxWidth = (<HTMLVideoElement>this.video).width.toString() + 'px';

        // This variable used to pass ourself to event call-backs
        let self = this;

        this.resizeTimer = setTimeout(
            function () {
                self.resizeCanvas();
            },
            20
        );

        // Make canvas responsive (using a resize timer to avoid viewport size inconsistencies)
        window.onresize = function() {
            self.resizeTimer = setTimeout(
                function () {
                    self.resizeCanvas();
                },
                20
            );
        };

    };

    resizeCanvas() {
        let currentWidth = this.mainContent.clientWidth;
        this.canvas.setAttribute( 'width', currentWidth.toString() );
        this.canvas.setAttribute( 'height', (currentWidth * (<HTMLVideoElement>this.video).height / (<HTMLVideoElement>this.video).width).toString() );
        this.frameConv.renderFrame();
    }

}