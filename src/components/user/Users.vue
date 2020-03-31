<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>User Management</el-breadcrumb-item>
      <el-breadcrumb-item>User List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <!-- search & add area -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">Add User</el-button>
        </el-col>
      </el-row>
      <!-- user list area -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="NAME" prop="username"></el-table-column>
        <el-table-column label="EMAIL" prop="email"></el-table-column>
        <el-table-column label="MOBILE" prop="mobile"></el-table-column>
        <el-table-column label="ROLE" prop="role_name"></el-table-column>
        <el-table-column label="STATUS">
          <template v-slot:default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="OPERATION" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeUserbyId(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="Setting" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination area -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryInfo.total"
      ></el-pagination>
    </el-card>

    <!-- add user dialog -->
    <el-dialog
      title="Add User"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- content -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="110px">
        <el-form-item label="USER NAME" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="PASS WORD" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="EMAIL" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="MOBILE" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- foot button -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- modify user dialog -->
    <el-dialog
      title="Modify User"
      :visible.sync="modifyDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- modify content -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="ModifyFormRef" label-width="100px">
        <el-form-item label="USER NAME">
          <el-input v-model="modifyForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="EMAIL" prop="email">
          <el-input v-model="modifyForm.email"></el-input>
        </el-form-item>
        <el-form-item label="MOBILE" prop="email">
          <el-input v-model="modifyForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- delete user messageBox -->
    <el-button type="text" @click="open">点击打开 Message Box</el-button>
  </div>
</template>

<script>
export default {
  data() {
    //validate email rules
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        //value is ture
        return cb();
      }
      cb(new Error("please enter the legal email address"));
    };
    //validate mobile rules
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        //value is true
        return cb();
      }
      cb(new Error("please enter the legal mobile No"));
    };
    return {
      //get user list param obj
      queryInfo: {
        query: "",
        //current page
        pagenum: 1,
        //current page contain data
        pagesize: 5
      },
      userlist: [],
      total: 0,
      //default hide add dialog
      addDialogVisible: false,
      //add user form data
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //add user form rules
      addFormRules: {
        username: [
          {
            required: true,
            message: "Please enter user name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "3-10 characters in length",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "please enter your password",
            trigger: "blur"
          },
          {
            min: 6,
            max: 15,
            message: "6-15 characters in length",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "please enter your email",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "please enter your mobile No",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      },
      //default hide modify dialog
      modifyDialogVisible: false,
      //enquiry user info pbj
      modifyForm: {},
      //modify user form rules
      modifyFormRules: {
        email: [
          {
            required: true,
            message: "please enter your email",
            trigger: "blur"
          },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "please enter your mobile No",
            trigger: "blur"
          },
          {
            validator: checkMobile,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("failed to get user list");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
    },
    //lisitner for page size change
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //listener for page no change
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //listener for switch status change
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `/users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return (this.$message.error = "update user state failed");
      }
      this.$message.success("update user state success");
    },
    //listener for Dialog closed
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //pre-validate form
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //true => passed to start connect with database
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("add User failed");
        }
        this.$message.success("add User success");
        //add success hide Dialog
        this.addDialogVisible = false;
      });
    },
    //show modify user dialog
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("enquiry user info failed");
      }
      this.modifyForm = res.data;
      this.modifyDialogVisible = true;
    },
    //listener for dialog closed
    editDialogClosed() {
      this.$refs.ModifyFormRef.resetFields();
    },
    //get modified data pre-validate
    modifyUserInfo() {
      this.$refs.ModifyFormRef.validate(async valid => {
        if (!valid) return;
        //true => passed to start connect with database
        const { data: res } = await this.$http.put(
          "users/" + this.modifyForm.id,
          { email: this.modifyForm.email, mobile: this.modifyForm.mobile }
        );
        if (res.meta.status !== 200) {
          this.$message.error("modify user failed");
        }
        //close dialog
        this.modifyDialogVisible = false;
        //refresh data list
        this.getUserList();
        //prompt modify success
        this.$message.success("modify user success");
      });
    },
    //prompt ask for delete
    async removeUserbyId(id) {
      //this function return a promise obj
      const confirmResult = await this.$confirm(
        "This will permanently delete user data, continue?",
        "Tips",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => {
        return err;
      });
      //(err => err)
      //if user confirm will return a string confirm
      //if user cancel will return a string cancel
      //console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("delete canceled");
      }
      //proceed to delete 
      const {data : res} = await this.$http.delete('users/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('delete user failed')
      }
      this.$message.success('delete user success')
      //refresh user list
      this.getUserList
    }
  }
};
</script>

<style lang="less" scoped>
</style>