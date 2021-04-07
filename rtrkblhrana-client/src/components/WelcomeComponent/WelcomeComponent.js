import React, { Component } from 'react';
import Cookies from 'js-cookie';
import * as util from '../../util';
import axios from 'axios';
import GlobalContext from '../../GlobalContext';

class WelcomeComponent extends Component {
    state = {  }

    

    loginWithCookie=(context, history, nextRoute)=>{
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
            util.loginWithCookie(this.context, this.props.history, '/order')
        }else this.props.history.push('/login');
    }

    render() { 
        return ( 
            <div>
                <img src="./rt-rk_logo_large.png"></img>
            </div>
        );
    }
}

WelcomeComponent.contextType = GlobalContext;
export default WelcomeComponent;