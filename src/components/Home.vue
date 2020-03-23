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
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF">
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
            <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
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
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data(){
    return {
      menulist: [],
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-s-management',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-s-marketing'
      }
    }
  },
  created(){
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //get all menu
    async getMenuList(){
    const {data: res} = await this.$http.get('menus')
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.menulist = res.data
    console.log(res)
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
.el-icon {
  margin-right: 10px;
}
</style>