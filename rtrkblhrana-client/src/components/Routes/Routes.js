import React, { Component } from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import LoginMenu from '../LoginMenu/LoginMenu';
import FoodMenu from '../FoodMenu/FoodMenu';
import SettingsMenu from '../SettingsMenu/SettingsMenu';
import AdminMenu from '../AdminMenu/AdminMenu';
import HeaderComponent from '../HeaderComponent/HeaderComponent';
import WelcomeComponent from '../WelcomeComponent/WelcomeComponent';
import OrderList from '../OrderList/OrderList';
import { withRouter } from 'react-router';

class Routes extends Component {
    state = { 
        loggedIn : false
     }
    render() { 
        return ( 
            <BrowserRouter>
                <HeaderComponent></HeaderComponent>
                <Switch>
                    <Route exact path="/" component={WelcomeComponent}/>
                    <Route exact path="/login" component={LoginMenu}/>
                    <Route exact path="/order" component={FoodMenu}/>
                    <Route exact path="/orders" component={OrderList}/>
                    <Route exact path="/settings" component={SettingsMenu}/>
                    <Route exact path="/admin" component={AdminMenu}/>
                    <Route path="*" component={WelcomeComponent}/>
                </Switch>
            </BrowserRouter>
         );
    }
}
 
export default Routes;