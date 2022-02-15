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
        <el-select v-model="query.name" placeholder="项目名称" clearable filterable class="handle-input mr10">
          <el-option v-for="item in projectList" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>


        <el-button type="primary" icon="" style="float: right" @click="handleOpen">新建</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="80" align="center">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
        <el-table-column label="部署环境" align="center">
          <template #default="scope">{{ scope.row.envName }}</template>
        </el-table-column>
        <el-table-column label="部署方式" align="center">
          <template #default="scope">{{ scope.row.typeName }}</template>
        </el-table-column>
        <el-table-column label="所属集群" align="center">
          <template #default="scope">{{ scope.row.clusterName }}</template>
        </el-table-column>
        <el-table-column label="容器标签" align="center">
          <template #default="scope">{{ scope.row.label }}</template>
        </el-table-column>
        <el-table-column label="部署机器" align="center">
          <template #default="scope">
            {{ scope.row.ecsName }}
          </template>
        </el-table-column>
        <el-table-column label="部署路径" align="center">
          <template #default="scope">{{ scope.row.path }}</template>
        </el-table-column>
        <el-table-column label="使用分支" align="center">
          <template #default="scope">{{ scope.row.branch }}</template>
        </el-table-column>
        <el-table-column label="部署指令" width="220">
          <template #default="scope">{{ scope.row.otherCmd }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button type="text" icon="el-icon-setting" @click="openPublish(scope.$index, scope.row)">发布
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :current-page="query.page"
                       :page-size="query.num" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="title" v-model="visible" width="30%">
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
            <el-option key="rancher" label="rancher容器" value="rancher"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部署机器" prop="ecsId" v-if="form.type == `ecs`">
          <el-select multiple v-model="form.ecsId" placeholder="请选择" clearable>
            <el-option v-for="item in ecsList" :key="item.ecsId" :label="item.name" :value="item.ecsId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集群" prop="clusterId" v-if="form.type == `k8s` || form.type == `rancher`">
          <el-select v-model="form.clusterId" placeholder="请选择" clearable v-if="form.type == `k8s`">
            <el-option v-for="item in k8sList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="form.clusterId" placeholder="请选择" clearable v-else>
            <el-option v-for="item in rancherList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="容器标签" prop="label" v-if="form.type == `rancher` || form.type == `k8s`">
          <el-input v-model="form.label"></el-input>
        </el-form-item>
        <el-form-item label="部署路径" prop="path" v-if="form.type == `ecs`">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="使用分支" prop="branch" v-if="form.type == `ecs`">
          <el-input v-model="form.branch"></el-input>
        </el-form-item>
        <el-form-item label="部署指令" prop="otherCmd" v-if="form.type == `ecs`">
          <el-input type="textarea" rows="5" v-model="form.otherCmd" placeholder="使用非系统自带命令时 确保/usr/bin目录下存在该指令"></el-input>
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


    <!-- 编辑弹出框 -->
    <el-dialog title="发布新版本" v-model="publishVisible" width="30%">
      <el-form label-width="80px" :model="publishForm" :rules="publishRules" ref="pForm">
        <el-form-item label="项目id" prop="name" v-show="false">
          <el-input v-model="publishForm.id"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="publishForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="部署环境" prop="env">
          <el-select v-model="publishForm.env" placeholder="请选择" clearable disabled>
            <el-option key="test" label="测试环境" value="test"></el-option>
            <el-option key="pre" label="预发环境" value="pre"></el-option>
            <el-option key="release" label="正式环境" value="release"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="容器名称" prop="containerName" v-if="publishForm.type == `k8s`">
          <el-select v-model="publishForm.containerName" placeholder="请选择" clearable>
            <el-option v-for="item in containerNameList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镜像地址" prop="dockerImageUid" v-if="publishForm.type != `ecs`">
          <el-input v-model="publishForm.dockerImageUid"></el-input>
        </el-form-item>
        <el-form-item label="通知列表" prop="noticeUserId">
          <el-select v-model="publishForm.noticeUserId" placeholder="请选择" clearable>
            <el-option v-for="item in noticeUserList" :key="item.id" :label="item.key" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新内容" prop="updateInfo">
          <el-input type="textarea" rows="5" v-model="publishForm.updateInfo"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
                <span class="dialog-footer">
                    <el-button @click="publishVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handlePublish" :disabled="isPublish"
                               :icon="buttonIcon">{{ buttonName }}</el-button>
                </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {ref, reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {
  getProject,
  getDistinctProject,
  addProject,
  editProject,
  deleteProject,
  fetchData,
  publish,
  getNoticeUser,
  getClusterGroupByType, getProjectInfo
} from "../api/index";

export default {
  name: "basetable",
  setup() {
    const query = reactive({
      name: "",
      page: 1,
      num: 10,
      distinct: 1
    });
    const tableData = ref([]);
    const pageTotal = ref(0);
    let ecsList = [];
    const projectList = ref([]);
    const k8sList = ref([]);
    let rancherList = ref([]);
    const containerNameList = ref([]);

    let noticeUserList = [];
    //获取ecs列表
    const getEcsList = () => {
      fetchData().then((res) => {
        if (res.code != 200 || res.errorCode != 0) {
          ElMessage.error(res.errorMessage)
          return false;
        }
        const list = res.data.list
        for (let i = 0; i < list.length; i++) {
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
        for (let i = 0; i < list.length; i++) {
          if (list[i].env == "test") {
            list[i].envName = "测试环境";
          } else if (list[i].env == "pre") {
            list[i].envName = "预发环境";
          } else {
            list[i].envName = "正式环境";
          }
          if (list[i].type == "ecs") {
            list[i].typeName = "ecs服务器";
          } else if (list[i].type == "k8s") {
            list[i].typeName = "k8s容器";
          } else if (list[i].type == "rancher") {
            list[i].typeName = "rancher容器";
          } else {
            list[i].typeName = "其它";
          }
          list[i].ecsUrl = ""
          if (list[i].type === "ecs") {
            list[i].ecsId = JSON.parse(list[i].ecsId);
          }
        }
        tableData.value = list;
      });
    };
    getData();
    const distinctProjectList = () => {
      getDistinctProject().then((res) => {
        projectList.value = res.data.list
      })
    }
    distinctProjectList()
    const getNoticeUserList = () => {
      getNoticeUser().then((res) => {
        if (res.code != 200 || res.errorCode != 0) {
          ElMessage.error(res.errorMessage)
          return false;
        }
        let list = res.data.list
        noticeUserList.push({
          "key": "无",
          "id": 0,
        });
        for (let i = 0; i < list.length; i++) {
          noticeUserList.push({
            "key": list[i].name,
            "id": list[i].id
          })
        }
      })
    }
    getNoticeUserList()

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
    const publishForm = reactive({
      id: "",
      name: "",
      type: "",
      env: "",
      dockerImageUid: "",
      updateInfo: "",
      noticeUserId: "",
      containerName: "",
    });

    // 删除操作
    const handleDelete = (id) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            deleteProject({
              "id": id
            }).then((res) => {
              if (res.code != 200 || res.errorCode != 0) {
                ElMessage.error(res.errorMessage)
                return false;
              }
              getData();
              ElMessage.success("删除成功");
              // tableData.value.splice(index, 1);
            })
          })
          .catch(() => {
          });
    };
    const rules = {
      name: [
        {required: true, message: "请输入名称", trigger: "blur"},
      ],
      type: [
        {required: true, message: "请选择类型", trigger: "blur"},
      ],
      env: [
        {required: true, message: "请输入环境", trigger: "blur"},
      ],
      ecsId: [
        {required: true, message: "请输入环境", trigger: "blur"},
      ],
      path: [
        {required: true, message: "请输入环境", trigger: "blur"},
      ],
      branch: [
        {required: true, message: "请输入环境", trigger: "blur"},
      ],
      label: [
        {required: true, message: "请输入容器标签", trigger: "blur"},
      ],
      clusterId: [
        {required: true, message: "请选择集群", trigger: "blur"},
      ]
    };

    const publishRules = {
      id: [
        {required: true, message: "请选择发布项目", trigger: "blur"},
      ],
      name: [
        {required: true, message: "请选择发布项目", trigger: "blur"},
      ],
      env: [
        {required: true, message: "请选择发布环境", trigger: "blur"},
      ],
      noticeUserId: [
        {required: true, message: "请选择通知人员", trigger: "blur"},
      ],
      updateInfo: [
        {required: true, message: "请输入更新内容", trigger: "blur"},
      ],
    };

    // 表格编辑时弹窗和保存
    const visible = ref(false);
    const publishVisible = ref(false)
    const createVisible = ref(false);
    const createForm = ref(null);
    const pForm = ref(null);
    const isNew = ref(false);
    const title = ref("新建");
    const form = reactive({
      id: "",
      name: "",
      env: "",
      type: "",
      ecsId: "",
      clusterId: "",
      label: "",
      ecsName: "",
      path: "",
      branch: "",
      otherCmd: ""
    });

    const openPublish = (item, row) => {
      getProjectInfo({
        "id": row.id
      }).then(res => {
        if (res.code != 200 || res.errorCode != 0) {
          ElMessage.error(res.errorMessage)
          isPublish.value = false;
          buttonIcon.value = "";
          return false;
        }
        containerNameList.value = res.data.container
      })
      Object.keys(publishForm).forEach((item) => {
        publishForm[item] = row[item];
      });

      if (row.type != "ecs") {
        publishRules.dockerImageUid = [
          {required: true, message: "请输入镜像地址", trigger: "blur"},
        ]
      }
      if (row.type == "k8s") {
        publishRules.containerName = [
          {required: true, message: "请输入容器名称", trigger: "blur"},
        ]
      }
      publishVisible.value = true
    }

    const isPublish = ref(false);
    const buttonName = ref("发布");
    const buttonIcon = ref("");

    const handlePublish = () => {
      pForm.value.validate((valid) => {
        if (valid) {
          isPublish.value = true;
          buttonName.value = "发布中";
          buttonIcon.value = "el-icon-loading";
          publish({
            "id": publishForm.id,
            "containerName": publishForm.containerName,
            "updateInfo": publishForm.updateInfo,
            "noticeUserId": publishForm.noticeUserId,
            "dockerImageUid": publishForm.dockerImageUid
          }).then((res) => {
            if (res.code != 200 || res.errorCode != 0) {
              ElMessage.error(res.errorMessage)
              isPublish.value = false;
              buttonIcon.value = "";
              return false;
            }
            buttonName.value = "发 布";
            isPublish.value = false;
            buttonIcon.value = "";
            ElMessage.success("提交成功！");
            publishVisible.value = false;
          })
        } else {
          return false;
        }
      })
    }
    let idx = -1;
    const handleEdit = (index, row) => {
      getCluster()
      title.value = "编辑";
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      isNew.value = false;
      visible.value = true;
    };
    const saveEdit = () => {
      if (form.ecsId == "" || form.ecsId == "[]") {
        form.ecsId = [];
      }
      editProject(form).then((res) => {
        if (res.code != 200 || res.errorCode != 0) {
          ElMessage.error(res.errorMessage)
          return false;
        }
        getData();
        ElMessage.success(`修改成功`);
        visible.value = false;
      })
    };

    const getCluster = () => {
      getClusterGroupByType().then((res) => {
        if (res.code != 200 || res.errorCode != 0) {
          ElMessage.error(res.errorMessage)
          return false;
        }
        k8sList.value = res.data.k8s
        rancherList.value = res.data.rancher
      })
    }

    const handleOpen = () => {
      getCluster()
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
          form.clusterId = parseInt(form.clusterId)
          if (form.ecsId == "") {
            form.ecsId = [];
          }
          addProject(form).then((res) => {
            if (res.code != 200 || res.errorCode != 0) {
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
      distinctProjectList,
      projectList,
      buttonIcon,
      buttonName,
      isPublish,
      publishRules,
      publishVisible,
      noticeUserList,
      containerNameList,
      ecsList,
      k8sList,
      rancherList,
      title,
      query,
      tableData,
      pageTotal,
      visible,
      isNew,
      createVisible,
      createForm,
      publishForm,
      pForm,
      form,
      rules,
      handlePublish,
      handleSearch,
      handleCreate,
      openPublish,
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

::v-deep .el-table .cell {
  white-space: pre-wrap;
}

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
