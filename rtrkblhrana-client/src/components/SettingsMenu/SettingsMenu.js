import React, { Component } from 'react';
import './SettingsMenu.css';
import GlobalContext from '../../GlobalContext';
import axios from 'axios';
import {DATA_SERVER} from '../../config';
import {setLocalStorageItem, getLocalStorageItem, mapLoaderTheme} from '../../util';
import ClipLoader from 'react-spinners/ClipLoader';

class SettingsMenu extends Component {
    state = { 
        orderReminderSelected : false,
        sendOrderSelected : false,
        times : null,
        locations : null,
        oldPassword : "",
        newPassword : "",
        newPasswordRepeat : "",
        selectedLocationId : null,
        selectedTimeId : null,
        loadingAll : true
    }

    componentDidMount(){
        axios.get('/user/settings/emailPreferences')
        .then(response => {
            this.setState({
                orderReminderSelected : response.data.sendForgotOrderEmail == 1? true : false,
                sendOrderSelected : response.data.sendOrderEmail ==1? true : false
            })
        })
        axios.get('/location', {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    locations : response.data
                })
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })

        axios.get('/time', {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    times : response.data,
                    loadingAll : false
                })
                this.context.setIsLogged(true);
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })

        let defaultLocation = getLocalStorageItem('defaultLocation', 1);
        let defaultTime = getLocalStorageItem('defaultTime', 1);
        this.setState({
            selectedLocationId : defaultLocation,
            selectedTimeId : defaultTime
        })
    }

    toggleOrderReminder = () => {
        this.setState({
            orderReminderSelected : !this.state.orderReminderSelected
        })
    }

    toggleSendOrder = () => {
        this.setState({
            sendOrderSelected : !this.state.sendOrderSelected
        })
    }

    toggleSelectedLocation = (event) =>{
        console.log('location', event.target.value)
        this.setState({
            selectedLocationId : event.target.value
        })
    }

    toggleSelectedTime = (event) =>{
        console.log('time', event.target.value)
        this.setState({
            selectedTimeId : event.target.value
        })
    }

    mapLocations = () =>{
        return (
            this.state.locations&&this.state.locations.length>0?
                this.state.locations.map((item, index)=>{
                    return(
                        <div key={item.id} className="settings-radio-row">
                            <input type="radio" id={`location-${item.id}`} name="location" value={item.id} checked={this.state.selectedLocationId==item.id} onChange={this.toggleSelectedLocation}/>
                            <label htmlFor={`location-${item.id}`} className={`settings-radio-label global-text-${this.context.theme}`}>{item.name}</label>
                        </div>
                    )
                })
            :
            <ClipLoader color={mapLoaderTheme(this.context.theme)} loading={this.state.loadingAll} size={100} />
        )
    }

    mapTimes = () =>{
        return (
            this.state.times&&this.state.times.length>0?
                    this.state.times.map((item, index)=>{
                        return(
                            <div key={item.id} className="settings-radio-row">
                                <input type="radio" id={`time-${item.id}`} name="time" value={item.id} checked={this.state.selectedTimeId==item.id} onChange={this.toggleSelectedTime}/>
                                <label htmlFor={`time-${item.id}`} className={`settings-radio-label global-text-${this.context.theme}`}>{item.chosenTime}</label>
                            </div>
                        )
                    })
            :
            <ClipLoader color={mapLoaderTheme(this.context.theme)} loading={this.state.loadingAll} size={100} />
        )
    }

    handleOldPasswordChange=(event)=>{
        this.setState({
            oldPassword:event.target.value
        })
     }
     handleNewPasswordChange=(event)=>{
        this.setState({
            newPassword:event.target.value
        })
     }

     handleNewPasswordRepeatChange=(event)=>{
        this.setState({
            newPasswordRepeat:event.target.value
        })
     }

     acceptSettings = () => {
        setLocalStorageItem('defaultLocation', this.state.selectedLocationId);
        setLocalStorageItem('defaultTime', this.state.selectedTimeId);
        let emailPreferencesRequestBody = {
            sendOrderEmail : this.state.sendOrderSelected? 1 : 0,
            sendForgotOrderEmail : this.state.orderReminderSelected? 1 : 0
        };
        console.log('emailPreferencesRequestBody', emailPreferencesRequestBody);
        axios.post('/user/settings/emailPreferences', JSON.stringify(emailPreferencesRequestBody), {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                console.log(response.data);
            }
        }).catch(error=>{
            this.context.setIsLogged(false);
            console.log(error);
            this.props.history.push('/');
        })
     }

     changePassword = () => {

     }

    render() { 
        return ( 
            <div>
                 <div className={`title global-text-${this.context.theme}`}>
                    Podešavanja
                </div>
                <div className={`main-settings-wrapper global-background-${this.context.theme}`}>
                    <div className="settings-half">
                        <div className="settings-block">
                            <div className={`settings-title global-text-${this.context.theme}`}>
                                E-mail obavještenja:
                            </div>
                            <div className="settings-row">
                                <div>
                                    <input className="settings-checkbox" id='order-reminder' checked={this.state.orderReminderSelected} type="checkbox" onChange={this.toggleOrderReminder}></input>
                                    <label className = {`settings-checkbox-label global-text-${this.context.theme}`} htmlFor='order-reminder'>Podsjeti me da poručim hranu</label>
                                </div>
                                <div>
                                    <input className="settings-checkbox" id='order-send-choice' checked={this.state.sendOrderSelected} type="checkbox" onChange={this.toggleSendOrder}></input>
                                    <label className = {`settings-checkbox-label global-text-${this.context.theme}`} htmlFor='order-send-choice'>Pošalji moj odabir na mail.</label>
                                </div>
                            </div>
                        </div>
                        <div className="settings-block">
                            <div className={`settings-title global-text-${this.context.theme}`}>
                                Termin:
                            </div>
                            <div className="settings-row">
                                {this.mapTimes()}
                            </div>
                        </div>
                        <div className="settings-block">
                            <div className={`settings-title global-text-${this.context.theme}`}>
                                Lokacija:
                            </div>
                            <div className="settings-row">
                                {this.mapLocations()}
                            </div>
                        </div>
                        <div className="settings-block">
                            <div className="settings-row">
                            <button className={`settings-button settings-button-${this.context.theme} btn`} onClick={this.acceptSettings}>Prihvati</button>
                            </div>
                        </div>
                    </div>
                    <div className="settings-half">
                        <div className="settings-block">
                            <div className={`settings-title global-text-${this.context.theme}`}>
                                Promjena lozinke:
                            </div>
                            <form id="settings-form" method="POST" action={DATA_SERVER+"/user/settings/password"} onSubmit={e => { e.preventDefault(); }}>
                                <label className={`settings-label global-text-${this.context.theme}`} htmlFor="old-password">Stara lozinka:</label>
                                <input className="settings-input" placeholder="Stara lozinka" type="text" name="old-password" value={this.state.oldPassword} onChange={this.handleOldPasswordChange}></input> 
                                <label className={`settings-label global-text-${this.context.theme}`} htmlFor="new-password">Nova lozinka:</label>
                                <input className="settings-input" placeholder="Nova lozinka" type="password" name="new-password" value={this.state.newPassword} onChange={this.handleNewPasswordChange}></input>
                                <label className={`settings-label global-text-${this.context.theme}`} htmlFor="new-password-repeat">Ponovi novu lozinku:</label>
                                <input className="settings-input" placeholder="Ponovi novu lozinku" type="password" name="new-password-repeat" value={this.state.newPasswordRepeat} onChange={this.handleNewPasswordRepeatChange}></input>
                                <button className={`settings-button settings-button-${this.context.theme} btn`} onClick={this.changePassword}>Prihvati</button>
                                {
                                    this.state.credentialsInvalid? <label className={`invalid-credentials-label-${this.context.theme}`}>{this.state.errorMessage}</label> : null
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
         );
    }
}

SettingsMenu.contextType = GlobalContext;
export default SettingsMenu;