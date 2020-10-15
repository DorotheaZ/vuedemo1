<template>
  <div class="home">
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
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
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
