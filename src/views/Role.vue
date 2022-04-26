<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 角色列表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="" style="float: right" @click="handleOpen" v-show="buttonVisibility.create">新建</el-button>
      </div>


      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="80" align="center">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column label="角色名" align="center" prop="name">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="角色介绍" align="center" prop="intro">
          <template #default="scope">{{ scope.row.intro }}</template>
        </el-table-column>
        <el-table-column label="是否为管理员" width="120" align="center" prop="isAdmin">
          <template #default="scope">{{ scope.row.isAdminDescribe }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">

            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" v-show="buttonVisibility.edit">编辑
            </el-button>
            <el-button type="text" icon="el-icon-delete" class="red"
                       @click="handleDelete(scope.row.id)" v-show="buttonVisibility.delete">删除
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
    <el-dialog :title="title" v-model="visible" width="60%">
      <el-form label-width="120px" ref="createForm" :model="form" :rules="rules">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="intro">
          <el-input v-model="form.intro"></el-input>
        </el-form-item>
        <el-form-item label="是否为管理员" prop="isAdmin">
          <el-radio v-model="form.isAdmin" label=0>否</el-radio>
          <el-radio v-model="form.isAdmin" label=1>是</el-radio>
        </el-form-item>
        <el-form-item label="权限列表" prop="menuList">
          <el-tree
              ref="refTree"
              :data="menus"
              show-checkbox
              node-key="id"
              check-strictly="true"
              :default-expanded-keys="[]"
              :default-checked-keys="[]"
              :props="defaultProps">
          </el-tree>
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
import {addRole, editRole, deleteRole, getRole, getAdminMenu, getMenu, deleteUser} from "../api/index";
import {getButtonList} from "../utils/tools";

export default {
  name: "role",
  setup() {
    const query = reactive({
      name: "",
      page: 1,
      num: 10,
    });
    const tableData = ref([]);
    const pageTotal = ref(0);

    const menus = ref([]);
    const defaultProps = {
      children: 'children',
      label: 'name'
    };
    const buttonVisibility = ref({
      create: false,
      edit: false,
      delete: false
    });
    getButtonList("/role").then(res =>{
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
      isAdmin: "",
      intro: "",
      menuList: ""
    });

    const refTree = ref();

    const rules = {
      name: [
        {required: true, message: "请输入角色名", trigger: "blur"},
      ],
      intro: [
        {required: true, message: "请输入角色介绍", trigger: "blur"},
      ]
    };

    const loadRoleList = () => {
      getRole(query).then(res => {
        var tmpList = res.data.list;
        Object.values(tmpList).forEach(item=>{
          item.isAdminDescribe = item.isAdmin == 1 ? "是" : "否";
        })
        tableData.value = tmpList
        pageTotal.value = res.data.count || 0;
      })
    }
    loadRoleList();
    // 查询操作
    const handleSearch = () => {
      query.page = 1;
      loadRoleList();
    };
    // 分页导航
    const handlePageChange = (val) => {
      query.page = val;
      loadRoleList();
    };

    const handleOpen = async () => {
      visible.value = true;

      //重置表单
      Object.keys(form).forEach((item) => {
        form[item] = "";
      });
      form.isAdmin = "0";
      title.value = "新建";
      isNew.value = true;
      await nextTick();
      refTree.value.setCheckedKeys([]);
    };

    const handleCreate = () => {
      createForm.value.validate((valid) => {
        if (valid) {
          form.id = parseInt(form.id)
          let menuIdArr = [];
          let nodeArr = refTree.value.getCheckedNodes(false, true);
          Object.values(nodeArr).forEach(item => {
            menuIdArr.push(item.id);
          });
          form.menuList = menuIdArr.join(",");
          form.isAdmin = parseInt(form.isAdmin)
          addRole(form).then((res)=>{
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            loadRoleList();
            ElMessage.success("提交成功！");
            visible.value = false;
          })
        } else {
          return false;
        }
      });
    };

    const loadMenus = () => {
      getAdminMenu().then(res => {
        var arr = [];
        Object.values(res.data).forEach(item => {
          arr.push(item);
        });
        menus.value = arr;
      })
    }

    const handleEdit = async (index, row) => {
      visible.value = true;
      isNew.value = false;
      title.value = "编辑";
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      form.isAdmin = form.isAdmin.toString();
      await nextTick();
      refTree.value.setCheckedKeys(row.menuList.split(","));
    };

    const saveEdit = () => {
      createForm.value.validate((valid) => {
        if (valid) {
          form.id = parseInt(form.id)
          let menuIdArr = [];
          let nodeArr = refTree.value.getCheckedNodes(false, true);
          Object.values(nodeArr).forEach(item => {
            menuIdArr.push(item.id);
          });
          form.menuList = menuIdArr.join(",");
          form.isAdmin = parseInt(form.isAdmin)
          editRole(form).then((res)=>{
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }

            loadRoleList();
            ElMessage.success("提交成功！");
            visible.value = false;
          })
        } else {
          return false;
        }
      });
    }

    const handleDelete = (id) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
          .then(() => {
            deleteRole({
              "id": id
            }).then((res)=> {
              if(res.code != 200 || res.errorCode != 0 ){
                ElMessage.error(res.errorMessage)
                return false;
              }
              loadRoleList();
              ElMessage.success("删除成功");
            })
          })
          .catch(() => {});
    };

    loadMenus();
    return {
      refTree,
      visible,
      createVisible,
      createForm,
      isNew,
      title,
      form,
      query,
      rules,
      tableData,
      pageTotal,
      menus,
      defaultProps,
      buttonVisibility,
      handleSearch,
      handlePageChange,
      handleOpen,
      handleCreate,
      handleDelete,
      handleEdit,
      saveEdit
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
