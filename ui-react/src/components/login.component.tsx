import React from "react";
import {Formik,Field,Form, ErrorMessage} from "formik";
import * as Yup from 'yup';


interface LoginProps {
  onLogin: (userName: string, password: string) => void
}
const Login: React.FC<LoginProps> = ({onLogin}) => {

    return (
      <div className="col-md-4 align-items-center">
        <Formik 
          initialValues= {{
            userName: '',
            password: ''
          }}
          validationSchema= {
            Yup.object().shape({
              userName: Yup.string().required('Required'),
              password: Yup.string().required('Required'),
            })
          }
          onSubmit= {(values) => {
              onLogin(values.userName,values.password);
          }}
        >
          {({errors,touched}) => (
            <Form>
              <div className="form-group">
                <label>Username</label>
                <Field className="form-control mb-3" name="userName"/>
                <ErrorMessage className="alert alert-danger" name="userName"/>
              </div>
              <div className="form-group">
                <label>Password</label>
                <Field className="form-control" name="password" component="input" type="password"/>
                <ErrorMessage className="alert alert-danger" name="password"/>
              </div>

              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  type="submit"
                >
                  <span>Login</span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
}

export default Login
