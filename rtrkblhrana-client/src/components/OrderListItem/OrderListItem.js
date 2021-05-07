import React, { Component } from 'react';
import axios from 'axios';
import GlobalContext from '../../GlobalContext';

class OrderListItem extends Component {
    state = { 
        
    }

    renderOrder = (order) => {
        console.log(this.props.order);
        return(
            <div>
                {
                    this.props.order?

                    <div>
                        {order.date} - 
                        {order.name} - 
                        {order.isCanceled} - 
                        <hr/>
                    </div>

                    :

                    null
                }
            </div>
        )
    }

    render() { 
        return ( 
            <div>
                ORDERS:
                {this.renderOrder(this.props.order)}
            </div>
         );
    }
}
 
OrderListItem.contextType = GlobalContext;
export default OrderListItem;