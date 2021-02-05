import { ModifyUserProps } from "../components/users.component";
import { Timezone } from "./Timezone";
import { User } from "./User";
import { UserInfo } from "./UserInfo";

export interface AppStateMachineContext {
  currentUser?: User
  timezones?: [Timezone]
  users?: [UserInfo]
}

export interface AppStateMachineSchema {
  context: AppStateMachineContext
  states: {
    check_user_is_authenticated:{}
    home: {}
    login_page: {}
    signed_in: {}
    login_initiated: {}
    sign_up: {}
    timezones: {}
    timezones_fetching: {}
    timezones_add_timezone: {}
    timezones_modify_timezone:{}
    timezones_delete_timezone:{}
    register_user: {}
    timezones_error: {}
    users_fetching: {}
    users: {}
    users_error: {}
    users_delete_user:{}
    users_modify_user:{}
    users_add_user:{}
  },
  EventObject: {}
}

export type AddUserEvent = {
  type: 'ADD_USER',
  payload: ModifyUserProps
}
export type ModifyUserEvent = {
  type: 'MODIFY_USER';
  payload: ModifyUserProps
}
export type DeleteUserEvent = {
  type: 'DELETE_USER';
  payload: {
    id: number
  }
}
export type RegisterEvent = {
  type: 'REGISTER';
  payload: {
    username: string,
    email:string,
    password: string
  }
}
export type AddTimezoneEvent = {
  type: 'ADD_TIMEZONE';
  payload: {
    name: string
    timezone: string
    gmt: string
    id: number
  }
}
export type DeleteTimezoneEvent = {
  type: 'DELETE_TIMEZONE';
  payload: {
    id: number
  }
}
export type ModifyTimezoneEvent = {
  type: 'MODIFY_TIMEZONE';
  payload: {
    name: string
    timezone: string
    gmt: string
    id: number
  }
}
export type OpenZonesForUserEvent = {
  type: 'OPEN_ZONES_FOR_USER';
  payload: {
    id: number
  }
}
export type LoginEvent = {
  type: 'LOGIN';
  payload: {
    userName: string
    password: string
  }
}
export type AppStateMachineEvent = AddTimezoneEvent | LoginEvent 
  | RegisterEvent | DeleteUserEvent | ModifyUserEvent | AddUserEvent | ModifyTimezoneEvent | DeleteTimezoneEvent | OpenZonesForUserEvent
  | {type: 'SIGNED_IN'}
  | {type: 'HOME'}
  | {type: 'LOGIN_PAGE'}
  | {type: 'LOG_OUT'}
  | {type: 'TIMEZONES'}
  | {type: 'SIGN_UP'}
  | {type: 'USERS'}
  | {type: 'ADMIN_PANEL'}
  