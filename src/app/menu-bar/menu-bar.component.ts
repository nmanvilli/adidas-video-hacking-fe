import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css'],
	providers: [ ]
})
export class MenuBarComponent {

    @Input() urlparams: string;

    constructor() {
        if (this.urlparams == undefined) {
            this.urlparams = '';
        }
	}

}