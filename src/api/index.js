import request from '../utils/request';
import {deploy} from '../utils/api';

const fetchData = query => {
    return request({
        url: deploy.ecsList,
        method: 'get',
        params: query
    });
}

const login = query => {
    return request({
        url: deploy.login,
        method: 'post',
        data: query
    });
}

const addEcs = query => {
    return request({
        url: deploy.ecsAdd,
        method: 'post',
        data: query,
    });
}

const editEcs = query => {
    return request({
        url: deploy.ecsEdit,
        method: 'post',
        data: query
    });
}

const deleteEcs = query => {
    return request({
        url: deploy.ecsDelete,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const getTagList = query => {
    return request({
        url: deploy.getTagList,
        method: 'get',
        params: query
    });
}

const getProject = query => {
    return request({
        url: deploy.projectList,
        method: 'get',
        params: query
    });
}

const getDistinctProject = () => {
    return request({
        url: deploy.distinctProjectList,
        method: 'get'
    });
}

const getProjectInfo = query => {
    return request({
        url: deploy.projectInfo,
        method: 'get',
        params: query
    });
}

const addProject = query => {
    return request({
        url: deploy.projectAdd,
        method: 'post',
        data: query,
    });
}

const editProject = query => {
    return request({
        url: deploy.projectEdit,
        method: 'post',
        data: query
    });
}

const deleteProject = query => {
    return request({
        url: deploy.projectDelete,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const getCluster = query => {
    return request({
        url: deploy.clusterList,
        method: 'get',
        params: query
    });
}

const getClusterGroupByType = query => {
    return request({
        url: deploy.clusterGroupByType,
        method: 'get',
        params: query
    });
}
const addCluster = query => {
    return request({
        url: deploy.clusterAdd,
        method: 'post',
        data: query,
    });
}

const editCluster = query => {
    return request({
        url: deploy.clusterEdit,
        method: 'post',
        data: query
    });
}

const deleteCluster = query => {
    return request({
        url: deploy.clusterDelete,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const getNoticeUser = query => {
    return request({
        url: deploy.noticeUserList,
        method: 'get',
        params: query
    });
}

const addNoticeUser = query => {
    return request({
        url: deploy.noticeUserAdd,
        method: 'post',
        data: query,
    });
}

const editNoticeUser = query => {
    return request({
        url: deploy.noticeUserEdit,
        method: 'post',
        data: query
    });
}

const deleteNoticeUser = query => {
    return request({
        url: deploy.noticeUserDelete,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const getUser = query => {
    return request({
        url: deploy.userList,
        method: 'get',
        params: query
    });
}

const addUser = query => {
    return request({
        url: deploy.userAdd,
        method: 'post',
        data: query,
    });
}

const editUser = query => {
    return request({
        url: deploy.userEdit,
        method: 'post',
        data: query
    });
}

const deleteUser = query => {
    return request({
        url: deploy.userDelete,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const getRole = query => {
    return request({
        url: deploy.roleList,
        method: 'get',
        params: query
    });
}

const addRole = query => {
    return request({
        url: deploy.roleAdd,
        method: 'post',
        data: query,
    });
}

const editRole = query => {
    return request({
        url: deploy.roleEdit,
        method: 'post',
        data: query
    });
}

const deleteRole = query => {
    return request({
        url: deploy.roleDelete,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const getResource = query => {
    return request({
        url: deploy.resourceList,
        method: 'get',
        params: query
    });
}

const getAllMenuResource = query => {
    return request({
        url: deploy.allMenuResource,
        method: 'get',
        params: query
    });
}

const addResource = query => {
    return request({
        url: deploy.resourceAdd,
        method: 'post',
        data: query,
    });
}

const editResource = query => {
    return request({
        url: deploy.resourceEdit,
        method: 'post',
        data: query
    });
}

const deleteResource = query => {
    return request({
        url: deploy.resourceDelete,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const setResourceStatus = query => {
    return request({
        url: deploy.resourceStatus,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}


const publish = query => {
    return request({
        url: deploy.publish,
        method: 'post',
        data: query
    });
}

const publishBack = query => {
    return request({
        url: deploy.publishBack,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const updateConfig = query => {
    return request({
        url: deploy.updateConfig,
        method: 'post',
        data: query,
    });
}

const updateAva = query => {
    return request({
        url: deploy.updateAva,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const saveUserInfoApi = query => {
    return request({
        url: deploy.saveUserInfo,
        method: 'post',
        data: query,
    });
}

const updatePassword = query => {
    return request({
        url: deploy.updatePassword,
        method: 'post',
        data: query,
        headers: { 'Content-Type': "application/x-www-form-urlencoded" }
    });
}

const deployRecord = query => {
    return request({
        url: deploy.deployRecord,
        method: 'get',
        params: query
    });
}

const loginRecord = query => {
    return request({
        url: deploy.loginRecord,
        method: 'get',
        params: query
    });
}

const getSystemConfig = query => {
    return request({
        url: deploy.getSystemConfig,
        method: 'get',
        params: query
    });
}

const getLoginInfo = () => {
    return request({
        url: deploy.getLoginInfo,
        method: 'get',
    });
}

const getMenu = () => {
    return request({
        url: deploy.getMenu,
        method: 'get',
    });
}

const getAdminMenu = () => {
    return request({
        url: deploy.getAdminMenu,
        method: 'get',
    });
}


export  {
    fetchData,
    login,
    addEcs,
    editEcs,
    deleteEcs,
    getProject,
    getDistinctProject,
    getProjectInfo,
    addProject,
    editProject,
    deleteProject,
    getNoticeUser,
    addNoticeUser,
    editNoticeUser,
    deleteNoticeUser,
    getUser,
    addUser,
    editUser,
    deleteUser,
    getClusterGroupByType,
    getCluster,
    addCluster,
    editCluster,
    deleteCluster,
    publish,
    publishBack,
    loginRecord,
    deployRecord,
    getSystemConfig,
    getLoginInfo,
    updateConfig,
    updateAva,
    saveUserInfoApi,
    updatePassword,
    getMenu,
    getAdminMenu,
    getTagList,
    getRole,
    addRole,
    editRole,
    deleteRole,
    getResource,
    addResource,
    editResource,
    deleteResource,
    setResourceStatus,
    getAllMenuResource
}


