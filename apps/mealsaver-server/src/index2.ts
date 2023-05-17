/* eslint-disable turbo/no-undeclared-env-vars */
import express, { Request, Response, Express } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

import { expireTime, CORS } from "./constants";

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
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface UserDataWithoutPassword{
  id: string;
  username:string;
  email:string;
}

export interface Post {
  id: string;
  product: string;
  pricePerUnit: number;
  units: number;
  seller: string;
  location: string;
}

export const users: Array<UserData> = new Array<UserData>();
export let refreshTokens: Array<string> = [];
export const posts: Map<string, Post> = new Map<string, Post>();

const postsByUser: Map<string, Array<string>> = new Map<string, Array<string>>();

export function registerUser(user: UserData) {
  users.push(user);
}

export function addRefreshToken(refreshToken: string) {
  refreshTokens.push(refreshToken);
}

function addPost(post: Post, user: UserData) {
  
  post.seller = user.username;
  
  const postId = uuidv4();
  post.id = postId; 


  posts.set(postId, post);

  const postsOfUser: Array<string>|undefined = postsByUser.get(user.id);
  if(postsOfUser){
    postsOfUser.push(postId);
    postsByUser.set(user.id, postsOfUser)
  }
  else{
    postsByUser.set(user.id, [postId])
  }
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
  res.status(200).json(users.map(({password, ...rest}) => rest));
});

SERVER.post("/users/register", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!(username && email && password)) {
    return res.status(400).send("Missing username, email, or password");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: UserData = { id: uuidv4(), username, email, password: hashedPassword };

    const existsUser: UserData | undefined = users.find(user => user.username === username);

    if (existsUser) {
      res.status(409).send("The username is already taken");
    } else {
      registerUser(user);
      res.status(201).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

SERVER.post("/users/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(400).send("Missing username or password");
  }

  const user: UserData | undefined = users.find(user => user.username === username);

  if (user === undefined) {
    return res.status(400).send("Cannot find the user");
  }

  try {
    if (await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      const accessToken = jwt.sign(userWithoutPassword, SECRET_KEY, { expiresIn: expireTime });
      const refreshToken = jwt.sign(userWithoutPassword, REFRESH_SECRET_KEY);
      addRefreshToken(refreshToken);
      res.json({ accessToken, refreshToken });
    } else {
      res.send("Failed Login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

SERVER.post("/token", (req, res) => {
  const { token: refreshToken } = req.body;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    const { id, username, email } = user;
    const accessToken = jwt.sign({ id, username, email }, SECRET_KEY, { expiresIn: expireTime });
    res.json({ accessToken });
  });
});

SERVER.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

SERVER.put("/users/me", authenticateToken, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { id } = req.body.user;

  if (!id) {
    return res.status(400).send("Missing user id");
  }

  const user = users.find(user => user.id === id);

  if (user) {
    user.email = email || user.email;
    if (password && password !== user.password) {
      user.password = await bcrypt.hash(password, 10);
    }
    res.status(200).send("User data updated");
  } else {
    res.status(404).send("User not found");
  }
});

SERVER.post("/products/add", authenticateToken, async (req: Request, res: Response) => {
  const { post } = req.body;
  const { id } = req.body.user;

  if (!(post && id)) {
    return res.status(400).send("Missing post data or user id");
  }

  try {
    post.id = uuidv4();
    const user = users.find(user => user.id === id);
    if (user) {
      addPost(post, user);
      res.json([...posts.values()]);
    } else {
      res.status(400).send("Invalid user id");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

SERVER.listen(3000);
