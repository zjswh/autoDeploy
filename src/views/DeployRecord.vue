<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 发布记录
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column prop="id" label="ID" width="80" align="center">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名" align="center"></el-table-column>
        <el-table-column label="发布环境" align="center">
          <template #default="scope">{{ scope.row.envName }}</template>
        </el-table-column>
        <el-table-column label="发布者" align="center">
          <template #default="scope">{{ scope.row.user }}</template>
        </el-table-column>
        <el-table-column label="更新内容">
          <template #default="scope">{{ scope.row.updateInfo }}</template>
        </el-table-column>
        <el-table-column label="部署结果" align="center">
          <template #default="scope">
            <span v-if="scope.row.status == 1" style="color:green">成功</span>
            <span v-else-if="scope.row.status == 0" style="color:green">部署中</span>
            <span v-else-if="scope.row.status == 3" style="color:red">失败</span>
            <span v-else-if="scope.row.status == 4" style="color:red">回滚失败</span>
            <span v-else-if="scope.row.status == 5" style="color:red">回滚中</span>
            <span v-else style="color: red">已回滚</span>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" align="center">
          <template #default="scope" style="color: red">{{ dateFormat(scope.row.createTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-button type="text" icon="" @click="handleOpen(scope.$index, scope.row)" v-show="buttonVisibility.read">查看部署详情
            </el-button>
            <el-button type="text" icon="el-icon-delete" v-show="scope.row.status == 1 && buttonVisibility.rollback" class="red"
                       @click="handleBack(scope.row.id)" >回滚
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
    <el-dialog title="部署详情" v-model="visible" width="60%">
      <el-form label-width="80px" :model="form">
        <el-input type="textarea" rows="20" v-model="form.deployInfo" disabled></el-input>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {ref, reactive} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {deployRecord, publishBack} from "../api/index";
import {dateFormat} from "../utils/time"
import {useStore} from "vuex";
import {getButtonList} from "../utils/tools";

export default {
  name: "deployRecord",
  emits: ['reload-data'],
  setup() {
    const store = useStore();
    const query = reactive({
      page: 1,
      num: 10,
    });
    const visible = ref(false);
    const tableData = ref([]);
    const pageTotal = ref(0);
    const buttonVisibility = ref({
      read: false,
      rollback: false,
    });
    getButtonList("/deployRecord").then(res =>{
      Object.values(res).forEach(item => {
        buttonVisibility.value[item.buttonType] = true;
      });
    });
    // 获取表格数据
    const getData = () => {
      deployRecord(query).then((res) => {
        let list = res.data.list;
        for (let i = 0; i < list.length; i++) {
          if (list[i].env == "test") {
            list[i].envName = "测试环境";
          } else if (list[i].env == "pre") {
            list[i].envName = "预发环境";
          } else {
            list[i].envName = "正式环境";
          }
        }
        tableData.value = list;
        pageTotal.value = res.data.count || 0;
      });
    };
    getData();
    const reloadData = () => {
      context.emit('reload-data', getData())
    }
    store.state.ws.publishRecord = tableData
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

    const form = reactive({
      deployInfo: "",
    });
    const handleOpen = (index, row) => {
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      visible.value = true;
    };
    const handleBack = (id) => {
      // 二次确认删除
      ElMessageBox.confirm("确定要回滚吗？", "提示", {
        type: "warning",
      })
          .then(() => {

            publishBack({
              "recordId": id
            }).then((res) => {
              if (res.code != 200 || res.errorCode != 0) {
                ElMessage.error(res.errorMessage)
                return false;
              }
              ElMessage.success("操作成功");
              getData();
            })
          })
          .catch(() => {
          });
    };

    return {
      form,
      visible,
      query,
      tableData,
      pageTotal,
      buttonVisibility,
      handleOpen,
      dateFormat,
      handleSearch,
      handlePageChange,
      handleBack,
      reloadData,
    };
  },
};
</script>

<style scoped>

::v-deep .el-table .cell {
  white-space: pre-wrap;
}

::v-deep .el-textarea.is-disabled .el-textarea__inner {
  color: #000;
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
