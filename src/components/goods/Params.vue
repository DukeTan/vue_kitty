<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Goods Management</el-breadcrumb-item>
      <el-breadcrumb-item>Param List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <el-alert
        title="Attention: Parameters are only allowed for Level 3 Classification"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>

      <!-- Select goods category area -->
      <el-row class="cat_opt">
        <el-col>
          <span>SELECT GOODS CATEGORY :</span>
          <!-- Cascader -->
          <el-cascader
            :options="cateList"
            :props="cascaderProps"
            v-model="selectedCateKeys"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tabs area -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- add Param -->
        <el-tab-pane label="DYNAMIC PARAM" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          ></el-button>
          <!-- DYNAMIC PARAM table area-->
          <el-table :data="manyTabData" border stripe>
            <!-- expand area -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- loop & render tag -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- input text -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- add button -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- index area -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="PARAMS NAME" prop="attr_name"></el-table-column>
            <el-table-column label="CORPORATION">
              <template v-slot:default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edi"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >EDIT</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >DELETE</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- add Attr -->
        <el-tab-pane label="STATIC ATTR" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          ></el-button>
          <!-- STATIC ATTR table area-->
          <el-table :data="onlyTabData" border stripe>
            <!-- expand area -->
            <el-table-column type="expand">
              <template v-slot:default="scope">
                <!-- loop & render tag -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- input text -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- add button -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- index area -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="ATTR NAME" prop="attr_name"></el-table-column>
            <el-table-column label="CORPORATION">
              <template v-slot:default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edi"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >EDIT</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >DELETE</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- add params dialog -->
    <el-dialog
      :title="'ADD'+titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- Edit params Dialog -->
    <el-dialog
      :title="'EDIT'+titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //goods list data
      cateList: [],
      //cascader config obj
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        lable: "cat_name",
        children: "children"
      },
      //selected parent category ID array
      selectedCateKeys: [],
      //actived tab name
      activeName: "many",
      //DYNAMIC PARAM data list
      manyTabData: [],
      //STATIC ATTR data list
      onlyTabData: [],
      //control dialog
      addDialogVisible: false,
      //add params form data obj
      addForm: {
        attr_name: ""
      },
      //add form rules valid obj
      addFormRules: {
        attr_name: [
          {
            required: true,
            message: "please enter params name",
            trigger: "blur"
          }
        ]
      },
      //control edit dialog
      editDialogVisible: false,
      //edit form data
      editForm: {},
      //edit form rules valid obj
      editFormRules: {
        attr_name: [
          {
            required: true,
            message: "please enter params name",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //get goods Cate list data
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("get goods category list failed");
      }
      console.log(res.data);
      this.cateList = res.data;
    },
    //habdle Cascader changed
    handleChange() {
      this.getParamsData();
    },

    //Tab click event function
    handleTabClick() {
      this.getParamsData();
    },

    //get Params data list
    async getParamsData() {
      //not select 3rd level cate
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTabData = [];
        this.onlyTabData = [];
        return;
      }

      //select 3rd level cate
      //According to selected cate ID & current tab to get param data
      const { data: res } = await this.$http.get(
        `categories:/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("get params data failed");
      }

      //before assign data to TabData use for each loop get attr_vals
      //(string to an array)
      res.data.array.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

        //add controler for text box visible
        item.inputVisible = false;
        //text box input value
        item.inputValue = "";
      });
      if (this.activeName === "many") {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    },
    //add Dialog closed
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //add params
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("add params failed");
        }
        this.$message.success("add params success");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    //Edit Dialog
    async showEditDialog(attr_id) {
      //enquiry current params
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("get params info failed");
      }

      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    //reset edit dialog
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //edit params
    editParams() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        const {
          res: data
        } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { attr_name: this.editForm.attr_name, attr_sel: this.activeName }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("edit params failed");
        }

        this.$message.success("edit params success");
        this.getParamsData();
        this.editDialogVisible = false;
      });
    },
    //delete corresponding params
    async removeParams(attr_id) {
      const confirmResult = await this.$confirm(
        "This will permanently delete Params data, continue?",
        "Tips",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      //canceled
      if (confirmResult !== "confirm") {
        return this.$message.info("delete canceled");
      }

      //delete
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("delete params failed");
      }

      this.$message.success("delete params success");
      this.getParamsData();
    },

    //text box blur or enter trigger
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      //process enter text
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;

      //request to save data to database
      this.saveAttrVals(row);
    },

    //click button show text box
    showInput(row) {
      row.inputVisible = true;
      //text box 自动获得焦点
      //input is DOM obj
      //$nextTick function 当页面上元素被重新render 才会执行call back中的code
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    //save attr_vals to database(delete)
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          //client保存array 拼接space to save as string
          attr_vals: row.attr_vals.join(" ")
        }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("edit params failed");
      }
      this.$message.success("edit params success!");
    },

    //delete params item
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  },

  computed: {
    //return a boolean value to control add button
    isBtnDisabled() {
      if (this.selectedCateKeys !== 3) {
        return true;
      }
      return false;
    },
    //selected current 3rd level cate ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    //used for dialog judgement
    titleText() {
      if (this.activeName === "many") {
        return "DYNAMIC PARAM";
      }
      return "STATIC ATTR";
    }
  }
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  width: 120px;
}
</style>