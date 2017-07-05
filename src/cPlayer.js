class cPlayer {
  
  constructor(option) {

		// 定义全局配置
    this.option = option
    
    // 定义默认参数
    let defaultOpt = {
      'autoplay': false,
      'skin': 'default',
      'mode': 'default',
      'volume': 50,
      'playlist': null
    }
    
    // 替换默认参数
    for(let optKey in defaultOpt) {
      if(!option.hasOwnProperty(optKey)) option[optKey] = defaultOpt[optKey]
    }
    
   // 初始化播放器
   (this.option.element != null) ? this.init() : console.log('播放器加载失败 (原因: 容器不存在)')
    
  }
  
  // 初始化播放器
  init() {
  	
    const rootID = this.option.element.id
    
    // 设置全局变量
    this.pFirst = true
    this.currTrack = 0
    
    // 加载皮肤文件
    const skinPath = this.jsPath() + 'skins/' + this.option.skin + '/'
    this.xhr(skinPath + 'template.html').then((template) => {
      
      // 构建播放器 HTML 结构
      template = template.replace(new RegExp(/{{ ([^"]*) }}/g), rootID + '$1')
      this.option.element.innerHTML = template
      
      // 判断皮肤 CSS 是否存在
      const _links = document.getElementsByTagName('link')
      let insertCSS = true
      for(let i = 0; i < _links.length; i++) {
        let rel = _links[i].rel,
            href = _links[i].href
        if(rel == 'stylesheet' && href.match(skinPath + 'template.css')) insertCSS = false
      }
      
      // 加载皮肤 CSS
      if(insertCSS) {
        let _body = document.getElementsByTagName('body')[0],
        _style = document.createElement('link')
        _style.rel = 'stylesheet'
        _style.href= skinPath + 'template.css'
        _body.appendChild(_style)
      }
      
      // 注册播放器 DOM
      this.elements = {
        'root': this.option.element,
        'cover_el': document.getElementById(rootID + 'TrackCover'),
        'title_el': document.getElementById(rootID + 'TrackTitle'),
        'artist_el': document.getElementById(rootID + 'TrackArtist'),
        'track_duration_time': document.getElementById(rootID + 'TrackDurationTime'),
        'track_played_time': document.getElementById(rootID + 'TrackPlayedTime'),
        'seek': document.getElementById(rootID + 'Seek'),
        'seek_played': document.getElementById(rootID + 'SeekPlayed'),
        'seek_played_point': document.getElementById(rootID + 'SeekPlayedPoint'),
        'seek_loaded': document.getElementById(rootID + 'SeekLoaded'),
        'toggle_btn_el': document.getElementById(rootID + 'ToggleBtn'),
        'stop_btn_el': document.getElementById(rootID + 'StopBtn'),
        'prev_btn_el': document.getElementById(rootID + 'PrevBtn'),
        'next_btn_el': document.getElementById(rootID + 'NextBtn'),
        'mode_btn_el': document.getElementById(rootID + 'ModeBtn'),
        'mute_btn_el': document.getElementById(rootID + 'MuteBtn'),
        'volume_bar_el': document.getElementById(rootID + 'VolumeBar'),
        'volume_fill_el': document.getElementById(rootID + 'VolumeFill')
      }
      
      // 创建 Audio 控件
      this.player = this.createPlayer()
      
    	// 播放切换按钮
    	if(this.elements.toggle_btn_el != null) {
      	this.elements.toggle_btn_el.addEventListener('click', () => {
      	  this.toggle()
      	})
    	}
    	
    	// 停止播放按钮
    	if(this.elements.stop_btn_el != null) {
      	this.elements.stop_btn_el.addEventListener('click', () => {
      	  this.stop()
      	})
    	}
    	
    	// 上一首按钮
    	if(this.elements.prev_btn_el != null) {
      	this.elements.prev_btn_el.addEventListener('click', () => {
      	  this.prev()
      	})
    	}
      
      // 下一首按钮
      if(this.elements.next_btn_el != null) {
        this.elements.next_btn_el.addEventListener('click', () => {
          this.next()
        })
      }
      
      // 播放模式按钮
      if(this.elements.mode_btn_el != null) {
        this.addClass(this.elements.mode_btn_el, this.option.mode)
        this.elements.mode_btn_el.addEventListener('click', () => {
          this.modeToggle()
        })
      }
      
    	// 进度条
    	if(this.elements.seek != null) {
      	const pointMove = (event) => {
      	  const e = event || window.event
      	  let percent = 0,
      	      barLeft = this.getOffset(this.elements.seek, 'left'),
      	      barWidth = this.elements.seek.clientWidth
      	  percent = parseInt(-(barLeft - e.clientX) / barWidth * 100)
      	  if(percent < 0) {
      	    percent = 0
      	  } else if(percent > 100) {
      	    percent = 100
      	  }
      	  this.updateBar('played', percent)
      	  this.seek(percent)
      	  this.elements.track_played_time.innerHTML = this.timeParse(this.player.currentTime)
      	}
      	const pointLeave = () => {
          document.removeEventListener('mousemove', pointMove)
          document.removeEventListener('mouseup', pointLeave)
          this.playedInterval = setInterval(() => {
            let currTime = this.player.currentTime,
                currPercent = parseInt((this.player.currentTime / this.player.duration) * 100)
            if(this.elements.track_played_time != null) this.elements.track_played_time.innerHTML = this.timeParse(currTime)
            if(this.elements.seek != null) {
              if(isNaN(currPercent)) {
                this.updateBar('played', 0)
              } else {
                this.updateBar('played', currPercent)
              }
            }
          }, 100)
      	}
      	this.elements.seek_played_point.addEventListener('mousedown', () => {
  	      clearInterval(this.playedInterval)
  	      document.addEventListener('mousemove', pointMove)
  	      document.addEventListener('mouseup', pointLeave)
      	})
      	this.elements.seek.addEventListener('click', pointMove)
    	}
    	
    	// 音量控制条
    	if(this.elements.volume_bar_el != null) {
      	this.elements.volume_bar_el.addEventListener('click', (event) => {
      	  const e = event || window.event
      	  let percent = 0,
      	      barLeft = this.getOffset(this.elements.volume_bar_el, 'left'),
      	      barWidth = this.elements.volume_bar_el.clientWidth
          percent = parseInt(-(barLeft - e.clientX) / barWidth * 100)
          if(percent < 0) {
            percent = 0
          } else if(percent > 100) {
            percent = 100
          }
          this.volume(percent)
      	})
    	}
    	
    	// 静音按钮
    	if(this.elements.mute_btn_el != null) {
      	this.elements.mute_btn_el.addEventListener('click', () => {
      	  this.mute()
      	})
     }
    	
     	// 加载歌曲
     	if(this.option.mode == 'random') {
     		this.genRandomPlaylist()
     		this.currTrack = this.randomPlaylist[0]
     	}
     	if(this.option.playlist.length > 0) this.load(this.currTrack)
     	
    }).catch((e) => {
      console.log(e)
    })
    
  }
  
  // 建立 Audio 控件
  createPlayer() {
    const player = document.createElement('audio')
    player.addEventListener('play', () => {
      if(this.elements.toggle_btn_el != null) this.addClass(this.elements.toggle_btn_el, 'playing')
    })
    player.addEventListener('pause', () => {
      if(this.elements.toggle_btn_el != null) this.removeClass(this.elements.toggle_btn_el, 'playing')
    })
    player.addEventListener('loadstart', () => {
    	if(this.elements.toggle_btn_el != null) this.removeClass(this.elements.toggle_btn_el, 'playing')
      this.playedInterval = setInterval(() => {
        let currTime = this.player.currentTime,
            currPercent = parseInt((this.player.currentTime / this.player.duration) * 100)
        if(this.elements.track_played_time != null) this.elements.track_played_time.innerHTML = this.timeParse(currTime)
        if(this.elements.seek != null) {
          if(isNaN(currPercent)) {
            this.updateBar('played', 0)
          } else {
            this.updateBar('played', currPercent)
          }
        }
      }, 100)
      // 初始化音量
      if(this.pFirst) this.volume(this.option.volume)
    })
    player.addEventListener('loadedmetadata', () => {
    	if(this.option.autoplay || !this.pFirst) this.play()
    	if(this.pFirst) this.pFirst = false
    })
    player.addEventListener('progress', () => {
      const percent = this.player.buffered.length ? this.player.buffered.end(this.player.buffered.length - 1) / this.player.duration * 100 : 0
      this.updateBar('loaded', percent)
    })
    player.addEventListener('volumechange', () => {
      if(this.player.muted) {
        if(this.elements.mute_btn_el != null) this.addClass(this.elements.mute_btn_el, 'muted')
      } else {
        if(this.elements.mute_btn_el != null) this.removeClass(this.elements.mute_btn_el, 'muted')
      }
      if(this.elements.volume_bar_el != null) this.updateBar('volume', this.player.volume * 100)
    })
    player.addEventListener('durationchange', () => {
      if(this.elements.track_duration_time != null) if(this.player.duration != 1) this.elements.track_duration_time.innerHTML = this.timeParse(player.duration)
    })
    player.addEventListener('ended', () => {
      this.next()
    })
    return player
  }

  // 加载歌曲
  load(id) {
  	const meta = this.option.playlist[id]
  	if(meta) {
  		this.currTrack = id
  		if(this.elements.cover_el != null )this.elements.cover_el.src = meta.cover
  		if(this.elements.title_el != null) this.elements.title_el.innerHTML = meta.title
  		if(this.elements.artist_el != null) this.elements.artist_el.innerHTML = meta.artist
  		this.player.src = meta.file
			clearInterval(this.playedInterval)
  	} else {
  	  console.log('歌曲不存在!')
  	}
  }
  
  // 播放歌曲
  play() {
    this.player.play()
  }
  
  // 停止播放
  stop() {
    this.player.currentTime = 0
    this.player.pause()
    if(this.elements.seek != null) this.updateBar('played', 0)
    if(this.elements.track_played_time != null) this.elements.track_played_time.innerHTML = this.timeParse(this.player.currentTime)
  }
  
  // 上一首
  prev() {
  	let prev = this.currTrack
  	this.updateBar('played', 0)
  	if(this.pFirst) this.pFirst = false
  	switch(this.option.mode) {
  		case 'default':
  			(prev > 0) ? prev-- : prev = this.option.playlist.length - 1
			break
			case 'random':
				let currRand = 0
  			for(let i = 0; i < this.randomPlaylist.length; i++) {
  				if(this.currTrack == this.randomPlaylist[i]) currRand = i
  			}
  			(currRand > 0) ? prev = this.randomPlaylist[currRand - 1] : prev = this.randomPlaylist[this.randomPlaylist.length - 1]
			break
  	}
    this.load(prev)
  }
  
  // 下一首
  next() {
  	let next = this.currTrack
  	this.updateBar('played', 0)
  	if(this.pFirst) this.pFirst = false
  	switch(this.option.mode) {
  		case 'default':
  			(next < (this.option.playlist.length - 1)) ? next++ : next = 0
  		break
  		case 'random':
  			let currRand = 0
  			for(let i = 0; i < this.randomPlaylist.length; i++) {
  				if(this.currTrack == this.randomPlaylist[i]) currRand = i
  			}
  			(currRand < (this.randomPlaylist.length - 1)) ? next = this.randomPlaylist[currRand + 1] : next = this.randomPlaylist[0]
  		break
  	}
    this.load(next)
  }
  
  // 播放模式切换
  modeToggle() {
    const modeType = ['default', 'loop', 'random']
    for(let i = 0; i < modeType.length; i++) {
      if(this.option.mode == modeType[i] && this.elements.mode_btn_el != null) this.removeClass(this.elements.mode_btn_el, modeType[i])
    }
    if(this.option.mode == 'default') {
      this.option.mode = 'loop'
    } else if(this.option.mode == 'loop') {
      this.option.mode = 'random'
      this.genRandomPlaylist()
    } else {
      this.option.mode = 'default'
    }
    if(this.elements.mode_btn_el != null) this.addClass(this.elements.mode_btn_el, this.option.mode)
  }
  
  // 播放状态切换
  toggle() {
    if(this.player.readyState == 4) {
      (this.player.paused) ? this.player.play() : this.player.pause()
    }
  }
  
  // 跳转到指定百分比
  seek(percent) {
    let time = this.player.duration * (percent / 100)
    if(isNaN(time)) time = 0
    this.player.currentTime = time
  }
  
  // 静音
  mute() {
    (this.player.muted) ? this.player.muted = false : this.player.muted = true
  }
  
  // 设置音量
  volume(vol) {
    let volume = parseInt(vol)
    this.player.volume = volume / 100
    if(this.player.volume > 0) {
      this.player.muted = false
    } else {
      this.player.muted = true
    }
  }
  
  // 插入播放列表
  push(playlist) {
    playlist.forEach((val) => {
      this.option.playlist.push(val)
      this.genRandomPlaylist()
    })
  }
  
  // 销毁
  destroy() {
    this.stop()
    this.option.element.innerHTML = ''
    clearInterval(this.playedInterval)
    for (let key in this) {
      if(this.hasOwnProperty(key)) delete this[key]
    }
  }
  
  // 生成随机列表
  genRandomPlaylist() {
  	this.randomPlaylist = []
  	for(let i = 0; i < this.option.playlist.length; i++) {
			this.randomPlaylist.push(i)
  	}
  	this.randomPlaylist.sort(function() { return 0.5 - Math.random() })
  }
  
  // 更新进度条
  updateBar(type = 'played', percent) {
    switch(type) {
      case 'played':
        this.elements.seek_played.style.width = percent + '%'
      break
      case 'loaded':
        this.elements.seek_loaded.style.width = percent + '%'
      break
      case 'volume':
        this.elements.volume_fill_el.style.width = percent + '%'
      break
    }
  }

  // 异步获取播放器资源
  xhr(url, method='GET', data=null) {
    return new Promise(function(res, rej) {
      try {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4 && xhr.status == 200) {
            res(xhr.responseText)
          } else if(xhr.readyState == 4) {
            rej(xhr.status)
          }
        }
        xhr.open(method, url, true)
        xhr.send(data)
      } catch(e) {}
    })
  }
  
  // 获取当前 JS 所在目录
  jsPath() {
    const script = document.getElementById('cmScript')
    let uri = script.attributes.src.nodeValue.split('/'),
        path = ''
    for(let i = 0; i < uri.length - 1; i++) {
      path += uri[i] + '/'
    }
    return path
  }
  
  // 添加类名
  addClass(tag, className) {
    let el = '';
    if(typeof tag == 'string') {
      el = document.getElementById(tag)
    } else {
      el = tag
    }
    if(el.className.indexOf(className) < 0) el.className += ' ' + className
  }
  
  // 移除类名
  removeClass(tag, className) {
    let el = '';
    if(typeof tag == 'string') {
      el = document.getElementById(tag)
    } else {
      el = tag
    }
    if(el.className.indexOf(className) > 0) {
      const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className = el.className.replace(reg, '')
    }
  }
  
  // 获取元素座标
  getOffset(el, type = 'left') {
    let offset = 0,
        parents = null
    switch(type) {
      case 'left':
        offset = el.offsetLeft
        parents = el.offsetParent
      break
      default:
        offset = el.offsetTop
        parents = el.offsetParent
      break
    }
    while(parents != null){
      (type == 'left') ? offset += parents.offsetLeft : offset += parents.offsetTop
      parents = parents.offsetParent
    }
    return offset;
  }
  
  // 格式化时间
  timeParse(time) {
    let minutes = 0,
        seconds = 0
     minutes = parseInt(time / 60)
     seconds = parseInt(time % 60)
     if(minutes < 10) minutes = '0' + minutes
     if(seconds < 10) seconds = '0' + seconds
     
    return minutes + ':' + seconds
  }
  
}

module.exports = cPlayer