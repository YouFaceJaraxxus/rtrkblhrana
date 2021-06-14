import React, { Component } from 'react';
import './FoodItem.css';
import StarRatings from 'react-star-ratings';
import GlobalContext from '../../GlobalContext'
import axios from 'axios';
import 'react-slidedown/lib/slidedown.css'
import ClipLoader from 'react-spinners/ClipLoader';
import {mapLoaderTheme} from '../../util';

class FoodItem extends Component {
    state = { 
        selectedSideDishes : [],
        ratings : [],
        rating : 0.0,
        ratingsLoading : true
    }

    calculateTotalRatings = (ratings) => {
        let grades = ratings.data.map((item, index) => item.grade);
        console.log('grades', grades);
        let total = 0.0;
        if(grades!=null&&grades.length>0){
            for(let grade of grades){
                total+=grade;
            }
            total /= grades.length;
        }
        this.setState({
            ratings : grades? grades: [],
            rating : total,
            ratingsLoading : false
        })
    }

    componentDidMount(){
        let tryStart = true;
        let tryGetSelection = setInterval(()=>{ //try to get an object from the parent
            if(this.props.startingSelection){
                if(this.props.startingSelection.mealId) //not an empty object
                {
                    this.toggleSelectedMeal();
                    console.log('startingSelection', this.props.startingSelection)
                    this.setState({
                        selectedSideDishes : this.props.startingSelection.sidedishes.map(sidedish => sidedish.sidedishId)
                    }, () => {
                        console.log('dishes state', this.state.selectedSideDishes)
                        this.props.selectionChangeHandler(this.props.startingSelection.mealId, this.state.selectedSideDishes, false)
                    })
                }
                tryStart = false;
                clearInterval(tryGetSelection);
            }
        }, 1000);
        
        if(this.props.isSpecial){
            let url = `/food/grade/${this.props.mealId}`;
            console.log('grade url', url);
            axios.get(url)
            .then(response => {
                this.calculateTotalRatings(response);
            })
        }
    }

    toggleSelectedMeal = () => {
        this.props.selectionChangeHandler(this.props.mealId, this.state.selectedSideDishes, true);
    }

    toggleSelectedSideDish = (sidedishId) => {
        if(this.props.isSelected){
            if(this.state.selectedSideDishes.includes(sidedishId)){
                let removedDish = this.state.selectedSideDishes.filter(item => item!=sidedishId);
                this.setState({
                    selectedSideDishes : removedDish
                }, () => {
                    this.props.selectionChangeHandler(this.props.mealId, this.state.selectedSideDishes, false)
                })
            }
            else {
                this.setState({
                    selectedSideDishes : [...this.state.selectedSideDishes, sidedishId]
                }, () => {
                    this.props.selectionChangeHandler(this.props.mealId, this.state.selectedSideDishes, false)
                })
            }
        }
    }

    mapSideDishes = () => {
        return (
            this.props.sideDishes? 
            <div className={`${this.props.isSpecial? 'sidedish-wrapper-special' : 'sidedish-wrapper'}`}>
                {
                    this.props.sideDishes.map((item, index) => {
                        return (
                            <div className={`sidedish${this.props.isSpecial? ' sidedish-special' : ''}`} key = {item.sidedishId}>
                                <input checked={this.state.selectedSideDishes.includes(item.sidedishId)} onChange={()=>this.toggleSelectedSideDish(item.sidedishId)} disabled={!this.props.isSelected} name={`${item.sidedishId}-${item.mealId}`} id={`${item.sidedishId}-${item.mealId}`} type="checkbox" className="food-card-text-light"></input>
                                <label className={`sidedish-label food-card-text-${this.context.theme}`} htmlFor = {`${item.sidedishId}-${item.mealId}`}>{item.name}</label>
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
            ratingsLoading : true
        }, () => {
            console.log(`${this.props.mealId} rated ${newRating}`)
            let body = {
                mealId : this.props.mealId,
                grade : newRating
            }
            axios.post('/food/grade', body, {
                headers:{
                    'Content-type' : 'application/json'
                }
            }).then(result => {
                this.calculateTotalRatings(result);
            })
        })
    }

    render() { 
        return ( 
            this.props.isSpecial?
            <div className={`food-card-special-${this.context.theme} food-card-special${this.props.isSelected? ` food-card-${this.context.theme}-selected` : ''} `}>
                <div>
                    <h6 className={`food-card-text-${this.context.theme}`}>
                        <input className="food-card-main-checkbox" id={`meal-${this.props.mealId}`} checked={this.props.isSelected} type="checkbox" onChange={this.toggleSelectedMeal}></input>
                        <label className = {`food-card-title food-card-text-${this.context.theme}`} htmlFor={`meal-${this.props.mealId}`}>{this.props.mealName}</label>
                    </h6>
                    <div className="food-card-image-extra-wrapper">
                        <div className="food-card-image-wrapper">
                            <img src="./rt-rk_logo_large.png" className="img img-fluid food-image"></img>
                        </div>
                        {
                                this.state.ratingsLoading ? 

                                <div className="food-item-clip-loader">
                                    <ClipLoader color={mapLoaderTheme(this.context.theme)} loading={this.state.loadingAll} size={50} />
                                </div>
                                
                                :

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
                        }
                        
                    </div>
                    {this.mapSideDishes()}
                </div>
            </div>

            :

            <div className={`food-card${this.props.isSelected? ` food-card-${this.context.theme}-selected` : ''} food-card-${this.context.theme}`}>
                <h6 className={`food-card-text-${this.context.theme}`}>
                    <input className="food-card-main-checkbox" id={`meal-${this.props.mealId}`} checked={this.props.isSelected} type="checkbox" onChange={this.toggleSelectedMeal}></input>
                    <label className = {`food-card-title food-card-text-${this.context.theme}`} htmlFor={`meal-${this.props.mealId}`}>{this.props.mealName}</label>
                </h6>
                {this.mapSideDishes()}
            </div>
         );
    }

    
}
 
FoodItem.contextType = GlobalContext;
export default FoodItem;