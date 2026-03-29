// recuperation des donne pour les trois main page de user 

const { getAllElement, incrementImageView }= require('../services/admin.service')
  

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
        case "annonce":
            try {
                const annonces = await getAllElement("annonce")
                res.json(annonces)
            } catch (error) {
                res.status(500).json({ message: "une erreur se produit "+error })
            }
            break
        default:
            res.status(400).json({ message: "Invalid data type" })
            break;
    }
}

const logImageView = async (req, res) => {
    const { imagePath, imageId } = req.body

    // on attend un chemin d'image, mais on journalise l'id si jamais il est envoyé
    console.log("image vue :", imagePath || imageId)

    if (!imagePath && !imageId) {
        return res.status(400).json({ message: "imagePath requis" })
    }

    try {
        // le service incrémente via le chemin; si seul un id est fourni, on renvoie une erreur claire
        if (!imagePath && imageId) {
            return res.status(400).json({ message: "envoyez imagePath (ex: uploads/xxx.jpg)" })
        }
        const result = await incrementImageView(imagePath)
        if (!result.updated) return res.status(404).json({ message: result.reason || "image introuvable" })
        res.json({ message: "vue comptabilisée", views: result.views })
    } catch (error) {
        res.status(500).json({ message: "une erreur se produit " + error })
    }
}


module.exports={server_api,logImageView}
