import React, { Component } from 'react';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import GlobalContext from '../../GlobalContext';

class MainComponent extends Component {
    state = {  }
    render() { 
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand>
                        <LinkContainer to="/">
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
                        <LinkContainer to="/settings">
                            <Nav.Link>TEMA : {this.context.theme}</Nav.Link>
                        </LinkContainer>
                        <NavDropdown title="Jezik" id="basic-nav-dropdown">
                            <NavDropdown.Item>Latinica</NavDropdown.Item>
                            <NavDropdown.Item>Ćirilica</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Tema" id="basic-nav-dropdown">
                            <NavDropdown.Item>Svijetla</NavDropdown.Item>
                            <NavDropdown.Item>Tamna</NavDropdown.Item>
                        </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            
        );
    }
}
 
MainComponent.contextType = GlobalContext;
export default MainComponent;