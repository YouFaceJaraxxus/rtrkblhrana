import axios from 'axios';

const loginWithCookie=(context, history, nextRoute)=>{
    axios.post("/user/login", {})
    .then(response=>{
        if(response.status==200){
           history.push(nextRoute);
           console.log('CONTEXT IN UTIL TRUE')
           context.setIsLogged(true);
        }
        else{
            console.log('CONTEXT IN UTIL FALSE')
            context.setIsLogged(false);
            history.push(nextRoute);
        }
    }).catch(err=>{
        console.log('CONTEXT IN UTIL FALSE')
        context.setIsLogged(false);
        console.log(err)
    })
}

const daysMap = new Map([
    ['Monday', 'Ponedjeljak'],
    ['Tuesday', 'Utorak'],
    ['Wednesday', 'Srijeda'],
    ['Thursday', 'Četvrtak'],
    ['Friday', 'Petak']
])

const getLocalStorageItem = (key, defaultValue) => {
    let value = window.localStorage.getItem(key);
    return value==null? defaultValue : value;
}

const setLocalStorageItem = (key, value) => {
    window.localStorage.setItem(key, value);
}

const getLocalDay = (englishDay) => {
    return daysMap.get(englishDay);
}

const mapLoaderTheme = (theme) => {
    return theme=='dark' ? 'white' : 'black';
}

export {
    loginWithCookie,
    getLocalStorageItem,
    setLocalStorageItem,
    getLocalDay,
    mapLoaderTheme
}