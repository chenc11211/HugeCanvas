# HugeCanvas
HugeCanvas

## 巨型画布效果

* 实现巨型画布的移动、绘制和清除绘制；

* 实现画布缩略图，标记当前视口和快速定位画布；

---

### 要点总结：

1. 存储画布内容：使用canvas绘图对象的getImageData(x,y,width,height)和putImageData(imageData,x,y)方法获取画布数据和导入画布数据;

2. 获取和更新画布缩略图：使用toBlob()或toDataURL()方法将画布转为blob数据和url;
```
void canvas.toBlob(callback, type, encoderOptions);(ie暂不支持)
```
参数
callback 回调函数，可获得一个单独的Blob对象参数。通过URL.createObjectURL(blob||file)可将其转化为url;
type 可选 DOMString类型，指定图片格式，默认格式为image/png。
encoderOptions 可选 Number类型，值在0与1之间，当请求图片格式为image/jpeg或者image/webp时用来指定图片展示质量。如果这个参数的值不在指定类型与范围之内，则使用默认值，其余参数将被忽略。

3. 画布与缩略图的联动。

