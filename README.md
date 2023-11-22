# Aggregation
By grouping document with aggregation this will give new document in certain condition.

Document during aggregation process pass through this stages.
db.<collection name>.aggregate([
    <stages1>,
    <stages2>,
    <.......>,
    <stagesN>,
])

db.<collection name>.aggregate([])
db.<collection name>.find({})
The above two operation give same result.

# Stages { $match , $group , $project , $sort , $count , $limit , $skip , $out }
Each stage starts from the stage operator
{$<stage operator> : {}}

example 
{$match : { age : {$gt:20}}}
{$group : {_id : "$age"}}
{$sort : {count : -1}}


# match : it is use to filter document by certain query.
{$match : {city : "New York"}}
{$match : $and : [{gender : "female"},{age : {$gt : 25}}]}

# group : it groups document by certain criteria.
{$group :{_id : "$name", total :{$sum : "$price"}}}

  here we doing staging of groups and performing $dateToString operation this will formate the
  date what we desire like yy-mm-dd

  const data = await person
    .aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$registered",
            },
          },
          //
        },
      },
    ])
    .toArray();

# project : it filters field in the document.
{$project :{name : 1 , "companyName.title" : 1}}
{$project :{_id : 0 , name : 1 , age : 1}}
1 means include and 0 means exclude that property
{
      $project: {
        _id:0,
         name: 1,
         info :{
            eyeColor : "$eyeColor",
            county : "$company.location.country"    
            }
         },
    }

in this operation we are doing staging of project and multiply two integers fields
    const data = await person
    .aggregate([
 
      {
        $project: {
          _id: -1,
          name: 1,
          mulAgeInd: { $multiply: ["$index", "$age"] },
        },
      },
     
    ])
    .toArray();

# sort : it sorts the object in orders.
{$sort : {score : -1}}
{$sort : {age : 1,gender : -1}}

first group and sort with two field
[
    {
        $group : {
            _id : {eyeColor : "$eyeColor" , favoriteFruit : "$favoriteFruit"}
        }
    },
    {
        $sort : {"_id.eyeColor" : -1 , "_id.favoriteFruit" : -1}
    }
]



# count : it is count the objects of document.
{$count : "document"}

db.collection.aggregate([]).toArray().length
this will take 1.7 sec result 1000
db.collection.aggregate([]).toArray().itCount()
this will take 1.4 sec result 1000
db.collection.aggregate([{$count : "AllDocumentCount"}]).toArray()
this will take 0.21 sec result 1000


Note = $count will be take less time than the others because the above two first is client-Side Count and the last one is ($count) is Server-Side Count
if you are using db.collection.find({}).count()   this and ($count) with aggregation will take same time both are server side and the find count will give the number.
Find count is the wrapper of the aggregate count.


# limit : it limit the no. of documents.
{$limit : 100}
this query $ limit will give you the only lenth of document what you desire.
const data = await collection.aggregate([
    {
        $limit : 100
    }
]).toArray()

# skip : it is skip certain amount of document.

# out : it is rise the result of aggregation into another collection.
Write resulting document to the mongodb collection

{$out : "newCollection"}

Document from the group stage will be written in the collection "youDesirenameCollection" .
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
NOTE - out must be last stage in the pipeline, if output collection doesnt exist, it will be created automaticlly.

# unwind : split each document with specified array to several documents - one document per array element 

{$unwind : "$Array"}
{$unwind : "$tags"}

example tags : ["first" , "second" , "third"]  this 1 document
and unwind will make it.
docment 1
{tags : "first"}
docment 2
{tags : "second"}
docment 3
{tags : "third"}

Here first we unwind this array and making every array's element to document and after that we group those document which is unwind 

const data = await person.aggregate([
    {
       $unwind : "$tags"
    },
    {
        $group : {
            _id : "$tags"
        }
    }
]).toArray()

# Aggregation Expressions
Expression refers to the name of the field in input document.
"$<field Name>"

example
{$group :{_id : "$age"}}
{$group :{_id : "$company.location.country"}}
{$group :{_id : "$name", total :{$sum : "$price"}}}

# Accumulator maintain state for each group of the documents
$sum $avg $max $min 

sum numeric value for the documents in each group
 {
    $group : { _id : "$age" , totalQuantity : {$sum : "$quantity"}}
 }

  {
    $group : { _id : "$age" , count : {$sum : 1}}
 }

 In this query we group the age and count how many times like (42 people have same age) the same age is repeat and count it with
 $sum accumulator Note- this accumulator work in group stage.
const data = await person.aggregate([
    {
        $group : { 
            _id : "$age" , totalQuantity : {$sum : 1}
        }
    }
]).toArray()

first we unwind the array and second we group it and this count the same tags how many time its happens
const data = await person.aggregate([
    {
       $unwind : "$tags"
    },
    {
        $group : {
            _id : "$tags",
            count : {
                $sum : 1
            }
        }
    }
]).toArray()

In this operation we are grouping the eyeColor field from the documment and calculating age field avarage
using $avg accumulator operator 
const data = await person.aggregate([
    {
        $group : {
            _id : "$eyeColor",
            ageAvg : {$avg : "$age"}
        }
    }
]).toArray()

# Unary Operator : perform operation for each document
# In group stage unary operator can be used only in conjuction with accumulators
unary operator usually work with $project operator

$type $or $and $lt $gt $multiply

type - returns BSON type of field's value

{$type : "$age"} -- integer
{$type : "$name"} -- string

this unary operator give type of field like it is int , string , array or object etc.
const data = await person.aggregate([
  {
    $project : {
      name : 1,
      eyeColorType  : {$type : "$eyeColor"},
      ageType : {$type : "$age"}
    }
  }
]).toArray()

NOTE --
## difference between accumulator and unary operator 
# accumulator operator work with $group operator
# unary operator perform operation for each document


# All aggregation stages can use maximum 100 MB of RAM
# Server will return error if RAM limit exceeded
# Following option will enable mongodb to write stage data to the temporal files.
{ allowDiskUse : true }

example --
db.person.aggregate([], {allowDiskUse:true})
