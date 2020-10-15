<template>
  <div>
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>
    <van-field
      v-model="username"
      label="用户名"
      placeholder="请输入用户名"
      clearable
      @input="checkPhone1"
      @clear="clearPhone1"
      :error-message="usernameErrMsg"
    />
    <van-field
      v-model="nickname"
      label="昵称"
      placeholder="请输入昵称"
      clearable
      @input="checkPhone2"
      @clear="clearPhone2"
      :error-message="nicknameErrMsg"
    />
    <van-field
      v-model="password"
      label="密码"
      placeholder="请输入密码"
      clearable
      @input="checkPhone3"
      @clear="clearPhone3"
      :error-message="passwordErrMsg"
    />
    <hm-button @click.native="startRegister">注册</hm-button>
  </div>
</template>

<script>
// 正则
const REG_USERNAME = /^1\d{3,5}$/
const REG_NICKNAME = /^[\u4e00-\u9fa5]{3,7}$/
const REG_PASSWORD = /^\d{3,12}$/
export default {
  data() {
    return {
      username: '',
      nickname: '',
      password: '',
      usernameErrMsg: '',
      passwordErrMsg: '',
      nicknameErrMsg: '',
    }
  },
  methods: {
    checkPhone1() {
      if (REG_USERNAME.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式不正确'
      }
    },
    clearPhone1() {
      this.usernameErrMsg = ''
    },
    clearPhone2() {
      this.nicknameErrMsg = ''
    },
    clearPhone3() {
      this.passwordErrMsg = ''
    },
    checkPhone2() {
      if (REG_NICKNAME.test(this.nickname)) {
        this.nicknameErrMsg = ''
      } else {
        this.nicknameErrMsg = '昵称格式不正确'
      }
    },
    checkPhone3() {
      if (REG_PASSWORD.test(this.password)) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式不正确'
      }
    },
    async startRegister() {
      if (
        this.username !== '' &&
        this.nickname !== '' &&
        this.password !== '' &&
        this.usernameErrMsg === '' &&
        this.nicknameErrMsg === '' &&
        this.passwordErrMsg === ''
      ) {
        this.$toast.success('校验成功')

        let res = await this.$axios.post('/register', {
          username: this.username,
          password: this.password,
          nickname: this.nickname,
        })
        console.log(res)
        if (res.data.statusCode === 200) {
          this.$toast.success('注册成功')
          this.$router.push({
            name: 'login',
            params: {
              username: this.username,
              password: this.password,
            },
          })
        } else {
          this.$toast.fail('注册失败')
        }
      } else {
        this.$toast.fail('校验失败')
      }
    },
  },
}
</script>

<style></style>
