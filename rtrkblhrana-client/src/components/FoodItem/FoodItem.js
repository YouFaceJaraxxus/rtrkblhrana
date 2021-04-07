import React, { Component } from 'react';
import './FoodItem.css';

class FoodItem extends Component {
    state = { 
        selectedSideDishes : []
    }


    setSelectedMeal = () => {
        this.props.selectionChangeHandler(this.props.id, this.state.selectedSideDishes);
        if(this.props.isSpecial){
            console.log('special sidedishes ' + this.props.id, this.props.sideDishes)
        }
    }

    toggleSelectedSideDish = (sidedishId) => {
        if(this.props.isSelected){
            console.log('selected', sidedishId + ' - ' + this.props.id);
            setTimeout(()=>console.log('state from ' + this.props.id, this.state.selectedSideDishes), 2000)
            this.props.selectionChangeHandler(this.props.id, this.state.selectedSideDishes)
            if(this.state.selectedSideDishes.includes(sidedishId)){
                console.log('deselecting', sidedishId);
                let removedDish = this.state.selectedSideDishes.filter(item => item!=sidedishId);
                this.setState({
                    selectedSideDishes : removedDish
                })
            }
            else {
                console.log('selecting', sidedishId);
                this.setState({
                    selectedSideDishes : [...this.state.selectedSideDishes, sidedishId]
                }, () => {
                    console.log('switching to ' + this.props.id, this.state.selectedSideDishes)
                    this.props.selectionChangeHandler(this.props.id, this.state.selectedSideDishes)
                })
            }
        }
        
    }

    componentDidUpdate(prevProps, newProps){
        if (prevProps.isSelected!=newProps.isSelected){
            //console.log('prevProps', prevProps)
            //console.log('newProps', newProps)
        }
    }


    mapSideDishes = () => {
        return (
            this.props.sideDishes? 
            <div className={`${this.props.isSpecial? 'sidedish-wrapper-special' : 'sidedish-wrapper'}`}>
                {
                    this.props.sideDishes.map((item, index) => {
                        return (
                            <div className={`sidedish${this.props.isSpecial? ' sidedish-special' : ''}`} key = {item.id}>
                                <input onChange={()=>this.toggleSelectedSideDish(item.id)} disabled={!this.props.isSelected} name={`${item.mealId}-${item.sidedishId}`} id={`${item.mealId}-${item.sidedishId}`} type="checkbox" className="food-card-text-light"></input>
                                <label className="sidedish-label" htmlFor = {`${item.mealId}-${item.sidedishId}`}>{item.name}</label>
                            </div>
                        )
                    })
                }
            </div>
             : null
        )
    }

    render() { 
        return ( 
            this.props.isSpecial?
            <div onClick={this.setSelectedMeal} className={`food-card-special${this.props.isSelected? ' food-card-selected' : ''}`}>
                <div>
                    <h6 className="food-card-text-light">{this.props.mealName}</h6>
                    <div className="food-card-image-wrapper">
                        <img src="./rt-rk_logo_large.png" className="img img-fluid"></img>
                    </div>
                    {this.mapSideDishes()}
                </div>
            </div>

            :

            <div onClick={this.setSelectedMeal} className={`food-card${this.props.isSelected? ' food-card-selected' : ''}`}>
                <h6>{this.props.mealName}</h6>
                {this.mapSideDishes()}
            </div>
         );
    }

    
}
 
export default FoodItem;