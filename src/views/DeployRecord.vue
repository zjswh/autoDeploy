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
                  <template #default="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="projectName" label="项目名" align="center"></el-table-column>
                <el-table-column label="发布环境" align="center">
                    <template #default="scope">{{ scope.row.env }}</template>
                </el-table-column>
              <el-table-column label="更新内容" align="center">
                <template #default="scope">{{ scope.row.updateInfo }}</template>
              </el-table-column>
              <el-table-column label="部署结果" align="center">
                <template #default="scope">{{ scope.row.status }}</template>
              </el-table-column>
              <el-table-column label="发布时间" align="center">
                <template #default="scope">{{ dateFormat(scope.row.createTime) }}</template>
              </el-table-column>
              <el-table-column label="部署详情" width="180" align="center">
                <template #default="scope">
                  <el-button type="text" icon="" @click="handleOpen(scope.$index, scope.row)">查看部署详情
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
      <el-dialog title="部署详情"  v-model="visible" width="60%">
        <el-form label-width="80px" :model="form">
          <el-input type="textarea" rows="20" v-model="form.deployInfo" style="color:#00ff00;" disabled></el-input>
        </el-form>
      </el-dialog>

    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {deployRecord} from "../api/index";
import {dateFormat} from "../utils/time"

export default {
    name: "deployRecord",
    setup() {
        const query = reactive({
            page: 1,
            num: 10,
        });
        const visible = ref(false);
        const tableData = ref([]);
        const pageTotal = ref(0);
        // 获取表格数据
        const getData = () => {
            deployRecord(query).then((res) => {
                tableData.value = res.data;
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
        const form = reactive({
          deployInfo: "",
        });
        const handleOpen = (index, row) => {
          Object.keys(form).forEach((item) => {
            form[item] = row[item];
          });
          visible.value = true;
        };
        return {
            form,
            visible,
            query,
            tableData,
            pageTotal,
            handleOpen,
            dateFormat,
            handleSearch,
            handlePageChange,
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
