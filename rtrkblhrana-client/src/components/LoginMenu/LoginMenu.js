import React, { Component } from 'react';
import axios from 'axios';
import {DATA_SERVER} from '../../config';
import Cookies from 'js-cookie';
import './LoginMenu.css';
import GlobalContext from '../../GlobalContext';

class LoginMenu extends Component {
    state = { 
        email:"",
        password:"",
        credentialsInvalid : false
     }

     componentDidMount(){
         this.context.setIsLogged(false);
     }

     
     handleEmailChange=(event)=>{
        this.setState({
            email:event.target.value
        })
     }
     handlePasswordChange=(event)=>{
        this.setState({
            password:event.target.value
        })
     }
     login=()=>{
         let data = JSON.stringify({
             email: this.state.email,
             password: this.state.password
         })
         axios.post("/user/login", data, {
             headers:{
                 'Content-type' : 'application/json'
             }
         })
         .then(response=>{
             this.setState({
                credentialsInvalid : false
             })
             if(response.status==200){
                this.context.setIsLogged(true);
                this.props.history.push('/order');
             }
         }).catch(err=>{
            this.setState({
                credentialsInvalid : true
             })
             console.log(err)
         })
     }

     componentDidMount(){
         let authCookie = Cookies.get('auth');
         if(authCookie){
             this.login();
         }
     }

    render() { 
        return ( 
            <div id="mainWrapper">
                <form id="mainForm" className={`mainForm-${this.context.theme}`} method="POST" action={DATA_SERVER+"/user/login"} onSubmit={e => { e.preventDefault(); }}>
                    <label className={`loginLabel global-text-${this.context.theme}`} htmlFor="email">E-mail:</label>
                    <input className="loginInput" placeholder="E-mail" type="text" name="email" value={this.state.email} onChange={this.handleEmailChange}></input> 
                    <label className={`loginLabel global-text-${this.context.theme}`} htmlFor="password">Lozinka:</label>
                    <input className="loginInput" placeholder="Password" type="password" name="password" value={this.state.password} onChange={this.handlePasswordChange}></input>
                    <button className={`loginButton loginButton-${this.context.theme} btn btn-block`} onClick={this.login}>Login</button>
                    {
                        this.state.credentialsInvalid? <label className={`invalidCredentialsLabel-${this.context.theme}`}>Ne postoji korisnik sa takvim kredencijalima.</label> : null
                    }
                </form>
            </div>
         );
    }
}
 
LoginMenu.contextType = GlobalContext;
export default LoginMenu;