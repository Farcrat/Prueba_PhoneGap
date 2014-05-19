//En Javascript todos los scripts son globales y pueden interactuar entre si, por lo que si hay 2 variables
//definidas con el mismo nombre en 2 scripts diferentes estas entraran en conflicto.
//Por esa razon podemos encapsular nuestro codigo dentro de una funcion autoejecutable de modo que
//nuestras variables y objetos seran locales impidiendo la modificacion por parte de otros scripts.
window.onload =function(){
	//Le decimos al navegador que no sea permisivo con malas practicas que se hacian antiguamente
	//y que acepta si no se lo indicamos. De este modo lo reportara como error en la consola javascript.
	'use strict';

	//Se queda escuchando para que cuando se termine de cargar la pagina comience a ejecutar la funcion init.
	window.addEventListener('load',init,false);

	var canvas=null,ctx=null;
	var mousex=0,mousey=0;

	var jugador=new Circulo(0,0,1);

	var ultimaPulsacion=null;
	var ultimaLiberacion=null;
	var arrastrables=[];
	var arrastrando=null;

	function init(){
		//Buscamos el elemento canvas del html mediante el id y lo asociamos a una variable.
		canvas=document.getElementById('canvas');
		//Obtenemos el contecto 2d de nuesto lienzo. Esto hace falta ya que es la herramienta con la que 
		//pintamos en el lienzo.
		ctx=canvas.getContext('2d');

		for(var i=0;i<5;i++)
			arrastrables.push(new Circulo(random(canvas.width),random(canvas.height),10));

		activarEscuchadores();

		run();
		repaint();
	}

	function run(){
		setTimeout(run,50);
		act();
	}

	function repaint(){
		//La funcion requiestAnimationFrame le pregunta al navegador cuando puede volver a pintar, 
		//que dependera del rendimiento del ordenador(FPS).
		requestAnimationFrame(repaint);
		paint(ctx);
	}

	function act(){
		jugador.x=mousex;
		jugador.y=mousey;

		if(jugador.x<0)
			jugador.x=0;
		if(jugador.x>canvas.width)
			jugador.x=canvas.width;
		if(jugador.y<0)
			jugador.y=0;
		if(jugador.y>canvas.height)
			jugador.y=canvas.height;

		//Si se ha pulsado el raton comprobamos si en la posicion actual del raton hay un circulo.
		if(ultimaPulsacion==1){
			ultimaPulsacion=null;
			for(var i=0;i<arrastrables.length;i++){
				if(jugador.distancia(arrastrables[i])<=0){
					arrastrando=i;
					break;//Salimos del for para evitar mover mas de un circulo a la vez.
				}
			}
		}else if(ultimaLiberacion==1){
			ultimaLiberacion=null;
			arrastrando=null;
		}

		//Si estamos moviendo algun circulo lo ponemos en la posicion actual del raton.
		if(arrastrando!=null){
			arrastrables[arrastrando].x=jugador.x;
			arrastrables[arrastrando].y=jugador.y;
		}
	}

	function paint(ctx){
		ctx.fillStyle='#000';
		ctx.fillRect(0,0,canvas.width,canvas.height);

		//Pintamos los objetos arrastrables
		ctx.fillStyle='#00f';
		for(var i=0;i<arrastrables.length;i++)
			arrastrables[i].fill(ctx);

		//ctx.strokeStyle='#0f0';
		//jugador.stroke(ctx);
	}

	function Circulo(x,y,radio){
		this.x=(x==null)?0:x;
		this.y=(y==null)?0:y;
		this.radio=(radio==null)?0:radio;
	}
	Circulo.prototype.fill=function(ctx){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radio,0,Math.PI*2,true);
		ctx.fill();
	}
	Circulo.prototype.stroke=function(ctx){
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.radio,0,Math.PI*2,true);
		ctx.stroke();
	}
	Circulo.prototype.distancia=function(circulo){
		if(circulo!=null){
			var dx=this.x-circulo.x;
			var dy=this.y-circulo.y;
			return (Math.sqrt(dx*dx+dy*dy)-(this.radio+circulo.radio));
		}
	}

	//Esta funcion nos devuelve un numero aleatorio entre 0 y max que es el valor maximo 
	//que puede tener sin salirse del Canvas.
	function random(max){
		//Podemos usar ~~ en lugar de Math.floor ya que es mas rapido.
		return Math.floor(Math.random()*max);
	}

	//Creamos una funcion que agrupe nuestros escuchadores para manejarlos de forma mas sencilla.
	function activarEscuchadores(){

		//Evento que escucha el movimiento del dedo sobre la pantalla tactil
		canvas.addEventListener('touchmove',function(evt){
			evt.preventDefault();
			var t=evt.targetTouches;
			mousex=t[0].pageX-canvas.offsetLeft;
			mousey=t[0].pageY-canvas.offsetTop;
		},false);

		//Evento que escucha la pulsacion del dedo sobre la pantalla tactil.
		canvas.addEventListener('touchstart', function(evt){
			evt.preventDefault();
			ultimaPulsacion=1;
			//Agregamos las mismas acciones que en el evento touchmove para saber la posicion inicial del
			//primer toque pues de lo contrario el movimiento empezaria en(null,null).
			var t=evt.targetTouches;
			mousex=t[0].pageX-canvas.offsetLeft;
			mousey=t[0].pageY-canvas.offsetTop;
		},false);

		//Creamos los eventos para cuando el toque termina o se cancela creando la misma accion en ambos para
		//evitar errores.
		canvas.addEventListener('touchend',function(evt){
			ultimaLiberacion=1;
		});
		canvas.addEventListener('touchcancel',function(evt){
			ultimaLiberacion=1;
		});
	}

}