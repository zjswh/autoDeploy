import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/dashboard",
                name: "dashboard",
                meta: {
                    title: '系统首页'
                },
                component: () => import ( /* webpackChunkName: "dashboard" */ "../views/Dashboard.vue")
            }, {
                path: "/ecs",
                name: "ecs",
                meta: {
                    title: '服务器列表'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/Ecs.vue")
            }, {
                path: "/cluster",
                name: "cluster",
                meta: {
                    title: '集群管理'
                },
                component: () => import ( /* webpackChunkName: "table" */ "../views/Cluster.vue")
            },{
                path: "/project",
                name: "project",
                meta: {
                    title: '项目列表'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/Project.vue")
            }, {
                path: "/notice",
                name: "notice",
                meta: {
                    title: '通知列表'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/Notice.vue")
            }, {
                path: "/user",
                name: "user",
                meta: {
                    title: '账号列表'
                },
                component: () => import ( /* webpackChunkName: "user" */ "../views/User.vue")
            }, {
                path: "/role",
                name: "role",
                meta: {
                    title: '角色列表'
                },
                component: () => import ( /* webpackChunkName: "user" */ "../views/Role.vue")
            }, {
                path: "/resource",
                name: "resource",
                meta: {
                    title: '角色列表'
                },
                component: () => import ( /* webpackChunkName: "user" */ "../views/Resource.vue")
            },{
                path: "/publisher",
                name: "publisher",
                meta: {
                    title: '项目发布'
                },
                component: () => import ( /* webpackChunkName: "publisher" */ "../views/Publisher.vue")
            },{
                path: "/deployRecord",
                name: "deployRecord",
                meta: {
                    title: '发布记录'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/DeployRecord.vue")
            }, {
                path: "/system",
                name: "system",
                meta: {
                    title: '系统设置'
                },
                component: () => import ( /* webpackChunkName: "charts" */ "../views/System.vue")
            }, {
                path: "/tabs",
                name: "tabs",
                meta: {
                    title: 'tab标签'
                },
                component: () => import ( /* webpackChunkName: "tabs" */ "../views/Tabs.vue")
            },{
                path: "/i18n",
                name: "i18n",
                meta: {
                    title: '国际化语言'
                },
                component: () => import ( /* webpackChunkName: "i18n" */ "../views/I18n.vue")
            }, {
                path: "/upload",
                name: "upload",
                meta: {
                    title: '上传插件'
                },
                component: () => import ( /* webpackChunkName: "upload" */ "../views/Upload.vue")
            }, {
                path: "/icon",
                name: "icon",
                meta: {
                    title: '自定义图标'
                },
                component: () => import ( /* webpackChunkName: "icon" */ "../views/Icon.vue")
            }, {
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import (/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '/403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import (/* webpackChunkName: "403" */ '../views/403.vue')
            }, {
                path: '/personal',
                name: 'personal',
                meta: {
                    title: '个人中心'
                },
                component: () => import (/* webpackChunkName: "personal" */ '../views/Personal.vue')
            }, {
                path: '/editor',
                name: 'editor',
                meta: {
                    title: '富文本编辑器'
                },
                component: () => import (/* webpackChunkName: "editor" */ '../views/Editor.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import ( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 自动部署系统`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;
