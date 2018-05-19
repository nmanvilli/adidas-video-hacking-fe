import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

//import { FrameConverter } from '../component-objects/frame-converter';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.css'],
    providers: [ RestApiService ]
})
export class VideoPlayerComponent {
    title = 'Adidas Video Hacking - Video playback';
    frameVariations = [];

    constructor( private restApiService: RestApiService ) {
        this.frameVariations = restApiService.getAllVariations()
    }

    ngAfterViewInit() {
        
        function frameConverter(video, canvas, variations) {
                    
            // Frames per second
            this.fps = 8;
            
            // Enable to print video time and frame number in console
            this.debugFrames = false;
            
            // Video refresh timer (milliseconds)
            this.renderInterval = 25;
            
            /*
            *	NOTE:
            *	At X FPS we have one frame every Y = 1000/X milliseconds.
            *	We should set the render interval to a lower value to avoid imprecisions.
            *	We chose a render interval that Y/5
            */

            // Set up our frame converter
            this.video = video;
            this.viewport = canvas.getContext('2d');
            this.canvas = canvas;

            // Create the frame-buffer canvas
            this.framebuffer = document.createElement('canvas');
            this.framebuffer.width = video.width;
            this.framebuffer.height = video.height;
            this.ctx = this.framebuffer.getContext('2d');

            // Array of variation overlays to apply to the frames
            this.variations = variations;

            // This variable used to pass ourself to event call-backs
            var self = this;

            // Start rendering when the video is playing
            this.video.addEventListener(
                'play',
                function() {
                    self.render();
                },
                false
            );

            // Update the playing canvas if the playing position changes while the video is paused or ended
            this.video.ontimeupdate = function() {
                if ( self.video.paused || self.video.ended ) {
                    self.renderFrame();
                }
            };

            // Rendering call-back
            this.render = function() {

                // If the video is not paused or ended, render  the new frame
                if ( this.video.paused || this.video.ended ) {
                return;
                }
                this.renderFrame();

                // This variable used to pass ourself timer call-backs
                var self = this;

                // Render at every refresh interval
                setTimeout(
                    function () {
                        self.render();
                    },
                    self.renderInterval
                );

            };

            // Compute and display the next frame 
            this.renderFrame = function() {

                // Acquire a video frame from the video element
                this.ctx.drawImage(
                    this.video,
                    0, 0,
                    this.canvas.width, this.canvas.height
                );

                // Apply corresponding variation overlay
                this.applyFrameVariation();

                // Retrieve graphic data from the frame-buffer canvas
                var data = this.ctx.getImageData(
                    0, 0,
                    this.canvas.width, this.canvas.height
                );
                
                // Render to viewport
                this.viewport.putImageData(data, 0, 0);
                
                return;
            };
            
            // Apply frame variation to the canvas
            this.applyFrameVariation = function() {

                // Calculate current frame  number
                var currentTime = this.video.currentTime;
                var currentFrameIndex = Math.floor( currentTime * this.fps );

                // Debug video time and frame number
                if (this.debugFrames) {
                    console.log('Time: ' + currentTime);
                    console.log('Frame ' + (currentFrameIndex + 1));
                }

                // Apply variation as overlay
                var img = new Image();
                img.src = this.variations[currentFrameIndex];
                this.ctx.drawImage(
                    img,
                    0, 0,
                    this.canvas.width, this.canvas.height
                );

            };
        }

        function videoControls(video, canvas, playButton, seekBar) {
            
            // Video DOM element
            this.video = video;
            
            // Canvas DOM element
            this.canvas = canvas;

            // Play/pause button
            this.playButton = playButton;
            
            // Seek bar
            this.seekBar = seekBar;
            
            // This variable used to pass ourself to event call-backs
            var self = this;

            // Event listener for the play/pause button
            this.playButton.addEventListener('click', function() {

                if (self.video.paused === true) {
                    self.playVideo();
                }
                else {
                    self.pauseVideo();
                }

            });
            
            // Event listener for the seek bar
            this.seekBar.addEventListener('change', function() {

                // Calculate the time from slider value
                var time = self.video.duration * (self.seekBar.value / 100);

                // Update the video time
                self.video.currentTime = time;

            });
            
            // Update the seek bar as the video plays
            this.video.addEventListener('timeupdate', function() {

                // Calculate the slider value from the video time
                var value = 100 / self.video.duration * self.video.currentTime;

                // Update the slider value
                self.seekBar.value = value;

            });

            // Pause the video when it's over
            this.video.onended = function() {
                self.pauseVideo();
            };

            // Pause the video when the slider handle is being dragged
            this.seekBar.addEventListener('mousedown', function() {
                self.pauseVideo();
            });
            
            // Play / pause by clicking on the canvas
            this.canvas.addEventListener('click', function() {

                self.playPauseVideo();

            });
            
            // Play/pause using spacebar (key code 32)
            document.addEventListener('keyup', function(e) {

                if ( (e.keyCode === 32) || (parseInt(e.key) === 32) ) {

                    e.preventDefault();
                    self.playPauseVideo();

                }

            });

            // Play/pause the video
            this.playPauseVideo = function() {

                if (self.video.paused === true) {
                    self.playVideo();
                }
                else {
                    self.pauseVideo();
                }

            };
            
            // Play the video
            this.playVideo = function() {

                this.video.play();

                // Update button label
                this.playButton.innerHTML = '<i class="fa fa-pause"></i>';

            };
            
            // Pause the video
            this.pauseVideo = function() {

                this.video.pause();

                // Update button label
                this.playButton.innerHTML = '<i class="fa fa-play"></i>';

            };
            
        }


        // Get HTML5 video from DOM (note: the video MUST have explicit width and height attributes)
        var video = document.getElementById('sourceVideo');

        // Get playing canvas from DOM
        var canvas = document.getElementById('playingCanvas');

        // Get play/pause button from DOM
        var playButton = document.getElementById('playPause');

        // Get time slider from DOM
        var seekBar = document.getElementById('seekBar');

        // Create videoControls object
        var vidCtrl = new videoControls( video, canvas, playButton, seekBar );

        // Create frameConverter object
        var frameConv = new frameConverter( video, canvas, this.frameVariations );

        // Get main content wrapper from DOM
        var mainContent = document.getElementById('main');

        // Set main content maximum width depending on video size
        mainContent.style.maxWidth = (<HTMLVideoElement>video).width.toString() + 'px';    

        // Make canvas responsive (using a resize timer to avoid viewport size inconsistencies)
        function resizeCanvas() {
            var currentWidth = mainContent.clientWidth;
            canvas.setAttribute( 'width', currentWidth.toString() );
            canvas.setAttribute( 'height', (currentWidth * (<HTMLVideoElement>video).height / (<HTMLVideoElement>video).width).toString() );
            frameConv.renderFrame();
        }

        var resizeTimer = setTimeout(
            function () {
                resizeCanvas();
            },
            20
        );

        window.onresize = function() {
            resizeTimer = setTimeout(
                function () {
                    resizeCanvas();
                },
                20
            );
        };


    };

}