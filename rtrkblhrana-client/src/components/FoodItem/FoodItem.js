import React, { Component } from 'react';
import './FoodItem.css';
import StarRatings from 'react-star-ratings';
import GlobalContext from '../../GlobalContext'
import {SlideDown} from 'react-slidedown'
import 'react-slidedown/lib/slidedown.css'

class FoodItem extends Component {
    state = { 
        selectedSideDishes : [],
        rating : 4.5,
        showComments: false
        
    }


    toggleSelectedMeal = () => {
        this.props.selectionChangeHandler(this.props.id, this.state.selectedSideDishes, true);
        if(this.props.isSpecial){
            console.log('special sidedishes ' + this.props.id, this.props.sideDishes)
        }
    }

    toggleSelectedSideDish = (sidedishId) => {
        if(this.props.isSelected){
            console.log('selected', sidedishId + ' - ' + this.props.id);
            setTimeout(()=>console.log('state from ' + this.props.id, this.state.selectedSideDishes), 2000)
            this.props.selectionChangeHandler(this.props.id, this.state.selectedSideDishes, false)
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
                    this.props.selectionChangeHandler(this.props.id, this.state.selectedSideDishes, false)
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
                                <label className={`sidedish-label food-card-text-${this.context.theme}`} htmlFor = {`${item.mealId}-${item.sidedishId}`}>{item.name}</label>
                            </div>
                        )
                    })
                }
            </div>
             : null
        )
    }

    changeRating = (newRating, name) =>{
        this.setState({
            rating : newRating
        })
    }

    toggleComments = () => {
        this.setState({
            showComments : !this.state.showComments
        })
    }

    render() { 
        if(this.props.isSelected) console.log('food-card-selected')
        return ( 
            this.props.isSpecial?
            <div className={`food-card-special-${this.context.theme} food-card-special${this.props.isSelected? ` food-card-${this.context.theme}-selected` : ''} `}>
                <div>
                    <h6 className={`food-card-text-${this.context.theme}`}>
                        <input className="food-card-main-checkbox" id={this.props.id} checked={this.props.isSelected} type="checkbox" onChange={this.toggleSelectedMeal}></input>
                        <label className = {`food-card-title food-card-text-${this.context.theme}`} htmlFor={this.props.id}>{this.props.mealName}</label>
                    </h6>
                    <div className="food-card-image-extra-wrapper">
                        <div className="food-card-image-wrapper">
                            <img src="./rt-rk_logo_large.png" className="img img-fluid food-image"></img>
                        </div>
                        <div className="ratings">
                            <div className={`food-card-text-${this.context.theme}`}>
                                <b>{this.state.rating}</b>
                            </div>
                            <StarRatings
                                rating={this.state.rating}
                                starRatedColor="blue"
                                changeRating={this.changeRating}
                                numberOfStars={5}
                                name='rating'
                                starDimension = {"1.5em"}
                                starSpacing = {"0.5em"}
                            />
                        </div>
                    </div>
                    {this.mapSideDishes()}
                    <SlideDown className={'react-slidedown'}>
                        {this.state.showComments ? 
                            <div className={`comments comments-${this.state.showComments ? 'visible' : 'hidden'}`}>
                                Komentari:
                                <div>
                                    Dobra klopa nema sta. 5/5.
                                </div>
                                <div>
                                    Dobra klopa nema sta. 5/5.
                                </div>
                                <div>
                                    Dobra klopa nema sta. 5/5.
                                </div>
                                <div>
                                    Dobra klopa nema sta. 5/5.
                                </div>
                            </div>

                            :

                            null
                        }
                    </SlideDown>
                    
                    <div className="chevron-wrapper" onClick={this.toggleComments}>
                        <i className={`fa fa-chevron-${this.state.showComments ? 'up' : 'down'} food-card-text-${this.context.theme}`}></i>
                    </div>
                </div>
            </div>

            :

            <div className={`food-card${this.props.isSelected? ` food-card-${this.context.theme}-selected` : ''} food-card-${this.context.theme}`}>
                <h6 className={`food-card-text-${this.context.theme}`}>
                    <input className="food-card-main-checkbox" id={this.props.id} type="checkbox" onChange={this.toggleSelectedMeal}></input>
                    <label className = {`food-card-title food-card-text-${this.context.theme}`} htmlFor={this.props.id}>{this.props.mealName}</label>
                </h6>
                {this.mapSideDishes()}
            </div>
         );
    }

    
}
 
FoodItem.contextType = GlobalContext;
export default FoodItem;