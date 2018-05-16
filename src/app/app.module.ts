import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';
import { routes } from './routes/routes';

import { VideoPlayerComponent } from './video-player/video-player.component';
import { FrameSelectorComponent } from './frame-selector/frame-selector.component';
import { FrameCustomizerComponent } from './frame-customizer/frame-customizer.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoPlayerComponent,
    FrameSelectorComponent,
    FrameCustomizerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
