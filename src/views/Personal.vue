<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="7">
              <el-card shadow="hover">
                <div class="info" >
                  <div class="info-image" @click="showDialog" >
                    <img :src="avatarImg" />
                    <span class="info-edit">
                         <i class="el-icon-lx-camerafill"></i>
                     </span>
                  </div>
                  <div class="info-name">{{ name }}</div>
                  <div class="info-base">姓&nbsp;&nbsp;&nbsp;名: {{ userForm.name }}</div>
                  <div class="info-base">手机号:{{ userForm.phone }}</div>
                  <div class="info-base">邮&nbsp;&nbsp;&nbsp;箱: {{ userForm.email }}</div>
                  <div class="info-base">职&nbsp;&nbsp;&nbsp;位: {{ userForm.job }}</div>
                  <el-button type="primary" @click="chooseAction(`baseInfo`)">修改信息</el-button>
                  <el-button type="primary" @click="chooseAction(`password`)">修改密码</el-button>
                </div>
              </el-card>


            </el-col>
<!--            <el-col :span="10">-->
<!--                <el-card shadow="hover">-->
<!--                    <div class="info" >-->
<!--                        <div class="info-image" @click="showDialog" >-->
<!--                            <img :src="avatarImg" />-->
<!--                            <span class="info-edit">-->
<!--                                <i class="el-icon-lx-camerafill"></i>-->
<!--                            </span>-->
<!--                        </div>-->
<!--                        <div class="info-name">{{ name }}</div>-->

<!--                    </div>-->
<!--                </el-card>-->
<!--            </el-col>-->
            <el-col :span="17" v-if="action == `baseInfo`" >
                <el-card shadow="hover">
                    <template #header>
                        <div class="clearfix">
                            <span>修改信息</span>
                        </div>
                    </template>
                    <el-form label-width="100px" :rules="rules" :model="userForm" ref="initForm" >
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="userForm.name"> </el-input>
                      </el-form-item>
                      <el-form-item label="手机号" prop="phone">
                        <el-input v-model="userForm.phone"></el-input>
                      </el-form-item>
                      <el-form-item label="邮箱" prop="email">
                        <el-input v-model="userForm.email"></el-input>
                      </el-form-item>
                      <el-form-item label="邮箱密钥" prop="emailKey">
                        <el-input v-model="userForm.emailKey"></el-input>
                      </el-form-item>
                      <el-form-item label="职位" prop="job">
                        <el-input v-model="userForm.job"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary"  @click="saveUserInfo" v-show="buttonVisibility.saveInfo">保存</el-button>
                      </el-form-item>
                    </el-form>
                </el-card>
            </el-col>

            <el-col :span="17" v-else-if="action == `password`">
              <el-card shadow="hover">
                <template #header>
                  <div class="clearfix">
                    <span>修改密码</span>
                  </div>
                </template>
                <el-form label-width="90px" :rules="passwordRule" :model="form" ref="passwordForm">
                  <el-form-item label="用户名："> {{ name }} </el-form-item>
                  <el-form-item label="旧密码：" prop="old">
                    <el-input type="password" v-model="form.old"></el-input>
                  </el-form-item>
                  <el-form-item label="新密码：" prop="new">
                    <el-input type="password" v-model="form.new"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="savePassword" v-show="buttonVisibility.savePasw">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>
        </el-row>

        <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
            <vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
                style="width: 100%; height: 400px"></vue-cropper>

            <template #footer>
                <span class="dialog-footer">
                    <el-button class="crop-demo-btn" type="primary">选择图片
                        <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
                    </el-button>
                    <el-button type="primary" @click="saveAvatar" v-show="buttonVisibility.saveAva">上传并保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { reactive, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import avatar from "../assets/img/img.jpg";
import {getLoginInfo, updateAva, saveUserInfoApi, updatePassword} from "../api/index";
import {ElMessage} from "element-plus";
import {getButtonList} from "../utils/tools";


export default {
    name: "user",
    components: {
        VueCropper,
    },
    setup() {
        const action = ref("baseInfo")
        const name = ref("");
        const form = reactive({
            old: "",
            new: "",
        });
        const passwordForm = ref(null);
        const initForm = ref(null);
        const userForm = reactive({
          "name": "",
          "phone": "",
          "email": "",
          "emailKey": "",
          "job": "",
        });

        const rules = {
          name: [
            { required: true, message: "请输入姓名", trigger: "blur" },
          ],
          phone: [
            { required: true, message: "请输入手机号", trigger: "blur" },
          ],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
          ],
          emailKey: [
            { required: true, message: "请输入邮箱密钥", trigger: "blur" },
          ],
          job: [
            { required: true, message: "请输入职位", trigger: "blur" },
          ]
        };
        const passwordRule = {
          old: [
            { required: true, message: "请输入旧密码", trigger: "blur" },
          ],
          new: [
            { required: true, message: "请输入新密码", trigger: "blur" },
          ],
        };
        const avatarImg = ref(avatar);
        const buttonVisibility = ref({
          saveInfo: false,
          saveAva: false,
          savePasw: false,
        });
        getButtonList("/personal").then(res =>{
          Object.values(res).forEach(item => {
            buttonVisibility.value[item.buttonType] = true;
          });
        });
        const getLogin = () => {
          getLoginInfo().then((res) => {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage);
              return false;
            }
            avatarImg.value = res.data.ava
            name.value = res.data.user
            Object.keys(userForm).forEach((item) => {
              userForm[item] = res.data[item]
            })
          })
        }
        getLogin()
        const chooseAction = (act) => {
          action.value = act
        }

        const onSubmit = () => {};

        const imgSrc = ref("");
        const cropImg = ref("");
        const dialogVisible = ref(false);
        const cropper = ref(null);

        const showDialog = () => {
            dialogVisible.value = true;
            imgSrc.value = avatarImg.value;
        };

        const setImage = (e) => {
            const file = e.target.files[0];
            if (!file.type.includes("image/")) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                dialogVisible.value = true;
                imgSrc.value = event.target.result;
                cropper.value && cropper.value.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        };

        const cropImage = () => {
            cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
        };

        const saveAvatar = () => {
            updateAva({
              "ava": cropImg.value
            }).then((res)=>{
              if(res.code != 200 || res.errorCode != 0 ){
                ElMessage.error(res.errorMessage);
                return false;
              }
              ElMessage.success("上传成功");
              avatarImg.value = cropImg.value;
              dialogVisible.value = false;
            })
        };

        const savePassword = () => {
          passwordForm.value.validate((valid) => {
            if(valid) {
              updatePassword(form).then((res) => {
                if(res.code != 200 || res.errorCode != 0 ){
                  ElMessage.error(res.errorMessage)
                  return false;
                }
                ElMessage.success("修改成功");
                form.old = ""
                form.new = ""
              })
            }else {
              return false;
            }
          })
        }

        const saveUserInfo = () => {
          initForm.value.validate((valid) => {
            if(valid) {
              saveUserInfoApi(userForm).then((res)=>{
                if(res.code != 200 || res.errorCode != 0 ){
                  ElMessage.error(res.errorMessage)
                  return false;
                }
                ElMessage.success("修改成功");
                getLogin();
              })
            }else {
              return false;
            }
          })
        }

        return {
            passwordForm,
            passwordRule,
            action,
            initForm,
            rules,
            name,
            form,
            userForm,
            onSubmit,
            cropper,
            avatarImg,
            imgSrc,
            cropImg,
            showDialog,
            dialogVisible,
            buttonVisibility,
            setImage,
            cropImage,
            saveAvatar,
            saveUserInfo,
            chooseAction,
            savePassword
        };
    },
};
</script>

<style scoped>
.info {
    text-align: center;
    padding: 35px 0;
}
.info-image {
    position: relative;
    margin: auto;
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 50px;
    overflow: hidden;
}
.info-image img {
    width: 100%;
    height: 100%;
}
.info-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.3s ease;
}
.info-edit i {
    color: #eee;
    font-size: 25px;
}
.info-image:hover .info-edit {
    opacity: 1;
}
.info-name {
    margin: 15px 0 10px;
    font-size: 24px;
    font-weight: 500;
    color: #262626;
}

.info-base {
  margin: 15px 0 10px;
  text-align: left;
  color: #262626;
  font-size: 18px;
}

.crop-demo-btn {
    position: relative;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>
