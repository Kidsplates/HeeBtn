<template>
  <div id="hee">
    <div class="main">
      <div class="panel">
        <img src="@/assets/bar-bg.png" alt="">
        <div id="bar" class="bar">
        <img src="@/assets/bar.png" alt="">
        </div>
      </div>
      <div class="count">
        <img src="@/assets/count.png" alt="">
        <span>{{ this.point }}</span>
      </div>
      <audio id="audio" preload="metadata" controls>
        <source src="@/assets/hee.mp3" type="audio/mp3">
      </audio>
    </div>

    <div class="control" v-if="showMenu">
      [ESC]で開閉
      <button class="btn" @click="addCount">へぇ</button>
      <button class="btn" @click="resetCount">リセット</button>
      <div class="center remote">
        <div class="border-bottom pb-2 mb-2">リモート<br>コントロールにする</div>
        <div v-if="urlControlPage">
          <a :href="urlControlPage" target="_blank">{{ urlControlPage }}</a><br>
          <img :src="qrControlPage" alt="">
        </div>
        <div class="center" v-else>
          <small>peer to peer サーバー<br>に接続中…</small>
        </div>
      </div>
      <br>
      <button @click="reload">リロード</button>
      ※リロードするとリモコンページを再生成します
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'Home',
  data() {
    return {
      point: 0,
      urlControlPage: '',
      qrControlPage: '',
      showMenu: true,
    }
  },
  watch: {
    'count': function(newVal, oldVal) {
      this.point = (this.$store.state.count < this.$store.state.max)? this.$store.state.count: this.$store.state.max

      let percent = (this.point/this.max) * 100
      document.getElementById('bar').style.height = percent + "%"

      if ( newVal > oldVal ) {
        this.playAudio()
      }
    }
  },
  computed: {
    count() {
      return this.$store.state.count
    },
    max() {
      return this.$store.state.max
    },
    myPeerId() {
      return this.$store.state.myPeerId
    },
    connectPeerId() {
      return this.$store.state.connectPeerId
    },
  },
  mounted() {
    this.initEventListener()

    const setMyPeerId = this.setMyPeerId
    const generateControlUrl = this.generateControlUrl
    const receivePeer = this.receivePeer
    this.$peer.on('open', function() {
      setMyPeerId()
      generateControlUrl()
      receivePeer()
    })
  },
  methods: {
    reload(){
      location.reload()
    },
    initEventListener() {
      document.addEventListener("keydown", event => {
        // ESCAPE
        if (event.keyCode == 27) {
            this.showMenu = !this.showMenu
        }
      });
    },
    setMyPeerId() {
      this.$store.state.myPeerId = this.$peer.id
    },
    generateControlUrl() {
      const url = location.href+'control/'+this.myPeerId
      const setQrControlPage = this.setQrControlPage

      this.urlControlPage = url
      QRCode.toDataURL(url, function (err, data) {
        setQrControlPage(data)
      })
    },
    setQrControlPage(data) {
      this.qrControlPage = data
    },
    receivePeer() {
      const peers = this.peers
      const addCount = this.addCount
      const resetCount = this.resetCount

      this.$peer.on('connection', function(conn) {
        conn.on('data', function(data){
          if(data.action == "connect") {
            peers()
          }
          if(data.action == "add") {
            addCount()
          }
          if(data.action == "reset") {
            resetCount()
          }
        });
      })
    },
    peers() {
      for (let [key] of Object.entries(this.$peer.connections)) {
        this.$store.state.connectPeerId.push(key);
      }
    },
    addCount() {
      this.$store.state.count += 1
    },
    resetCount() {
      this.$store.state.count = 0
    },
    playAudio() {
      const audio = document.getElementById("audio").cloneNode(true)
      audio.play()
    },
  },
}
</script>

<style lang="scss">
body {
  background: #00ff00;
}

#hee {
  padding: 30px 0;

  .main {
    margin-left: 100px;
    width: 334px;
    text-align: center;
    .panel {
      position: relative;
      margin: 0 auto 1em;
    }
    .bar {
      position: absolute;
      bottom: 10px;
      left: 0;
      width: 100%;
      overflow: hidden;
      img {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .count {
      position: relative;
      margin: 0 auto;
      line-height: 1;
      span {
        position: absolute;
        top: 57%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 200px;
      }
    }
  }

  .control {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 100;
    padding: 30px;
    background: #efefef;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .btn {
      margin-top: 10px;
      width: 200px;
      height: 100px;
      font-size: 2em;
      background: #ffffff;
      box-shadow:2px 2px 9px -2px #969696;
      border-radius:6px;
      border:1px solid #cccccc;
      color: inherit;
      text-decoration: none;
    }
    .remote {
      margin-top: 10px;
      padding: 10px;
      width: 200px;
      box-sizing: border-box;
      background: #ff9bcd;
      box-shadow:2px 2px 9px -2px #969696;
      border-radius:6px;
      border:1px solid #cccccc;
      color: inherit;
      text-decoration: none;
      word-wrap: break-word;
    }
  }

  audio {
    display: none;
  }
}
</style>