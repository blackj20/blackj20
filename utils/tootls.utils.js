const bcypte= require('bcrypt')
const jwt =require('jsonwebtoken')
const { JWT_SECRET ,JWT_EXPIRES_IN} = process.env


console.log(JWT_SECRET ,JWT_EXPIRES_IN)


const decoded=(token)=>{ // verification du token 
            
        return jwt.verify(token,JWT_SECRET )
        
    }

const  signeToken=(user)=>{ // signature avec secret 

    // j'en code le id le username et le role
    return  jwt.sign({id:user.id,email:user.email,username:user.username,role:user.role},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
}

const comparePassword= async(password,user)=>{ // compare le mot de passe
   return await bcypte.compare(password,user.password)
}

const cryptePassword=async(password)=>{ // pour acher le mot de pass
   return await bcypte.hash(password,12)
   
}





module.exports={comparePassword,cryptePassword,decoded , signeToken}
