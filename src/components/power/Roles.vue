<template>
  <div>
    <!-- bread crumb Nav area -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">Home</el-breadcrumb-item>
      <el-breadcrumb-item>Authority Management</el-breadcrumb-item>
      <el-breadcrumb-item>Role List</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Card view area -->
    <el-card>
      <!-- add roles button -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">Add Roles</el-button>
        </el-col>
      </el-row>
      <!-- roles list -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand"></el-table-column>
        <!-- index -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="roleName" prop="roleName"></el-table-column>
        <el-table-column label="roleDesc" prop="roleDesc"></el-table-column>
        <el-table-column label="operation">
          <template v-slot:default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(scope.row.id)"
            >Edit</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="removeRolebyId(scope.row.id)"
            >Delete</el-button>
            <el-button type="warning" icon="el-icon-edit" size="small">Arrange Authorization</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- add user dialog -->
    <el-dialog
      title="Add Roles"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!-- content -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="110px">
        <el-form-item label="ROLE NAME" prop="rolename">
          <el-input v-model="addForm.rolename"></el-input>
        </el-form-item>
        <el-form-item label="ROLE DESC" prop="roledesc">
          <el-input v-model="addForm.roledesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- foot button -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- modify content -->
    <el-dialog
      title="Modify User"
      :visible.sync="modifyDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- modify content -->
      <el-form :model="modifyForm" :rules="modifyFormRules" ref="ModifyFormRef" label-width="110px">
        <el-form-item label="ROLE NAME" prop="rolename">
          <el-input v-model="modifyForm.rolename"></el-input>
        </el-form-item>
        <el-form-item label="ROLE DESC" prop="roledesc">
          <el-input v-model="modifyForm.roledesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //role list
      roleList: [],
      //default hide add dialog
      addDialogVisible: false,
      //add role form data
      addForm: {
        rolename: "",
        roledesc: ""
      },
      //add role form rules
      addFormRules: {
        rolename: [
          {
            required: true,
            message: "Please enter role name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "3-10 characters in length",
            trigger: "blur"
          }
        ]
      },
      //default hide modify dialog
      modifyDialogVisible: false,
      //enquiry Role info pbj
      modifyForm: {},
      //modify Role form rules
      modifyFormRules: {
        rolename: [
          {
            required: true,
            message: "Please enter role name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 10,
            message: "3-10 characters in length",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getRoleslist();
  },
  methods: {
    //get all roles
    async getRoleslist() {
      const { data: res } = await this.$http.get("roles");

      if (res.meta.status !== 200) {
        return this.$message.error("get Role list failed");
      }
      this.roleList = res.data;
    },
    //listener for dialog closed
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    //pre-validate add form
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        //true => passed to start connect with database
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) {
          this.$message.error("add Role failed");
        }
        this.$message.success("add Role success");
        //add success hide Dialog
        this.addDialogVisible = false;
      });
    },
    //show modify user dialog
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("enquiry Role info failed");
      }
      this.modifyForm = res.data;
      this.modifyDialogVisible = true;
    },
    //listener for dialog closed
    editDialogClosed() {
      this.$refs.ModifyFormRef.resetFields();
    },
    //get modified data pre-validate
    modifyRoleInfo() {
      this.$refs.ModifyFormRef.validate(async valid => {
        if (!valid) return;
        //true => passed to start connect with database
        const { data: res } = await this.$http.put(
          "roles/" + this.modifyForm.id,
          {
            roleName: this.modifyForm.rolename,
            roleDesc: this.modifyForm.roledesc
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("modify roles failed");
        }
        //close dialog
        this.modifyDialogVisible = false;
        //refresh data list
        this.getRolesList();
        //prompt modify success
        this.$message.success("modify roles success");
      });
    },
    //prompt ask for delete
    async removeRolebyId(id) {
      //this function return a promise obj
      const confirmResult = await this.$confirm(
        "This will permanently delete Role data, continue?",
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
      const {data : res} = await this.$http.delete('roles/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('delete Role failed')
      }
      this.$message.success('delete Role success')
      //refresh user list
      this.getRoleslist
    }
  }
};
</script>

<style lang="less" scoped>
</style>