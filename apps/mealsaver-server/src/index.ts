/* eslint-disable turbo/no-undeclared-env-vars */
import express, { Request, Response, Express } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import cors from "cors"

import { expireTime , CORS} from "./constants";

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY; 
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;



if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
  console.error("Secret keys are not defined in environment variables");
  process.exit(1);
}


const SERVER: Express = express();
SERVER.use(express.json());
SERVER.use(CORS);


export interface UserData {
  username: string;
  email: string;
  password: string;
}

export const users: Array<UserData> = new Array<UserData>();
let refreshTokens: Array<string> = [];

export function registerUser(user:UserData){
  users.push(user);
}
export function addRefreshToken(refreshToken:string){
  refreshTokens.push(refreshToken)
}




const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.body.user = user;
    next();
  });
};


SERVER.get("/users", (req: Request, res: Response) => {
  // Check if the user has the necessary permissions
  
    res.status(200).json(users);
  
});



SERVER.post("/users/register", async (req: Request, res: Response) => {
  try {
    const username: string = req.body.username;
    const email: string = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user: UserData = { username: username, email: email, password: hashedPassword };
    


    const existsUser: UserData | undefined = users.find((userParam: UserData) => userParam.username == req.body.username);
    
    if(existsUser){
      res.status(409).send("The username is already taken");
    }
    else{
      registerUser(user);
    }

    res.status(201).send();


  } catch {
    res.status(500).send();
  }
});

SERVER.post("/users/login", async (req: Request, res: Response) => {
  const user: UserData | undefined = users.find((user: UserData) => user.username == req.body.username);

  if (user == undefined) {
    return res.status(400).send("Cannot find the user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user, SECRET_KEY, { expiresIn: expireTime });
      const refreshToken = jwt.sign(user, REFRESH_SECRET_KEY);
      addRefreshToken(refreshToken);
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    } else {
      res.send("Failed Login");
    }
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

SERVER.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, { expiresIn: expireTime });
    res.json({ accessToken: accessToken });
  });
}); 

SERVER.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

SERVER.put("/users/me", authenticateToken, async (req: Request, res: Response) => {
  // Get the username from the user object in the JWT token, instead of from the request body
  const username = req.body.user.username;

  // Update the user's data
  const user = users.find((user) => user.username === username);
  if (user) {
    user.email = req.body.email || user.email;
    if (req.body.password) {
        user.password = await bcrypt.hash(req.body.password, 10);
    }
    res.status(200).send("User data updated");
  } else {
    res.status(404).send("User not found");
  }
});

  
  SERVER.listen(3000);
  
