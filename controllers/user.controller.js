// recuperation des donne pour les trois main page de user 

const { getAllElement }= require('../services/admin.service')
  

// =========================== pou eviter de diplique la meme code  ==========================

const server_api=async(req,res)=>{
    const { data }=req.body

    switch (data) {
        case "realisation":
            try {
                const data_realisation = await getAllElement("realisation")
                res.json(data_realisation) // on envoie un tableau pour eviter les erreur de type dans le front
               
            } catch (err) {
                res.status(500).json({ message: "une erreur se produit "+err })
            }
            break
        case "actualites":
        case "actualite":
            try {
                const actualitesData =await getAllElement("actualite")
                res.json(actualitesData)
            } catch (err) {
               res.status(500).json({ message: "une erreur se produit "+err })
            }
            break
        case "accueil":

            try {
                const accueilData =await getAllElement("realisation")
                console.log(accueilData)
                res.json(accueilData)
            } catch (error) {
                res.status(500).json({ message: "une erreur se produit "+error })
            }
            break
        default:
            res.status(400).json({ message: "Invalid data type" })
            break;
    }
}


module.exports={server_api}
