const tools=require('../utils/tootls.utils')
const { getUserByIdentifiant}=require('../services/admin.service')
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
  // On extrait les champs attendus depuis le body JSON du login.
  const { username, hash } = req.body

  // Si un des deux champs manque, inutile d'aller plus loin.
  if (!username || !hash) {
    res.status(403).json({ message: 'donne incorect' })
  // On s'assure que ce middleware ne sert bien qu'a la route /login.
  } else if (req.path !== '/login') res.status(400).json({ message: "erruer chemin. On n'est perdue? :)" })
  // Ce controle evite les methodes inattendues sur cette route.
  else if (req.method !== 'POST') res.status(400).json({ message: "erruer methode . ici tu donne pas l'inverse  :)" })
  else {
    // Tout est bon: on laisse le controller de login travailler.
    next()
  }
}
// -------------------------- main auth --------------------------
const auth = async (req, res, next) => {
  // On lit d'abord le cookie, puis `Authorization` en secours.
  const token = tools.getTokenFromRequest(req)

  // Sans token, la route admin doit etre refusee.
  if (!token) return res.status(403).json({ message: 'pas de token' })

  try {
    // Le helper verifie la signature et retourne les infos du JWT.
    const user = tools.decoded(token)

    // On garde l'utilisateur sur la requete pour les middlewares suivants.
    req.user = user
    // On garantit que `req.body` existe meme sur un GET.
    req.body = req.body || {}
    // Compatibilite avec l'ancien code qui lisait `req.body.user`.
    req.body.user = user

    // La requete est authentifiee, on passe a la suite.
    next()
  } catch (err) {
    // Token invalide, mal signe ou expire.
    return res.status(403).json({ message: 'invalid or expired token: ' + err.message })
  }
}

// ------------------------------ admin --------------------------

const isAdmin = async(req, res, next) => {
  const user = req.user || req.body.user

  // Si aucun utilisateur n'est injecte, la verif precedente n'a pas abouti.
  if (!user) {
    return res.status(400).json({ message: 'page reserve pour admins .' })
  }

  const dbUser = await getUserByIdentifiant(user.username)

  if (!dbUser) {
    return res.status(403).json({ message: 'erreur token phantom .' })
  }

  // Ici on verrouille les routes reservees au role admin.
  if (dbUser.role !== 'admin') {
    return res.status(403).json({ message: 'page reserve aux admins .' })
  }

  // Tout est bon: l'utilisateur est bien admin.
  req.user = dbUser
  next()
}

const checkCoockie = (req, res, next) => {
  // Ce middleware réutilise exactement la meme lecture que `auth`.
  const token = tools.getTokenFromRequest(req)

  if (!token) return res.status(401).json({ message: ' pas de token ' })
  try {
    // On decode le JWT puis on l'accroche a la requete.
    const user = tools.decoded(token)
    req.user = user
    next()
  } catch (err) {
    return res.status(403).json({ message: 'invalid or expired token: ' + err.message })
  }
}

module.exports={routeRequette,trafique, logincheck,isAdmin,auth ,checkDataCreat,checkCoockie }
