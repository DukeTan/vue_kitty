<template>
  <el-container class="home-container">
    <!--Header-->
    <el-header>
      <div>
        <img src="../assets/main_logo.jpg" alt />
        <span>Kitty E-commerce Management System</span>
      </div>
      <el-button type="info" @click="logout">Exit</el-button>
    </el-header>
    <!--main area-->
    <el-container>
      <!--aside-->
      <el-aside width="200px">
        <!--menu area-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <!--1st class menu-->
          <el-submenu index="1">
            <!--1st class menu template-->
            <template slot="title">
              <!--icon-->
              <i class="el-icon-location"></i>
              <!-- content -->
              <span>Navigator1</span>
            </template>
            <!--2nd class menu-->
            <el-menu-item index="1-4-1">
              <!--2nd class menu template-->
              <template slot="title">
                <!--icon-->
                <i class="el-icon-location"></i>
                <!-- content -->
                <span>content1</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--right content-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  padding-right: 0;
  color: antiquewhite;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
</style>