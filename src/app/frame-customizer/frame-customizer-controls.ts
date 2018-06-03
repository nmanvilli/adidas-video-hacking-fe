
// Load Fabric.js library <http://fabricjs.com/>
import { fabric } from 'fabric';

// Load Fabric Brush addon <https://github.com/tennisonchan/fabric-brush/>
import '../../assets/js/fabric-brush.min.js';


export class FrameCustomizerControls {

    // Fabric Canvas for drawing
    drawingCanvas: fabric.Canvas;

    // Brushes
	messyBrush: fabric.InkBrush;
    preciseBrush: fabric.SprayBrush;
    
    // Colors
    color1:string = '#d0261e';
    color2:string = '#f8f8f8';
    color3:string = '#111111';
    currentColor: string;

    // Buttons
    messyBrushButton: HTMLButtonElement; // Messy Brush button
    preciseBrushButton: HTMLButtonElement; // Precise Brush button
    color1Button: HTMLButtonElement; // Color 1 button
    color2Button: HTMLButtonElement; // Color 2 button
    color3Button: HTMLButtonElement; // Color 3 button

    constructor (drawingCanvas: fabric.Canvas) {

        this.drawingCanvas = drawingCanvas;

        // This variable used to pass ourself timer call-backs
        let self:FrameCustomizerControls = this;

        // Set Messy Spray brush (from Fabric Brush addon)
		this.messyBrush = new fabric.InkBrush(this.drawingCanvas, {
            width: 30
		});

		// Set Precise Spray brush (from Fabric Brush addon)
		this.preciseBrush = new fabric.MarkerBrush(this.drawingCanvas, {
            width: 10
		});

        // Set starting color and brush
        this.currentColor = this.color1;
        this.setBrush(this.messyBrush);

        // Get DOM button elements
        this.messyBrushButton = <HTMLButtonElement>document.getElementById('messyBrushButton');
        this.preciseBrushButton = <HTMLButtonElement>document.getElementById('preciseBrushButton');
        this.color1Button = <HTMLButtonElement>document.getElementById('color1Button');
        this.color2Button = <HTMLButtonElement>document.getElementById('color2Button');
        this.color3Button = <HTMLButtonElement>document.getElementById('color3Button');


        // Event listener for the Messy Brush button
        this.messyBrushButton.addEventListener('click', function() {
            self.setBrush(self.messyBrush);
        });

        // Event listener for the Precise Brush button
        this.preciseBrushButton.addEventListener('click', function() {
            self.setBrush(self.preciseBrush);
        });

        // Event listener for the Color 1 button
        this.color1Button.addEventListener('click', function() {
            self.setColor(self.color1);
        });

        // Event listener for the Color 2 button
        this.color2Button.addEventListener('click', function() {
            self.setColor(self.color2);
        });

        // Event listener for the Color 3 button
        this.color3Button.addEventListener('click', function() {
            self.setColor(self.color3);
        });

    }

    setBrush(brush) {
        this.drawingCanvas.freeDrawingBrush = brush;
        this.setColor(this.currentColor);
    }

    setColor(color) {
        this.currentColor = color;
        this.drawingCanvas.freeDrawingBrush.changeColor(color);
    }

}
