import axios from 'axios';
import qs from 'qs';
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";


const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8002/' : '',
    timeout: 3000
});

service.interceptors.request.use(
    config => {
        if (config.method === 'post' && config.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
            config.data = qs.stringify(config.data)
        }
        config.headers["token"] = localStorage.getItem("ms_token");
        return config;
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);
const router = useRouter();

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            if (response.data.code != 200 || response.data.errorCode != 0) {
                //登录过期
                if( response.data.errorCode === 1) {
                    ElMessage.error('登录已过期！')
                    localStorage.removeItem("ms_token");
                    localStorage.removeItem("ms_username");
                    router.push("/");
                } else {
                    ElMessage.error(response.data.errorMessage)
                }
                return Promise.reject();
            }


            return response.data;
        } else {
            ElMessage.error('服务异常！')
            Promise.reject();
        }
    },
    error => {
        ElMessage.error('请求失败，请联系后台管理员！')
        return Promise.reject();
    }
);

export default service;
