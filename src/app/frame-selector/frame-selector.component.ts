import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';

import { FrameThumbnail } from '../frame-thumbnail';

@Component({
    selector: 'app-frame-selector',
    templateUrl: './frame-selector.component.html',
    styleUrls: ['./frame-selector.component.css'],
    providers: [ RestApiService ]
})
export class FrameSelectorComponent {
    title = 'Choose the frame to customize!'
    frameThumbs = [];

    constructor(private restApiService: RestApiService) {

        let jsonRandomFrames = restApiService.getRandomFrames();
        for (let jsonFrame of jsonRandomFrames) {
            let customizeUrl = '/edit?frame=' + jsonFrame.id + '&path=' + jsonFrame.path;
            this.frameThumbs.push( new FrameThumbnail(customizeUrl, jsonFrame.path) );
        }

    }

}