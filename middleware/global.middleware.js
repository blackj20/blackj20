

const routeRequette=(req,res,next)=>{ // on coute tout demmend extern

    const auth=["accueil","realisation","actualites"]
    const { data }=req.body


    if(!auth.includes(data)){
        res.status(400).json({message:"eh bein on n'est perdues ?"})
        
    }
    // else if(data===auth[0]){

    //     delete(req.body.data)
    //     req.body.data = "realisation"
    //     next()   
    // }
    
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
    const body = req.resume
    

    console.log(path)
    console.log(methode)
    console.log(body)

    next()
}

module.exports={routeRequette,trafique}