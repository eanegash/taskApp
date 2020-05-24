// CRUD create read update delete

require('dotenv').config();
//const mongodb = require('mongodb');
//const MongoClient = mongodb.MongoClient;
// const ObjectId = mongodb.ObjectID;
const { MongoClient, ObjectID } = require('mongodb');

const id = new ObjectID();

//Mongose Connection
MongoClient.connect(process.env.DB_CONNECTION, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!')
    }

    const db = client.db(process.env.DB_NAME);

//    db.collection('users').insertMany([
//       { name: 'John', age: 30
//        },{ name: 'Jessica', age: 25
//        },{ name: 'Jacob', age: 58 }
        //MongoDB results is a Callback format for insertOne.
//    ], (error, result) => {
//       if (error){
//            return console.log('Unable to INSERT USER(s)');
//        }
        //Result Object - command executed successfully. Property: ops, contains all   the documents inserted.
//        console.log(result.ops);
//    });

    db.collection('users').insertOne({
        id: id,
        name: "Jones",
        age: 15
    }, (error, results) => {
        if (error){
            return console.log('Unable to Insert User(s)');
        }
        //Result Object - command executed successfully. Property: ops, contains all   the documents inserted.
        console.log(result.ops);
    })
});