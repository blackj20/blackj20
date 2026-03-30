const bcypte= require('bcrypt')
const jwt =require('jsonwebtoken')
const { JWT_SECRET ,JWT_EXPIRES_IN} = process.env



console.log(` le secret ${JWT_SECRET} expire en ${JWT_EXPIRES_IN}`)

const decoded=(token)=>{ // verification du token 
            
        return jwt.verify(token,JWT_SECRET )
        
    }

const  signeToken=(user)=>{ // signature avec secret 

    // j'en code le id le username et le role
    return  jwt.sign({id:user.id,
        username:user.username,
        password:user.password,
        role:user.rolr,
        created_at:user.created_at},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
}

const comparePassword= async(password_,{password})=>{ // compare le mot de passe
    console.log()
   return await bcypte.compare(password_,password)
}

const cryptePassword=async(password)=>{ // pour acher le mot de pass
   return await bcypte.hash(password,12)
   
}



// const init = async (target) => {
//     const adminExists = await new Promise((resolve, reject) => {
//         db.get('SELECT * FROM users WHERE username = ?', [target], (err, row) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 resolve(!!row)
//             }
//         })
//     })

//     if (!adminExists) {
//         const hashedPassword = await  cryptePassword('admin')
      
//         await new Promise((resolve, reject) => {
//             db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin'], function (err) {
//                 if (err) {
//                     reject(err)
//                 } else {
//                     resolve()
//                 }
//             })
//         })
//         console.log('Admin user created with username "admin" and password "admin"')
//     } else {
//         console.log('Admin user already exists')
//     }
// }

// init().catch(err => console.error('Error initializing database:', err))




module.exports={comparePassword,cryptePassword,decoded , signeToken}
