// simolation data 

const createSpinner = (containerId = "actualite_data") => {
    const container = document.getElementById(containerId)
    if (!container) return null

    const body_ = document.createElement("div")
    const message = document.createElement("p")
    const spinner = document.createElement("span")
    
    spinner.className="spinner"
    message.className="spinner_message"
    message.textContent = "Chargement..."
    body_.className="cart_spinner"

    body_.append(spinner, message)
    container.append(body_)

    return {
        show: (text = "Chargement...") => message.textContent = text,
        remove: () => body_.remove()
    }
}

const spinner = createSpinner()


const getData=async()=>{//recuperaeation des donne au back

    try {
        const dataRealisation= await fetch("/api/get_actualites",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
             body:JSON.stringify({data:"actualites"}) 
        })

        const data= await dataRealisation.json()
        spinner?.remove()

        if(!dataRealisation.ok) throw new Error(data.message);

        loadindingImg(data)
        
    } catch (err) {
        console.error( "echec lor du chargement des donnes"+err)
        spinner?.show("Échec du chargement")
    }

}

getData()


const viewedImages = new Set()
const normalizeImagePath = (path = '') => {
    try {
        const url = new URL(path)
        const cleaned = url.pathname.replace(/^\/+/, '')
        return cleaned.startsWith('uploads/') ? cleaned : `uploads/${cleaned}`
    } catch {
        const cleaned = path.replace(/^\/+/, '')
        return cleaned.startsWith('uploads/') ? cleaned : `uploads/${cleaned}`
    }
}

const registerImageView = (path) => {
    const normalized = normalizeImagePath(path)
    if (!normalized || viewedImages.has(normalized)) return
    viewedImages.add(normalized)
    fetch('/api/image-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: normalized })
    }).catch(() => {})
}

const annonce =(data,parent="actualiter",className_="cart")=>{ // createur d'annonce 
    const carte_annonce=document.createElement("div")
    const titre =document.createElement("h3")
    const evenement =document.createElement("p")

    titre.textContent=data.titre
    carte_annonce.className=className_ // pour son style globale 
    evenement.textContent=data.message 
    carte_annonce.append(titre, evenement )

    document.getElementById(parent).append(carte_annonce)

}
const loadindingImg=(data)=>{// on cree des poste en boucle
    data.forEach(elem => {
       poste(elem,parent="actualite_data") 
       
    });
}
const poste=(data_api,parent="",ClassName="item",info_div="active")=>{

    if(!parent)return alert(" erreur arrét 'affichage  parent manquant !")

    const { titre,description,image  }=data_api // on retire tout les donne du data 

    const div_cart =document.createElement("div") // le contenneur
    const div_info =document.createElement("div") // le contenneur
    const icon=document.createElement("i") // icon de l'oeil pour voir les details de la realisation
    const icon_2=document.createElement("i")
    const  titre_=document.createElement("h3")   // titre de la realisation
    const  descrp= document.createElement("p")// description sur la realisation
    const  image_ =document.createElement("img") // image de la realisation  
    const icon_desc=document.createElement("i") // icon de description

    icon_desc.className="fas fa-info-circle"
    div_info.className=info_div
    div_cart.className=ClassName


    titre_.textContent=titre
    const imgSrc = image || "image/logo.png"
    image_.src=imgSrc
    if (image) registerImageView(imgSrc)


    descrp.textContent=description||"aucune description pour le moment" 
    descrp.prepend(icon_desc)
    div_info.append(titre_,descrp)
    div_cart.append(image_,div_info)

    icon.className="fas fa-eye"
    icon_2.className="fas fa-map-marker-alt"


    div_cart.addEventListener("click",()=>{
        div_info.classList.toggle("info")
    })
    document.getElementById(parent).append(div_cart)
}

