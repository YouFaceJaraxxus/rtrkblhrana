import React, { Component } from 'react';
import Cookies from 'js-cookie';
import * as util from '../../util';
import axios from 'axios';
import GlobalContext from '../../GlobalContext';
import './WelcomeComponent.css';

class WelcomeComponent extends Component {
    state = {  }

    

    loginWithCookie=()=>{
        axios.post("/user/login", {})
        .then(response=>{
            if(response.status==200){
               this.props.history.push('/order');
               this.context.setIsLogged(true);
            }
            else{
                this.context.setIsLogged(false);
                this.props.history.push('/login');
            }
        }).catch(err=>{
            this.context.setIsLogged(false);
            console.log(err)
        })
    }
    componentDidMount(){
        let authCookie = Cookies.get('auth');
        if(authCookie){
            console.log('auth is there', authCookie);
            util.loginWithCookie(this.context, this.props.history, '/order')
        }else{
            
            console.log('auth is undefined');
            this.props.history.push('/login');
        }
    }

    render() { 
        return ( 
            <div className="center-image">
                <img src="./rt-rk_logo_large.png"></img>
            </div>
        );
    }
}

WelcomeComponent.contextType = GlobalContext;
export default WelcomeComponent;