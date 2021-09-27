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

export  { fetchData, login, addEcs, editEcs, deleteEcs }


