<template>
  <div id="login-frame">
    <div id="login-content">
      <el-card>
        <div slot="header" class="loginheader">
          <span>登 录</span>
        </div>
        <div class="loginbody">
          <el-input class="logininput" v-model="username" placeholder="用户名"></el-input>
          <el-input class="logininput" placeholder="密码" v-model="password" show-password></el-input>
          <el-button type="primary" plain class="loginbutton" :loading="isLoging" @click="login">登 录</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { setTimeout } from 'timers';

export default {
  name: 'App',
  data(){
    return {
      username: '',
      password: '',
      isLoging: false
    }
  },
  methods: {
    login(){
      if(this.username == '' || this.password == ''){
          this.openMessage("warning","用户名和密码不能为空");
      } else {
          // 需要向后端发送的登录参数
          let loginParam = {
              username: this.username,
              password: this.password
          }

          // 设置在登录状态，延迟返回数据显示动态组件
          this.isLoging = true;
          let loginResult = false;
          
          axios.post("/api/login", loginParam)
          .then(response => 
              new Promise(resolve => setTimeout(() => {
                  this.isLoging = false
                  resolve(response.data)
              }, 500)))
          .then(result => {
              if(result.status == 1){
                  this.openMessage("success", result.message);
                  return new Promise(resolve => setTimeout(() => { 
                      loginResult = true;
                      resolve(); 
                  }, 500))
              }else {
                  this.openMessage("error", result.message);
              }
          })
          .catch(error => {
              this.isLoging = false
              this.openMessage("error", "登录出现问题，请检查程序")
          })
          .finally(() => {
              if(loginResult){
                  window.location.href = "/manage.html"
              } 
          });
      }
    },
      //   展示消息框
    openMessage(typ,msg){
        this.$message({
        showClose: true,
        message: msg,
        center: true,
        type: typ
        });
    }
  }
}
</script>

<style>
  html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
  }

  #login-frame{
    position: relative;
    width: 100%;
    height: 100%; 
    /* border:1px solid #000 */
  } 

  #login-content{
    position: absolute;
    width: 400px;
    height: auto;
    left: 50%;    
    top: 50%;
    /* 使用transform使元素居中放置 */
    transform: translate(-50%, -50%); 
    /* background:#000 */
  }

  .loginheader{
    font-size: 32px;
    font-weight: bold;
    text-align: center;
    color: cornflowerblue;
    padding: 12px;
    margin: 8px;
  }

  .loginbody{
    padding: 12px;
    margin: 6px;
  }

  .logininput{
    margin-bottom: 14px;
  }

  .loginbutton{
    width: 100%;
  }
</style>
