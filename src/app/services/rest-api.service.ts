export class RestApiService  {

	endpointDomain: 'http://localhost/';

	getRandomFrames(){

		var frames = [
			{
				'id': '0001',
				'path': './assets/img/frame.jpg'
			},
			{
				'id': '0002',
				'path': './assets/img/frame.jpg'
			},
			{
				'id': '0003',
				'path': './assets/img/frame.jpg'
			},
		];

		return frames;
	}

    getAllVariations() {

        var numberOfVariations = 320

		// Example canvas 1
		var context1, canvas1;
		canvas1 = document.createElement('CANVAS');
		canvas1.setAttribute('width', 320);
		canvas1.setAttribute('height', 176);
		context1 = canvas1.getContext('2d');
		context1.lineWidth = 5;
		context1.strokeStyle = '#ff0000';

		context1.beginPath();
		context1.moveTo(33, 62);
		context1.lineTo(31, 23);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(32, 24);
		context1.lineTo(46, 41);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(46, 41);
		context1.lineTo(59, 24);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(59, 24);
		context1.lineTo(61, 61);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(73, 60);
		context1.lineTo(82, 24);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(82, 24);
		context1.lineTo(93, 57);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(77, 48);
		context1.lineTo(87, 45);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(106, 52);
		context1.lineTo(104, 22);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(104, 22);
		context1.lineTo(122, 53);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(122, 53);
		context1.lineTo(122, 21);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(135, 24);
		context1.lineTo(144, 55);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(143, 51);
		context1.lineTo(156, 24);
		context1.stroke();
		context1.closePath();

		context1.save();
		context1.translate(180.5, 43);
		context1.scale(1, 0.8888888888888888);
		context1.beginPath();
		context1.arc(0, 0, 12, 0, 6.283185307179586, false);
		context1.stroke();
		context1.closePath();
		context1.restore();

		context1.beginPath();
		context1.moveTo(69, 77);
		context1.lineTo(76, 98);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(76, 95);
		context1.lineTo(85, 76);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(85, 76);
		context1.lineTo(92, 100);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(92, 100);
		context1.lineTo(101, 74);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(108, 97);
		context1.lineTo(118, 77);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(118, 77);
		context1.lineTo(125, 94);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(111, 90);
		context1.lineTo(124, 86);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(132, 91);
		context1.lineTo(147, 90);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(144, 91);
		context1.lineTo(132, 72);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(132, 72);
		context1.lineTo(147, 69);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(31, 107);
		context1.lineTo(41, 145);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(39, 128);
		context1.lineTo(53, 122);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(51, 103);
		context1.lineTo(60, 139);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(95, 119);
		context1.lineTo(68, 133);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(70, 131);
		context1.lineTo(88, 150);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(70, 131);
		context1.lineTo(97, 136);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(106, 115);
		context1.lineTo(111, 147);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(106, 116);
		context1.lineTo(136, 122);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(110, 130);
		context1.lineTo(132, 126);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(109, 132);
		context1.lineTo(135, 144);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(172, 85);
		context1.lineTo(146, 129);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(146, 129);
		context1.lineTo(183, 144);
		context1.stroke();
		context1.closePath();

		context1.beginPath();
		context1.moveTo(147, 129);
		context1.lineTo(177, 115);
		context1.stroke();
		context1.closePath();

		// Example canvas 2
		var context2, canvas2;
		canvas2 = document.createElement('CANVAS');
		canvas2.setAttribute('width', 320);
		canvas2.setAttribute('height', 176);
		context2 = canvas2.getContext('2d');
		context2.lineWidth = 5;
		context2.strokeStyle = '#ff0000';

		context2.beginPath();
		context2.moveTo(48, 19);
		context2.lineTo(55, 58);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(33, 20);
		context2.lineTo(66, 14);
		context2.stroke();
		context2.closePath();

		context2.save();
		context2.translate(104, 35);
		context2.scale(1, 1);
		context2.beginPath();
		context2.arc(0, 0, 20, 0, 6.283185307179586, false);
		context2.stroke();
		context2.closePath();
		context2.restore();

		context2.beginPath();
		context2.moveTo(44, 82);

		context2.lineTo(44, 82);
		context2.stroke();

		context2.beginPath();
		context2.moveTo(45, 86);
		context2.lineTo(15, 109);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(15, 109);
		context2.lineTo(43, 128);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(59, 69);
		context2.lineTo(56, 126);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(60, 68);
		context2.lineTo(90, 77);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(59, 96);
		context2.lineTo(87, 75);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(58, 95);
		context2.lineTo(93, 119);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(114, 79);
		context2.lineTo(91, 100);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(91, 101);
		context2.lineTo(123, 116);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(90, 102);
		context2.lineTo(115, 97);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(133, 62);
		context2.lineTo(135, 119);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(131, 63);
		context2.lineTo(154, 116);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(131, 98);
		context2.lineTo(148, 97);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(161, 57);
		context2.lineTo(167, 114);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(147, 67);
		context2.lineTo(181, 55);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(195, 71);
		context2.lineTo(174, 93);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(174, 94);
		context2.lineTo(196, 111);
		context2.stroke();
		context2.closePath();

		context2.beginPath();
		context2.moveTo(180, 93);
		context2.lineTo(200, 91);
		context2.stroke();
		context2.closePath();

		// Array of variation overlays
		var variations = [];
		
		// Fill the array by alternating the two example canvases
		for (var i = 0; i < numberOfVariations; i++) {
			if ( i % 2 ) {
				variations[i] = canvas1.toDataURL();
			}
			else {
				variations[i] = canvas2.toDataURL();
			}
		}

		// Return the array of variation overlays
		return variations;
	}

}