<template>
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right">
        <i class="iconfont iconwode" @click="$router.push('user')"></i>
      </div>
    </div>
    <!-- tab栏 -->
    <van-tabs v-model="active" sticky>
      <van-tab :title="tab.name" v-for="tab in tabsList" :key="tab.id">
        <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
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
    }
  },
  async created() {
    let res = await this.$axios.get('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.tabsList = data
      this.getPostList(this.tabsList[this.active].id)
    }
  },
  watch: {
    active(newValue) {
      const id = this.tabsList[newValue].id
      this.getPostList(id)
    },
  },
  methods: {
    async getPostList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
        },
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.postList = data
      }
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__nav {
  background: #ccbbbb;
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
