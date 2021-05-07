import React, { Component } from 'react';
import GlobalContext from './GlobalContext'
import Routes from './components/Routes/Routes';
import './App.css';
import {getLocalStorageItem} from './util.js'

class App extends Component {

    state = { 
        theme : getLocalStorageItem('theme', 'light'),
        language : getLocalStorageItem('language', 'latin'),
        isLogged : false,
        isAdmin : false,

        setTheme : (theme) => {
            this.setState({
                theme : theme
            })
            global.window.localStorage.setItem('theme', theme);
        },

        setLanguage : (language) => {
            this.setState({
                language : language
            })
            global.window.localStorage.setItem('language', language);
        },

        setIsLogged : (isLogged) => {
            console.log('ISLOGGED CALLED', isLogged)
            this.setState({
                isLogged : isLogged
            })
        },

        setIsAdmin : (isAdmin) => {
            this.setState({
                isAdmin : isAdmin
            })
        }
     }


    render() { 
        return ( 
            <GlobalContext.Provider value={this.state}>
                <div className={`main-wrapper-${this.state.theme}`}>
                    <Routes />
                </div>
            </GlobalContext.Provider>
         );
    }
}
 
export default App;