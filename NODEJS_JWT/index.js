const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//created constant users and did not use any database
const users = [
    {
        email: "john@gmail.com",
        username: "John88",
        id: 111,
        password: '1234@'
    },
    {
        email: "yashi@gmail.com",
        username: "yashi88",
        id: 222,
        password: '12345@'
    },
    {
        email: "yashvi@gmail.com",
        username: "yashvi88",
        id: 333,
        password: '123456@'
    }
]

//get route
app.get('/api', (req, res) => {
    res.json({
        message: "Hello there,this is first route"
    }
    )
})


//implementing login route
app.post('/api/login', (req, res) => {
    console.log('req data', req.body.password, req.body.email);
    users.filter(user => {
        if (user.email === req.body.email) {
            if (user.password === req.body.password) {
                console.log(user);
                //user ID is used payload
                const payload = {
                    "id": user.id
                }

                //header,payload,signature creating JWT
                //shhh is my secret key
                jwt.sign(payload, 'shhh', { expiresIn: '5m' }, (err, token) => {
                    res.json({
                        token: token,
                    }
                    )
                });
            }
        }
    })
})

//send http post request with JWT

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'shhh', (err, authData) => {  //verify JWT
        if (err) {
            res.sendStatus(403);
        }

        else {
            res.json({
                message: "blog posted!!",
                authData: authData
            })
        }
    })
});

function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    //if there is no JWT token or authorization header send status 403
    else {
        res.sendStatus(403);
    }
}


//port no:8000
app.listen(8000, () => {
    console.log("server started on port 8000")
})