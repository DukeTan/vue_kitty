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
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">丨丨丨</div>
        <!--menu area-->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          default-active="this.$router.history.current.path"
        >
          <!--1st class menu-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!--1st class menu template-->
            <template slot="title">
              <!--icon-->
              <i :class="iconsObj[item.id]"></i>
              <!-- content -->
              <span>{{item.authName}}</span>
            </template>
            <!--2nd class menu-->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <!--2nd class menu template-->
              <template slot="title">
                <!--icon-->
                <i class="el-icon-menu"></i>
                <!-- content -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--right content-->
      <el-main>
        <!--route placeholder-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        "125": "el-icon-user-solid",
        "103": "el-icon-s-management",
        "101": "el-icon-s-goods",
        "102": "el-icon-s-order",
        "145": "el-icon-s-marketing"
      },
      //defaule menu not collapse
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //get all menu
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
    },
    //Click button to collapse menu
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
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
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.el-icon {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: antiquewhite;
  text-align: center;
  cursor: pointer;
}
</style>