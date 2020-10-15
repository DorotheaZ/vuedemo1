<template>
  <div class="my-comments">
    <hm-header>我的跟帖</hm-header>
    <!-- 列表 -->
    <van-list
      :immediate-check="false"
      offset="50"
      @load="onLoad"
      :finished="finished"
      v-model="loading"
      finished-text="没有更多数据了"
    >
      <div class="list">
        <div class="item" v-for="item in list" :key="item.id">
          <!-- 1. 时间 -->
          <div class="time">
            {{ item.create_date | date('YYYY-MM-DD HH:mm') }}
          </div>
          <!-- 2.1 父评论的内容 -->
          <div class="parent-comment" v-if="item.parent">
            <div class="parent-name">
              回复 : {{ item.parent.user.nickname }}
            </div>
            <div class="parent-content">
              {{ item.parent.content }}
            </div>
          </div>
          <!-- 2.2 我的内容 -->
          <div class="content">{{ item.content }}</div>

          <!-- 3. 原文 -->
          <div class="link">
            <div class="title">{{ item.post.title }}</div>
            <i class="iconfont iconjiantou1"></i>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      pageIndex: 1,
      loading: false,
      finished: false,
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      let res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: 4,
        },
      })
      this.list = [...this.list, ...res.data.data]
      this.loading = false
      if (res.data.data.length < 4) {
        this.finished = true
      }
    },
    onLoad() {
      setTimeout(() => {
        this.pageIndex++
        this.getCommentList()
      }, 2000)
    },
  },
}
</script>
<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .time {
    color: #999;
    height: 30px;
    line-height: 30px;
  }
  .parent-comment {
    padding: 10px;
    background: #eee;
    color: #666;
    line-height: 20px;

    .parent-name {
      height: 25px;
      line-height: 25px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
  }
  .link {
    color: #999;
    display: flex;
    margin-top: 10px;
    // justify-content: space-between;
    .title {
      flex: 1;
    }
    i {
      width: 50px;
      text-align: right;
    }
  }
}
</style>
