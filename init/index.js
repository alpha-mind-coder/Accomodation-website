const mongoose=require("mongoose");

const initData = require("./data.js");
const Listing =require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
  console.log("connected to DB");
})
.catch((err)=>{
  console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
  await Listing.deleteMany({});
  //again need to put it into initdata
  // as it makes new array so have to assign again
  // so when we insert the new array in which we added owner is formed
  initData.data = initData.data.map((obj)=>(
    {...obj,owner:"691e0c3308d8d871fe906a82"}
  ))
  await Listing.insertMany(initData.data)
  console.log("data was initialised");
  
}
initDB();