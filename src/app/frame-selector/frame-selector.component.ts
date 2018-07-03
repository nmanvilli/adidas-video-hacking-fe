import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalsService } from '../services/globals.service';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';

// Load Template Models
import { FrameThumbnail } from './frame-thumbnail';

// Load Menu Bar
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

@Component({
    selector: 'app-frame-selector',
    templateUrl: './frame-selector.component.html',
    styleUrls: ['./frame-selector.component.css'],
    providers: [ RestApiService, GlobalsService ]
})
export class FrameSelectorComponent {

    isInStore: boolean;

    // Add Menu Bar
    @ViewChild(MenuBarComponent) menu: MenuBarComponent;

    // HTML title
    title = 'Choose the frame to customize!';

    // Array of random thumbnails
    frameThumbs: Array<FrameThumbnail> = [];


    constructor(private router: Router, private restApiService: RestApiService, private globalsService: GlobalsService ) {

        this.isInStore = globalsService.INSTORE;

        // Get random frames from the server
        restApiService.getRandomFrames()
            .subscribe( (data:Array<{ id:string, path:string }>) => {
                // Add the frames to the array as FrameThumbnail objects
                for (let jsonFrame of data) {
                    this.frameThumbs.push( new FrameThumbnail(jsonFrame.id, jsonFrame.path) );
                }
            });

    }

}
