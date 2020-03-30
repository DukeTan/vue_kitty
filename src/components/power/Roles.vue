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
                <el-button type="primary">Add Roles</el-button>
            </el-col>
        </el-row>
        <!-- roles list -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="roleName" prop="roleName"></el-table-column>
        <el-table-column label="roleDesc" prop="roleDesc"></el-table-column>
        <el-table-column label="operation">
          <template v-slot:default="scope">
            <el-button type="primary"
              icon="el-icon-search"
              size="small">Edit</el-button>
                <el-button type="danger"
              icon="el-icon-edit"
              size="small">Delete</el-button>
                    <el-button type="warning"
              icon="el-icon-edit"
              size="small">Arrange Authorization</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //role list
            roleList: []
        }
    },
    created(){
        this.getRoleslist()
    },
    methods: {
        //get all roles 
        async getRoleslist(){
            const {data:res} = await this.$http.get('roles')
            
            if(res.meta.status !== 200){
                return this.$message.error('get Role list failed')
            }
            this.roleList = res.data
            console.log(this.roleList)
        }
    }
};
</script>

<style lang="less" scoped>
</style>