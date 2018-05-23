import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RestApiService  {

	baseURL = 'http://localhost:3000/';

	constructor(private http: HttpClient) { }

	getRandomFrames(){
		let frames = this.http.get( this.baseURL + 'getRandomFrames' );
		return frames;
	}

    getAllVariations() {
		let variations = this.http.get( this.baseURL + 'getAllVariations' );
		return variations;
	}

}