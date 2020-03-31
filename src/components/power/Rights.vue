<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Authority Management</el-breadcrumb-item>
      <el-breadcrumb-item>Authority List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <el-table :data="rightsList" stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="AUTH NAME" prop="authName"></el-table-column>
          <el-table-column label="PATH" prop="path"></el-table-column>
          <el-table-column label="AUTH LEVEL" prop="level">
              <template v-slot:default="scope">
                  <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                  <el-tag type="success" v-if="scope.row.level === '1'">二级</el-tag>
                  <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
              </template>
          </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //rights list
      rightsList: []
    };
  },
  created() {
    //get all rights
    this.getRightsList();
  },
  methods: {
    //get all rights function
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.error("obtain authority list failed");
      }
      //success, mount data to rightList
      this.rightsList = res.data;
    }
  }
};
</script>

<style lang="less" scoped>
</style>