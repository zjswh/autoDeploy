import axios from 'axios';
import qs from 'qs';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: 'http://127.0.0.1:8002/',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            config.data = qs.stringify(config.data)
        }
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
