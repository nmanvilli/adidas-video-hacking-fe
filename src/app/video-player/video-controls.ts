
export class VideoControls {

    video: HTMLVideoElement; // Video DOM element
    canvas: HTMLCanvasElement; // Canvas DOM element
    playButton: HTMLButtonElement; // Play/pause button DOM element
    seekBar: HTMLInputElement; // Seek bar DOM element

    constructor (video, canvas, playButton, seekBar) {

        // Set DOM elements
        this.video = video;
        this.canvas = canvas;
        this.playButton = playButton;
        this.seekBar = seekBar;

        // This variable used to pass ourself to event call-backs
        let self:VideoControls = this;

        // Event listener for the play/pause button
        this.playButton.addEventListener('click', function() {
            if (self.video.paused === true) self.playVideo();
            else self.pauseVideo();
        });

        // Event listener for the seek bar
        this.seekBar.addEventListener('change', function() {

            // Calculate the time from slider value
            let time = self.video.duration * (Number(self.seekBar.value) / 100);

            // Update the video time
            self.video.currentTime = time;

        });
        
        // Update the seek bar as the video plays
        this.video.addEventListener('timeupdate', function() {

            // Calculate the slider value from the video time
            let value = 100 / self.video.duration * self.video.currentTime;

            // Update the slider value
            self.seekBar.value = value.toString();

        });

        // Pause the video when it's over
        this.video.addEventListener('ended', function() {
            self.pauseVideo();
        });

        // Pause the video when the slider handle is being dragged
        this.seekBar.addEventListener('mousedown', function() {
            self.pauseVideo();
        });
        
        // Play / pause by clicking on the canvas
        this.canvas.addEventListener('click', function() {
            self.playPauseVideo();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keyup', function(e) {

            // Play/pause using spacebar (key code 32)
            if ( (e.keyCode === 32) || (parseInt(e.key) === 32) ) {
                e.preventDefault();
                self.playPauseVideo();
            }

        });

    } // end of constructor()

    // Play/pause the video
    playPauseVideo() {
        if (this.video.paused === true) this.playVideo();
        else this.pauseVideo();
    };
    
    // Play the video
    playVideo() {
        this.video.play();
        this.playButton.innerHTML = '<i class="fa fa-pause"></i>' // Update button label
    };
    
    // Pause the video
    pauseVideo() {
        this.video.pause();
        this.playButton.innerHTML = '<i class="fa fa-play"></i>'; // Update button label
    };

}