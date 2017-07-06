# cPlayer
---
> 一个支持自定义皮肤的 HTML5 音乐播放器

## 截图
![截图](https://raw.githubusercontent.com/Caringor/cPlayer/master/demo/screenshot.jpg)

## 演示
有关 cPlayer 之演示，请参考 [cPlayer 演示页](https://caringor.github.io/cPlayer/demo/)。

## 概述
cPlayer 是一个基于 HTML5 的音乐播放插件，无需 jQuery 库支持即可调用出一个支持自定义皮肤的音乐播放器。此插件采用 ECMAScript6 编写，经 [Babel](https://babeljs.io/) 编译 ECMAScript5 后发布。

## 特性
- [x] 支持自定义皮肤
- [x] 提供 API 接口
- [ ] ~~LRC 歌词显示（计划中）~~

## 获取
```
git clone https://github.com/caringor/cPlayer.git
```

## 调用

#### HTML
```
<div id="cm1"></div>
<!-- ... -->
<script type="text/javascript" src="cmusic.min.js" id="cmScript"></script>
```

#### JS
```
var cm1 = new cMusic({
  'element': document.getElementById('cm1'),
  'autoplay': false,
  'mode': 'default',
  'playlist': [
    {
      'title': '人生讃歌',
      'artist': '茶色坚果巧克力',
      'cover': 'http://p3.music.126.net/CRO_peQ7AN1e811BoKrQCw==/2327666116025235.jpg?param=500y500',
      'file': 'https://m1.jixun.moe/26082159/192000/4975020ff8fcb2ecb26233cecdd80e9cb46bfb4655d3f8b4ca14e8894b4c13ac'
    }
  ]
})
```

#### 参数
```
//播放器容器
element: document.getElementById('cm1')

//是否自动播放
autoplay: false

//皮肤 (自带 default、vertical 两套皮肤)
skin: 'default'

//播放模式
mode: 'default'

//初始音量
volume: 50

//播放列表
playlist: [
  {
    'title': '', // 歌曲标题
    'artist': '', // 歌手
    'cover': '', // 封面地址
    'file': '' // 音乐地址
  }
]
```

## API
> + `element.play()` 播放
> + `element.toggle()` 播放状态切换
> + `element.stop()` 停止
> + `element.prev()` 上一首
> + `element.next()` 下一首
> + `element.push()` 插入播放列表
> + `element.modeToggle()` 播放模式切换
> + `element.seek()` 跳到指定时间 (百分比)
> + `element.volume()` 设置音量 (百分比)
> + `element.mute()` 静音
> + `element.currTrack` 当前轨道
> + `element.destroy()` 销毁

## 皮肤
皮肤是 cPlayer 的一个特性，不同于其它播放插件，cPlayer 的皮肤引擎相对宽松，每个按钮都被当成是独立的部件。这意味着您不仅可以修改样式表，还能对播放器的 HTML 结构进行任意调整，甚至移除掉某写不需要的按钮。

#### 结构
细心的您会发现，在 cPlayer JS 文件所处的 `同级目录` 下，有一个叫做 `skins` 的文件夹，里面的结构是这样的：

> + skins
> + + default
> + + vertical

其中，`default` 和 `vertical` 这两个文件夹，我们称它做皮肤包，文件夹名与 `skin` 参数的值对应。cPlayer 会根据包内的 `template.css`、`template.html` 这两个文件进行渲染。亦就是说，一个正常的 cPlayer 主题包，需具备以上两个文件。

#### 部件
cPlayer 把每个按钮都当成是独立的部件，并根据部件标记来绑定与之对应的功能，部件标记格式为 `{{ value }}`。目前，cPlayer 提供以下部件，请根据需要把部件标记填到目标元素的 ID 标签内。

> + `{{ TrackTitle }}` 歌曲名
> + `{{ TrackArtist }}` 歌手名
> + `{{ TrackCover }}` 专辑封面
> + `{{ TrackPlayedTime }}` 已播放时间
> + `{{ TrackDurationTime }}` 歌曲总长
> + `{{ ToggleBtn }}` 播放状态切换按钮
> + `{{ StopBtn }}` 停止按钮
> + `{{ PrevBtn }}` 上一曲按钮
> + `{{ NextBtn }}` 下一曲按钮
> + `{{ ModeBtn }}` 播放模式切换妞
> + `{{ MuteBtn }}` 静音按钮
> + `{{ Seek }}` 进度条
> + + `{{ SeekPlayedPoint }}` 进度条拖拽触点
> + + `{{ SeekPlayed }}` 播放进度
> + + `{{ SeekLoaded }}` 缓冲进度
> + `{{ VolumeBar }}` 音量控制条
> + + `{{ VolumeFill }}` 音量百分比


## 其它
cPlayer 采用 MIT 许可证进行发布，有关 cPlayer 的使用问题欢迎提交 Issue 或使用以下方式与我联系。

- Telegram: [@lkwing](https://telegram.me/lkwing)
- QQ: 474599981
- 用户交流群: 635767413