import axios from 'axios';
import { ModifyUserProps } from '../components/users.component';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/users/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'public');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  deleteUser(id:number) {
    console.log(id)
    return axios.put(API_URL + 'deleteUser',{}, { 
      params: {
        userId: id
      },
      headers: authHeader() 
    });
  }

  addUser(values: ModifyUserProps) {
    return axios.post(API_URL+'addUser',values,{
      params: {
        userId: values.id
      },
      headers: authHeader()
    })
  }

  modifyUser(values: ModifyUserProps) {
    return axios.post(API_URL+'updateUser',values,{
      params: {
        userId: values.id
      },
      headers: authHeader()
    })
  }
  
  getUsers() {
    return axios.get(API_URL + 'getAll', { headers: authHeader() });
  }
}

export default new UserService();
