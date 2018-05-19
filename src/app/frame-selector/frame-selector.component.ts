import { Component } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';


@Component({
    selector: 'app-frame-selector',
    templateUrl: './frame-selector.component.html',
    styleUrls: ['./frame-selector.component.css'],
    providers: [ RestApiService ]
})
export class FrameSelectorComponent {
    title = 'Choose the frame to customize!'
    apiService: RestApiService;

    constructor(private restApiService: RestApiService) {
        this.apiService = restApiService;
    }

    ngAfterViewInit() {

        var randomFrames = this.apiService.getRandomFrames();

        var imgLink0 = <HTMLLinkElement>document.getElementById('a0');
        imgLink0.href = '/edit?frame=' + randomFrames[0].id + '&path=' + randomFrames[0].path;
        var img0 = document.getElementById('img0');
        (<HTMLImageElement>img0).src = randomFrames[0].path;

        var imgLink1 = <HTMLLinkElement>document.getElementById('a1');
        imgLink1.href = '/edit?frame=' + randomFrames[1].id + '&path=' + randomFrames[1].path;
        var img1 = document.getElementById('img1');
        (<HTMLImageElement>img1).src = randomFrames[1].path;

        var imgLink2 = <HTMLLinkElement>document.getElementById('a2');
        imgLink2.href = '/edit?frame=' + randomFrames[2].id + '&path=' + randomFrames[2].path;
        var img2 = document.getElementById('img2');
        (<HTMLImageElement>img2).src = randomFrames[2].path;

    }; // end of ngAfterViewInit()
}