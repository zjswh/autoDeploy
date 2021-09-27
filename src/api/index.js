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

const getProject = query => {
    return request({
        url: deploy.projectList,
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

const publish = query => {
    return request({
        url: deploy.publish,
        method: 'post',
        data: query
    });
}

export  {
    fetchData,
    login,
    addEcs,
    editEcs,
    deleteEcs,
    getProject,
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
    publish
}


