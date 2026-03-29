

const routeRequette=(req,res,next)=>{ // on coute tout demmend extern

    const auth=["accueil","realisation","actualites","annonce"]
    const { data }=req.body


    if(!auth.includes(data)){
        res.status(400).json({message:"eh bein on n'est perdues ?"})
        
    }
    
    else if(req.method !== "POST"){
        res.status(400).json({message:"Ohooo on est coince?"})
    }
    else{
        next()
    }
}
const trafique = (req,res,next)=>{
    const path = req.path
    const methode = req.method
    const body= req.body
    const file = req.file

    if(body){
        console.log(body)
    }
    if(file){
        console.log(file)
    }
    
    console.log(path)
    console.log(methode)
   

    next()
}

module.exports={routeRequette,trafique}
