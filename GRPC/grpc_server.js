const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "./example.proto";

const { Client } = require('pg')
const client = new Client({
  user: 'a',
  host: 'myhost',
  database: 'juan',
  password: 'a',
  port: 5432,
})
client.connect(function(err) {
  if (err) throw err;
  console.log("Connected! to DB");
});

let items = [];




const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const itemProto = grpc.loadPackageDefinition(packageDefinition);

const server = () => {
  const server = new grpc.Server();
  server.addService(itemProto.ItemService.service, {
    getItem: (_, callback) => {
      const itemName = _.request.name;
      console.log('itemName: ',itemName);
      if(itemName)
      {
        console.log("DATA EXIST", itemName);
        client.query('SELECT * FROM Items;', (err, res) => {
          //console.log(res.rows);
          items = res.rows
          console.log(err ? err.stack : 'Query to Db succes');
          const item = items.filter((obj) => obj.name.includes(itemName));
          callback(null, { items: item});
          //client.end()
        })
      }else{
        console.log("All Data Call");
        client.query('SELECT * FROM Items;', (err, res) => {
          //console.log(res.rows);
          items = res.rows
          console.log(err ? err.stack : 'Query to Db succes');
          const item = items.filter((obj) => obj.name.includes(itemName));
          callback(null, { items: item});
          //client.end()
        })
      }
      
    }
  });
  server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) console.log(err);
    else {
      console.log("GRPC SERVER RUN AT http://localhost:50051");
      server.start();
    }
  });
};

exports.server = server;