import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

// Load Server API handler
import { RestApiService } from '../services/rest-api.service';
import { Observable } from 'rxjs';

// Load Template Models
import { FrameThumbnail } from './frame-thumbnail';


@Component({
    selector: 'app-frame-selector',
    templateUrl: './frame-selector.component.html',
    styleUrls: ['./frame-selector.component.css'],
    providers: [ RestApiService ]
})
export class FrameSelectorComponent implements AfterViewInit {

    @ViewChild(MenuBarComponent) menu: MenuBarComponent;

    title = 'Choose the frame to customize!';

    frameThumbs: Array<FrameThumbnail> = [];


    constructor(private router: Router, private restApiService: RestApiService) {

        // Get random frames from the server
        restApiService.getRandomFrames()
            .subscribe( (data:Array<{ id:string, path:string }>) => {
                // Add the frames to the array as FrameThumbnail objects
                for (let jsonFrame of data) {
                    this.frameThumbs.push( new FrameThumbnail(jsonFrame.id, jsonFrame.path) );
                }
            });




    }

    ngAfterViewInit() {
    }

}
