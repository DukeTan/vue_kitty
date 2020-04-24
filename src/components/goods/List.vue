<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
      <el-breadcrumb-item>Goods List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">ADD GOODS</el-button>
        </el-col>
      </el-row>

      <!-- goods List -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="GOODS NAME" prop="goods_name"></el-table-column>
        <el-table-column label="GOODS PRICE" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="GOODS WEIGHT" prop="goods_weight" width="95px"></el-table-column>
        <el-table-column label="CREATION TIME" prop="add_time" width="140px">
          <template v-slot:default="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="operation" width="130px">
          <template v-slot:default="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">EDIT</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            >DELETE</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination area -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagensize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //query info obj
      queryInfo: {
        query: "",
        pagenum: 0,
        pagesize: 10
      },
      //goods list
      goodslist: [],
      //total data
      total: 0
    };
  },

  created() {
    this.getGoodsList();
  },

  methods: {
    //According to pagesize get goods list
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("get goods list failed");
      }

      this.$message.success("get goods list success");
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    //delete by ID
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "This will permanently delete that goods, continue?",
        "Tips",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("Delete canceled");
      }

      const { data: res } = await this.$http.delete(`goods/${id}`);

      if (res.meta.status !== 200) {
        return this.$message.error("Delete goods failed");
      }

      this.$message.success("Delete goods success");
      this.getGoodsList();
    },
    //forward to add goods page
    goAddPage(){
        this.$router.push('/goods/add')
    }
  }
};
</script>

<style lang="less" scoped>
</style>