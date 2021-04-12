import React, { Component } from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import GlobalContext from '../../GlobalContext';

class HeaderComponent extends Component {
    state = {  }

    handleLanguageChange = (newLanguage) =>{
        this.context.setLanguage(newLanguage);
    }

    handleThemeChange = (newTheme) =>{
        this.context.setTheme(newTheme);
    }
    render() { 
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
                        <LinkContainer to="/settings">
                            <Nav.Link>Podešavanje naloga</Nav.Link>
                        </LinkContainer>
                        <NavDropdown variant={this.context.theme} title={`Jezik : ${this.context.language}`} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=>this.handleLanguageChange('latin')}>Latinica</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>this.handleLanguageChange('cyrillic')}>Ћирилица</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown variant={this.context.theme} title={`Tema : ${this.context.theme}`} id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={()=>this.handleThemeChange('light')}>Svijetla</NavDropdown.Item>
                            <NavDropdown.Item onClick={()=>this.handleThemeChange('dark')}>Tamna</NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            
        );
    }
}
 
HeaderComponent.contextType = GlobalContext;
export default HeaderComponent;