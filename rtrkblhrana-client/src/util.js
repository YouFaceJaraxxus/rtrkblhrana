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

export {
    loginWithCookie
}