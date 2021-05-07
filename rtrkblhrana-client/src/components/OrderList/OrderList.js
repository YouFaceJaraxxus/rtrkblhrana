import React, { Component } from 'react';
import axios from 'axios';
import GlobalContext from '../../GlobalContext';
import OrderListItem from '../OrderListItem/OrderListItem';
import moment from 'moment';

class OrderList extends Component {
    state = { 
        orders : [],
        ordersLoading : false
        
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
                })
            }
            this.setState({
                orders : response.data
            })
        })
    }

    mapOrders = () => {
        return(
            <div>
                {
                    this.state.orders&&this.state.orders.length>0?
                    this.state.orders.map((item, index) => 
                        <OrderListItem 
                            order = {item}
                        />
                    )
                    :
                    <div>
                        NO ORDERS
                    </div>
                }
            </div>
        )
    }

    render() { 
        return ( 
            <div>
                ORDERS:
                {this.mapOrders()}
            </div>
         );
    }
}
 
OrderList.contextType = GlobalContext;
export default OrderList;