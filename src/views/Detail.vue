<template>
  <div class="detail">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div
          v-if="detail.has_follow"
          class="followed"
          @click="unfollow(detail.user.id)"
        >
          已关注
        </div>
        <div v-else class="followed" @click="follow(detail.user.id)">
          关注
        </div>
      </div>
    </div>

    <!-- 内容 -->
    <div class="detail-content">
      <!-- 标题 -->
      <div class="title">{{ detail.title }}</div>
      <!-- 新闻作者和时间 -->
      <div class="user">
        <div>{{ detail.user.nickname }}</div>
        <div>{{ detail.create_date | date }}</div>
      </div>
      <!-- 内容 -->
      <div
        v-if="detail.type == 1"
        class="content"
        v-html="detail.content"
      ></div>
      <video v-else :src="detail.content" controls></video>
      <!-- 点击 -->
      <div class="btns">
        <div
          class="like"
          :class="{ active: detail.has_like }"
          @click="like(detail.id)"
        >
          <i class="iconfont icondianzan"></i>
          <span>{{ detail.like_length }}</span>
        </div>
      </div>
    </div>
    <div ref="box"></div>
    <!-- 评论 -->
    <hm-comment
      v-for="comment in commentList"
      :key="comment.id"
      :comment="comment"
    ></hm-comment>

    <!-- 底部 -->
    <div class="footer">
      <!-- input -->
      <div class="input" v-if="!isShow">
        <div class="left">
          <input
            ref="input"
            @focus="handleFocus"
            type="text"
            placeholder="写跟帖"
          />
        </div>
        <div class="center">
          <van-icon name="chat-o" :badge="detail.comment_length" />
        </div>
        <div class="right" @click="star">
          <van-icon name="star-o" :class="{ active: detail.has_star }" />
        </div>
      </div>
      <!-- textarea -->
      <div class="textarea" v-else>
        <div class="left">
          <textarea
            v-model="content"
            ref="textarea"
            @blur="handleBlur"
            :placeholder="replyName ? '回复 : ' + replyName : '请输入内容'"
          ></textarea>
        </div>
        <div class="right">
          <div class="send" @touchstart="send">发送</div>
          <!-- <div class="send" @mousedown="send">发送</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: '',
      },
      commentList: [],
      isShow: false,
      replyId: '',
      replyName: '',
      content: '',
    }
  },
  created() {
    this.getDetailList()
    this.getCommentList()
    this.$bus.$on('reply', async (replyId, replyName) => {
      console.log('detail --- 走了')
      this.replyId = replyId
      this.replyName = replyName
      this.isShow = true
      await this.$nextTick()
      this.$refs.textarea.focus()
    })
  },
  methods: {
    async getCommentList() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
      }
    },
    async getDetailList() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.detail = data
      }
    },
    async unfollow(id) {
      let res = await this.$axios.get(`/user_unfollow/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetailList()
      }
    },
    async follow(id) {
      let token = localStorage.getItem('token')
      if (!token) {
        try {
          await this.$dialog.confirm({
            title: '温馨提示',
            message: '该操作需要登录喔亲~',
          })
          this.$router.push({
            name: 'login',
            params: {
              back: 1,
            },
          })
        } catch (error) {}
        return
      }
      let res = await this.$axios.get(`/user_follows/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetailList()
      }
    },
    async like(id) {
      let token = localStorage.getItem('token')
      if (!token) {
        try {
          await this.$dialog.confirm({
            title: '温馨提示',
            message: '该操作需要登录喔亲~',
          })
          this.$router.push({
            name: 'login',
            params: {
              back: 1,
            },
          })
        } catch (error) {}
        return
      }
      let res = await this.$axios.get(`/post_like/${id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetailList()
      }
    },
    async handleFocus() {
      this.isShow = true
      await this.$nextTick()
      this.$refs.textarea && this.$refs.textarea.focus()
    },
    handleBlur() {
      this.isShow = false
      if (!this.content) {
        this.replyId = ''
        this.replyName = ''
      }
    },
    async star() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetailList()
      }
    },
    async send() {
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId,
        }
      )
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getCommentList()
        this.content = ''
        this.isShow = false
        this.replyId = ''
        this.replyName = ''
        this.$refs.box.scrollIntoView()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.active {
  color: #f00;
}
.header {
  height: 40px;
  line-height: 40px;
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 0 20px;
  align-items: center;
  .left {
    width: 20px;
    // background: red;
  }
  .center {
    flex: 1;
    // background: pink;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 50px;
    }
  }
  .right {
    width: 60px;
    // padding: 0 10px;
    height: 20px;
    border: 1px solid #999;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.detail-content {
  padding: 0 20px;

  .user {
    color: #999;
    height: 40px;
    line-height: 40px;
    display: flex;
    div {
      margin-right: 10px;
    }
  }

  /deep/ img {
    width: 100%;
    margin-top: 10px;
  }
  video {
    width: 100%;
  }
  .title {
    font-weight: 700;
    font-size: 14px;
    padding: 20px 0;
  }

  .btns {
    // height: 80px;
    // background: pink;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    .like {
      width: 80px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #000;
      padding: 0 15px;
      border-radius: 15px;
      text-align: center;
      span {
        margin-left: 10px;
      }
      &.active {
        color: red;
        border: 1px solid red;
      }
    }
  }
}

// 底部
.footer {
  background: #fff;
  border-top: 1px solid #ccc;
  position: fixed;
  bottom: 0;
  width: 100%;
  .input {
    height: 40px;
    display: flex;
    .left {
      flex: 1;
      // background: red;
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        height: 30px;
        width: 80%;
        border: none;
        border-radius: 15px;
        background: #ddd;
        text-indent: 1em;
      }
    }
    .center,
    .right {
      width: 60px;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .active {
      color: #f00;
    }
  }
  .textarea {
    height: 70px;
    display: flex;
    .left {
      flex: 1;
      // background: pink;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        border: none;
        width: 90%;
        height: 75%;
        border-radius: 8px;
        resize: none;
        background: #ddd;
        text-indent: 1em;
        padding-top: 5px;
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      .send {
        background: #f00;
        color: #fff;
        width: 40px;
        height: 30px;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>
