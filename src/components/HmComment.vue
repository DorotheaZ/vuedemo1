<template>
  <div class="hm-comment">
    <!-- 头部信息 -->
    <div class="header">
      <div class="left">
        <img :src="$axios.defaults.baseURL + comment.user.head_img" alt />
      </div>
      <div class="center">
        <div class="name">{{ comment.user.nickname }}</div>
        <div class="date">{{ comment.create_date | date }}</div>
      </div>
      <div class="right" @click="reply">回复</div>
    </div>
    <!-- 楼层 -->
    <!-- 内容 -->
    <hm-floor
      :count="getCount(0, comment)"
      v-if="comment.parent"
      :parent="comment.parent"
    ></hm-floor>
    <div class="content">{{ comment.content }}</div>
  </div>
</template>

<script>
export default {
  props: ['comment'],
  methods: {
    getCount(num, parent) {
      if (parent.parent) {
        return this.getCount(num + 1, parent.parent)
      } else {
        return num
      }
    },
    reply() {
      console.log('评论里的回复')
      this.$bus.$emit('reply', this.comment.id, this.comment.user.nickname)
    },
  },
}
</script>

<style lang="less" scoped>
.hm-comment {
  border-bottom: 1px solid #ccc;
  padding: 20px;
  .header {
    display: flex;
    margin-bottom: 10px;
    // background: pink;
    .left {
      margin-right: 10px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: block;
      }
    }
    .center {
      flex: 1;
      // background: yellow;
      line-height: 25px;
      .date {
        color: #999;
      }
    }
    .right {
      width: 50px;
      line-height: 50px;
      text-align: center;
      color: #999;
    }
  }
  .content {
    color: #000;
    padding-top: 10px;
  }
}
</style>
