// @ts-nocheck
//  <ImportConfiguration>
const CosmosClient = require("@azure/cosmos").CosmosClient
const config = require("./config");
//const dbContext = require("./data/databaseContext")
const express = require('express')
const bodyparser = require("body-parser")
const moment= require('moment');
const { Item } = require("@azure/cosmos");
const app = express()
app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
//app.use('/', express.static(__dirname + '/public'));
//app.use('/', express.static(path.join(__dirname + '/public')));
app.set("view engine", "ejs");



async function getFullResult() {

  // <CreateClientObjectDatabaseContainer>
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  try {
    const currentDateTime = {
      query: 'SELECT GetCurrentDateTime() as currentUtcDateTime'
    };

    const { resources: today } = await container.items
      .query(currentDateTime)
      .fetchAll();

    const yesterday = {
      query: 'SELECT DateTimeAdd("DD", -1,' + '\"' + today[0].currentUtcDateTime + '\"' + ') AS yesterday'
    };

    const { resources: day } = await container.items
      .query(yesterday)
      .fetchAll();

    //console.log(day[0].yesterday)

    // query to return all items in 24 hours
    const querySpec = {
      query: 'SELECT * from c  WHERE c.ReportedAt >=' + '\"' + day[0].yesterday + '\"' + 'ORDER By c.ReportedAt DESC'
    };

    // read all items in the Items container
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
 
    return items

  } catch (err) {
    console.log(err.message);
  }

}



async function getHours() {

  let hours = await getFullResult()

  console.log(hours)
}


let arr = []
async function main() {

  // <CreateClientObjectDatabaseContainer>
  const { endpoint, key, databaseId, containerId, sensors } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  // Make sure Tasks database is already setup. If not, create it.
  //await dbContext.create(client, databaseId, containerId);

  try {
    const currentDateTime = {
      query: 'SELECT GetCurrentDateTime() as currentUtcDateTime'
    };

    const { resources: today } = await container.items
      .query(currentDateTime)
      .fetchAll();

    const yesterday = {
      query: 'SELECT DateTimeAdd("DD", -1,' + '\"' + today[0].currentUtcDateTime + '\"' + ') AS yesterday'
    };

    const { resources: day } = await container.items
      .query(yesterday)
      .fetchAll();

    //console.log(day[0].yesterday)

    // query to return all items
    const querySpec1 = {
      query: 'SELECT * from c  WHERE c.ReportedAt >=' + '\"' + day[0].yesterday + '\"' + 'ORDER By c.ReportedAt DESC '
    };
    const { resources: items } = await container.items
      .query(querySpec1)
      .fetchAll();
    //let filtered = items.filter(item => item.DeviceId === '5f76db9f73643300067f92c5').sort((a,b)=> {return new Date(b.ReportedAt) - new Date(a.ReportedAt)});
    //let filter = filtered.map(item => ({ SnowDepth: 3065 -item.Distance, ReportedAt: new Date(moment.utc(item.ReportedAt ).local().format('YYYY-MM-DD HH:mm:ss')).getUTCHours()  }))
    //console.log(filtered)
    //console.log(filter)
    let querySpec2 = {}
    for (let i = 0; i < sensors.length; i++) {
      //console.log(sensor.id)
      querySpec2 = {
        query: "SELECT c.Distance, c.Temperature FROM c where c.DeviceId =" + "\'" + sensors[i].id + "\'" + "order by c.ReportedAt DESC OFFSET 0 LIMIT 1"
      }
      const { resources: items } = await container.items
        .query(querySpec2)
        .fetchAll();
      
      arr.push(items[0])
      arr[i].Id = sensors[i].id
      arr[i].Name = sensors[i].name
      arr[i].Type = sensors[i].type
      arr[i].SnowDepthLimit = sensors[i].snowDepthLimit
      arr[i].BaseValue = sensors[i].basevalue
      arr[i].SnowDepth = sensors[i].basevalue - arr[i].Distance
      if(arr[i].SnowDepth < 0) arr[i].SnowDepth = 0
      arr[i].SnowDepth >= arr[i].SnowDepthLimit? arr[i].Status = 'Closed' : arr[i].Status = 'Opened'
    }

    console.log(arr)



    let querySpec3 = {}
    for (let i = 0; i < sensors.length; i++) {
      //console.log(sensor.id)
      querySpec3 = {
        query: "SELECT c.Distance, c.ReportedAt FROM c WHERE c.DeviceId =" + "\'" + sensors[i].id + "\'" + "ORDER BY c.ReportedAt DESC "
      }
      const { resources: pair } = await container.items
        .query(querySpec3)
        .fetchAll();
      
     //console.log(pair)
    }

    


    let hoursArray = []
    let set = new Set()

    items.forEach(item => {
      new Date(item.ReportedAt).getUTCHours() + 1 === 24? set.add(0):set.add(new Date(item.ReportedAt).getUTCHours()+1)
    });
    hoursArray = Array.from(set)
   // console.log(hoursArray)

    app.get("/", function (req, res) {
      res.render("sensordata", {
        items: items,
        arr: arr,
        
      })
    })

    app.listen(3000, function () {
      console.log("Server started on port 3000")
    })

  } catch (err) {
    console.log(err.message);
  }
}

main();
//  (async () => {
// console.log(await getFullResult())
// })()

// let x = await getFullResult()
// console.log( x )
//export { getFullResult };