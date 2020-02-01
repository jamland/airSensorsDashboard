const MongoClient = require("mongodb");
const sensor = require("node-dht-sensor").promises;
const { mongoUser, mongoPassword, mongoURI } = require("./keys_dev.js");

sensor.initialize({
  test: {
    fake: {
      temperature: 20,
      humidity: 30
    }
  }
});

MongoClient.connect(mongoURI, { useNewUrlParser: true }, (err, db) => {
  if (err) {
    console.log(
      "Failed to Establish Connection with MongoDB with Error: " + err
    );
    throw new Error(
      "Failed to Establish Connection with MongoDB with Error: " + err
    );
  }
  console.log("Successfully Established Connection with MongoDB");

  // dbo.createCollection("sensorsData", (err, res) => {
  //   if (err) throw err;
  //   console.log("collection created");
  //   db.close();
  // });

  // const query = {
  //   env: "test"
  // };
  // const dbo = db.db("SensorData");
  // dbo.collection("sensorsData").deleteMany(query, function(err, obj) {
  //   if (err) throw err;
  //   console.log("1 document deleted");
  //   db.close();
  // });
  setInterval(() => readSaveRoutine(db), 2000);
});

const readSaveRoutine = async db => {
  const { temperature, humidity } = await readDHT11();
  const timeStamp = new Date().toISOString();

  // DHT-11 | Time |  Temp | Humidity | env
  const newInsert = {
    name: "DHT11",
    timeStamp,
    temperature,
    humidity,
    env: "test"
  };

  const dbo = db.db("SensorData");
  dbo.collection("sensorsData").insertOne(newInsert, (err, res) => {
    if (err) throw err;

    // db.close();
  });
};

const readDHT11 = async () => {
  try {
    const res = await sensor.read(11, 4);
    console.log(
      `temp: ${res.temperature.toFixed(1)}°C, ` +
        `humidity: ${res.humidity.toFixed(1)}%`
    );
    return res;
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
};
