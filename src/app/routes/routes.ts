import { Routes } from '@angular/router';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { FrameSelectorComponent } from '../frame-selector/frame-selector.component';
import { FrameCustomizerComponent } from '../frame-customizer/frame-customizer.component';
import { FrameQRComponent } from '../frame-qr/frame-qr.component';
import { FrameSharingComponent } from '../frame-sharing/frame-sharing.component';
import { AboutComponent } from '../about/about.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: VideoPlayerComponent },
    { path: 'choose', component: FrameSelectorComponent },
    { path: 'edit', component: FrameCustomizerComponent },
    { path: 'share-from-store', component: FrameQRComponent },
    { path: 'share', component: FrameSharingComponent },
    { path: 'about', component: AboutComponent}
];
