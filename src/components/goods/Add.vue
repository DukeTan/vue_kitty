<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
      <el-breadcrumb-item>Add Goods</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <el-alert title="ADD GOODS INFORMATION" type="info" show-icon :closable="false"></el-alert>
      <!-- Steps area -->
      <el-steps :space="400" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="BASIC INFO"></el-step>
        <el-step title="GOODS PARAMS"></el-step>
        <el-step title="GOODS ATTR"></el-step>
        <el-step title="GOODS PIC"></el-step>
        <el-step title="GOODS CONTENT"></el-step>
        <el-step title="COMPLETE"></el-step>
      </el-steps>

      <!-- Tabs area -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane label="BASIC INFO" name="0">
            <el-form-item label="GOODS NAME" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="GOODS PRICE" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="GOODS WEIGHT" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="GOODS NUMBER" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="GOODS CATEGORY" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="GOODS PARAMS" name="1">GOODS PARAMS</el-tab-pane>
          <el-tab-pane label="GOODS ATTR" name="2">GOODS ATTR</el-tab-pane>
          <el-tab-pane label="GOODS PIC" name="3">GOODS PIC</el-tab-pane>
          <el-tab-pane label="GOODS CONTENT" name="4">GOODS CONTENT</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      //add goods form data obj
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: []
      },
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: "Please enter goods name",
            trigger: "blur"
          }
        ],
        goods_price: [
          {
            required: true,
            message: "Please enter goods price",
            trigger: "blur"
          }
        ],
        goods_weight: [
          {
            required: true,
            message: "Please enter goods weight",
            trigger: "blur"
          }
        ],
        goods_number: [
          {
            required: true,
            message: "Please enter goods number",
            trigger: "blur"
          }
        ],
        goods_cat: [
          {
            required: true,
            message: "Please select goods cate",
            trigger: "blur"
          }
        ]
      },
      //categories list
      catelist: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        lable: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("get goods categories data failed");
      }

      this.catelist = res.data;
    },
    //cascader changed
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>