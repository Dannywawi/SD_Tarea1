const express = require('express');
const redis = require('redis');
const app = express();
const {promisify} = require('util');
const axios = require('axios');
const { json } = require('express');

const port = process.env.port || 3000;

const client = redis.createClient({
    host: process.env.REDIS_HOST,   
    port: 6379
});
client.connect();

const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

client.on("error", function(error) {
    console.error(error);
});

app.get('/',(req,res)=>{
    res.send("<h1>Sistemas Distribuidos</h1>");
});

app.get('/inventory/search',async (req,res)=>{
    try {
        let x = null
        const key = req.query.q;
        (async () =>{
            let rep = await client.get(key);
            if (rep) {
                x = JSON.parse(rep);
                res.json(x);
            }
            else{
                axios.get("direccion de docker de GRPC", { params:{ name : key}}).then(json =>{
                    let data = JSON.stringify(json.data)
                    client.set(Key, data);
                    cache = json.data;
                    res.json(cache);
                })
            }
        })
        
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`API RUN AT http://localhost:${port}`);
  });
