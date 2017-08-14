var playlist = [
  {
    'title': 'MR.TAXI',
    'artist': 'れをる',
    'cover': 'http://p3.music.126.net/dwm1e42u6nUwHqM97HgymA==/2887317534745980.jpg?param=500y500',
    'file': 'https://m1.jixun.moe/31356410/192000/a71281c701a60fc9dfd5e07154552811dabb064eb073c2ecaf26eeca2ed47002',
    'lrc': 'lrc/MR.TAXI.lrc'
  },
  {
    'title': '人生讃歌',
    'artist': '茶色坚果巧克力',
    'cover': 'http://p3.music.126.net/CRO_peQ7AN1e811BoKrQCw==/2327666116025235.jpg?param=500y500',
    'file': 'https://m1.jixun.moe/26082159/192000/4975020ff8fcb2ecb26233cecdd80e9cb46bfb4655d3f8b4ca14e8894b4c13ac',
    'lrc': 'lrc/人生讃歌.lrc'
  },
  {
    'title': '告白予行練習',
    'artist': '鎖那',
    'cover': 'http://p1.music.126.net/DlbcqrIxwY8lgel4ctDvzw==/6656443394675930.jpg?param=500y500',
    'file': 'https://m1.jixun.moe/29017574/192000/f6ad4aa97dcddf4463f717743ef02b661494bdc085b9f810c5bcd777689c093c',
    'lrc': 'lrc/告白予行練習.lrc'
  },
  {
    'title': 'drop pop candy',
    'artist': 'れをる / ギガP',
    'cover': 'http://p4.music.126.net/cZPx3peGTuWEI_GaZB5CDg==/8892850045794893.jpg?param=500y500',
    'file': 'https://m1.jixun.moe/28941711/192000/ec63e0de79896053f37b336328da14deb9ba70eced8169cd9564ce9ad25916bc',
    'lrc': 'lrc/drop_pop_candy.lrc'
  },
  {
    'title': '再教育',
    'artist': 'いかさん',
    'cover': 'http://p3.music.126.net/SixQNrGRejG79VTGhwdvwQ==/7768049650269645.jpg?param=500y500',
    'file': 'https://m1.jixun.moe/30053369/192000/0fb0c7fe94b9c94ef18e40ccd6993c1607419c4282705bf04dde2c990ee35c60',
    'lrc': 'lrc/再教育.lrc'
  },
  {
    'title': 'Good Night (Radio Edit)',
    'artist': 'ななひら',
    'cover': 'http://p4.music.126.net/Q51QHeh2hUVAaF_au0Zsfg==/7997847580978679.jpg?param=500y500',
    'file': 'https://m1.jixun.moe/32737364/192000/f8877e42dfd7888c4f824364c3f5d6f33a77b2952adc921444dcb90fc799783d'
  }
]

var playlist2 = [
  {
    'title': 'adrenaline!!!',
    'artist': 'TrySail',
    'cover': 'http://p4.music.126.net/iXtmQBWe5yxvE6ZM6g0nkA==/18636722092705558.jpg?param=500y500',
    'file': 'https://m1.jixun.moe/479938319/192000/4ba78f0249448a4c0f9f3099a74cfb24d21274e298e78fe93a7593556d92efbb',
    'lrc': 'lrc/adrenaline.lrc'
  }
]

var cm1 = new cPlayer({
  'element': document.getElementById('cm1'),
  'autoplay': false,
  'mode': 'default',
  'skin': 'default',
  'playlist': playlist
})