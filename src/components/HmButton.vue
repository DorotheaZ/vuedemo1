<template>
  <div class="hm-button">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.hm-button {
  height: 50px;
  margin: 20px;
  text-align: center;
  line-height: 50px;
  border-radius: 25px;
  background-color: red;
  color: #fff;
  font-size: 18px;
}
</style>