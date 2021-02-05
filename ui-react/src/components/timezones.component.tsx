import TimezoneMapGL from './timezone-map-gl'
import {Provider} from './context'
import timezoneTopoJSON from '../data/timezoneTopo.json'
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { ChangeEvent, useState,useEffect } from "react";
import { Formik, Field, Form,ErrorMessage} from "formik";
import DateTime from 'luxon';
import { Timezone } from '../models/Timezone';
import {SizeMe} from 'react-sizeme';
import {Modal,Button} from 'antd';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import * as Yup from 'yup';
import Select,{ValueType} from 'react-select'
import timezoneMeta from 'moment-timezone/data/meta/latest.json'
import Clock from 'react-clock'
import {confirmAlert} from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import 'react-clock/dist/Clock.css';
import moment from 'moment-timezone';

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
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaHVodXJlem1hcml1cyIsImEiOiJja2hpajl1NGsxZDhtMnpvNHc5eG05b2Q0In0.5dmqX2D4zV0Xa1rW7TrCzg';

const zoneKeys = Object.keys(timezoneMeta.zones).sort();



const timezoneOptions = zoneKeys.map((zoneKey: string) => {
  const timezone = zoneKey
  return {
    label: timezone,
    value: timezone,
  };
});

type OptionType = { label: string; value: string };

const TimeZones: React.FC<{
  timezones?: [Timezone]
  onAddTimezone: (
    name: string,
    timezone: string,
    gmt: string
  ) => void
  onModifyTimezone: (
    name: string,
    timezone: string,
    gmt: string,
    id: number
  ) => void
  onDeleteTimezone:(id:number) => void,
  username?: string
}> = ({
  timezones,
  onAddTimezone,
  onModifyTimezone,
  onDeleteTimezone,
  username
}) =>  {

  const [mapVisible,setMapVisible] = useState(false)
  const [isModify,setIsModify] = useState(false)
  const [currentTimezone,setCurrrentTimezone] = useState('')
  const [currentName,setCurrentName] = useState('')
  const [currentId,setCurrentId] = useState(0)

  
  const [date, setDate] = useState(new Date());

  const classes = useStyles();
  
  useEffect(() => {
    const interval = setInterval(
      () => setDate(new Date()),
      1000
    );
 
    return () => {
      clearInterval(interval);
    }
  }, []);

    return (
      <div className={classes.root}>
        {username? <Grid item xs className="mx-auto">
          <span>{'Timezones for user '+ username} </span>
        </Grid> : null}

        <Formik 
        enableReinitialize={true}
        initialValues= {{
          name: isModify ? currentName : '',
          timezone: isModify ? currentTimezone : Intl.DateTimeFormat().resolvedOptions().timeZone,
          gmt: Intl.DateTimeFormat().resolvedOptions().timeZone,
          id: isModify ? currentId : 0
        }}
        validationSchema={
          Yup.object().shape({
            name: Yup.string().required("Required"),
            timezone: Yup.string().required("Required"),
            
          })
        }
        onSubmit={(values)=> isModify ? onModifyTimezone(values.name,values.timezone,values.gmt,values.id) : onAddTimezone(values.name,values.timezone,values.gmt)}
      >
        { props => (
            <Form id="addForm">
              <Paper key="addTimeZone" className={classes.paper}>
                <Grid container spacing={2} className="pb-4 unselectable">
                  <Grid item className="my-auto unselectable">
                    <ButtonBase className={classes.image + ' unselectable'}>
                      <img 
                        title="Click to open map"
                        onClick={e => setMapVisible(true)}
                        className={classes.img+' unselectable'} alt="complex" src="data:image/png;base64,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" />
                    </ButtonBase>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid  className="my-auto" item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          <div className="form-group">
                            <Field placeholder="Name" className="form-control mb-1" name="name"/>
                            <ErrorMessage className="alert alert-danger" name="name"/>
                          </div>
                          <div className="form-group">
                          <Select
                            onChange={(option: ValueType<OptionType>) => {
                              const value = (option as OptionType).value;
                              props.setFieldValue("timezone",value)
                              props.setFieldValue("gmt",value)
                            }}
                            value={{value:props.values.timezone,label:props.values.timezone}}
                            name="timezone"
                            options={timezoneOptions}
                          />
                            <ErrorMessage className="alert alert-danger" name="timezone"/>
                          </div>
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item className="mx-4 my-auto pb-4">
                      <Typography variant="subtitle1">
                        <Button
                        className="mb-4"
                          form="addForm" key="submit" htmlType="submit"
                          shape="round" type="primary" style={{background: isModify? 'blue' :'green'}}>{
                            isModify? 'Modify timezone' : 'Add timezone'
                            }</Button>
                        {isModify ? <div>
                          <Button shape="round" type="primary" style={{background: 'red'}} onClick={e=>setIsModify(false)}>
                            Cancel modify
                          </Button></div>: null}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              <Modal
                title={'Select timezone on map '}
                visible={mapVisible}
                width={760}
                onCancel={e => setMapVisible(false)}
                footer={[
                  <Button key="cancel" onClick={e=> setMapVisible(false)}>
                      Cancel
                  </Button>
                  ]}
              >
                <div className="mx-auto">
                <Provider value={timezoneTopoJSON}>
                        <SizeMe>
                          {({size}) => (<TimezoneMapGL
                          className="mx-auto"
                          timezone={props.values.timezone }
                          mapboxApiAccessToken={MAPBOX_TOKEN}
                          onTimezoneClick={(event:ChangeEvent,timezone:String,dt: DateTime.DateTime)=> {
                              props.setFieldValue("timezone",timezone)
                              props.setFieldValue("gmt",dt.offsetNameLong)
                              setMapVisible(false)
                            }
                          }
                          defaultViewport={{
                            width: 700,
                            height: 700 / 27 * 14,
                            zoom: 1,
                          }}
                        />)}
                        </SizeMe>
                </Provider>
                </div>
              </Modal>
            </Form>
          )}
      </Formik>
      { timezones?.map( (timezone) => (
              <Paper key={timezone.name} className={classes.paper}>
                <Grid container spacing={2} className="unselectable">
                  <Grid item className="mx-10 unselectable">
                    <ButtonBase className={'pb-2 unselectable'}>
                      <Clock key={timezone.zoneName} className="mx-auto my-auto" renderHourMarks={true} renderMinuteMarks={true} renderNumbers={true} 
                      value={
                        moment.tz(date.toString(),timezone.zoneName).format("HH:MM:ss a")
                      }></Clock>  
                    </ButtonBase>
                    <div className="mx-10 unselectable">
                      <span className="mx-auto my-auto clockText">
                        &nbsp;&nbsp;&nbsp;
                        {moment.tz(date.toString(),timezone.zoneName).format("HH:MM:ss a")}

                      </span>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm container>
                    <Grid  className="pb-20" item xs container direction="column" spacing={2}>
                      <Grid item xs>
                        <Typography gutterBottom variant="subtitle1">
                          <span className="usernameText">{timezone.name}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography className="my-auto" variant="body2" color="textSecondary">
                            <span className="emailText">{timezone.zoneName}</span>
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography className="my-auto" variant="body2" color="textSecondary">
                            <span className="clockText">{'Browser time: '}</span> 
                            <div>
                              <span className="clockText">
                                {Intl.DateTimeFormat('en-US', {
                                  hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(date)}
                              </span>
                            </div>
                        </Typography>
                      </Grid>
                      
                    </Grid>
                    <Grid item className="mx-4 my-auto mb-4">
                      <Typography variant="subtitle1">
                        <Button className="mb-4"
                          shape="round" type="primary" onClick={e => {
                            setIsModify(true)
                            setCurrentName(timezone.name)
                            setCurrrentTimezone(timezone.zoneName)
                            setCurrentId(timezone.id)
                            window.scrollTo(0,0)
                          }} >Modify</Button>
                        <div>
                          <Button shape="round" type="primary" style={{background: 'red'}} onClick={e=>{
                            confirmAlert({
                              title: 'Confirm delete',
                              message: 'Are you sure you want to delete timezone?',
                              buttons: [
                                {
                                  label: 'Yes',
                                  onClick: () => onDeleteTimezone(timezone.id)
                                },
                                {
                                  label: 'No',
                                  onClick: () => {}
                                }
                              ]
                            });
                          }}>
                            Delete
                          </Button>
                        </div>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
      ))}

      </div>
    )
}

export default TimeZones