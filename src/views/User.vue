<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 账号列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="" style="float: right" @click="handleOpen" v-if="buttonVisibility.create">新建</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="80" align="center">
                  <template #default="scope">{{  scope.$index + 1  }}</template>
                </el-table-column>
                <el-table-column prop="user" label="登录名" align="center"></el-table-column>
                <el-table-column label="姓名" align="center">
                    <template #default="scope">{{ scope.row.name }}</template>
                </el-table-column>
              <el-table-column label="手机号" width="120" align="center">
                <template #default="scope">{{ scope.row.phone }}</template>
              </el-table-column>
              <el-table-column label="职位" align="center">
                <template #default="scope">{{ scope.row.job }}</template>
              </el-table-column>
              <el-table-column label="角色" align="center">
                <template #default="scope">{{ scope.row.roleName }}</template>
              </el-table-column>
              <el-table-column label="邮箱" width="250" align="center">
                <template #default="scope">{{ scope.row.email }}</template>
              </el-table-column>
              <el-table-column label="邮箱秘钥" align="center">
                <template #default="scope">{{ scope.row.emailKey }}</template>
              </el-table-column>
              <el-table-column label="密码" align="center">
                <template #default="scope">{{ scope.row.password }}</template>
              </el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                  <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-if="buttonVisibility.edit">编辑
                  </el-button>
                  <el-button type="text" icon="el-icon-delete" class="red"
                             @click="handleDelete(scope.row.id)" v-if="buttonVisibility.delete">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="query.page"
                    :page-size="query.num" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

      <!-- 编辑弹出框 -->
      <el-dialog :title="title"  v-model="visible" width="30%">
        <el-form label-width="80px" ref="createForm" :model="form" :rules="rules">
          <el-form-item label="登录名" prop="user">
            <el-input v-model="form.user"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="job">
            <el-input v-model="form.job"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择" clearable>
              <el-option v-for="(key, item) in roleMap" :key="key" :label="key" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="邮箱秘钥" prop="emailKey">
            <el-input v-model="form.emailKey"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visible = false">取 消</el-button>
                    <el-button type="primary" v-if="isNew" @click="handleCreate">创建</el-button>
                    <el-button type="primary" v-else @click="saveEdit">确 定</el-button>
                </span>
        </template>
      </el-dialog>

    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {getButtonList} from "../utils/tools";
import {getUser, addUser, editUser, deleteUser, getRole} from "../api/index";

export default {
    name: "user",
    setup() {
        const query = reactive({
            name: "",
            page: 1,
            num: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        const roleMap = ref({});
        const buttonVisibility = ref({
              create: false,
              edit: false,
              delete: false,
        });
        getButtonList("/user").then(res =>{
          Object.values(res).forEach(item => {
            buttonVisibility.value[item.buttonType] = true;
          });
        });
        // 获取表格数据
        const getData = () => {
            getUser(query).then((res) => {
                const tmpList = res.data.list;
                Object.values(tmpList).forEach(item => {
                  item.roleName = roleMap.value[item.roleId] || "其它";
                })
                tableData.value = tmpList;
                pageTotal.value = res.data.count || 0;
            });
        };

        // 查询操作
        const handleSearch = () => {
            query.page = 1;
            getData();
        };
        // 分页导航
        const handlePageChange = (val) => {
            query.page = val;
            getData();
        };

        // 删除操作
        const handleDelete = (id) => {
            // 二次确认删除
            ElMessageBox.confirm("确定要删除吗？", "提示", {
                type: "warning",
            })
                .then(() => {
                  deleteUser({
                    "id": id
                  }).then((res)=> {
                    if(res.code != 200 || res.errorCode != 0 ){
                      ElMessage.error(res.errorMessage)
                      return false;
                    }
                    getData();
                    ElMessage.success("删除成功");
                    // tableData.value.splice(index, 1);
                  })
                })
                .catch(() => {});
        };
        const rules = {
          name: [
            { required: true, message: "请输入姓名", trigger: "blur" },
          ],
          user: [
            { required: true, message: "请输入登录名", trigger: "blur" },
          ],
          phone: [
            { required: true, message: "请输入手机号", trigger: "blur" },
          ],
          job: [
            { required: true, message: "请输入职位", trigger: "blur" },
          ],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
          ],
          emailKey: [
            { required: true, message: "请输入邮箱秘钥", trigger: "blur" },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
          ]
        };
        // 表格编辑时弹窗和保存
        const visible = ref(false);
        const createVisible = ref(false);
        const createForm = ref(null);
        const isNew = ref(false);
        const title = ref("新建");
        const form = reactive({
            id: "",
            name: "",
            user: "",
            phone: "",
            email: "",
            emailKey: "",
            password: "",
            job: "",
            roleId: "",
        });
        const handleEdit = (index, row) => {
            title.value = "编辑";
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            form.roleId = form.roleId.toString();
            isNew.value = false;
            visible.value = true;
        };
        const saveEdit = () => {
            form.roleId = parseInt(form.roleId)
            editUser(form).then((res) => {
              if(res.code != 200 || res.errorCode != 0 ){
                ElMessage.error(res.errorMessage)
                return false;
              }
              getData();
              ElMessage.success(`修改成功`);
              visible.value = false;
            })
        };

        const handleOpen = () => {
          //重置表单
          Object.keys(form).forEach((item) => {
            form[item] = "";
          });

          title.value = "新建";
          isNew.value = true;
          visible.value = true;
        };

        const handleCreate = () => {
          createForm.value.validate((valid) => {
            if (valid) {
              form.ecsId = parseInt(form.ecsId)
              form.id= parseInt(form.id)
              form.roleId = parseInt(form.roleId)
              addUser(form).then((res)=>{
                if(res.code != 200 || res.errorCode != 0 ){
                  ElMessage.error(res.errorMessage)
                  return false;
                }
                getData();
                ElMessage.success("提交成功！");
                visible.value = false;
              })
            } else {
              return false;
            }
          });
        };

        const loadRoleList = () => {
          getRole(query).then(res => {
            const tmpMap = {};
            Object.values(res.data.list).forEach(item=>{
              tmpMap[item.id] = item.name;
            })
            roleMap.value = tmpMap;
          })
        }
        loadRoleList();
        getData();
        return {
          buttonVisibility,
            roleMap,
            title,
            query,
            tableData,
            pageTotal,
            visible,
            isNew,
            createVisible,
            createForm,
            form,
            rules,
            handleSearch,
            handleCreate,
            handleOpen,
            handlePageChange,
            handleDelete,
            handleEdit,
            saveEdit,
        };
    },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
