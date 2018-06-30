export class FrameConverter {

    fps: number = 8; // Frames per second
    renderInterval: number = 25; // Video refresh timer (milliseconds)

    /*	NOTE:
     *	At X FPS we have one frame every Y = 1000/X milliseconds.
     *	We should set the render interval to a lower value to avoid imprecisions.
     *	We chose a render interval that is Y/5
     */

    // Main DOM elements
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D;
    framebuffer: HTMLCanvasElement;
    framebufferCtx: CanvasRenderingContext2D;

    // Object representing the last modified frame
	frame: { id: string, numericId: number, path: string, variationPath: string };
    variationId: number;
    variationPath: any;
    variationImage: any;

    // Main function (constructor)
    constructor(video, canvas, frame = undefined)  {

        this.video = video;

        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');

        this.framebuffer = document.createElement('canvas');
        this.framebuffer.width = this.video.width;
        this.framebuffer.height = this.video.height;
        this.framebufferCtx = this.framebuffer.getContext('2d');

        this.frame = frame;

        if (this.frame != undefined) {
            this.variationImage = new Image();
            this.variationImage.crossOrigin = 'anonymous';
            this.variationImage.src = this.frame.variationPath;
            this.variationImage.onload = function() {
                console.log('Variation loaded.');
            }
        }

        // This variable used to pass ourself timer call-backs
        let self:FrameConverter = this;

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

    } // end of constructor()


    // Rendering call-back
    render() {

        // If the video is not paused or ended, render  the new frame
        if ( this.video.paused || this.video.ended ) return;
        this.renderFrame();

        // This variable used to pass ourself timer call-backs
        let self = this;

        // Render at every refresh interval
        setTimeout(
            function () {
                self.render();
            },
            self.renderInterval
        );

    }


    // Compute and display the next frame
    renderFrame() {

        // Acquire a video frame from the video element
        this.framebufferCtx.drawImage(
            this.video,
            0, 0,
            this.canvas.width, this.canvas.height
        );

        // Calculate current frame  number
        let currentFrameIndex = Math.floor( this.video.currentTime * this.fps );

        // Apply corresponding variation overlay
        if ( (this.frame != undefined) && (currentFrameIndex == this.frame.numericId) ) {
            this.framebufferCtx.drawImage(
                this.variationImage,
                0, 0,
                this.canvas.width, this.canvas.height
            );
            
        }

        // Retrieve graphic data from the frame-buffer canvas
        let data = this.framebufferCtx.getImageData(
            0, 0,
            this.canvas.width, this.canvas.height
        );

        // Render to canvasCtx
        this.canvasCtx.putImageData(data, 0, 0);

        return;
    }

}
