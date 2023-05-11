import express, { Request, Response, Express } from "express"
import bcrypt from "bcrypt"



interface UserData  {
    username: string;
    email:string;
    password:string;
}


const SERVER: Express = express()
SERVER.use(express.json())











const users: Array<UserData> = new Array<UserData>



SERVER.get('/users', (req: Request, res: Response) => {
    res.json(users)
})






SERVER.post('/users', async (req: Request, res: Response) => {

    try {
        
        const username:string = req.body.username;
        const email:string = req.body.email;
        
        // const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        // console.log(salt)
        // console.log(hashedPassword)




        const user:UserData = { username: username, email:email, password: hashedPassword }

        users.push(user)

        res.status(201).send()
    }
    catch {
        res.status(500).send()
    }



})


SERVER.post('/users/login', async(req: Request, res: Response) => {
    const user:UserData | undefined = users.find((user:UserData)=> user.username == req.body.username)

    if(user == undefined){
        return res.status(400).send('Cannot find the user')
    }

    try{

      if(await bcrypt.compare(req.body.password, user.password)){
        res.send('Succes')
      }
      else{
        res.send('Failed Login')
      }
    }
    catch(e){
        console.error(e)

        res.status(500).send()
    }
})


SERVER.listen(3000)