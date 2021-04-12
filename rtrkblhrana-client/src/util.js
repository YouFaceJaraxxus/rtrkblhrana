import axios from 'axios';

const loginWithCookie=(context, history, nextRoute)=>{
    axios.post("/user/login", {})
    .then(response=>{
        if(response.status==200){
           history.push(nextRoute);
           context.setIsLogged(true);
        }
        else{
            context.setIsLogged(false);
            history.push(nextRoute);
        }
    }).catch(err=>{
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
    let value = global.window.localStorage.getItem(key);
    return value==null? defaultValue : value;
}

const getLocalDay = (englishDay) => {
    return daysMap.get(englishDay);
}

export {
    loginWithCookie,
    getLocalStorageItem,
    getLocalDay
}