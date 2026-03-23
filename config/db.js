const sqlt=require('sqlite3')
const { DB_PATH }=process.env
console.log(typeof(DB_PATH))

const db=new sqlt.Database(DB_PATH,(err)=>{
    if(err){

        console.log('Error connecting to database',err)
    }else{
        console.log('Connected to database '+DB_PATH)
    }
})
module.exports=db