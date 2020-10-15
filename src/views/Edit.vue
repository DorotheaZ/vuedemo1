<template>
  <div>
    <hm-header>编辑用户信息</hm-header>
    <!-- 头部 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <van-uploader class="uploader" :after-read="afterRead" />
    </div>
    <van-cell-group>
      <van-cell
        title="昵称"
        :value="info.nickname"
        is-link
        @click="ShowNickname"
      />
      <van-cell title="密码" :value="info.password" is-link />
      <van-cell
        title="性别"
        @click="showGender"
        :value="info.gender === 1 ? '男' : '女'"
        is-link
      />
    </van-cell-group>
    <!-- 修改昵称弹框 -->
    <van-dialog
      @confirm="confirmNickname"
      v-model="isShowNickname"
      title="修改昵称"
      show-cancel-button
    >
      <van-field v-model="nickname" placeholder="请输入新昵称" />
    </van-dialog>
    <!-- 修改性别的弹框 -->
    <van-dialog
      @confirm="confirmGender"
      v-model="isShowGender"
      title="修改性别"
      show-cancel-button
    >
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      isShowNickname: false,
      nickname: '',
      isShowGender: false,
      gender: 0,
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const token = localStorage.getItem('token')
      const user_id = localStorage.getItem('user_id')
      let res = await this.$axios.get(`/user/${user_id}`)
      if (res.data.statusCode === 200) {
        this.info = res.data.data
      }
    },
    ShowNickname() {
      this.isShowNickname = true
      this.nickname = this.info.nickname
    },
    confirmNickname() {
      if (this.nickname === this.info.nickname) {
        this.$toast('新旧昵称不能一样')
        return
      }
      this.editUser({ nickname: this.nickname })
    },
    showGender() {
      this.isShowGender = true
      this.gender = this.info.gender
    },
    confirmGender() {
      if (this.gender === this.info.gender) {
        this.$toast('并没有做修改喔~')
        return
      }
      this.editUser({ gender: this.gender })
    },
    async editUser(data) {
      let user_id = localStorage.getItem('user_id')
      let res = await this.$axios.post(`/user_update/${user_id}`, data)
      this.getInfo()
      this.$toast.success(res.data.message)
    },
    async afterRead(data) {
      let token = localStorage.getItem('token')
      // 拼接 FormData
      let formData = new FormData()
      formData.append('file', data.file)
      let res = await this.$axios.post('/upload', formData)
      console.log(res.data.data.url)
      this.editUser({
        head_img: res.data.data.url,
      })
    },
  },
}
</script>

<style lang="less" scoped>
.avatar {
  text-align: center;
  margin: 20px 0;
  position: relative;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: contain;
  }

  .uploader {
    width: 70px;
    height: 70px;
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    opacity: 0;
  }
}
</style>
