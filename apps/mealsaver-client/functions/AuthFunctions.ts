import { SERVER_URL } from "../constants/AuthConstants";


export function setAccessToken(token:string){
    window.localStorage.accessToken = token;
}
export function getAccessToken(){
   return window.localStorage.accessToken ;
}

export function setRefreshToken(token:string){
    window.localStorage.refreshToken = token;
}
export function getRefreshToken(){
    return window.localStorage.refreshToken;
}



export async function registerNewUser(username:string, email:string, password:string) {
const url = SERVER_URL+"/users/register"


    const payload =
    {
        "username": username,
        "email": email,
        "password": password
    }
    const headers = {
        'Content-Type': 'application/json'
    };


    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
    })


    console.log(res)
}

export async function loginUser(username:string, email:string, password:string) {
    const url = SERVER_URL+"/users/login"


    const payload =
    {
        "username": username,
        "email": email,
        "password": password
    }
    const headers = {
        'Content-Type': 'application/json'
    };


    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
    })
    const data = await res.json()

    console.log(data)
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);

    console.log("ACCESS TOKEN TEST", getAccessToken());
}