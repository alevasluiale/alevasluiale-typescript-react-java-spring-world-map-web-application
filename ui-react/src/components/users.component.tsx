import React, {useState} from "react";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import {Modal,Button} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { UserInfo } from "../models/UserInfo";
import {Formik,Form,Field,ErrorMessage} from 'formik';
import * as Yup from 'yup';
import authService from "../services/auth.service";


export interface ModifyUserProps {
  id: number
  username: string
  password: string
  email: string
  role: string
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: "10px auto",
    maxWidth: 800,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));
const Users: React.FC<{
  users?: [UserInfo]
   deleteUser: (id:number) => void
   modifyUser: (values:ModifyUserProps) => void
   addUser: (values:ModifyUserProps) => void
   openZonesForUser:(id:number,username: string) => void
  }> = ({users,deleteUser,modifyUser,addUser,openZonesForUser}) => {

  const classes = useStyles();

  const [modify,setModify] = useState({
    visible: false,
    id: 0,
    email: '',
    password: '',
    role: '',
    name: ''
  })

  return (
    <div className={classes.root}>
      <Formik 
        initialValues= {{
          id: 0,
          username: '',
          password: '',
          email: '',
          role: ''
        }}
        validationSchema={
          Yup.object().shape({
            username: Yup.string().required("Required"),
            email: Yup.string().email("Must be a valid email").required("Required"),
            role: Yup.string().required("Required"),
            password: Yup.string().min(6,"Password needs to have at least 6 characters").required('Required')
          })
        }
        onSubmit={(values)=> addUser(values)}
      >
        { props => (
            <Form id="addForm" className="unselectable">
              <Paper key="addUser" className={classes.paper}>
                <Grid container spacing={2} className="pb-4 unselectable">
                  <Grid item className="my-auto">
                    <ButtonBase className={classes.image}>
                      <img className={classes.img} alt="complex" src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/bear-face.png" />
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          <div className="form-group">
                            <Field placeholder="Username" className="form-control mb-1" name="username"/>
                            <ErrorMessage className="alert alert-danger" name="username"/>
                          </div>
                          <div className="form-group">
                            <Field placeholder="Email" className="form-control mb-1" name="email"/>
                            <ErrorMessage className="alert alert-danger" name="email"/>
                          </div>
                          <div className="form-group">
                            <select
                             placeholder="Role"
                              className="form-control mb-3 border"
                              onChange={e => props.setFieldValue('role',e.target.value)}
                              value = {props.values.role}
                            > 
                              <option value="" disabled>Role</option>
                              <option value="ROLE_USER">Normal user</option>
                              <option value="ROLE_USER_MANAGER"> User manager</option>
                              <option value="ROLE_ADMIN">Admin</option>
                            </select>
                            <ErrorMessage className="alert alert-danger" name="role"/>
                          </div>
                          <div className="form-group">
                            <Field placeholder="Password" className="form-control" name="password" component="input" type="password"/>
                            <ErrorMessage className="alert alert-danger" name="password"/>
                          </div>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item className="mx-4 my-auto">
                      <Typography variant="subtitle1">
                        <Button
                          form="addForm" key="submit" htmlType="submit"
                          shape="round" type="primary" style={{background: 'green'}}>Add user</Button>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Form>
          )}
      </Formik>
      {users?.map(user => (
      <Paper key={user.id} className={classes.paper}>
        <Grid container spacing={2} className="pb-4 unselectable">
          <Grid item  className="my-auto unselectable">
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src="https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/bear-face.png" />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  <span className="usernameText">{user.username}</span>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.roles[0].name}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  <Button className="mr-4" shape="round" type="primary" style={{color: 'black'}} danger onClick={e => deleteUser(user.id)}>Remove</Button>
                  <Button className="mr-4" shape="round" type="primary" onClick={e => setModify({
                    visible: true,
                    id:user.id,
                    name:user.username,
                    email: user.email,
                    role: user.roles[0].name,
                    password: ''
                    })}>Modify</Button>
                  {
                  authService.getCurrentUser().roles[0] === "ROLE_ADMIN" ?
                  <Button shape="round" type="primary" style={{background: 'green'}} onClick={e => openZonesForUser(user.id,user.username)}>
                    Zones</Button> : null }
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">
                <span className="emailText">
                  {user.email}
                </span>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>))}
      <Modal
        title={'Modify user '+ modify.name}
        visible={modify.visible}
        footer={[
          <Button key="cancel" onClick={e=> setModify({
            id: 0,
            name: '',
            visible:false,
            email: '',
            role: '',
            password: ''
          })}>
              Cancel
          </Button>,
          <Button type="primary" form="modifyForm" key="submit" htmlType="submit">
              Submit
          </Button>
          ]}
      >
        <Formik 
          initialValues= {{
            id: modify.id,
            username: modify.name,
            password: '',
            email: modify.email,
            role: modify.role
          }}
          validationSchema={
            Yup.object().shape({
              username: Yup.string().required("Required"),
              email: Yup.string().email("Must be a valid email").required("Required"),
              role: Yup.string().required("Required")
            })
          }
          onSubmit={(values)=> modifyUser(values)}
        >
          { props => (
            <Form id="modifyForm">
              <div className="form-group">
                <label>Username</label>
                <Field className="form-control mb-3" name="username"/>
                <ErrorMessage className="alert alert-danger" name="username"/>
              </div>
              <div className="form-group">
                <label>Email</label>
                <Field className="form-control mb-3" name="email"/>
                <ErrorMessage className="alert alert-danger" name="email"/>
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  className="form-control mb-3 border"
                  onChange={e => props.setFieldValue('role',e.target.value)}
                  value = {props.values.role}
                >
                  <option value="ROLE_USER">Normal user</option>
                  <option value="ROLE_USER_MANAGER"> User manager</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
                <ErrorMessage className="alert alert-danger" name="role"/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field placeholder="Leave blank if it should remain the same" className="form-control" name="password" component="input" type="password"/>
                <ErrorMessage className="alert alert-danger" name="password"/>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </div>
  )
}

export default Users