import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import GlobalContext from '../../GlobalContext';
import './OrderListItem.css';
import {getLocalDay} from '../../util'
import { Link } from 'react-router-dom';

class OrderListItem extends Component {
    state = { 
        
    }


    renderSidedishes = (order) => {
        let sidedishes = order.sidedishes;
        if(sidedishes==null||sidedishes.length<1) return '';
        let sidedishesString = '';
        for(let index in sidedishes){
            let sidedish = sidedishes[index];
            sidedishesString += sidedish.name  + (index==sidedishes.length-1? '' : ', ');
        }
        return sidedishesString;
    }

    cancelOrder = () => {
        this.props.handleCancelOrder(this.props.order.id, moment(this.props.order.date).format('YYYY-MM-DD'))
    }

    render() { 
        let order = this.props.order;
        console.log('order', order)
        return ( 
            order!=null?
                <tr className={`list-item-${this.context.theme}`}>
                    <td className={`global-text-${this.context.theme}`}>
                        {getLocalDay(moment(order.date).format('dddd'))}, {moment(order.date).format('DD.MM')}
                    </td>
                    <td className={`global-text-${this.context.theme}`}>
                        {order.name}
                    </td>   
                    <td className={`global-text-${this.context.theme}`}>
                        {this.renderSidedishes(order)}
                    </td>   
                    <td>
                        <div style={{textAlign:'right'}}>
                            <Link to={{pathname: `/order`, date : order.date}} props><button className={`btn`}><i className={`fa fa-edit list-item-icon global-text-${this.context.theme}`}></i></button></Link>
                            <button onClick={this.cancelOrder} className={`btn`}><i className={`fa fa-close list-item-icon list-item-icon-close-${this.context.theme}`}></i></button>
                        </div>
                    </td>          
                </tr>
            :
            null
         );
    }
}
 
OrderListItem.contextType = GlobalContext;
export default OrderListItem;