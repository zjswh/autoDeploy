<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 项目列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.name" placeholder="项目名称" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="" style="float: right" @click="handleOpen">新建</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="80" align="center">
                  <template #default="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
                <el-table-column label="部署环境" align="center">
                    <template #default="scope">{{ scope.row.env }}</template>
                </el-table-column>
              <el-table-column label="部署方式" align="center">
                <template #default="scope">{{ scope.row.type }}</template>
              </el-table-column>
              <el-table-column label="部署机器" align="center">
<!--                <template #default="scope">{{ scope.row.ecsName }}</template>-->
                <template #default="scope">
                    <router-link :to="scope.row.ecsUrl">{{ scope.row.ecsName }}</router-link>
                </template>

              </el-table-column>
              <el-table-column label="部署路径" align="center">
                <template #default="scope">{{ scope.row.path }}</template>
              </el-table-column>
              <el-table-column label="使用分支" align="center">
                <template #default="scope">{{ scope.row.branch }}</template>
              </el-table-column>
              <el-table-column label="其它指令" align="center">
                <template #default="scope">{{ scope.row.otherCmd }}</template>
              </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.row.id)">删除</el-button>
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
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="部署环境" prop="env">
            <el-select v-model="form.env" placeholder="请选择" clearable>
              <el-option key="test" label="测试环境" value="test"></el-option>
              <el-option key="pre" label="预发环境" value="pre"></el-option>
              <el-option key="release" label="正式环境" value="release"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署方式" prop="type">
            <el-select v-model="form.type" placeholder="请选择" clearable>
              <el-option key="ecs" label="ecs服务器" value="ecs"></el-option>
              <el-option key="k8s" label="k8s容器" value="k8s"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署机器" prop="ecsId">
            <el-select v-model="form.ecsId" placeholder="请选择" clearable>
              <el-option v-for="item in ecsList" :key="item.ecsId" :label="item.name" :value="item.ecsId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署路径" prop="path">
            <el-input v-model="form.path"></el-input>
          </el-form-item>
          <el-form-item label="使用分支" prop="branch">
            <el-input v-model="form.branch"></el-input>
          </el-form-item>
          <el-form-item label="其它指令" prop="otherCmd">
            <el-input v-model="form.otherCmd"></el-input>
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
import {getProject, addProject, editProject, deleteProject, fetchData} from "../api/index";

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
        let ecsList = [];

      //获取ecs列表
        const getEcsList = () => {
          fetchData().then((res)=> {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            const list = res.data.list
            for(let i=0;i<list.length;i++) {
              ecsList.push({
                "ecsId": list[i].id,
                "name": list[i].name
              })
            }
          })
        }
         getEcsList();
        // 获取表格数据
        const getData = () => {
            getProject(query).then((res) => {
                pageTotal.value = res.data.count || 0;
                const list = res.data.list;

              for(let i=0; i< list.length;i++) {
                  if(list[i].env == "test") {
                    list[i].env = "测试环境";
                  } else if (list[i].env == "pre") {
                    list[i].env = "预发环境";
                  }else {
                    list[i].env = "正式环境";
                  }
                  if(list[i].type == "ecs") {
                    list[i].type = "ecs服务器";
                  } else if (list[i].type == "k8s") {
                    list[i].type = "k8s容器";
                  }else {
                    list[i].type = "其它";
                  }
                  list[i].ecsUrl = ""
                  if(list[i].ecsName != "") {
                    list[i].ecsUrl = "/ecs?name=" + list[i].ecsName;
                  }
              }
              tableData.value = list;
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
                  deleteProject({
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
          type: [
            { required: true, message: "请输入地址", trigger: "blur" },
          ],
          env: [
            { required: true, message: "请输入端口", trigger: "blur" },
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
            env: "",
            type: "",
            ecsId: "",
            ecsName:"",
            path: "",
            branch: "",
            otherCmd: ""
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
            editProject(form).then((res) => {
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
              addProject(form).then((res)=>{
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
            ecsList,
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
