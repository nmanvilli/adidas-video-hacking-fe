import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css'],
	providers: [ ]
})
export class MenuBarComponent {

    @Input() urlparams: string;

    constructor(private router: Router, private route: ActivatedRoute) {
        if (this.urlparams == undefined) {
            this.urlparams = '';
        }
	}

}