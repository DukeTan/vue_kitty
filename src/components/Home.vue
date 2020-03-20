<template>
    <el-container>
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

</style>