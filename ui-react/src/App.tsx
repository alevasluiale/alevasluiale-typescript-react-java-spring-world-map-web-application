import React,{useState} from "react";
import "./style/index.css";
import AuthService from "./services/auth.service";
import TimezonesService from "./services/timezones.service";
import {useMachine} from '@xstate/react';
import Login from "./components/login.component";
import TimeZones from "./components/timezones.component";
import Register from "./components/register.component";
import Home from "./components/home.component";
import {assign, Machine} from 'xstate';
import { User } from "./models/User";
import Match from "./utils/Match";
import { message } from 'antd'
import { AddTimezoneEvent, AddUserEvent, AppStateMachineContext, AppStateMachineEvent, AppStateMachineSchema, DeleteTimezoneEvent, DeleteUserEvent, LoginEvent, ModifyTimezoneEvent, ModifyUserEvent, OpenZonesForUserEvent, RegisterEvent } from "./models/AppStateMachineSchema";
import userService from "./services/user.service";
import Users, { ModifyUserProps } from "./components/users.component";
import authService from "./services/auth.service";

export const App:  React.FC = () => {
  
  const [current,send] = useMachine(createAppStateMachine(AuthService.getCurrentUser()))
  
  const [userIdForZones,setUserIdForZones] = useState({
    id: 0,
    username: ''
  })

  function clearUserForZone() {
    setUserIdForZones({
      id: 0,
      username: ''
    })
    localStorage.removeItem('userIdForZone')
  }

    return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark unselectable">
        <span style={{cursor: 'pointer'}} className="navbar-brand unselectable" onClick={e=>{
          clearUserForZone()
          send({type:'HOME'})}}>
          TopTal
        </span>
            <div className="navbar-nav mr-auto  unselectable">
            
            {current.context.currentUser && 
              (<li className="nav-item" onClick={e => {
                clearUserForZone()
                send({type: 'HOME'})}}>
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={e=>{
                  clearUserForZone()
                  send({type: 'OPEN_ZONES_FOR_USER',payload:{
                    id: current.context.currentUser?.id ?? 0
                  }})}}>
                  TimeZones
                </span>
              </li>
            )}


            {current.context.currentUser && 
              ( current.context.currentUser.roles.includes("ROLE_USER_MANAGER") ||
              current.context.currentUser.roles.includes("ROLE_ADMIN") ) && (
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={e=>{
                  clearUserForZone()
                  send({type:'USERS'})}}>
                  Users
                </span>
              </li>
            )}
          </div>

          {current.context.currentUser ? (
            <div className="navbar-nav ml-auto unselectable">
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable">
                  {current.context.currentUser.username}
                </span>
              </li>
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={ e => {
                  clearUserForZone()
                  send({type: 'LOG_OUT'})}}>
                  LogOut
                </span>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto unselectable">
              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" 
                  onClick={e=> {
                    clearUserForZone()
                    send({
                    type: 'LOGIN_PAGE'
                    })}}>
                  Login
                  </span>
              </li>

              <li className="nav-item">
                <span style={{cursor: 'pointer'}} className="nav-link unselectable" onClick={e=>{send({
                  type: 'SIGN_UP'
                })}}>
                  Sign Up
                </span>
              </li>
            </div>
          )}
        </nav>

  
      <div className="container py-4">
        <Match state={['home','signed_in']} current={current}>
          <Home/>
        </Match>

        <Match state={'login_page'} current={current}>
          <Login onLogin={
            (userName: string,password:string) => {
              send({
              type:'LOGIN',
              payload: {
                userName: userName,
                password: password
              }
            })
            }
          }/>
        </Match>

        <Match state={"timezones"} current={current}>
          <TimeZones 
            timezones={current.context.timezones}
            username={userIdForZones.username !== '' ? userIdForZones.username : undefined}
            onAddTimezone={(name: string,timezone: string,gmt: string)=> {
              send({
                type: 'ADD_TIMEZONE',
                payload: {
                  name: name,
                  timezone: timezone,
                  gmt: gmt,
                  id: userIdForZones.id > 0 ? userIdForZones.id : AuthService.getCurrentUserId()
                }
              })
            }}
            onModifyTimezone={(name: string,timezone: string,gmt: string,id:number)=> {
              send({
                type: 'MODIFY_TIMEZONE',
                payload: {
                  name: name,
                  timezone: timezone,
                  gmt: gmt,
                  id: id
                }
              })
            }}
            onDeleteTimezone={(id:number)=> {
              send({
                type: 'DELETE_TIMEZONE',
                payload: {
                  id: id
                }
              })
            }}/>
        </Match>

        <Match state={"sign_up"} current={current}>
          <Register
            onRegister={(username: string,email:string,password:string) => 
              send({
                type: 'REGISTER',
                payload: {
                  username: username,
                  email: email,
                  password: password
                }
              })}
          />
        </Match>
        
        <Match state={"users"} current={current}>
          <Users 
            users={current.context.users}
            deleteUser={(id: number) => {
              send({
                type: 'DELETE_USER',
                payload: {
                  id: id
                }
              })
            }}
            modifyUser={(values: ModifyUserProps) => send({
              type: 'MODIFY_USER',
              payload: values
            })}
            addUser={(values: ModifyUserProps) => send({
              type: 'ADD_USER',
              payload: values
            })}
            openZonesForUser={(id: number,username:string) => {
              setUserIdForZones({
                id:id,
                username: username
              })
              localStorage.setItem('userIdForZone',id.toString())
              send({
                type: 'OPEN_ZONES_FOR_USER',
                payload: {
                  id: id
                }
              })
            }}
          />
        </Match>

      </div>
    </div>
    )
}

export default App;

const createAppStateMachine = (currentUser?: User ) => 
  Machine<AppStateMachineContext,AppStateMachineSchema,AppStateMachineEvent>({
  initial: currentUser ? 'home' : 'check_user_is_authenticated',
  id: 'app-state-machine',
  context: {
    currentUser: currentUser
  },
  states: {
    check_user_is_authenticated: {
      invoke: {
        id: 'check-user-is-authenticated',
        src: 'authenticateUser',
        onDone: 'signed_in',
        onError: {
          target: 'home',
          actions: assign({
            currentUser: (context) => {
              localStorage.removeItem("user")
              return undefined
            }
          })
        }
      }
    },
    home: {
      on: {
        LOGIN_PAGE: 'login_page',
        SIGN_UP: 'sign_up',
        OPEN_ZONES_FOR_USER: 'timezones_fetching',
        LOG_OUT: {
          target: 'home',
          actions: 'logOut'
        },
        USERS: 'users_fetching'
      }
    },
    signed_in: {
      on: {
        LOG_OUT: {
          target: 'home',
          actions: 'logOut'
        },
        OPEN_ZONES_FOR_USER: 'timezones_fetching',
        USERS: 'users_fetching'
      }
    },
    login_page: {
      on: {
        LOGIN: 'login_initiated',
        SIGN_UP: 'sign_up',
        HOME: 'home'
      }
    },
    login_initiated: {
      invoke: {
        id: 'loginInvoke',
        src: 'loginService',
        onDone: {
          target: 'signed_in',
          actions: [
            (context,event) => {
              localStorage.setItem('user',JSON.stringify(event.data.data))
              message.success("You have logged in succesfully.",2)
            },
            assign({
              currentUser: (context,event) => event.data.data
            })
          ]
        },
        onError: {
          target: 'login_page',
          actions: (context,event) => message.error(event.data.message,2)
        }
      },
      on: {
        SIGNED_IN: {
          target: 'signed_in',
          actions: assign({
            currentUser: (context) => AuthService.getCurrentUser()
          })
        }
      }
    },
    sign_up: {
      on: {
        REGISTER: 'register_user',
        LOGIN_PAGE: 'login_page',
        HOME: 'home'
      }
    },
    register_user: {
      invoke: {
        id: 'register-user',
        src: 'registerUser',
        onDone: {
          target: 'signed_in',
          actions: assign({
            currentUser: (context,event) => {
              message.success('User registred with success',2)
              localStorage.setItem('user',JSON.stringify(event.data.data))
              return event.data.data
            }
          })
        },
        onError: {
          target: 'sign_up',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    timezones_fetching: {
      invoke: {
        id: 'fetch-timezones',
        src: 'fetchTimeZones',
        onDone: {
          target: 'timezones',
          actions: assign({
            timezones: (context,event) => event.data.data
          })
        },
        onError: {
          target: 'home',
          actions: () => message.error('There was an error fetching the timezones',2)
        }
      }
    },
    timezones: {
      on: {
        ADD_TIMEZONE: 'timezones_add_timezone',
        LOG_OUT: {
          target: 'home',
          actions: 'logOut'
        },
        HOME: 'home',
        USERS: 'users_fetching',
        MODIFY_TIMEZONE: 'timezones_modify_timezone',
        DELETE_TIMEZONE: 'timezones_delete_timezone'
      }
    },
    timezones_add_timezone: {
      invoke: {
        id: 'timezones_add_timezone',
        src: 'addTimeZone',
        onDone: {
          target: 'timezones_fetching',
          actions: () => message.success('Timezone added succesfully',2)
        },
        onError: {
          target: 'timezones',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    timezones_modify_timezone: {
      invoke: {
        id: 'timezones_modify_timezone',
        src: 'modifyTimeZone',
        onDone: {
          target: 'timezones_fetching',
          actions: () => message.success('Timezone modified succesfully',2)
        },
        onError: {
          target: 'timezones',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    timezones_delete_timezone:{
      invoke: {
        id: 'timezones_delete_timezone',
        src: 'deleteTimezone',
        onDone: {
          target: 'timezones_fetching',
          actions: () => message.success('Timezone deleted succesfully',2)
        },
        onError: {
          target: 'timezones',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    timezones_error: { 
      on: {
        HOME: 'home',
        LOG_OUT: {
          target: 'home',
          actions: 'logOut'
        },
        TIMEZONES: 'timezones_fetching'
      }
    },
    users_fetching: {
      invoke: {
        id: 'fetch_users',
        src: 'fetchUsers',
        onDone: {
          target: 'users',
          actions: assign({
            users: (context,event) => {
              return event.data.data
            }
          })
        },
        onError: {
          target: 'home',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    users: {
      on: {
        HOME: 'home',
        LOG_OUT: {
          target: 'home',
          actions: 'logOut'
        },
        DELETE_USER: 'users_delete_user',
        MODIFY_USER: 'users_modify_user',
        OPEN_ZONES_FOR_USER: 'timezones_fetching',
        ADD_USER: 'users_add_user'
      }
    },
    users_delete_user: {
      invoke: {
        id: 'delete-user',
        src: 'deleteUser',
        onDone: {
          target: 'users_fetching',
          actions: () => message.success("The user was deleted successfully.",2)
        },
        onError: {
          target: 'users',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    users_modify_user: {
      invoke: {
        id: 'modify-user',
        src: 'modifyUser',
        onDone: {
          target: 'users_fetching',
          actions:() => message.success("The user has been modified successfully",2)
        },
        onError: {
          target: 'users',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    users_add_user: {
      invoke: {
        id: 'add-user',
        src: 'addUser',
        onDone: {
          target: 'users_fetching',
          actions:() => message.success("The user has been added successfully",2)
        },
        onError: {
          target: 'users',
          actions: (context,event) => message.error(event.data.response.data.message,2)
        }
      }
    },
    users_error: {
    
    }
  }
},{
  actions: {
    logOut: assign({
        currentUser: (context)=> {
          AuthService.logout()
          message.success('You have logged out succesfully.',2)
          return undefined
        }
      })
  },
  services: {
    authenticateUser:(context)=> {
      return AuthService.checkIfUserIsLoggedIn(AuthService.getCurrentUser().username)
    },
    loginService: (context,event) =>  {
      
      return AuthService.login((event as LoginEvent).payload.userName,(event as LoginEvent).payload.password);
    },
    fetchTimeZones: (context,event) => {
      console.log(event,localStorage.getItem('userIdForZone'))
      return TimezonesService.getTimezones((event as OpenZonesForUserEvent).payload ? (event as OpenZonesForUserEvent).payload.id : ( localStorage.getItem('userIdForZone') ? Number(localStorage.getItem('userIdForZone')) : authService.getCurrentUserId()));
    },
    addTimeZone: (context,event) => {
      return TimezonesService.addTimezone((event as AddTimezoneEvent).payload.name,(event as AddTimezoneEvent).payload.timezone,(event as AddTimezoneEvent).payload.gmt,(event as AddTimezoneEvent).payload.id);
    },
    modifyTimeZone:(context,event)=>{
      return TimezonesService.modifyTimezone((event as ModifyTimezoneEvent).payload.name,(event as ModifyTimezoneEvent).payload.timezone,(event as ModifyTimezoneEvent).payload.gmt,(event as ModifyTimezoneEvent).payload.id);
    },
    deleteTimezone:(contex,event)=> {
      return TimezonesService.deleteTimezone((event as DeleteTimezoneEvent).payload.id)
    },
    registerUser: (context,event) => {
      return AuthService.register((event as RegisterEvent).payload.username,(event as RegisterEvent).payload.email,(event as RegisterEvent).payload.password);
    },
    fetchUsers:(context,event) => {
      return userService.getUsers();
    },
    deleteUser:(context,event) => {
      return userService.deleteUser((event as DeleteUserEvent).payload.id);
    },
    modifyUser:(context,event) => {
      return userService.modifyUser((event as ModifyUserEvent).payload);
    },
    addUser:(context,event) => {
      return userService.addUser((event as AddUserEvent).payload);
    }
  }
})