import React, { Component } from 'react';
import GlobalContext from './GlobalContext'
import Routes from './components/Routes/Routes';
class App extends Component {
    state = { 
        theme : 'light',
        language : 'cyrillic'
     }
    render() { 
        return ( 
            <GlobalContext.Provider value={this.state}>
                <Routes />
            </GlobalContext.Provider>
         );
    }
}
 
export default App;