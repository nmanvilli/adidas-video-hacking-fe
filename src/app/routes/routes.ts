import { Routes } from '@angular/router';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { FrameSelectorComponent } from '../frame-selector/frame-selector.component';
import { FrameCustomizerComponent } from '../frame-customizer/frame-customizer.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: VideoPlayerComponent },
    { path: 'choose', component: FrameSelectorComponent },
    { path: 'edit', component: FrameCustomizerComponent }
];