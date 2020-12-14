// @ts-check

const config = {
  endpoint: "https://yggiotocosmodbaccount.documents.azure.com/",
  key: "7HWWtLHyBlbSfIzCoYZEOMxs8Li63lOqAUJfJKuWFaT9PlL6KeHuZDBYYfn8pBVbfb1Qozsr395pVJcPhTn0pQ==",
  databaseId: "diaccess-cosmos-db",
  containerId: "sensor-data",
  sensors: [
  {
  "id": "5f6c96d273643300063d4a0f",
  "name": "Sportfältet Teleborg",
  "type": "Konstgräs",
  "snowDepthLimit": "20",
  "basevalue": "3008",
  },
  {
  "id": "5f76db9f73643300067f92c5",
  "name": "Arenastaden",
  "type": "Konstgräs",
  "snowDepthLimit": "20",
  "basevalue": "3062",
  },
  {
    "id": "5fbfbfc3038e750006daf014",
    "name": "Norremark",
    "type": "Konstgräs",
    "snowDepthLimit": "20",
    "basevalue": "3063",
    }
 
  ]
  
};




module.exports = config;
