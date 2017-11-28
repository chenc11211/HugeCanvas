;
//兼容的事件绑定和解绑函数
function addHandler(element,type,handler) {
    if(element.addEventListener){
        element.addEventListener(type,handler,false);
    }else if(element.attachEvent){
        element.attachEvent("on"+type,handler);
    }else {
        element["on"+type]=handler;
    }
}

function removeHandler(element,type,handler) {
    if(element.removeEventListener){
        element.removeEventListener(type,handler,false);
    }else if(element.detachEvent){
        element.detachEvent("on"+type,handler);
    }else {
        element["on"+type]=null;
    }
}

//获取外部css样式
function getStyle(element,attr) {
    if(getComputedStyle(element,null)){
        return window.getComputedStyle(element,null)[attr];
    }else {
        return element.currentStyle[attr];
    }
}
//获取画布数据，转为url;
function setImgUrl(oImg,oCanvas) {
    //chrome浏览器使用性能更好的toBlob方法；
    if(oCanvas.toBlob){
        oCanvas.toBlob(function (blob) {
            var url=window.URL.createObjectURL(blob);
            oImg.onload=function () {
                window.URL.revokeObjectURL(url);
            };
            oImg.src=url;
        });
    }else {
        oImg.src=oCanvas.toDataURL();
    }
}
window.onload=function () {

    var oCanvas=document.getElementById('origin_img');
    var oImgViewer=document.getElementById('img_viewer');
    var oThumbnail=document.getElementById('thumbnail');
    var oCurrentView=document.getElementById('current_view');
    var oPreview=document.getElementById('preview');
    var oDraw=document.getElementById('draw');
    var oClear=document.getElementById('clear');
    var oLineWidth=document.getElementById('line_width');

    var oCanvas_context=oCanvas.getContext('2d');
    // 设置渐变
    var gradient=oCanvas_context.createLinearGradient(0,0,oCanvas.width,oCanvas.height);
    gradient.addColorStop(0,'red');
    gradient.addColorStop(0.5,'green');
    gradient.addColorStop(1,'blue');
    oCanvas_context.lineWidth=1;
    oCanvas_context.fillStyle=gradient;
    oCanvas_context.rect(0,0,oCanvas.width,oCanvas.height);
    oCanvas_context.fill();
    //存储起始画布内容
    var saveImg=oCanvas_context.getImageData(0,0,oCanvas.width,oCanvas.height);
    // 获取画布内容
    //oThumbnail.src=oCanvas.toDataURL();
    setImgUrl(oThumbnail,oCanvas);

  //移动画布

    // 画布的起始位置
    var startX=0,
        startY=0,
        // 边界
        maxY=parseInt(getStyle(oCanvas,'height'))-parseInt(getStyle(oImgViewer,'height')),
        maxX=parseInt(getStyle(oCanvas,'width'))-parseInt(getStyle(oImgViewer,'width'));

    // 鼠标移动执行函数
    var move=function (ev) {
        var event=ev||window.event;
        var currentX=event.clientX,
            currentY=event.clientY;
        var x=currentX-startX,
            y=currentY-startY;
        var top=parseInt(oCanvas.style.top)+y,
            left=parseInt(oCanvas.style.left)+x;
        // 判断边界
        if(top>0){top=0}
        if (top<-(maxY)){top=-(maxY)}
        if(left>0){left=0}
        if(left<-(maxX)){left=-(maxX)}
        //设置画布
        oCanvas.style.top=top+'px';
        oCanvas.style.left=left+'px';
        // 设置缩略图
        oCurrentView.style.top=-top/20+"px";
        oCurrentView.style.left=-left/20+"px";
        startX=currentX;
        startY=currentY;
        if(event.preventDefault){
            event.preventDefault();
        }else {
            event.returnValue=false;
        }
    };

    // 起始触发并绑定鼠标移动事件
    var start=function (ev) {
        var event=ev||window.event;
        startX=event.clientX;
        startY=event.clientY;
        addHandler(document,'mousemove',move);
    };

    // 解除绑定
    var end=function () {
        removeHandler(document,'mousemove',move);
        removeHandler(document,'mousemove',move_thumb);
        if(oDraw.getAttribute('class')){
            removeHandler(oCanvas,'mousemove',move_draw);
            //oThumbnail.src=oCanvas.toDataURL();
            setImgUrl(oThumbnail,oCanvas);
        }
    };

    addHandler(oCanvas,'mousedown',start);
    addHandler(document,'mouseup',end);

    //移动缩略图
    var move_thumb=function (ev) {
        var event=ev||window.event,
            top=event.clientY-oPreview.offsetTop-12,
            left=event.clientX-oPreview.offsetLeft-25;
        if(top<0){top=0}
        if (top>75){top=75}
        if(left<0){left=0}
        if(left>150){left=150}
        oCurrentView.style.top=top+"px";
        oCurrentView.style.left=left+"px";
        oCanvas.style.top=-top*20+'px';
        oCanvas.style.left=-left*20+'px';
        if(event.preventDefault){
            event.preventDefault();
        }else {
            event.returnValue=false;
        }
    };

    // 缩略图起始并绑定
    var start_thumb=function (ev) {
        var event=ev||window.event,
            top=event.clientY-oPreview.offsetTop-12,
            left=event.clientX-oPreview.offsetLeft-25;
        if(top<0){top=0}
        if (top>75){top=75}
        if(left<0){left=0}
        if(left>150){left=150}
        oCurrentView.style.top=top+"px";
        oCurrentView.style.left=left+"px";
        oCanvas.style.top=-top*20+'px';
        oCanvas.style.left=-left*20+'px';
        addHandler(document,'mousemove',move_thumb);
    };

    addHandler(oPreview,'mousedown',start_thumb);


    //绘制起始
    
    function getPosition(event,element) {

    }

    var move_draw=function (ev) {
        var event=ev||window.event,
            x=event.clientX-parseInt(oCanvas.style.left),
            y=event.clientY-parseInt(oCanvas.style.top);
        oCanvas_context.lineTo(x,y);
        oCanvas_context.stroke();
        oCanvas_context.moveTo(x,y);
        if(event.preventDefault){
            event.preventDefault();
        }else {
            event.returnValue=false;
        }
    };

    var start_draw=function (ev) {
        var event=ev||window.event,
            x=event.clientX-parseInt(oCanvas.style.left),
            y=event.clientY-parseInt(oCanvas.style.top);
        oCanvas_context.beginPath();
        oCanvas_context.moveTo(x,y);
        addHandler(oCanvas,'mousemove',move_draw);
    };


    //绘制按钮
    var toggle_draw=function () {
        if(oDraw.getAttribute('class')=='draw'){
            oDraw.removeAttribute('class');
            oCanvas.removeAttribute('class');
            removeHandler(oCanvas,'mousedown',start_draw);
            addHandler(oCanvas,'mousedown',start);
        }else{
            oDraw.setAttribute('class','draw');
            oCanvas.setAttribute('class','draw');
            removeHandler(oCanvas,'mousedown',start);
            addHandler(oCanvas,'mousedown',start_draw);
        }
    };

    addHandler(oDraw,'click',toggle_draw);

    // 清除按钮
    var clear_draw=function () {
        oCanvas_context.putImageData(saveImg,0,0);
        setImgUrl(oThumbnail,oCanvas);
    };
    addHandler(oClear,'click',clear_draw);

    //设置笔触
    var set_lineWidth=function () {
        oCanvas_context.lineWidth=parseInt(oLineWidth.value);
    };
    addHandler(oLineWidth,'change',set_lineWidth);

};