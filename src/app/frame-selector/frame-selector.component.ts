import { Component } from '@angular/core';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load Template Models
import { FrameThumbnail } from './frame-thumbnail';


@Component({
    selector: 'app-frame-selector',
    templateUrl: './frame-selector.component.html',
    styleUrls: ['./frame-selector.component.css'],
    providers: [ RestApiService ]
})
export class FrameSelectorComponent {

    title = 'Choose the frame to customize!';

    frameThumbs: Array<FrameThumbnail> = [];


    constructor(private restApiService: RestApiService) {

        // Get random frames from the server
        let jsonRandomFrames = restApiService.getRandomFrames();

        // Add the frames to the array as FrameThumbnail objects
        for (let jsonFrame of jsonRandomFrames) {
            this.frameThumbs.push( new FrameThumbnail(jsonFrame.id, jsonFrame.path) );
        }

    }

}