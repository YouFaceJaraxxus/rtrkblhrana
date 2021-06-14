import React, { Component } from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import GlobalContext from '../../GlobalContext';
import { withRouter } from 'react-router';

class HeaderComponent extends Component {
    state = {  }

    handleLanguageChange = (newLanguage) =>{
        this.context.setLanguage(newLanguage);
    }

    handleThemeChange = (newTheme) =>{
        this.context.setTheme(newTheme);
    }

    logout = ()=> {
        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        this.context.setIsLogged(false);
        this.props.history.push('/login');
    }

    render() { 
        console.log(this.context.isLogged);
        return (
            <div>
                <Navbar bg={this.context.theme} variant={this.context.theme} expand="lg">
                    <Navbar.Brand>
                        <LinkContainer to="/order">
                            <Nav.Link>
                                <img src="favicon.ico"></img>
                            </Nav.Link>
                        </LinkContainer>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/order">
                                <Nav.Link>Naručivanje hrane</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/orders">
                                <Nav.Link>Moje narudžbe</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/settings">
                                <Nav.Link>Podešavanja</Nav.Link>
                            </LinkContainer>
                            <NavDropdown variant={this.context.theme} title='Jezik' id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={()=>this.handleLanguageChange('latin')}>Latinica</NavDropdown.Item>
                                <NavDropdown.Item onClick={()=>this.handleLanguageChange('cyrillic')}>Ћирилица</NavDropdown.Item>
                            </NavDropdown>
                            <NavDropdown variant={this.context.theme} title='Tema' id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={()=>this.handleThemeChange('light')}>Svijetla</NavDropdown.Item>
                                <NavDropdown.Item onClick={()=>this.handleThemeChange('dark')}>Tamna</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                    <Nav variant={this.context.theme}>
                        {
                            this.context.isLogged?

                            <Nav.Link variant={this.context.theme} onClick={this.logout}>Odjavi se</Nav.Link>

                            :

                            <LinkContainer to="/login">
                                <Nav.Link variant={this.context.theme}>Prijavi se</Nav.Link>
                            </LinkContainer>

                        }
                    </Nav>
                </Navbar>
            </div>
            
        );
    }
}
 
HeaderComponent.contextType = GlobalContext;
export default withRouter(HeaderComponent);