import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import LoginMenu from '../LoginMenu/LoginMenu';
import FoodMenu from '../FoodMenu/FoodMenu';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import AdminMenu from '../AdminMenu/AdminMenu';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import WelcomeComponent from '../WelcomeComponent/WelcomeComponent';

class Routes extends Component {
    state = { 
        loggedIn : false
     }
    render() { 
        return ( 
            <BrowserRouter>
                <HeaderComponent></HeaderComponent>
                <Switch>
                    <Route exact path="/" exact component={WelcomeComponent}/>
                    <Route exact path="/login" exact component={LoginMenu}/>
                    <Route exact path="/order" exact component={FoodMenu}/>
                    <Route exact path="/settings" exact component={SettingsMenu}/>
                    <Route exact path="/admin" exact component={AdminMenu}/>
                </Switch>
            </BrowserRouter>
         );
    }
}
 
export default Routes;