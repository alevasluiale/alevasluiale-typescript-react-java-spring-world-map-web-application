import axios from "axios";
import authHeader from './auth-header';

const API_URL = "http://localhost:8080/timezones/";

class TimezonesService {
  getTimezones(userId: number) {
    return axios
      .get(API_URL+ 'get',{
        params: {
          userId: userId,
        },
        headers: authHeader() 
      })
  }

  addTimezone(name: String, zoneName: String,gmt: String,id:number) {
    return axios
      .post(API_URL+'add',{name,zoneName,gmt},{

        params: {
          userId: id
        },
        headers: authHeader()
      })
  }

  modifyTimezone(name: String, zoneName: String,gmt: String,id: number) {
    return axios
      .post(API_URL+'modify',{name,zoneName,gmt},{

        params: {
          timezoneId: id
        },
        headers: authHeader()
      })
  }

  deleteTimezone(id:number) {
    console.log(id)
    return axios
      .put(API_URL+'delete',{},{
        params: {
          timezoneId: id
        },
        headers: authHeader()
      })
  }
}

export default new TimezonesService();
