
export class FrameConverter {

    debug: boolean = false; // Enable to print video time and frame number in console

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

    // Array of variation overlays to apply to the frames
    variations: Array<{ json: string }> = [];

    // Main function (constructor)
    constructor(video, canvas, variations)  {

        this.video = video;

        this.canvas = canvas;
        this.canvasCtx = this.canvas.getContext('2d');

        this.framebuffer = document.createElement('canvas');
        this.framebuffer.width = this.video.width;
        this.framebuffer.height = this.video.height;
        this.framebufferCtx = this.framebuffer.getContext('2d');

        this.variations = variations;

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

        // Apply corresponding variation overlay
        this.applyFrameVariation();

        // Retrieve graphic data from the frame-buffer canvas
        let data = this.framebufferCtx.getImageData(
            0, 0,
            this.canvas.width, this.canvas.height
        );
        
        // Render to canvasCtx
        this.canvasCtx.putImageData(data, 0, 0);
        
        return;
    }


    // Apply frame variation to the canvas
    applyFrameVariation() {

        // Calculate current frame  number
        let currentTime = this.video.currentTime;
        let currentFrameIndex = Math.floor( currentTime * this.fps );

        // Debug video time and frame number
        if (this.debug) {
            console.log('Time: ' + currentTime);
            console.log('Frame ' + (currentFrameIndex + 1));
        }

        if (currentFrameIndex in this.variations) {
            // Apply variation as overlay
            let img = new Image();
            img.src = this.variations[currentFrameIndex].json;
            this.framebufferCtx.drawImage(
                img,
                0, 0,
                this.canvas.width, this.canvas.height
            );
        }

    }


}