<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover" class="mgb20" style="height:403px;">
          <div class="user-info">
            <img :src="avatar" class="user-avator" alt/>
            <div class="user-info-cont">
              <div class="user-info-name">{{ name }}</div>
              <div>{{ role }}</div>
            </div>
          </div>
          <div class="user-info-list">
            上次登录时间：
            <span>{{ dateFormat(lastLoginTime) }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" style="height:403px;">
          <template #header>
            <div class="clearfix">
              <span>访问记录</span>
            </div>
          </template>

          <el-table :show-header="false" :data="todoList" style="width:100%;">
            <el-table-column width="10"></el-table-column>
            <el-table-column>
              <template #default="scope">
                <div class="todo-item">
                  <span style="color: #00a854">{{ scope.row.user }} </span>
                  于
                  <span style="color: #00a854">{{ dateFormat(scope.row.createTime) }} </span>
                  访问了系统
                </div>
              </template>
            </el-table-column>
            <el-table-column width="60">
              <template>
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {ref} from "vue";
import {getLoginInfo, loginRecord} from "../api/index";
import {ElMessage} from "element-plus";
import {dateFormat} from "../utils/time"

export default {
  name: "dashboard",
  setup() {
    const name = localStorage.getItem("ms_username");
    const todoList = ref([]);
    let lastLoginTime = ref("")
    let role = ref("");
    let avatar = ref("");

    const getLogin = () => {
      getLoginInfo().then((res) => {
        if (res.code != 200 || res.errorCode != 0) {
          ElMessage.error(res.errorMessage);
          return false;
        }
        role.value = res.data.isAdmin === 1 ? "超级管理员" : "普通用户";
        lastLoginTime.value = res.data.lastLoginTime
        avatar.value = res.data.ava

      })
    }
    getLogin()
    const getLoginRecord = () => {
      loginRecord().then((res) => {
        if (res.code != 200 || res.errorCode != 0) {
          ElMessage.error(res.errorMessage)
          return false;
        }
        todoList.value = res.data
      })
    }

    getLoginRecord()
    return {
      avatar,
      lastLoginTime,
      name,
      todoList,
      role,
      dateFormat,
      getLogin
    };
  },
};
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-avator {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
