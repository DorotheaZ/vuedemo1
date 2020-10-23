<template>
  <div>
    <div class="header">
      <div class="left" @click="back">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <input
          @input="search_recommend"
          v-model="keyword"
          @keyup.enter="search"
          type="text"
          placeholder="请输入搜索的内容"
        />
        <i class="iconfont iconsearch"></i>
      </div>
      <div class="right" @click="search">搜索</div>
    </div>
    <!-- 搜索推荐 -->
    <div class="recommend" v-if="recommendList.length > 0">
      <div
        v-for="item in recommendList"
        @click="history_search(item.title)"
        :key="item.id"
      >
        {{ item.title }}
      </div>
    </div>
    <!-- 列表 -->
    <div class="content" v-else-if="postList.length > 0">
      <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
    </div>
    <!-- 历史 -->
    <div class="history" v-else>
      <!-- 历史记录 -->
      <div class="title">历史记录</div>
      <div class="list">
        <div
          @click="clickHistoryTag(h)"
          class="item"
          v-for="h in historyList"
          :key="h"
        >
          {{ h }}
        </div>
      </div>
      <!-- 热门搜索 -->
      <div class="title">热门搜索</div>
      <div class="list">
        <div
          @click="clickHistoryTag(hot)"
          class="item"
          v-for="hot in hotList"
          :key="hot"
        >
          {{ hot }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      postList: [],
      historyList: [],
      recommendList: [],
      hotList: ['关晓彤', '情火', '肺炎', '1'],
    }
  },
  created() {
    this.historyList = JSON.parse(localStorage.getItem('history')) || []
    this.search_recommend = this.$_.debounce(this.search_recommend, 500)
  },
  watch: {
    keyword(val) {
      if (!val) {
        this.postList = []
        this.recommendList = []
      }
    },
  },
  methods: {
    async search() {
      if (this.keyword.trim() === '') return
      this.recommendList = []
      this.historyList.unshift(this.keyword)
      this.historyList = [...new Set(this.historyList)]
      localStorage.setItem('history', JSON.stringify(this.historyList))
      let res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword,
        },
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.postList = data
      }
    },
    clickHistoryTag(item) {
      this.keyword = item
      this.search()
    },
    async search_recommend() {
      if (!this.keyword.trim()) return
      let res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword,
        },
      })
      this.recommendList = res.data.data
    },
    history_search(item) {
      this.keyword = item
      this.search()
    },
    back() {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.$router.back()
      }
    },
  },
}
</script>

<style scoped lang="less">
.header {
  height: 40px;
  background: #ddd;
  border-bottom: 1px solid #ccc;
  display: flex;
  .left {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .right {
    width: 50px;
    display: flex;
    align-items: center;
  }
  .center {
    flex: 1;
    // background: pink;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    input {
      height: 30px;
      width: 90%;
      border: none;
      border: 1px solid #ccc;
      border-radius: 15px;
      text-indent: 2em;
    }
    i {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.history {
  padding: 10px;
  .title {
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    color: #000;
    font-weight: 700;
    margin-top: 20px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    .item {
      background: #ddd;
      padding: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}

.recommend {
  padding: 10px;
  div {
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    height: 50px;
    font-size: 16px;
  }
}
</style>
