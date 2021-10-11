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
                          <el-button type="primary" v-show="isAdmin" @click="updateSystemConfig">修改</el-button>
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

export default {
    name: "publisher",
    setup() {
      let isAdmin = ref(0);

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
          wechatSwitch: ""
        });

        const getData = () => {
          getSystemConfig().then((res) => {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            Object.keys(form).forEach((v)=> {
              if(v == "emailSwitch" || v == "wechatSwitch") {
                form[v] = !!parseInt(res.data[v])
              } else {
                form[v] = res.data[v]
              }
            })
          })
        }

        checkAdmin()
        getData()
        const updateSystemConfig = () => {
          form.emailSwitch = form.emailSwitch === true ? "1" : "0";
          form.wechatSwitch = form.wechatSwitch === true ? "1" : "0";
          updateConfig(form).then((res) => {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            ElMessage.success("修改成功");
            getData();
          })
        }
        return {
          isAdmin,
          form,
          updateSystemConfig
        };
    },
};
</script>
