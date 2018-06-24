import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-menu-bar',
    templateUrl: './menu-bar.component.html',
    styleUrls: ['./menu-bar.component.css'],
	providers: [ ]
})
export class MenuBarComponent {

    constructor(private router: Router, private route: ActivatedRoute) {
	}

}