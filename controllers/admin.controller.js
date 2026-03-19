const srv =require('../services/admin.service')

exports.realisation= async (req,res)=>{
    try {
        const data = await srv.creeUnrealisation(req.body)
        res.status(200).json({message:"realisation cree avec succes",data})
    } catch (error) {
        res.status(500).json({message:"une erreur est survenue",error})
    }
}

exports.actualite= async (req,res)=>{
    try {
        const data = await srv.creeUnactualiter(req.body)
        res.status(200).json({message:"actualite cree avec succes",data})
    } catch (error) {
        res.status(500).json({message:"une erreur est survenue",error})
    }
}

exports.annonce= async (req,res)=>{
    try {
        const data = await srv.creeUnannonce(req.body)
        res.status(200).json({message:"annonce cree avec succes",data})
    } catch (error) {
        res.status(500).json({message:"une erreur est survenue",error})
    }
}
 
