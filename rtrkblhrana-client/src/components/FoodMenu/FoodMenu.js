import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import FoodItem from '../FoodItem/FoodItem';
import './FoodMenu.css';
import ClipLoader from "react-spinners/ClipLoader";
import GlobalContext from "../../GlobalContext";
import {getLocalDay} from '../../util.js'

class FoodMenu extends Component {
    state = { 
        currentDate : moment('20210401').format('YYYY-MM-DD'),
        defaultMeals : null,
        specialMeals : null,
        defaultSidedishes : null,
        specialSidedishes : null,
        selectedMealId : null,
        selectedSideDishes: [],
        loading: true,
        selectedLocationId : 1,
        selectedTimeId : 1,
        locations : null,
        times: null
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
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    defaultMeals : response.data
                })
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })

        axios.post('/food/special/date', body, {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    specialMeals : response.data
                })
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })

        axios.get('/food/sidedish/default', {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    defaultSidedishes : response.data
                })
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })

        axios.post('/food/sidedish/special/date', body, {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    specialSidedishes : response.data,
                    loading : false
                })
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })

        axios.get('/location', {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    locations : response.data
                })
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })

        axios.get('/time', {
            headers:{
                'Content-type' : 'application/json'
            }
        }).then(response=>{
            if(response.status == 401){
                this.props.history.push('/login');
            }else{
                this.setState({
                    times : response.data
                })
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })
    }

    mapMeals = (meals, special = false) => {
        let selectedMealId = this.state.selectedMealId;
        let sidedishList = special ? this.state.specialSidedishes : this.state.defaultSidedishes;
        return (
            meals&&meals.length>0 ?
            meals.map((item, index) => {
                let sidedishes = sidedishList? sidedishList.filter(sidedish => sidedish.mealId == item.id) : null;
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

    toggleSelectedLocation = (event) =>{
        console.log('location', event.target.value)
        this.setState({
            selectedLocationId : event.target.value
        })
    }

    toggleSelectedTime = (event) =>{
        console.log('time', event.target.value)
        this.setState({
            selectedTimeId : event.target.value
        })
    }

    mapLocations = () =>{
        return (
            this.state.locations&&this.state.locations.length>0?
            <div className="locations">
                {
                    this.state.locations.map((item, index)=>{
                        return(
                            <div className={`location-item`} key={item.id}>
                                <input type="radio" id={`location-${item.id}`} name="location" value={item.id} checked={this.state.selectedLocationId==item.id} type="checkbox" onChange={this.toggleSelectedLocation}/>
                                <label htmlFor={`location-${item.id}`} className={`global-text-${this.context.theme}`}>{item.name}</label><br/>
                            </div>
                        )
                    })
                }
            </div>
            :

            null

        )
    }

    mapTimes = () =>{
        return (
            this.state.times&&this.state.times.length>0?
            <div className="times">
                {
                    this.state.times.map((item, index)=>{
                        return(
                            <div className={`time-item`} key={item.id}>
                                <input type="radio" id={`time-${item.id}`} name="time" value={item.id} checked={this.state.selectedTimeId==item.id} type="checkbox" onChange={this.toggleSelectedTime}/>
                                <label htmlFor={`time-${item.id}`} className={`global-text-${this.context.theme}`}>{item.chosenTime}</label><br/>
                            </div>
                        )
                    })
                }
            </div>
            :

            null

        )
    }

    incrementDate = () => {
        let day = moment(this.state.currentDate).format('dddd');
        if(day=='Friday') {
            this.setState({
                currentDate : moment(this.state.currentDate).add(3, 'days').format('YYYY-MM-DD')
            })
        }else{
            this.setState({
                currentDate : moment(this.state.currentDate).add(1, 'days').format('YYYY-MM-DD')
            })
        }
        
    }

    decrementDate = () => {
        let day = moment(this.state.currentDate).format('dddd');
        if(day=='Monday') {
            this.setState({
                currentDate : moment(this.state.currentDate).add(-3, 'days').format('YYYY-MM-DD')
            })
        }else{
            this.setState({
                currentDate : moment(this.state.currentDate).add(-1, 'days').format('YYYY-MM-DD')
            })
        }
    }

    handleSelectionChange = (mealId, newSidedishes, deselect = false) => {
        console.log('mealId', mealId)
        console.log('newSidedishes', newSidedishes)
        console.log('deselect', deselect)
        if(this.state.selectedMealId==mealId&&deselect){
            this.setState({
                selectedMealId : null,
                selectedSideDishes : []
            })
        }
        else{
            this.setState({
                selectedMealId : mealId,
                selectedSideDishes : newSidedishes
            })
        }
    }
    

    noMeals = () => {
        return (this.state.defaultMeals==null||this.state.defaultMeals.length==0)
        && (this.state.specialMeals==null||this.state.specialMeals.length==0);
    }

    selectMeal = () => {
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
                let requestBody = {
                    date : this.state.currentDate,
                    mealId : this.state.selectedMealId,
                    locationId : this.state.selectedLocationId,
                    timeId : this.state.selectedTimeId,
                    sideDishes : this.state.selectedSideDishes
                }

                console.log('requestBody', requestBody);

                axios.post('/order/order', JSON.stringify(requestBody), {
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
                        window.alert('Uspjesno ste narucili obrok za ' + this.state.currentDate)
                    }
                }).catch(error=>{
                    console.log(error);
                    this.props.history.push('/');
                })
                /*let alertMessage = `You selected ${selectedMeal.name} with the sidedishes: `;
                if(this.state.selectedSideDishes&&this.state.selectedSideDishes.length>0)
                for(let sideDish of selectedSidedishes){
                    alertMessage += ` ${sideDish.name}`
                }
                window.alert(alertMessage);*/
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

    cancelOrder = () => {
        let requestBody = {
            date : this.state.currentDate
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
                window.alert('Uspjesno ste otkazali narudzbu za ' + this.state.currentDate)
            }
        }).catch(error=>{
            console.log(error);
            this.props.history.push('/');
        })
    }

    render() { 
        return ( 
            this.state.loading ? 
            <div className="custom-spinner-wrapper">
                <ClipLoader color="blue" loading={this.state.loading} size={300} />
            </div>

            :

            this.noMeals()?

            <div className={`global-background-${this.context.theme} global-text-${this.context.theme} no-meals`}>
                <h1>
                    Meni nije dostupan.
                </h1>
            </div>

            :

            <div className={`menu-wrapper global-background-${this.context.theme}`}>
                <div className = "menu-navigation-wrapper">
                    <i className={`fa fa-chevron-left food-card-text-${this.context.theme} navigation-chevron`} onClick={this.decrementDate}></i>
                    <div className={`food-card-text-${this.context.theme}`}>
                        {getLocalDay(moment(this.state.currentDate).format('dddd'))}, {moment(this.state.currentDate).format('DD-MM-YYYY')}
                    </div>
                    <i className={`fa fa-chevron-right food-card-text-${this.context.theme} navigation-chevron`} onClick={this.incrementDate}></i>
                </div>
                <div className={`menu-special global-background-${this.context.theme}`}>
                    {this.mapMeals(this.state.specialMeals, true)}
                </div>
                <hr/>
                <div className={`menu-default global-background-${this.context.theme}`}>
                    {this.mapMeals(this.state.defaultMeals, false)}
                </div>
                <div className={`location-time-wrapper global-background-${this.context.theme}`}>
                    {this.mapLocations()}
                    {this.mapTimes()}
                </div>
                <div className="menu-buttons-wrapper">
                    <button className={`btn menu-button menu-button-${this.context.theme}-green`} onClick={this.selectMeal}>Odaberi</button>
                    <button className={`btn menu-button menu-button-${this.context.theme}-red`} onClick={this.cancelOrder}>Otkazi narudzbu</button>
                </div>
                
            </div> 
         );
    }
}

FoodMenu.contextType = GlobalContext;
export default FoodMenu;