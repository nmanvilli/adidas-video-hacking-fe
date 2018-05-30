import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { routes } from './routes/routes';

import { QRCodeModule } from 'angular2-qrcode';

import { VideoPlayerComponent } from './video-player/video-player.component';
import { FrameSelectorComponent } from './frame-selector/frame-selector.component';
import { FrameCustomizerComponent } from './frame-customizer/frame-customizer.component';
import { FrameQRComponent } from './frame-qr/frame-qr.component';
import { FrameSharingComponent } from './frame-sharing/frame-sharing.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    FrameSelectorComponent,
    FrameCustomizerComponent,
    FrameQRComponent,
    FrameSharingComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
