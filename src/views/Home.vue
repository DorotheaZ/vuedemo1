<template>
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center" @click="$router.push('/search')">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right">
        <i class="iconfont iconwode" @click="$router.push('user')"></i>
      </div>
    </div>
    <!-- tab栏 -->
    <van-sticky :offset-top="0" z-index="999">
      <!-- 添加 z-index 滚动后点击方可 -->
      <div class="container" @click="$router.push('/tabedit')">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </van-sticky>
    <van-tabs v-model="active" sticky>
      <van-tab :title="tab.name" v-for="tab in tabsList" :key="tab.id">
        <van-pull-refresh @refresh="onRefresh" v-model="isRefreshing">
          <van-list
            v-model="loading"
            :finished="finished"
            offset="50"
            @load="onLoad"
            :immediate-check="false"
          >
            <hm-post
              v-for="(post, index) in postList"
              :key="index.id"
              :post="post"
              @click.native="$router.push(`/detail/${post.id}`)"
            ></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      tabsList: [],
      postList: [],
      pageIndex: 1,
      pageSize: 5,
      loading: false,
      finished: false,
      isRefreshing: false,
    }
  },
  async created() {
    let activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    let deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
    if (activeTabs && deactiveTabs) {
      this.tabsList = activeTabs
      return
    }
    this.getTabsList()
    this.getPostList(this.tabsList[this.active].id)
  },
  watch: {
    active(newValue) {
      this.postList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      this.getPostList(this.tabsList[newValue].id)
    },
  },
  methods: {
    async getTabsList() {
      let res = await this.$axios.get('/category')
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.tabsList = data
      }
    },
    async getPostList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.postList = [...this.postList, ...data]
        this.loading = false
        this.isRefreshing = false
        if (data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      this.loading = false
      this.pageIndex++
      this.getPostList(this.tabsList[this.active].id)
    },
    onRefresh() {
      setTimeout(() => {
        this.postList = []
        this.pageIndex = 1
        this.finished = false
        this.getPostList(this.tabsList[this.active].id)
      }, 1000)
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  width: 40px;
  height: 44.7px;
  line-height: 43.98px;
  text-align: center;

  background: #ccbbbb;
  position: absolute;
  right: 0;
  z-index: 999; // 添加 z-index 点击方可
}
/deep/ .van-tabs__nav {
  background: #ccbbbb;
  margin-right: 40px;
}
.header {
  height: 50px;
  background-color: #f00;
  display: flex;
  align-items: center;
  color: #fff;

  .left,
  .right {
    width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }

  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 30px;
  }

  .center {
    flex: 1;
    display: flex;
    justify-content: center;
    height: 30px;
    line-height: 30px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 15px;

    .iconsearch {
      margin-right: 8px;
    }
  }
}
</style>
