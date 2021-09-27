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
                <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
                    <el-form-item label="项目" prop="project">
                      <el-select v-model="form.project" placeholder="请选择">
                        <el-option v-for="item in projectList" :key="item.key" :label="item.key" :value="item.key"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="环境" prop="env">
                        <el-select v-model="form.env" placeholder="请选择">
                          <el-option v-for="item in envList" :key="item.key" :label="item.name" :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                  <el-form-item label="通知列表" prop="noticeUser">
                    <el-select v-model="form.noticeUserId" placeholder="请选择">
                      <el-option v-for="item in noticeUserList" :key="item.id" :label="item.key" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                    <el-form-item label="更新内容" prop="updateInfo">
                        <el-input type="textarea" rows="5" v-model="form.updateInfo"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">发布</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import {getNoticeUser, getProject, publish} from "../api/index";

export default {
    name: "publisher",
    setup() {
        const envList = [
          {"key": "test", "name":"测试环境"},
          {"key": "pre", "name":"环境预发"},
          {"key": "release", "name":"正式环境"},
        ];
        const rules = {
            project: [
                { required: true, message: "请选择发布项目", trigger: "blur" },
            ],
            env: [
                { required: true, message: "请选择发布环境", trigger: "blur" },
            ],
            updateInfo: [
              { required: true, message: "请输入更新内容", trigger: "blur" },
            ],
        };
        const formRef = ref(null);
        const form = reactive({
            project: "",
            env: "",
            noticeUserId: "",
            updateInfo: ""
        });
        let projectList = [];
        let noticeUserList = [
        ];

        const getProjectList = () => {
          getProject({"distinct":1}).then((res) => {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            let list = res.data.list
            for(let i=0;i<list.length;i++) {
              projectList.push({
                "key": list[i].name,
              })
            }
          })
        }

      const getNoticeUserList = () => {
        getNoticeUser().then((res) => {
          if(res.code != 200 || res.errorCode != 0 ){
            ElMessage.error(res.errorMessage)
            return false;
          }
          let list = res.data.list
          for(let i=0;i<list.length;i++) {
            noticeUserList.push({
              "key": list[i].name,
              "id": list[i].id
            })
          }
        })
      }
      getProjectList();
      getNoticeUserList();
        // 提交
        const onSubmit = () => {
            // 表单校验
            formRef.value.validate((valid) => {
                if (valid) {
                    form.noticeUserId = parseInt(form.noticeUserId)
                    publish(form).then((res)=>{
                      if(res.code != 200 || res.errorCode != 0 ){
                        ElMessage.error(res.errorMessage)
                        return false;
                      }
                      ElMessage.success("发布成功！");
                    })
                } else {
                    return false;
                }
            });
        };
        // 重置
        const onReset = () => {
            formRef.value.resetFields();
        };

        return {
            envList,
            projectList,
            noticeUserList,
            rules,
            formRef,
            form,
            onSubmit,
            onReset,
            getProjectList,
            getNoticeUserList
        };
    },
};
</script>