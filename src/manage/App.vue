<template>
    <div class="app-main">
        <el-container class="container">
            <el-aside class="aside" style="width: 200px;">
                <div>
                    <div class="title"><span>会员管理系统</span></div>
                </div>
                <NavBar></NavBar>
            </el-aside>
            <el-main class="main">
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import NavBar from './components/NavBar'

export default {
    name: "app",
    components:{
        NavBar
    },
    data(){
        return {
            
        }
    }
}
</script>

<style>
    html,body {
        height: 100%;
        margin: 0px;
    }
</style>

<style scoped>
    .app-main {
        height: 100%;
    }
    .container{
        height: 100%;
    }

    .aside{
        background-color:#CDB38B;
        height: 100%;

    }

    .title{
        color: white;
        font-size: 18px;
        text-align: center;
        padding: 12px;
        margin: 0px;
        line-height: 40px;
        height: 40px;
        border-bottom: 1px solid white;
    }

   
    .main{
        /* background-color: blue; */
        padding: 15px;
    }
</style>
