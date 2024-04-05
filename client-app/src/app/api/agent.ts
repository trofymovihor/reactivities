import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "./router/Routes";
import { store } from "../stores/store";
import { User, userFormValues } from "../models/user";
import { Profile, Photo } from "../models/profile";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5050/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config =>{
    const token = store.commonStore.token;
    if (token && config.headers){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('/not-found')
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]){
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
      break;
        case 401:
            toast.error("Unautorized")
            break;
        case 403:
            toast.error("Forbidden")
            break;
        case 404:
            router.navigate('/not-found')
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error')
            break;
        default:
            break;
    }
})

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {}),
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: userFormValues) => requests.post<User>('/account/login', user),
    register: (user: userFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
    get: (userName: string) => requests.get<Profile>(`/profiles/${userName}`),
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-Type':'multipart/form-data'}
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
}

const agent = {
    Activities,
    Account,
    Profiles,
}

export default agent;