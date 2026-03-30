const tools=require('../utils/tootls.utils')

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

// ------------------------ check register -----------------------
const checkDataCreat = (req, res, next) => {
  try {
    const { username, hash } = req.body

    if (!username || !hash)
      res.status(401).json({ message: 'donne incomplet' })
    else if (req.path !== '/creeAdmin') res.status(400).json({ message: "erruer chemin. On n'est perdue? :)" })
    else if (req.method !== 'POST') res.status(400).json({ message: "erruer methode . ici tu donne pas l'inverse  :)" })
    else {
      req.body.valide = true
      next()
    }
  } catch (err) {
    res.status(400).json({ message: 'erreur :' + err })
  }
}
// ------------------------ check login --------------------------
const logincheck = (req, res, next) => {
  const { username, hash } = req.body

  if (!username || !hash) {
    res.status(403).json({ message: 'donne incorect' })
  } else if (req.path !== '/login') res.status(400).json({ message: "erruer chemin. On n'est perdue? :)" })
  else if (req.method !== 'POST') res.status(400).json({ message: "erruer methode . ici tu donne pas l'inverse  :)" })
  else {
    next()
  }
}
// -------------------------- main auth --------------------------
const auth = async (req, res, next) => {
  const header = req.headers.authorization

  if (!header) return res.status(401).json({ message: ' pas de token ' })

  const token = header.split(' ')[1]

  try {
    const user = tools.decoded(token)
    console.log(user)

    next()
  } catch (err) {
    return res.status(403).json({ message: 'invalid or expired token' + err })
  }
}

// ------------------------------ admin --------------------------

const isAdmin = (req, res, next) => {
    if(!req.body){
        return res.status(400).json({ message: 'page reserve pour admins .' })
    }

  if (!req.body.user.role === 'admin') res.status(403).json({ message: 'page reserve au admins .' })
  next()
}

const checkCoockie = (req, res, next) => {
  const token = req.cookies.token

  if (!token) return res.status(401).json({ message: ' pas de token ' })
  try {
    const user = decoded(token)
    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ message: 'invalid or expired token' + err })
  }
}

module.exports={routeRequette,trafique, logincheck,isAdmin,auth ,checkDataCreat,checkCoockie }
