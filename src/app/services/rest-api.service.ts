import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RestApiService  {

	baseURL = 'http://localhost:3000/';

	constructor(private http: HttpClient) { }

	// Returns an array of random frames
	getRandomFrames(){
		let frames = this.http.get( this.baseURL + 'get-random-frames' );
		return frames;
	}

	// Save a variation. Returns file path for the new file.
	saveVariation(imageString, frameNum) {
		return this.http.post(
			this.baseURL + 'save-variation',
			{ image: imageString, frame: frameNum },
			{ responseType: 'text' }
		).toPromise();
	}

	getBaseUrl() {
		return this.baseURL;
	}

}