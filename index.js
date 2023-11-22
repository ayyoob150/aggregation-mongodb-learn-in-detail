const app = require("express")();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { group } = require("console");
dotenv.config();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ date: "hi there" });
});

const client = new MongoClient(process.env.MONGODB_URL);
const dbName = "aggregate";

function ISODate(dateString) {
  return new Date(dateString);
}

function NumberInt(value) {
  return parseInt(value, 10);
}

const main = async () => {
  await client.connect();
  console.log("connected to the db");
  const db = client.db(dbName);
  const person = db.collection("person");

  // this query will give all the document where isActive field is true
  // const data = await person.aggregate([{$match : {isActive : true}}]).toArray()

  // this query will give all the document where age is greater than 25
  // const data = await person.aggregate([
  //     {
  //         $match : {
  //             age : {$gt : 25}
  //         }
  //     }
  // ]).toArray()

  // this query will give all the document where age is less than 25
  // const data = await person.aggregate([
  //     {
  //         $match : {
  //             age : {$lt : 25}
  //         }
  //     }
  // ]).toArray()

  //it will check the size of the array of that field and give the result if the size matches
  // const data = await person.aggregate([
  //     {
  //         $match : {
  //             tags : {$size : 5}
  //         }
  //     }
  // ]).toArray()

  // this query will give the result which is not equal to the give property
  //   const data = await person
  //     .aggregate([
  //       {
  //         $match: {
  //           eyeColor: { $ne: "blue" },
  //         },
  //       }
  //     ])
  //     .toArray();

  // Grouping this document will give documnet where key will be _id and the age field from the main document will be the _id of new document
  // const data = await person.aggregate([
  //     {
  //         $group : {
  //             _id : "$age"
  //         }
  //     }
  // ]).toArray()

  // the result will look like this

  // [
  //     {_id : 38},
  //     {_id : 32},
  //     {_id : 28},
  //     {_id : 81},
  //     {_id : 58},
  // ]

  // grouping this document behalf of gender and making it _id it will give only two document male and female

  // const data = await person.aggregate([
  //     {
  //         $group : {
  //             _id : "$gender"
  //         }
  //     }
  // ]).toArray()

  // nasted grouping of document
  // const data = await person.aggregate([
  //     {
  //         $group : {
  //             _id : "$company.location.country"
  //         }
  //     }
  // ]).toArray()

  // In this query first we match then we group it

  // const data = await person.aggregate([
  //     {
  //         $match : {
  //             age : 38
  //         }
  //     },
  //    {
  //     $group : {
  //         _id : {
  //             name : "$name",
  //             age:"$age",
  //             isActive:"$isActive"
  //         }
  //     }
  //    }
  // ]).toArray()

  // Here we first group the document and match the what we get from the grouping
  //   const data = await person
  //     .aggregate([
  //       {
  //         $group: {
  //           _id: {
  //             name: "$name",
  //             age: "$age",
  //             isActive: "$isActive",
  //           },
  //         },
  //       },
  //       {
  //         $match: {
  //           "_id.age": 38,
  //         },
  //       },
  //     ])
  //     .toArray();

  // this will give the total count of the document

  //   const data = await person.aggregate([
  //     {$count : "document"}
  //   ]).toArray()

  // first this will group nasted document and give total count only
  //   const data = await person.aggregate([
  //     {$group : {_id : "$company.location.country"}},
  //     {$count : "document"}
  //   ]).toArray()

  // const data =await person.aggregate([
  //     {
  //         $match : {age : {$gt : 25}},
  //     },
  //     {
  //         $group : {
  //             _id : { eyeColor : "$eyeColor" ,age : "$age"}
  //         }
  //     },
  //     {
  //         $count : "total count"
  //     }
  // ]).toArray()

  

  //this sort will give the document age ascending eyeColor ascending gender descending order
  // const data =await person.aggregate([
  //     {
  //         $sort : {age : 1 , eyeColor: 1 , gender : -1}
  //     }
  // ]).toArray()

  //first group and sort with two field
  // const data = await person.aggregate([
  //     {
  //         $group : {
  //             _id : {eyeColor : "$eyeColor" , favoriteFruit : "$favoriteFruit"}
  //         }
  //     },
  //     {
  //         $sort : {"_id.eyeColor" : -1 , "_id.favoriteFruit" : -1}
  //     }
  // ]).toArray()

  // $project query , this is only fetch that specific field that in is 1 means include and 0 is refer to exlude that field from
  // that document.

//   const data = await person.aggregate([
//     {
//       $project: {
//         name: 1,
//         "company.location.country": 1,
//       },
//     },
//   ]).toArray()

//   const data = await person.aggregate([
//     {
//       $project: {
//         _id:0,
//         name: 1,
//         info :{
//             eyeColor : "$eyeColor",
//             county : "$company.location.country"
//         }
//       },
//     },
//   ]).toArray()

// this query $ limit will give you the only lenth of document what you desire.

// const data = await person.aggregate([
//     {
//         $limit : 100
//     }
// ]).toArray()


// here first we unwind this array and making every array's element to document and after that we group those document which is unwind 

// const data = await person.aggregate([
//     {
//        $unwind : "$tags"
//     },
//     {
//         $group : {
//             _id : "$tags"
//         }
//     }
// ]).toArray()


// In this query we group the age and count how many times the same age is repeat and count it with
// $sum accumulator Note- this accumulator work in group stage.
// const data = await person.aggregate([
//     {
//         $group : { 
//             _id : "$age" , totalQuantity : {$sum : 1}
//         }
//     }
// ]).toArray()

// first we unwind the array and second we group it and this count the same tags how many time its happens

// const data = await person.aggregate([
//     {
//        $unwind : "$tags"
//     },
//     {
//         $group : {
//             _id : "$tags",
//             count : {
//                 $sum : 1
//             }
//         }
//     }
// ]).toArray()

// In this operation we are grouping the eyeColor field from the documment and calculating age field avarage
// using $avg accumulator operator 
// const data = await person.aggregate([
//     {
//         $group : {
//             _id : "$eyeColor",
//             ageAvg : {$avg : "$age"}
//         }
//     }
// ]).toArray()

// this unary operator give type of field like it is int , string , array or object etc

// const data = await person.aggregate([
//   {
//     $project : {
//       name : 1,
//       eyeColorType  : {$type : "$eyeColor"},
//       ageType : {$type : "$age"}
//     }
//   }
// ]).toArray()

// Document from the group stage will be written in the collection "youDesirenameCollection" .
const data = await person.aggregate([
  {
    $project : {
      name : 1,
      eyeColorType  : {$type : "$eyeColor"},
      ageType : {$type : "$age"}
    },
  },
  {
    $out : "outCollection"
  }
]).toArray()

  app.get("/data", (req, res) => {
    res.json(data);
  });

  //     await person.insertMany([
  //         {
  //           "index": NumberInt(448),
  //           "name": "Meredith Velasquez",
  //           "isActive": true,
  //           "registered": ISODate("2018-01-01T03:08:12+0000"),
  //           "age": NumberInt(39),
  //           "gender": "female",
  //           "eyeColor": "green",
  //           "favoriteFruit": "apple",
  //           "company": {
  //             "title": "TUBESYS",
  //             "email": "meredithvelasquez@tubesys.com",
  //             "phone": "+1 (981) 410-2067",
  //             "location": {
  //               "country": "Italy",
  //               "address": "228 Main Street"
  //             }
  //           },
  //           "tags": [
  //             "qui",
  //             "ex",
  //             "nostrud",
  //             "quis",
  //             "et"
  //           ]
  //         },
  //       ])
};
main()
  .then(() => {
    console.log("db handshake");
  })
  .catch((e) => console.log("error", e.message))
  .finally(() => client.close());

// mongoose.connect(process.env.MONGODB_URL)
// .then(()=>{
//     console.log("database connected");
// })
// .catch(e=>{
//     console.log("error",e.message);
// })

app.listen(process.env.PORT || 2024, () => {
  console.log("server is running on", process.env.PORT);
});
