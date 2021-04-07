import React, { Component } from 'react';
import GlobalContext from './GlobalContext'
import Routes from './components/Routes/Routes';
class App extends Component {
    state = { 
        theme : 'Svijetla',
        language : 'Latinica',
        isLogged : false,
        isAdmin : false,

        setTheme : (theme) => {
            this.setState({
                theme : theme
            })
        },

        setLanguage : (language) => {
            this.setState({
                language : language
            })
        },

        setIsLogged : (isLogged) => {
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