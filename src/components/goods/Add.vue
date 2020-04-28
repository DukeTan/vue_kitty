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
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
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
          <el-tab-pane label="GOODS PARAMS" name="1">
            <!-- render form item -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- check box group -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="GOODS ATTR" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="GOODS PIC" name="3">
            <el-upload
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="GOODS CONTENT" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="btnAdd" @click="add">ADD GOODS</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- pic preview dialog -->
    <el-dialog title="PIC PREVIEW" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" class="previewImg" />
    </el-dialog>
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
        goods_cat: [],
        pics: [],
        goods_introduce: ''
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
      },
      //dynamic data list
      manyTableData: [],
      //static data list
      onlyTableData: [],
      //pic upload component header obj
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      previewVisible: false
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
    },
    //Tabs before leave
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("pls select goods cate first");
        return false;
      }
    },
    //click to select diff info
    async tabClicked() {
      //visit dynamic param tab
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("get dynamic params list failed");
        }
        res.data.array.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("get static attr data failed");
        }
        this.onlyTableData = res.data;
      }
    },
    //process pic preview
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
    },
    //process pic remove
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex(x => (x.pic = filePath));
      this.addForm.pics.splice(i, 1);
    },
    //save server response pic path
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    //addgoods
    add(){
      
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
};
</script>

<style lang="less" scoped>
.el-checkbox {
  //top right bottom left
  margin: 0 10px 0 0 !important;
}

.previewImg {
  width: 100%;
}

.btnAdd{
  margin-top: 15px;
}
</style>