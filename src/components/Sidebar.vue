<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in menu">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template #title>
                            <i :class="item.icon"></i>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {getMenu} from "../api/index"
import {ElMessage} from "element-plus";
export default {
    setup() {
        const menu = ref([]);
        const route = useRoute();
        // const items = [
        //   {
        //     icon: "el-icon-lx-home",
        //     index: "/dashboard",
        //     title: "系统首页",
        //   },
        //   {
        //     icon: "el-icon-star-off",
        //     index: "/project",
        //     title: "项目列表",
        //   },
        //   {
        //     icon: "el-icon-s-operation",
        //     index: "/deployRecord",
        //     title: "发布记录",
        //   },
        //   {
        //     icon: "el-icon-lx-cascades",
        //     index: "/ecs",
        //     title: "服务器列表",
        //   },
        //   {
        //     icon: "el-icon-lx-copy",
        //     index: "/notice",
        //     title: "通知列表",
        //   },
        //   {
        //     icon: "el-icon-user",
        //     index: "/user",
        //     title: "账号列表",
        //   },
        //   {
        //     icon: "el-icon-s-tools",
        //     index: "/system",
        //     title: "系统设置",
        //   },
        //   {
        //     icon: "el-icon-s-custom",
        //     index: "/personal",
        //     title: "个人中心",
        //   }
        // ];
        const getMenuData = () => {
          getMenu().then((res)=> {
            if(res.code != 200 || res.errorCode != 0 ){
              ElMessage.error(res.errorMessage)
              return false;
            }
            var menuData = []
            Object.values(res.data).forEach((item)=> {
              menuData.push({
                "icon": item.icon,
                "index": item.path,
                "title": item.name,
              })
            })
            menu.value = menuData
          })
        }
        const onRoutes = computed(() => {
            return route.path;
        });

        const store = useStore();
        const collapse = computed(() => store.state.collapse);
        getMenuData()
        return {
            menu,
            onRoutes,
            collapse,
        };
    },
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
