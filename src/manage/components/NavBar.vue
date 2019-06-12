<template>
    <div>
        <el-menu
        default-active="1"
        class="el-menu-vertical"
        mode="verticle"
        text-color="#ffffff"
        @select="handleSelect">
            <el-menu-item index="1">
                <i class="el-icon-user-solid"></i>
                <span slot="title">会员管理</span>
            </el-menu-item>
            <el-menu-item index="2">
                <i class="el-icon-s-data"></i>
                <span slot="title">会员统计</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: "navbar",
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            if(key[0] == '1')
                this.$router.push('manage');
            else if(key[0] == '2')
                this.$router.push('userstatistic');
        }
    }

}
</script>

<style scoped>
    .el-menu-vertical{
        background-color: #CDB38B;
    }


</style>
