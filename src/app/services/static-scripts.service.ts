export class StaticScriptsService  {

    public static jsPath = '/assets/js/';

    public static loadJs(src:string, inHeader = false) {
        let node = document.createElement('script');
        node.src = this.jsPath + src;
        node.type = 'text/javascript';
        node.async = true;
        node.charset = 'utf-8';
        if (inHeader)  document.getElementsByTagName('head')[0].appendChild(node);
        else  document.getElementsByTagName('body')[0].appendChild(node);
    }

}