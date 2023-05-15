export interface UserData {
    username: string;
    email: string;
    password: string;
}

export const users: Array<UserData> = new Array<UserData>();
export let refreshTokens: Array<string> = [];




export function registerUser(user:UserData){
    users.push(user);
}
export function addRefreshToken(token:string){
    refreshTokens.push(token);
}