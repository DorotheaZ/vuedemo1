<template>
  <div class="my-follow">
    <hm-header>我的关注</hm-header>
    <!-- 列表 -->
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt />
        </div>
        <div class="center">
          <div class="name">{{ item.nickname }}</div>
          <div class="date">
            {{ item.create_date | date('YYYY-MM-DD HH:mm') }}
          </div>
        </div>
        <div class="right" @click="unfollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    }
  },
  created() {
    this.getFollowList()
  },
  methods: {
    async getFollowList() {
      let res = await this.$axios.get('/user_follows')
      if (res.data.statusCode === 200) {
        this.list = res.data.data
      }
    },
    async unfollow(id) {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您确定要取关该用户吗?',
        })
        let res = await this.$axios.get(`/user_unfollow/${id}`)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          this.getFollowList()
        }
      } catch (error) {}
    },
  },
}
</script>

<style lang="less" scoped>
.item {
  height: 80px;
  border-bottom: 1px solid #ccc;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .left {
    img {
      width: 40px;
      height: 40px;
      display: block;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    .name {
      font-size: 14px;
    }
    .date {
      color: #999;
      font-size: 12px;
    }
  }

  .right {
    height: 30px;
    line-height: 30px;
    background: #ddd;
    border-radius: 15px;
    padding: 0 15px;
    color: #000;
  }
}
</style>
