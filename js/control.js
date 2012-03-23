var PROPS = {
	'CANVAS':{
		'initialize':function(){

			this.canvasElements = [];
			PROPS.CANVAS.width = window.innerWidth;
			PROPS.CANVAS.height = window.innerHeight;


			PROPS.CANVAS.drawType = false;
			PROPS.field = false; 


			PROPS.CANVAS.mouseDown = false;

			for (var i = 0; i < 2; i++) {
				if (typeof document.getElementsByClassName("PRO-CAN")[i] !== "undefined") {
					this.canvasElements[i] = document.getElementsByClassName("PRO-CAN")[i];
				} else {
					this.canvasElements[i] = document.createElement('canvas');
					this.canvasElements[i].style.zIndex = 100000 + i;
					document.body.appendChild(this.canvasElements[i]);
					this.canvasElements[i].getContext('2d').canvas.width = this.width;
					this.canvasElements[i].getContext('2d').canvas.height = this.height;
					this.canvasElements[i].className = "PRO-CAN";
				}
			}

			this.overlay = this.canvasElements[1].getContext('2d');
			this.display = this.canvasElements[0].getContext('2d');

			window.addEventListener('resize', function(e){
				PROPS.CANVAS.width = window.innerWidth;
				PROPS.CANVAS.height = window.innerHeight;
				PROPS.CANVAS.overlay.canvas.width = PROPS.CANVAS.width;
				PROPS.CANVAS.overlay.canvas.height = PROPS.CANVAS.height;
				PROPS.CANVAS.display.canvas.width = PROPS.CANVAS.width;
				PROPS.CANVAS.display.canvas.height = PROPS.CANVAS.height;
				PROPS.CANVAS.draw();
			}, false);

			this.canvasElements[1].addEventListener('mousemove', function(e){
				PROPS.CANVAS.mouseX = e.clientX - PROPS.CANVAS.canvasElements[1].offsetLeft;
				PROPS.CANVAS.mouseY = e.clientY - PROPS.CANVAS.canvasElements[1].offsetTop;
				if (PROPS.CANVAS.mouseDown === true) {
					addElementProperties();
				}
			}, false);
			function addElementProperties(){
				if (PROPS.field == 'canvas') {
					if (PROPS.CANVAS.drawType == 'line') {
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.beginPath();
						PROPS.CANVAS.overlay.moveTo(PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1]);
						PROPS.CANVAS.overlay.lineTo(PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY);
						PROPS.CANVAS.overlay.stroke();
						PROPS.CANVAS.overlay.closePath();

					}
					if (PROPS.CANVAS.drawType == 'free') {
						PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].movement.push([PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY]);

						var elm = PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1];
						PROPS.CANVAS.overlay.lineTo(elm.movement[elm.movement.length - 1][0], elm.movement[elm.movement.length - 1][1]);
						PROPS.CANVAS.overlay.stroke();
					}
					if (PROPS.CANVAS.drawType == 'square') {
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.strokeRect(
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1],
							PROPS.CANVAS.mouseX - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
							PROPS.CANVAS.mouseY - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1]
						);
					}
					if (PROPS.CANVAS.drawType == 'eraser') {
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.fillRect(
							PROPS.CANVAS.mouseX - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.mouseY - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.draw_settings.eraserWidth,
							PROPS.CANVAS.draw_settings.eraserWidth
						);
						PROPS.CANVAS.display.clearRect(
							PROPS.CANVAS.mouseX - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.mouseY - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.draw_settings.eraserWidth,
							PROPS.CANVAS.draw_settings.eraserWidth
						);
					}

				}
			}
			this.canvasElements[1].addEventListener('mousedown', function(e){
				PROPS.CANVAS.mouseDown = true;
				if (PROPS.field == 'canvas') {

					PROPS.CANVAS.set_pencil();

					if (PROPS.CANVAS.drawType == 'line') {
						PROPS.CANVAS.elements.push({
							'type':'line',
							'start':[PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY]
						});

						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.beginPath();
						PROPS.CANVAS.overlay.moveTo(PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1]);
						PROPS.CANVAS.overlay.lineTo(PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY);
						PROPS.CANVAS.overlay.stroke();
						PROPS.CANVAS.overlay.closePath();
					}
					if (PROPS.CANVAS.drawType == 'free') {
						PROPS.CANVAS.elements.push({
							'type':'free',
							'movement':[[PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY]]
						});
							
						PROPS.CANVAS.overlay.beginPath();
						PROPS.CANVAS.overlay.moveTo(PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].movement[0][0], PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].movement[0][1]);
						PROPS.CANVAS.overlay.stroke();
					}
					if (PROPS.CANVAS.drawType == 'square') {
						PROPS.CANVAS.elements.push({
							'type':'square',
							'start':[PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY]
						});
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.strokeRect(
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1],
							PROPS.CANVAS.mouseX - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
							PROPS.CANVAS.mouseY - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1]
						);
					}
					if (PROPS.CANVAS.drawType == 'eraser') {
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.fillRect(
							PROPS.CANVAS.mouseX - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.mouseY - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.draw_settings.eraserWidth,
							PROPS.CANVAS.draw_settings.eraserWidth
						);
						PROPS.CANVAS.display.clearRect(
							PROPS.CANVAS.mouseX - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.mouseY - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.draw_settings.eraserWidth,
							PROPS.CANVAS.draw_settings.eraserWidth
						);
					}
				}
			}, false);
			this.canvasElements[1].addEventListener('mouseup', function(e){
				PROPS.CANVAS.mouseDown = false;
				if (PROPS.field == 'canvas') {
					if (PROPS.CANVAS.drawType == 'line') {
						PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].end = [PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY];
						
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.beginPath();
						PROPS.CANVAS.overlay.moveTo(PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1]);
						PROPS.CANVAS.overlay.lineTo(PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY);
						PROPS.CANVAS.overlay.stroke();
						PROPS.CANVAS.overlay.closePath();
					}
					if (PROPS.CANVAS.drawType == 'free') {
						PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].movement.push([PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY]);
						
						PROPS.CANVAS.overlay.lineTo(PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].movement[0], PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].movement[1]);
						PROPS.CANVAS.overlay.stroke();
						PROPS.CANVAS.overlay.closePath();
					}
					if (PROPS.CANVAS.drawType == 'square') {
						PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].end = [PROPS.CANVAS.mouseX, PROPS.CANVAS.mouseY];

						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.strokeRect(
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1],
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].end[0] - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
							PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].end[1] - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1] 
						);
						console.log(PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1]);
					}
					if (PROPS.CANVAS.drawType == 'eraser') {
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
						PROPS.CANVAS.overlay.fillRect(
							PROPS.CANVAS.mouseX - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.mouseY - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.draw_settings.eraserWidth,
							PROPS.CANVAS.draw_settings.eraserWidth
						);
						PROPS.CANVAS.display.clearRect(
							PROPS.CANVAS.mouseX - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.mouseY - (PROPS.CANVAS.draw_settings.eraserWidth / 2), 
							PROPS.CANVAS.draw_settings.eraserWidth,
							PROPS.CANVAS.draw_settings.eraserWidth
						);
						PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);
					}

				}
				PROPS.CANVAS.draw();
			}, false);
		},
		'draw_settings':{
			fontSize: 20,
			lineWidth: 10,
			color: 'black',
			eraserWidth: 20
		},
		'draw':function(whole){
			if (this.elements.length < 1) {
				return;
			}
			if (arguments.length < 1) {
				whole = false;
			}
			
			PROPS.CANVAS.overlay.clearRect(0, 0, PROPS.CANVAS.width, PROPS.CANVAS.height);

			if (whole === true) {
				
				this.display.clearRect(0,0,this.width,this.height);

				for (var i = 0; i < this.elements.length; i++) {
					this.draw_figure(i);
				}
			} else {
				this.draw_figure(this.elements.length - 1);
			}
		},
		'pencils':{
			'color': 'black',
			'lineWidth':'1'
		},
		'set_pencil':function(){
			this.overlay.fillStyle = this.pencils.color;
			this.overlay.strokeStyle = this.pencils.color;
			this.overlay.lineWidth = this.pencils.lineWidth;

			this.display.fillStyle = this.pencils.color;
			this.display.strokeStyle = this.pencils.color;
			this.display.lineWidth = this.pencils.lineWidth;
		},
		'draw_figure':function(i){
			console.log(this.elements);
			if (this.elements[i].type == 'free') {
				this.display.beginPath();
				this.display.moveTo(this.elements[i].movement[0][0], this.elements[i].movement[0][1]);
				for (var x = 1; x < this.elements[i].movement.length; x++) {
					this.display.lineTo(this.elements[i].movement[x][0], this.elements[i].movement[x][1]);
				}
				this.display.stroke();
				this.display.closePath();
			}
			if (this.elements[i].type == 'line') {
				this.display.beginPath();
					this.display.moveTo(this.elements[i].start[0], this.elements[i].start[1]);
					this.display.lineTo(this.elements[i].end[0], this.elements[i].end[1]);
				this.display.stroke();
				this.display.closePath();
			}
			if (PROPS.CANVAS.drawType == 'square') {

				PROPS.CANVAS.display.strokeRect(
					PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
					PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1],
					PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].end[0] - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[0], 
					PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].end[1] - PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1].start[1] 
				);

			}

		},
		'edit':{
			'undo_list':[],
			'redo':function(){
				console.log(PROPS);
			},
			'undo':function(){
				this.undo_list.push(PROPS.CANVAS.elements[PROPS.CANVAS.elements.length - 1]);
				PROPS.CANVAS.elements.splice(-1,1);
				PROPS.CANVAS.draw(true);
			}
		},
		'elements':[]
	}
}
