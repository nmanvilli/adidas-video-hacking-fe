
export class PointerControls {

    wsIp = '127.0.0.1';
    wsPort = 8989;
    connection: WebSocket;

    isDragging = false;

    constructor() {

        // This variable used to pass ourself to event call-backs
        let self:PointerControls = this;

        // Create WebSocket connection
        this.connection = new WebSocket('ws://' + this.wsIp + ':' + this.wsPort);

        /*
         * Stop execution of this constructor in case of error.
         * It's not possible to prevent the error from showing up in console,
         * not even with a try/catch statement.
         */
        this.connection.onerror = function() {
            console.log('No WebSocket connection, disabling IR pointer.');
            return;
        };

        // Manage WebSocket messages
        this.connection.onmessage = function (e) {
            let msg = JSON.parse(e.data);
            switch (msg.cmd) {

                // IR pointer is moving: drag mouse pointer
                case 'mv':
                    self.dragTo(msg.x, msg.y);
                    break;

                // IR pointer has stopped: stop dragging mouse pointer
                case 'st':
                    self.stopDragging();
                    break;
            };
        }

    }

    dragTo( projX: number, projY: number ) {
        let coords = this.remapCoordinates(projX, projY);
        

        if (this.isDragging) {
            console.log('MOVE TO ' + coords.x + ', ' + coords.y);
        }
        else {
            console.log('START MOVEMENT AT ' + coords.x + ', ' + coords.y);
            this.isDragging = true;
        }
    }

    stopDragging() {
        console.log('STOP');

        if (this.isDragging) {
            this.isDragging = false;
        }
    }

    remapCoordinates(x: number, y: number) {
        return {x: x, y: y};
    }

}
