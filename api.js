const express = require("express")
const api = express.Router()

const store = require('./data/store')

api.post('/user', (req, res) => {
    const user = req.body
    const users = store.getUsers()
    let userId = 1
    if (users.length > 0) {
        userId = users[users.length - 1].id + 1
    }
    const newUser = {
        id: userId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    }

    users.push(newUser)
    //ensure values saved
    console.log(users);
    store.saveUsers(users)

    res.json(users)
})

api.get('/user', (req, res) => {
    const users = store.getUsers()
    res.json(users)
})

api.delete('/user/:id', (req, res) => {
    //get specific id
    const id = req.params.id;
    //get users
    const users = store.getUsers(); 
    let deleted = false;
    let contactindex = users.length-1;
    //while loop runs unless user is deleted
    while (!deleted) {
        //check if id of array[index]==specific id
        if (users[contactindex].id == id) { 
            //runner stores new indexes
            var runner = 0;
            while (contactindex != users.length-1) {
                runner = users[contactindex];
                users[contactindex] = users[contactindex + 1];
                users[contactindex + 1] = runner;
                contactindex++;
            }
            users.pop();
            deleted = true;
        }
        contactindex--;
    }
    //save users
    store.saveUsers(users)
    res.json(users);
})

//post route to get specific user by id
api.post('/user/specificuser', (req, res) => { 
    //get users from store
    const users = store.getUsers(); 
    //get user from req.body
    const user = req.body;
    //initialize specific user id to be moved by index
    let specificuserid;
    for (let i = users.length - 1; i >= 0; i--) {
        if (users[i].name == user.name && users[i].email == user.email && users[i].phone == user.phone) {
            //if user id matches, specific id becomes users[i]
            specificuserid = users[i];
            res.json(JSON.stringify(specificuserid));
        }
        else {
            continue;
        }
    }
})

//update user based on id
api.put('/user/:id', (req, res) => { 
    const contactChanged = req.body;
    //get user from store
    let users = store.getUsers(); 
    let edited = false;
    let index = 0;
    while (!edited && index < users.length) {
        if (users[index].id == contactChanged.id) {
            users[index].name = contactChanged.name;
            users[index].email = contactChanged.email;
            users[index].phone = contactChanged.phone;
    
            edited = true;
        }
        index++;
    }

    store.saveUsers(users);
    res.json(users);
})

module.exports = api