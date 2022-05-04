'use strict';

const express = require('express');
const https = require('https')
const redis = require('redis');
const axios = require('axios')

const PORT = 8070;
const HOST = '0.0.0.0';
const url = `redis://redis_sv:6379`;

const app = express();
const client = redis.createClient({url});

(async () => {
  console.log('Conectado')
  await client.connect();
})();


function search(item)
{
  
}

app.get('/search', (req, res) => {
  console.log('Entro al Servidor');
  const item = req.query.q;
  console.log('item Enviado: ',item)
  let cache = null;
  (async () => {
    let reply = await client.get(item);
    console.log('Cache?: ',reply); 
      if(reply)
      {
        console.log('Esta en Cache');
        cache = JSON.parse(reply)
        res.json(cache);
      }else{
        console.log('No esta en Cache');
        axios.get('http://gr_rpc:8050/items', { params:{name: item}}).then(res2 => {
          console.log('Data:',res2.data);
          let data = JSON.stringify(res2.data)
          client.set(item, data);
          cache = res2.data;
          res.json(cache);
        }).catch(error => {console.error(error)})
        
      }
  })();
});


app.listen(PORT, HOST, () => {
  console.log(`SERVER RUN AT http://localhost:${PORT}`);
});