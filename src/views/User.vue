<template>
  <div class="user">
    <hm-header>个人中心</hm-header>
    <!-- 个人信息 -->
    <div class="info">
      <!-- 左 -->
      <div class="left">
        <img :src="$axios.defaults.baseURL + info.head_img" alt />
      </div>
      <!-- 中 -->
      <div class="center">
        <div class="name">
          <i v-if="info.gender === 1" class="iconfont iconxingbienan"></i>
          <i v-else class="iconfont iconxingbienv"></i>
          <span>{{ info.nickname }}</span>
        </div>
        <div class="time">{{ info.create_date | date }}</div>
      </div>
      <!-- 右 -->
      <div class="right">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </div>
    <van-cell-group>
      <van-cell
        title="我的关注"
        is-link
        value="关注的用户"
        @click="$router.push('my-follow')"
      />
      <van-cell
        title="我的跟帖"
        is-link
        value="跟帖/回复"
        @click="$router.push('my-comment')"
      />
      <van-cell title="我的收藏" is-link value="文档/视频" @click="$router.push('my-star')" />
      <van-cell title="设置" is-link @click="$router.push('/edit')" />
      <van-cell title="退出" is-link @click.native="logout" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
    }
  },
  async created() {
    let user_id = localStorage.getItem('user_id')
    let token = localStorage.getItem('token')
    let res = await this.$axios.get(`/user/${user_id}`)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.info = data
    }
  },
  methods: {
    async logout() {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您确定要退出本系统吗?',
        })

        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        this.$router.push('/login')
        this.$toast.success('退出成功')
      } catch (error) {
        this.$toast('已取消本次退出')
      }
    },
  },
}
</script>

<style lang="less">
.info {
  height: 100px;
  border-bottom: 2px solid #ccc;
  display: flex;
  align-items: center;
  .left {
    margin: 0 20px;
    img {
      width: 70px;
      height: 70px;
      display: block;
      border-radius: 50%;
      object-fit: contain;
    }
  }
  .center {
    flex: 1;
    line-height: 30px;
  }

  .right {
    width: 70px;
    text-align: center;
  }
}
</style>
