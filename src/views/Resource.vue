<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 权限列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="" style="float: right" @click="handleOpen" v-show="buttonVisibility.create">新建</el-button>
      </div>


      <el-table :data="tableData" border class="table" ref="multipleTable"
                header-cell-class-name="table-header"
                row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="名称" align="center" prop="name" width="120">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="icon" align="center" prop="icon">
          <template #default="scope">{{ scope.row.icon }}</template>
        </el-table-column>
        <el-table-column label="前端路径" align="center" prop="path">
          <template #default="scope">{{ scope.row.path }}</template>
        </el-table-column>
        <el-table-column label="权限类型" align="center" prop="type">
          <template #default="scope">{{ scope.row.typeName }}</template>
        </el-table-column>
        <el-table-column label="排序值" align="center" prop="sort">
          <template #default="scope">{{ scope.row.sort }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
          <template #default="scope">{{ dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template #default="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-show="buttonVisibility.edit">编辑</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row.id, 1)" v-if="scope.row.status == `0` && buttonVisibility.enable">启用</el-button>
            <el-button type="text" icon="el-icon-edit" @click="handleStatus(scope.row.id, 0)" v-if="scope.row.status == `1` && buttonVisibility.disable">停用</el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.row.id)" v-show="buttonVisibility.delete">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="title" v-model="visible" width="30%">
      <el-form label-width="80px" ref="createForm" :model="form" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="icon" prop="icon">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="前端路径" prop="path">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="权限类型" prop="type">
          <el-radio v-model="form.type" label="menu">菜单</el-radio>
          <el-radio v-model="form.type" label="button">按钮</el-radio>
        </el-form-item>
        <el-form-item label="按钮类型" prop="buttonType" v-if="form.type == `button`">
          <el-input v-model="form.buttonType"></el-input>
        </el-form-item>
        <el-form-item label="父节点" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择" clearable filterable>
            <el-option v-for="item in menuResource" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序值" prop="sort">
          <el-input v-model.number="form.sort" type="number"></el-input>
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
import {ref, reactive, nextTick} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {addResource, editResource, deleteResource, getResource,getAdminMenu, getAllMenuResource, setResourceStatus} from "../api/index";
import {dateFormat} from "../utils/time"
import {getButtonList} from "../utils/tools";

export default {
  name: "resource",
  setup() {
    const tableData = ref([]);
    const pageTotal = ref(0);

    var menus = ref([]);
    var defaultProps = {
      children: 'children',
      label: 'name'
    };
    const buttonVisibility = ref({
      create: false,
      edit: false,
      delete: false,
      enable: false,
      disable: false
    });
    getButtonList("/resource").then(res =>{
      Object.values(res).forEach(item => {
        buttonVisibility.value[item.buttonType] = true;
      });
    });

    // 表格编辑时弹窗和保存
    const visible = ref(false);
    const createVisible = ref(false);
    const createForm = ref(null);
    const isNew = ref(false);
    const title = ref("新建");
    const form = reactive({
      id: "",
      name: "",
      icon: "",
      path: "",
      type: "",
      pid: "",
      sort: "",
      buttonType: ""
    });

    const refTree = ref();

    const rules = {
      name: [
        {required: true, message: "请输入名称", trigger: "blur"},
      ],
      icon: [
        {required: true, message: "请输入icon", trigger: "blur"},
      ],
      path: [
        {required: true, message: "请输入前端路径", trigger: "blur"},
      ],
      type: [
        {required: true, message: "请选择权限类型", trigger: "blur"},
      ],
      buttonType: [
        {required: true, message: "请选择菜单类型", trigger: "blur"},
      ]
    };
    const menuResource = ref([]);
    const loadResourceList = () => {
      getResource().then(res => {
        var tmpList = res.data.list;
        Object.values(tmpList).forEach(item=>{
          item.typeName = item.type == "menu" ? "菜单" : "按钮";
        })
        tableData.value = tmpList
        pageTotal.value = res.data.count || 0;
        dealData(tmpList)

      })
    }
    const dealData = (data) => {
      Object.values(data).forEach(item=>{
        if(item.children === null) {
          return
        }
        item.typeName = item.type == "menu" ? "菜单" : "按钮";
        console.log(item.typeName)

        dealData(item.children)
      })
    }

    loadResourceList();

    const loadAllMenuResource = () => {
      getAllMenuResource().then(res=> {
        if(res.code != 200 || res.errorCode != 0 ){
          ElMessage.error(res.errorMessage)
          return false;
        }
        menuResource.value = res.data;
      })
    }

    const handleOpen = async () => {
      await loadAllMenuResource()
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
          addResource(form).then((res)=>{
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            loadResourceList();
            ElMessage.success("提交成功！");
            visible.value = false;
          })
        } else {
          return false;
        }
      });
    };

    const handleEdit = async (index, row) => {
      await loadAllMenuResource()
      visible.value = true;
      isNew.value = false;
      title.value = "编辑";
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
    };

    const saveEdit = () => {
      createForm.value.validate((valid) => {
        if (valid) {
          form.id = parseInt(form.id)
          editResource(form).then((res)=>{
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }

            loadResourceList();
            ElMessage.success("提交成功！");
            visible.value = false;
          })
        } else {
          return false;
        }
      });
    }
    const handleStatus = (id, status) => {
      setResourceStatus({
        "id": id,
        "status": status,
      }).then((res)=> {
        if(res.code != 200 || res.errorCode != 0 ){
          ElMessage.error(res.errorMessage)
          return false;
        }
        loadResourceList();
        ElMessage.success("设置成功");
      })
    }
    const handleDelete = (id) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            deleteResource({
              "id": id
            }).then((res)=> {
              if(res.code != 200 || res.errorCode != 0 ){
                ElMessage.error(res.errorMessage)
                return false;
              }
              loadResourceList();
              ElMessage.success("删除成功");
            })
          })
          .catch(() => {});
    };

    return {
      refTree,
      visible,
      createVisible,
      createForm,
      isNew,
      title,
      form,
      rules,
      tableData,
      pageTotal,
      menus,
      defaultProps,
      menuResource,
      buttonVisibility,
      dateFormat,
      handleOpen,
      handleCreate,
      handleDelete,
      handleEdit,
      saveEdit,
      handleStatus,
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
