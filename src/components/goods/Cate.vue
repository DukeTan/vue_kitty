<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Category</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">Add Category</el-button>
        </el-col>
      </el-row>
      <!-- table area -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- isValid(2nd column) -->
        <template v-slot:isValid="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- sortLevel(3rd column) -->
        <template v-slot:sortLevel="scope">
          <el-tag size="small" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="small" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="small" type="warning" v-else>三级</el-tag>
        </template>
        <!-- opt -->
        <template v-slot:opt="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">Edit</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small">Delete</el-button>
        </template>
      </tree-table>
      <!-- Pagination -->
      <el-pagination></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //initial query condition for 1st time render catelist
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //goods list data
      cateList: [],
      //data total
      total: 0,
      //define columns in tree-table
      columns: [
        {
          label: "Catogory Name",
          prop: "cat_name"
        },
        {
          label: "Valid or Not",
          prop: "cat_deleted",
          type: "template",
          template: "isValid"
        },
        {
          label: "Category Level",
          type: "template",
          template: "sortLevel"
        },
        {
          label: "Operation",
          type: "template",
          template: "opt"
        }
      ]
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //get goods Cate list data
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("get goods category list failed");
      }
      console.log(res.data.result);
      this.cateList = res.data.result;
      //get all data count
      this.total = res.data.total;
    }
  }
};
</script>

<style lang="less" scoped>
</style>