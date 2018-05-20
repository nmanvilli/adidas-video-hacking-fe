export class FrameThumbnail {

    public id: string;
    public path: string;
    public customizeUrl: string;

    constructor( id, path ) {
        this.id = id;
        this.path = path;
        this.customizeUrl = '/edit?frame=' + id + '&path=' + path;
    }

}