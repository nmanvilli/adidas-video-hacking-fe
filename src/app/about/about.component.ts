import { Component, ViewChild } from '@angular/core';

// Load Menu Bar
import { MenuBarComponent } from '../menu-bar/menu-bar.component';

@Component({
	selector: 'APP-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
	providers: []
})
export class AboutComponent{

    // Add Menu Bar
    @ViewChild(MenuBarComponent) menu: MenuBarComponent;

}
