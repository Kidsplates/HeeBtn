<template>
  <div id="control">
    <div class="control">
      <div class="remote">
        <div class="center">コントローラーにする</div>
        <div class="center">
          <div class="status"><span v-if="success">接続成功</span><span v-if="!success">接続中…</span></div>
        </div>
      </div>
      <button class="btn" @click="remoteAddCount">へぇ</button>
      <button class="btn" @click="remoteResetCount">リセット</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hee',
  data() {
    return {
      success: false,
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
    const setMyPeerId = this.setMyPeerId
    const connectPeer = this.connectPeer
    this.$peer.on('open', function() {
      setMyPeerId()
      connectPeer()
    })
  },
  methods: {
    setMyPeerId() {
      this.$store.state.myPeerId = this.$peer.id
    },
    connectPeer() {
      const id = this.$route.params.id
      const conn = this.$peer.connect(id)
      const successConnection = this.successConnection
      conn.on('open', function() {
        successConnection()
      })
    },
    successConnection() {
      this.peers()
      this.success = true
    },
    peers() {
      for (let [key] of Object.entries(this.$peer.connections)) {
        this.$store.state.connectPeerId.push(key);
      }
    },
    remoteAddCount() {
      const id = this.connectPeerId[0]
      const conn = this.$peer.connect(id)
      conn.on('open', function() {
        conn.send({
          action: 'add'
        });
      })
    },
    remoteResetCount() {
      const id = this.connectPeerId[0]
      const conn = this.$peer.connect(id)
      conn.on('open', function() {
        conn.send({
          action: 'reset'
        });
      })
    },
  },
}
</script>

<style lang="scss">
body {
  background: #efefef;
}

#control {
  .control {
    position: relative;
    z-index: 100;
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
      .status {
        background: #ffffff;
        border-radius:6px;
        border:1px solid #cccccc;
        padding: 10px;
      }
    }
  }
}
</style>