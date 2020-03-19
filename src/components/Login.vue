<template>
    <div>
        <div class="login_container">
            <div class="login_box">
              <!--avatar area--->
              <div class="avatar_box">
                <img src="../assets/catlogo.jpg" alt="">
              </div>
              <!--LoginForm area-->
              <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
                <!--User name-->
                <el-form-item prop="username">
                  <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" >

                  </el-input>
                </el-form-item>

                <!--Psw-->
                 <el-form-item prop="password">
                  <el-input prefix-icon="el-icon-s-goods" v-model="loginForm.password" type="password">

                  </el-input>
                </el-form-item>
                <!--Button Area-->
                <el-form-item class="btns">
                  <el-button type="primary" @click="login">Sign in</el-button>
                  <el-button type="info" @click="resetLoginForm">Reset</el-button>
                </el-form-item>
              </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      //Login Form data bind object
      loginForm: {
        username:'',
        password:''
      },
      //info validation
      loginFormRules: {
        username: [{required: true, message: 'please enter your username', trigger: 'blur'},
                   {min: 3, max: 10, message: '3-10 characters in length', trigger: 'blur'}],
        password: [{required: true, message: 'please enter your password', trigger: 'blur'},
                   {min: 6, max: 15, message: '6-15 characters in length', trigger: 'blur'}]
      }
    }
  },
  methods: {
    //Reset form info
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async (valid) =>{
        if (!valid) return;
        const {data : res} = await this.$http.post("login", this.loginForm);
        if(res.meta.status !== 200) return console.log("Login failed")
        console.log("Login completed")
      });
    }
  } 
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: snow;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box{
      height: 130px;
      width: 130px;
      border: 1px solid snow;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px slategray;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: snow;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: snow;
      }
    }
}

.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns{
  display: flex;
  justify-content: flex-end;
}
</style>
