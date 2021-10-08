<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 通知列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" style="float: right" icon="" @click="handleOpen">新建</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="80" align="center">
                  <template #default="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                <el-table-column label="手机号" align="center">
                    <template #default="scope">{{ scope.row.phone }}</template>
                </el-table-column>
              <el-table-column label="邮箱" align="center">
                <template #default="scope">{{ scope.row.email }}</template>
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
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email"></el-input>
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
import {getNoticeUser, addNoticeUser, editNoticeUser, deleteNoticeUser} from "../api/index";

export default {
    name: "basetable",
    setup() {
        const query = reactive({
            name: "",
            page: 1,
            num: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            getNoticeUser(query).then((res) => {
                tableData.value = res.data.list;
                pageTotal.value = res.data.count || 0;
            });
        };
        getData();

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
                  deleteNoticeUser({
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
          phone: [
            { required: true, message: "请输入手机号", trigger: "blur" },
          ],
          email: [
            { required: true, message: "请输入邮箱", trigger: "blur" },
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
            phone: "",
            email: "",
        });
        let idx = -1;
        const handleEdit = (index, row) => {
            title.value = "编辑";
            idx = index;
            Object.keys(form).forEach((item) => {
                form[item] = row[item];
            });
            isNew.value = false;
            visible.value = true;
        };
        const saveEdit = () => {
            editNoticeUser(form).then((res) => {
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
              form.id= parseInt(form.id)
              addNoticeUser(form).then((res)=>{
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

        return {
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
