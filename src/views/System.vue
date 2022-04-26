<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 项目发布
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form :model="form" label-width="200px">
                      <el-form-item label="公司名" prop="company">
                        <el-input v-model="form.company" ></el-input>
                      </el-form-item>
                      <el-form-item label="环境配置" prop="env" @change="changeEnv">
                        <el-radio v-model="form.env" label="test">测试环境</el-radio>
                        <el-radio v-model="form.env" label="pre">预发环境</el-radio>
                        <el-radio v-model="form.env" label="release">正式服环境</el-radio>
                      </el-form-item>
                      <el-form-item label="通知邮箱" prop="noticeEmail">
                        <el-input v-model="form.noticeEmail" ></el-input>
                      </el-form-item>
                      <el-form-item label="企业微信通知地址" prop="wechatWebHook">
                        <el-input v-model="form.wechatWebHook"></el-input>
                      </el-form-item>
                      <el-form-item label="是否发送邮箱通知" prop="emailSwitch">
                        <el-switch
                            v-model="form.emailSwitch"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                      </el-form-item>
                      <el-form-item label="是否发送企业微信通知" prop="wechatSwitch">
                        <el-switch
                            v-model="form.wechatSwitch"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" v-show="isAdmin || buttonVisibility.update" @click="updateSystemConfig" >修改</el-button>
                      </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {getSystemConfig, getLoginInfo, updateConfig} from "../api/index";
import {getButtonList} from "../utils/tools";

export default {
    name: "publisher",
    setup() {
      let isAdmin = ref(0);
      let envConfig = {};
      const buttonVisibility = ref({
        update: false
      });
      getButtonList("/system").then(res =>{
        Object.values(res).forEach(item => {
          buttonVisibility.value[item.buttonType] = true;
        });
      });
      const checkAdmin = () => {
          getLoginInfo().then((res) => {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage);
              return false;
            }
            if(res.data.isAdmin === 1) {
              isAdmin.value = 1
            }
          })
        }

        const form = reactive({
          company: "",
          noticeEmail: "",
          wechatWebHook: "",
          emailSwitch: "",
          wechatSwitch: "",
          env: ""
        });

        const getData = () => {
          getSystemConfig().then((res) => {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            envConfig = res.data.env
            form.env = "test"
            if(envConfig[form.env]) {
              form.noticeEmail = envConfig[form.env].noticeEmail;
              form.wechatWebHook = envConfig[form.env].wechatWebHook;
              form.emailSwitch = !!parseInt(envConfig[form.env].emailSwitch);
              form.wechatSwitch = !!parseInt(envConfig[form.env].wechatSwitch);
            }
            form.company = res.data.sys.company
          })
        }

        checkAdmin()
        getData()
        const updateSystemConfig = () => {
          form.emailSwitch = form.emailSwitch === true ? 1 : 0;
          form.wechatSwitch = form.wechatSwitch === true ? 1 : 0;
          updateConfig({
            "sys": {
              "company": form.company
            },
            "env": {
              "noticeEmail": form.noticeEmail,
              "wechatWebHook": form.wechatWebHook,
              "emailSwitch": form.emailSwitch,
              "wechatSwitch": form.wechatSwitch,
            },
            "chooseEnv": form.env
          }).then((res) => {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            ElMessage.success("修改成功");
            getData();
          })
        }

        const changeEnv = () =>{
          if(envConfig[form.env]) {
            form.noticeEmail = envConfig[form.env].noticeEmail;
            form.wechatWebHook = envConfig[form.env].wechatWebHook;
            form.emailSwitch = !!parseInt(envConfig[form.env].emailSwitch);
            form.wechatSwitch = !!parseInt(envConfig[form.env].wechatSwitch);
          }
        }

        return {
          isAdmin,
          form,
          buttonVisibility,
          updateSystemConfig,
          changeEnv
        };
    },
};
</script>
