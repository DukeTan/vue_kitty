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
          <el-button type="primary" @click="showAddCateDialog">Add Category</el-button>
        </el-col>
      </el-row>
      <!-- table area -->
      <tree-table
        class="treeTable"
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
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- add Dialog -->
    <el-dialog
      title="Add Category"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- add form -->
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="100px"
      >
        <el-form-item label="CATEGORY NAME:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="PARENT CATEGORY:">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
            checkStrictly
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
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
      ],
      //initial add dialog
      addCateDialogVisible: false,
      //add cate form obj
      addCateForm: {
        //add cate name
        cat_name: "",
        //Parent classification ID (0->class 1)
        cat_id: 0,
        //default add cate level class 1
        cat_level: 0
      },
      //add cate form rules
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: "Please add Category name",
            trigger: "blur"
          }
        ]
      },
      //save parent category list
      parentCateList: [],
      //cascader config obj
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        lable: "cat_name",
        children: "children"
      },
      //selected parent category ID array
      selectedKeys: []
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
    },
    //listener for page size change
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //listener for page num change
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList;
    },
    //show add Dialog
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    //get Parent Category data list
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("get Parent Category list failed");
      }
      this.parentCateList = res.data;
    },
    //cascader selection changed
    parentCateChanged() {
      if (this.selectedKeys.length > 0) {
        //parent cate id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        //current cate level
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //parent cate id
        this.addCateForm.cat_pid = 0;
        //current cate level
        this.addCateForm.cat_level = 0;
      }
    },
    //add new cate to database
    addCate() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if(res.meta.status !== 201){
          return this.$message.error('add category failed')
        }
        this.$message.success('add category success')
        this.getCateList()
        this.addCateDialogVisible = false
      });
    },
    //listener for add dialog close event reset form data
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    }
  }
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>