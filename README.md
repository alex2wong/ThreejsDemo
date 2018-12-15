# ThreejsDemo

不知不觉《三体》已经被我啃掉了50%，太长了这三部小说。从地球往事 => 黑暗森林，从文化大革命时的雷达峰基地，到22世纪的太空舰队。在刘慈欣的笔下，人类经历了无数政治、战争的浩劫，从三体舰队出发的那一刻起，走上了一条与外星文明抗争的漫长道路。降临派的惨败，荒谬的面壁者计划，黑暗的大低落时代，再到地球文明休养生息重返黄金时代的漫漫时间中，我感觉世界观被刷新了无数次。尺度（Scale）在小说中是一个重要的概念，时间和空间上的尺度跨越了微秒到世纪，纳米到光年，人类的视角也许每人都不懂。天文学家也许只看得见光年，而普通人常常谈到的是千米，生物学家可能往往喜欢研究微米、纳米的微观世界。微观世界中是否蕴含着另外一个宏大的宇宙，是否夸克就不在可分，这些问题真是不想不知道，一想就头大。。作为一个曾经研习地理信息系统，以计算机为视角来认识现实世界的Giser，可能有一些不同的感受罢。

## Scaling World [demo1，Basic 3d Objects](http://alex2wong.github.io/ThreejsDemo/index.html)
最早看到一部网上流传的三体相关的《水滴》微电影，没有看懂。。但经过对三体前两部的阅读，今天正巧又看到了这部微电影，非常震撼。从太空舰队组成的矩阵，到一艘战舰，再到一个舱室，一个螺丝钉上的红色油漆，到高分子化合物，排列整齐的分子群。尺度的连续切换，让我再次感叹老刘的想象力。其实我们也有可能想过镜子中是否有一个完整的世界。而水滴探测器这样的制造工艺让科技被锁死的地球文明望尘莫及。
So，能不能基于webgl或者threejs设计一个光滑的镜面，反映外界的实景。。想必非常酷炫。

以下是ThreeJS打造的例子：
![demo1，基本元素][1]


## Light and Terrain [demo2，Terrain from an RGB image](http://alex2wong.github.io/ThreejsDemo/index2.html)
本项目的意义在于基于ThreeJS库打造 有趣的应用，目前本项目有一个基础Demo展现了基于Webgl的基本对象绘制，光与影的设置。第二个[demo2，纹理加高程](http://alex2wong.github.io/ThreejsDemo/index2.html) 展现了稍微高级的使用方法，例如BufferGeometry的使用，canvas的像素获取，可以用来实现一些有趣的应用。textureLoader这个demo用到了谷歌中土世界地图的素材，4张非常优雅的影像切片，以及1张包含高程信息的图像（4个波段，rgba）。利用高程信息拉伸BufferGeometry初始化的平面，可以实现地形效果。
demo2，纹理加高程
![demo2，纹理加高程][2]


[1]: https://raw.githubusercontent.com/alex2wong/ThreejsDemo/master/img/Demo1.png
[2]: https://raw.githubusercontent.com/alex2wong/ThreejsDemo/master/img/Demo2.png
