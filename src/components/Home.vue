<template>
    <el-container class="home-container">
        <!--Header-->
        <el-header>Header<el-button type="info" @click="logout">Exit</el-button>
        </el-header>
        <!--main area-->
        <el-container>
            <!--aside-->
            <el-aside width="200px">Aside</el-aside>
            <!--right content-->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    methods : {
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373D41;
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #EAEDF1;
}
</style>