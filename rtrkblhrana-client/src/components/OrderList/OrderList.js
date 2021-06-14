import React, { Component } from 'react';
import axios from 'axios';
import GlobalContext from '../../GlobalContext';
import OrderListItem from '../OrderListItem/OrderListItem';
import moment from 'moment';
import './OrderList.css';
import ClipLoader from 'react-spinners/ClipLoader';
import {mapLoaderTheme} from '../../util';

class OrderList extends Component {
    state = { 
        orders : [],
        ordersLoading : true
     }

    componentDidMount(){
        axios.post('/order/user/all')
        .then(response => {
            console.log('orders', response.data);
            let orders = response.data;
            if(orders){
                //newest date first
                orders = orders.sort((a, b)=>{
                    let dateA = moment(a.date);
                    let dateB = moment(b.date);
                    let diff = dateB.diff(dateA);
                    return diff;
                });
            }
            this.setState({
                orders : response.data,
                ordersLoading : false
            })
            this.context.setIsLogged(true);
        }).catch(error=>{
            console.log(error);
            this.context.setIsLogged(false);
            this.props.history.push('/');
        })
    }

    cancelOrder = (orderId, date) => {
        console.log('delete called');
        console.log('orderId', orderId);
        console.log('date', date);
        let requestBody = {
            date : date
        }
        axios.post('/order/delete', JSON.stringify(requestBody), {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            console.log(response);
            if(response.status == 400){
                console.log('client error');
            }
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                console.log('all orders', this.state.orders);
                let keptOrders = this.state.orders.filter(order => order.id!= orderId);
                console.log('kept orders' , keptOrders);
                this.setState({
                    orders : keptOrders
                })
                window.alert('Uspjesno ste otkazali narudzbu za ' + date)
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })
        
    }

    mapOrders = () => {
        return(
            <div>
                {
                    this.state.ordersLoading?

                    <div className='loader-wrapper'>
                        <ClipLoader color={mapLoaderTheme(this.context.theme)} loading={this.state.ordersLoading} size={300} />
                    </div>

                    :

                    this.state.orders&&this.state.orders.length>0?

                    <table className='order-list-table'>
                        <thead>
                            <tr className={`order-list-header-${this.context.theme}`}>
                                <th>Datum</th>
                                <th>Naziv</th>
                                <th>Prilozi</th>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.orders.map((item, index) => 
                                        <OrderListItem 
                                        order = {item}
                                        theme = {this.context.theme}
                                        language = {this.context.language}
                                        key = {item.id}
                                        handleCancelOrder = {this.cancelOrder}
                                    />
                                )
                            }
                        </tbody>
                        
                    </table>
                    
                    :


                    <div>
                        Nemate narudžbi za tekući mjesec.
                    </div>
                }
            </div>
        )
    }

    render() { 
        return ( 
            <div>
                <div className={`title global-text-${this.context.theme}`}>
                    Moje narudžbe
                </div>
                <div className="order-list-wrapper">
                    {this.mapOrders()}
                </div>
            </div>
         );
    }
}
 
OrderList.contextType = GlobalContext;
export default OrderList;