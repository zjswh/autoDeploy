<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 集群管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon=""  style="float: right; margin-bottom: 10px" @click="handleOpen" v-show="buttonVisibility.create">新建</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center">
                  <template #default="scope">{{  scope.$index + 1  }}</template>
                </el-table-column>
                <el-table-column prop="name" label="集群名称" align="center">
                  <template #default="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="类型" align="center">
                    <template #default="scope">{{ scope.row.type }}</template>
                </el-table-column>
              <el-table-column label="命名空间" align="center">
                <template #default="scope">{{ scope.row.namespace }}</template>
              </el-table-column>
              <el-table-column label="访问地址" align="center">
                <template #default="scope">{{ scope.row.host }}</template>
              </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-show="buttonVisibility.edit">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.row.id)" v-show="buttonVisibility.delete">删除</el-button>
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
        <el-form label-width="90px" ref="createForm" :model="form" :rules="rules">
          <el-form-item label="集群名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择" clearable>
              <el-option key="test" label="k8s" value="k8s"></el-option>
              <el-option key="pre" label="rancher" value="rancher"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="命名空间" prop="namespace">
            <el-input v-model="form.namespace"></el-input>
          </el-form-item>
          <el-form-item label="访问地址" prop="host">
            <el-input v-model="form.host"></el-input>
          </el-form-item>
          <el-form-item label="accessKey" prop="accessKey">
            <el-input type="textarea" rows="5" v-model="form.accessKey"></el-input>
          </el-form-item>
          <el-form-item label="secretKey" prop="secretKey">
            <el-input type="textarea" rows="5" v-model="form.secretKey"></el-input>
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
import {getCluster, addCluster, deleteCluster, editCluster} from "../api/index";
import {getButtonList} from "../utils/tools";

export default {
    name: "basetable",
    setup() {
      const query = reactive({
            type: "",
            page: 1,
            num: 10,
        });
        const tableData = ref([]);
        const pageTotal = ref(0);
        const buttonVisibility = ref({
          create: false,
          edit: false,
          delete: false,
        });
        getButtonList("/cluster").then(res =>{
          Object.values(res).forEach(item => {
            buttonVisibility.value[item.buttonType] = true;
          });
        });
        // 获取表格数据
        const getData = () => {
          getCluster(query).then((res) => {
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
                  deleteCluster({
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
            { required: true, message: "请输入名称", trigger: "blur" },
          ],
          namespace: [
            { required: true, message: "请输入命名空间", trigger: "blur" },
          ],
          type: [
            { required: true, message: "请选择类型", trigger: "blur" },
          ],
          host: [
            { required: true, message: "请输入访问域名", trigger: "blur" },
          ],
          accessKey: [
            { required: true, message: "请输入accessKey", trigger: "blur" },
          ],
          secretKey: [
            { required: true, message: "请输入secretKey", trigger: "blur" },
          ],
        };
        // 表格编辑时弹窗和保存
        const visible = ref(false);
        const createVisible = ref(false);
        const createForm = ref(null);
        const isNew = ref(false);
        const title = ref("新建")
        const form = reactive({
            id: "",
            name: "",
            namespace: "",
            type: "",
            host: "",
            accessKey: "",
            secretKey: ""
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
            editCluster(form).then((res) => {
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
              form.id = parseInt(form.id)
              addCluster(form).then((res)=>{
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
            buttonVisibility,
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
