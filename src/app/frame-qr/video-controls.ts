
export class VideoControls {

    video: HTMLVideoElement; // Video DOM element
    canvas: HTMLCanvasElement; // Canvas DOM element
    playButton: HTMLButtonElement; // Play/pause button DOM element
    seekBar: HTMLInputElement; // Seek bar DOM element
    mark: HTMLElement; // "You are here" mark
    frameId: number;

    constructor (video, canvas, seekBar, mark, frameId) {

        // Set DOM elements
        this.video = video;
        this.canvas = canvas;
        this.seekBar = seekBar;
        this.mark = mark;
        this.frameId = frameId;

        // This variable used to pass ourself to event call-backs
        let self:VideoControls = this;

        // Update the seek bar as the video plays
        this.video.addEventListener('timeupdate', function() {

            // Calculate the slider value from the video time
            let value = 100.0 / self.video.duration * self.video.currentTime;
            let variationValue = 100.0 / self.video.duration * (0.125 * self.frameId);
            console.log('frame '+self.frameId+', dur '+self.video.duration+', varVal '+variationValue);

            // Update the slider value
            self.seekBar.value = value.toString();
            mark.style.left =  variationValue + "%";

        });

    } // end of constructor()

}