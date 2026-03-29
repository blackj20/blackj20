// simolation data 


const createSpinner = (containerId) => {
    const container = document.getElementById(containerId)
    if (!container) return null

    const wrapper = document.createElement('div')
    const message = document.createElement('p')
    const icon = document.createElement('span')

    wrapper.className = 'cart_spinner'
    icon.className = 'spinner'
    message.className = 'spinner_message'
    message.textContent = 'Chargement...'

    wrapper.append(icon, message)
    container.append(wrapper)

    return {
        show: (text = 'Chargement...') => (message.textContent = text),
        remove: () => wrapper.remove()
    }
}

const spinner = createSpinner('actualiter')

const normalizeImagePath = (path = '') => {
    try {
        const url = new URL(path)
        return url.pathname.replace(/^\/+/, '')
    } catch {
        return path.replace(/^\/+/, '')
    }
}

const registerImageView = (path) => {
    const normalized = normalizeImagePath(path)
    if (!normalized) return
    fetch('/api/image-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: normalized })
    }).catch(() => {})
}

const getData=async()=>{//recuperaeation des donne au back

    try {
        spinner?.show('Chargement...')
        const dataRealisation= await fetch("http://localhost:8080/api/get_actualites",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
             body:JSON.stringify({data:"actualites"}) 
        })

        const realisation= await dataRealisation.json()

        if(!dataRealisation.ok) throw new Error(realisation.message);

        loadindingImg(realisation)
        spinner?.remove()
        
    } catch (err) {
        console.error( "echec lor du chargement des donnes")
        spinner?.show("Échec du chargement")
    }

}

getData()

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
       annonce(elem) 
       
    });
}
const poste=(data_api,parent="",ClassName="item",info_div="active")=>{

    if(!parent)return alert(" erreur arrét 'affichage  parent manquant !")

    const { titre ,img, image, data_description,anneé,localisation }=data_api // on retire tout les donne du data 

    const div_cart =document.createElement("div") // le contenneur
    const div_info =document.createElement("div") // le contenneur
    const icon=document.createElement("i") // icon de l'oeil pour voir les details de la realisation
    const icon_2=document.createElement("i")
    const  titre_=document.createElement("h3")   // titre de la realisation
    const  descrp= document.createElement("p")// description sur la realisation
    const  image =document.createElement("img") // image de la realisation  
    const icon_desc=document.createElement("i") // icon de description

    icon_desc.className="fas fa-info-circle"
    div_info.className=info_div
    div_cart.className=ClassName


    titre_.textContent=titre
    const imgSrc = image || img || "image/logo.png"
    image.src=imgSrc
    if (imgSrc && imgSrc !== "image/logo.png") registerImageView(imgSrc)


    descrp.textContent=data_description||"aucune description pour le moment" 
    descrp.prepend(icon_desc)
    div_info.append(titre_,descrp)
    div_cart.append(image,div_info)

    icon.className="fas fa-eye"
    icon_2.className="fas fa-map-marker-alt"


    if (anneé) {
    const year = document.createElement("p")
    const icon = document.createElement("i")

    icon.className = "fas fa-calendar"

    year.textContent = ` année :`+anneé||"pas d'anneé"
    year.prepend(icon)

    div_info.append(year)
    }
    
    if (localisation) {
        const loc = document.createElement("p")
        const icon_2 = document.createElement("i")
    
        icon_2.className = "fas fa-map-marker-alt"
    
        loc.textContent = ` localisation : ${localisation}`
        loc.prepend(icon_2)
    
        div_info.append(loc)
    }
    div_cart.addEventListener("click",()=>{
        div_info.classList.toggle("info")
    })


     

    document.getElementById(parent).append(div_cart)
}
