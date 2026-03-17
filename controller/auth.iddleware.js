const { decoded }= require('../util/token.util')
const { link }= require('../service/post.service')




// ------------------------ check register -----------------------
const checkDataCreat=(req,res,next)=>{ // cette foction est fait que pour une route seulement le createUser

    try {
        const { username,password}=req.body

    if (!username||!password)  
        res.status(401).json({message:"donne incomplet" })

    else if (req.path !=='/createUser') res.status(400).json({message:"erruer chemin. On n'est perdue? :)"})

    else if (req.method !== 'POST') res.status(400).json({message:"erruer methode . ici tu donne pas l'inverse  :)"})
    
    else{
        req.body.valide=true;// 098 65 03 910

        console.log(req.body.valide)
        next()
       }
      
    } catch (err) {
      res.status(400).json({message:"erreur :"+err})  
    }
}
// ------------------------ check login --------------------------
const logincheck=(req,res,next)=>{ // this fuction is juste for the login route

    const {identifian,password}=req.body
    
    console.log(identifian,password)

    if(!identifian||!password){
        res.status(403).json({message:"donne incorect"})
    }
    else if (req.path !=='/login') res.status(400).json({message:"erruer chemin. On n'est perdue? :)"})

    else if (req.method !== 'POST') res.status(400).json({message:"erruer methode . ici tu donne pas l'inverse  :)"})
    
    else{  
        next()
       }

}
// -------------------------- main auth --------------------------
const auth=(req ,res ,next )=>{ // validation du token 

    const header= req.headers.authorization 
  
    if (!header) return res.status(401).json({message:' pas de token '})

           const token = header.split(' ')[1]
          
    try {
            const { id }=req.body.user
            const user = link(id)

            if(!user.id===id) res.status(403).json({ message:"vous ne pouvez ni modifie ce poste ni la supprimer"})

            next()
         
    } catch (err) {

        return res.status(403).json({message:'invalid or expired token'+err})
    } 
}
// ------------------------------ admin --------------------------
const isAdmin =(req,res,next)=>{ // i check if the user is an admin or not
 
    // on prend les element directement dans le body
    if(!req.body.user.role ==='admin')res.status(403).json({message:"page reserve au admins ."})
    // on verifie le role de l'user 
    next()


}
// ------------------------------ owner --------------------------
const IsOwner=(req,res,next)=>{// i check if the user is the owner of the post or not
    const user = decoded(token)
    const auth = link(user.id)  

    if (!auth.id===user.id) res.status(403).json({ message:"vous ne pouvez ni modifie ce poste ni la supprimer"})

    next()
}
const checkCoockie=(req,res,next)=>{ // this fuction gonna check the token in the cookie and if is valible or not

    const token = req.cookies.token

    if (!token) return res.status(401).json({message:' pas de token '})
    try {
        const user = decoded(token)
        req.user = user
        next()
    } catch (err) {
        return res.status(403).json({message:'invalid or expired token'+err})
    }
    
}



module.exports={ checkDataCreat,auth,logincheck,isAdmin,IsOwner}