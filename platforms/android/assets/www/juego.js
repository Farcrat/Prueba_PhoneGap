(function(){
    'use strict';
    window.addEventListener('load',init,false);
    window.addEventListener('resize',resize,false);
    var canvas=null,ctx=null;
    var scaleX=1,scaleY=1;
    var touches=[];
    var COLORS=['#f00','#0f0','#00f','#fff'];

    function init(){
        canvas=document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width=200;
        canvas.height=300;
        
        canvas.style.position='fixed';
        canvas.style.top='0';
        canvas.style.left='0';
        canvas.style.width='100%';
        canvas.style.height='100%';
        
        enableInputs();
        resize();
        run();
    }

    function resize(){
        if(window.innerWidth>window.innerHeight){
            canvas.width=300;
            canvas.height=200;
        }
        else{
            canvas.width=200;
            canvas.height=300;
        }
        scaleX=canvas.width/window.innerWidth;
        scaleY=canvas.height/window.innerHeight;
    }

    function run(){
        requestAnimationFrame(run);
        act();
        paint(ctx);
    }

    function act(){

    }

    function paint(ctx){
        ctx.fillStyle='#000';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        
        ctx.fillStyle='#999';
        ctx.fillText('Touch to test',10,10);
        for(var i=0,l=touches.length;i<l;i++){
            if(touches[i]!=null){
                ctx.fillStyle=COLORS[i%COLORS.length];
                ctx.fillRect(touches[i].x-10,touches[i].y-10,20,20);
                ctx.fillText('ID: '+i+' X: '+touches[i].x+' Y: '+touches[i].y,10,10*i+20);
            }
        }
    }

    function enableInputs(){
        canvas.addEventListener('touchstart',function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                var x=~~((t[i].pageX-canvas.offsetLeft)*scaleX);
                var y=~~((t[i].pageY-canvas.offsetTop)*scaleY);
                touches[t[i].identifier%100]=new Vtouch(x,y);
            }
        },false);
        canvas.addEventListener('touchmove',function(evt){
            evt.preventDefault();
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                if(touches[t[i].identifier%100]){
                    touches[t[i].identifier%100].x=~~((t[i].pageX-canvas.offsetLeft)*scaleX);
                    touches[t[i].identifier%100].y=~~((t[i].pageY-canvas.offsetTop)*scaleY);
                }
            }
        },false);
        canvas.addEventListener('touchend',function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                touches[t[i].identifier%100]=null;
            }
        },false);
        canvas.addEventListener('touchcancel',function(evt){
            var t=evt.changedTouches;
            for(var i=0;i<t.length;i++){
                touches[t[i].identifier%100]=null;
            }
        },false);
        
        canvas.addEventListener('mousedown',function(evt){
            evt.preventDefault();
            var x=~~((evt.pageX-canvas.offsetLeft)*scaleX);
            var y=~~((evt.pageY-canvas.offsetTop)*scaleY);
            touches[0]=new Vtouch(x,y);
        },false);
        document.addEventListener('mousemove',function(evt){
            if(touches[0]){
                touches[0].x=~~((evt.pageX-canvas.offsetLeft)*scaleX);
                touches[0].y=~~((evt.pageY-canvas.offsetTop)*scaleY);
            }
        },false);
        document.addEventListener('mouseup',function(evt){
            touches[0]=null;
        },false);

        function Vtouch(x,y){
            this.x=x||0;
            this.y=y||0;
        }
    }

    window.requestAnimationFrame=(function(){
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            function(callback){window.setTimeout(callback,17);};
    })();
})();