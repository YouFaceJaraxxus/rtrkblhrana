import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import FoodItem from '../FoodItem/FoodItem';
import './FoodMenu.css';
import ClipLoader from "react-spinners/ClipLoader";

class FoodMenu extends Component {
    state = { 
        currentDate : moment('20210401').format('YYYY-MM-DD'),
        defaultMeals : null,
        specialMeals : null,
        defaultSidedishes : null,
        specialSidedishes : null,
        selectedMealId : null,
        selectedSideDishes: [],
        loading: true

    }

    componentWillMount(){

    }

    componentDidMount(){
        let body = JSON.stringify({
            date : this.state.currentDate
        })
        axios.get('/food/default', {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            //console.log('response', response);
            //console.log('response data', response.data);
            this.setState({
                defaultMeals : response.data
            })
        })

        axios.post('/food/special/date', body, {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            this.setState({
                specialMeals : response.data
            })
        })

        axios.get('/food/sidedish/default', {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            this.setState({
                defaultSidedishes : response.data
            })
        })

        axios.post('/food/sidedish/special/date', body, {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            this.setState({
                specialSidedishes : response.data,
                loading : false
            })
        })
    }

    mapMeals = (meals, special = false) => {
        let selectedMealId = this.state.selectedMealId;
        let sidedishList = special ? this.state.specialSidedishes : this.state.defaultSidedishes;
        return (
            meals&&meals.length>0 ?
            meals.map((item, index) => {
                let sidedishes = sidedishList? sidedishList.filter(sidedish => sidedish.mealId == item.id) : null;
                if(special){
                    //console.log('sidedishList', sidedishList);
                    //console.log('sidedishList', sidedishes);
                    //if(item.id == selectedMealId) console.log('selected', item.id)
                }
                return(
                    <FoodItem 
                        key={item.id}
                        id = {item.id}
                        mealName = {item.name}
                        isSpecial = {item.isSpecial}
                        isSelected = {item.id == selectedMealId}
                        selectionChangeHandler = {this.handleSelectionChange}
                        sideDishes = {sidedishes}
                    ></FoodItem>
                )
            })
            : null
        )
    }

    handleSelectionChange = (mealId, newSidedishes) => {
        console.log('handle called ' + mealId, newSidedishes)
        this.setState({
            selectedMealId : mealId,
            selectedSideDishes : newSidedishes
        })
    }

    noMeals = () => {
        return (this.state.defaultMeals==null||this.state.defaultMeals.length==0)
        && (this.state.specialMeals==null||this.state.specialMeals.length==0);
    }

    alertSelection = () => {
        if(this.state.selectedMealId){
            let selectedMeal = this.state.defaultMeals.find(meal => meal.id == this.state.selectedMealId);
            let selectedSidedishes = null;
            if(selectedMeal){
                if(this.state.selectedSideDishes&&this.state.selectedSideDishes.length>0)selectedSidedishes = this.state.defaultSidedishes.filter(sidedish => sidedish.mealId==this.state.selectedMealId && this.state.selectedSideDishes.includes(sidedish.sidedishId));
            }else{
                selectedMeal = this.state.specialMeals.find(meal => meal.id == this.state.selectedMealId);
                if(selectedMeal&&this.state.selectedSideDishes&&this.state.selectedSideDishes.length>0)selectedSidedishes = this.state.specialSidedishes.filter(sidedish => sidedish.mealId==this.state.selectedMealId && this.state.selectedSideDishes.includes(sidedish.sidedishId));
            }
            if(selectedMeal!=null){
                let alertMessage = `You selected ${selectedMeal.name} with the sidedishes: `;
                if(this.state.selectedSideDishes&&this.state.selectedSideDishes.length>0)
                for(let sideDish of selectedSidedishes){
                    alertMessage += ` ${sideDish.name}`
                }
                window.alert(alertMessage);
            }
            else {
                let alertMessage = `You selected no meal so far`;
                window.alert(alertMessage);
            }
        }
        else {
            let alertMessage = `You selected no meal so far`;
            window.alert(alertMessage);
        }
        
    }

    render() { 
        return ( 
            this.noMeals() ? 
            <div className="menu-wrapper no-items">
                <ClipLoader color="blue" loading={this.state.loading} size={300} />
            </div>

            :

            <div className="menu-wrapper">
                <div className="menu-special">
                    {this.mapMeals(this.state.specialMeals, true)}
                </div>
                <hr/>
                <div className="menu-default">
                    {this.mapMeals(this.state.defaultMeals, false)}
                </div>
                <button className="btn btn-primary btn-block menu-button" onClick={this.alertSelection}>Selection</button>
            </div> 
         );
    }
}
 
export default FoodMenu;