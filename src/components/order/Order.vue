<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Order Management</el-breadcrumb-item>
      <el-breadcrumb-item>Order List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- order list table -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="ORDER No." prop="order_number"></el-table-column>
        <el-table-column label="ORDER PRICE" prop="order_price"></el-table-column>
        <el-table-column label="PAY/NOT" prop="pay_status">
          <template v-slot:default="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">Paied</el-tag>
            <el-tag type="danger" v-else>Not Paied</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="SEND/NOT" prop="is_send"></el-table-column>
        <el-table-column label="ORDER TIME" prop="create_time">
          <template v-slot:default="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="OPERATION">
          <template v-slot:default="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- pagination -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- edit address dialog -->
    <el-dialog title="EDIT ADDRESS" :visible.sync="addressVisible" width="50%">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="180px"
      >
        <el-form-item label="PROVINCE/DISTRICT" prop="address1">
          <el-input v-model="addressForm.address1"></el-input>
        </el-form-item>
        <el-form-item label="DETAIL ADDRESS" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- express progress dialog -->
    <el-dialog title="EXPRESS PROGRESS" :visible.sync="expressVisible" width="50%">
      <!-- timeline -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in expressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "Please select PROVINCE/DISTRICT",
            trigger: "blur"
          }
        ],
        address2: [
          {
            required: true,
            message: "Please enter detail address",
            trigger: "blur"
          }
        ]
      },
      expressVisible: false,
      expressInfo: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //get order list
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("get order list failed");
      }
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    //pagination handle page size
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderList();
    },
    //show edit address dialog
    showBox() {
      this.addressVisible = true;
    },
    //show express progress dialog
    async showProgressBox() {
      const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      if (res.meta.status !== 200) {
        return this.$message.error("get express data failed");
      }
      this.expressInfo = res.data;
      this.expressVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
</style>