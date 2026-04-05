
const createSpinner = (containerId = "realisation-container") => {
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
const viewedImages = new Set()

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
    if (!normalized || viewedImages.has(normalized)) return
    viewedImages.add(normalized)
    fetch('/api/image-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: normalized })
    }).catch(() => {})
}

const getPostTimestamp = ({ created_at, annee, ['anneé']: anneeAccent }) => {
    const directTime = created_at ? new Date(created_at).getTime() : NaN
    if (!Number.isNaN(directTime)) return directTime

    const yearMatch = String(annee || anneeAccent || '').match(/\d{4}/)
    return yearMatch ? new Date(`${yearMatch[0]}-01-01T00:00:00`).getTime() : 0
}

const getDisplayDate = ({ created_at, annee, ['anneé']: anneeAccent }) => {
    if (created_at) {
        const date = new Date(created_at)
        if (!Number.isNaN(date.getTime())) {
            return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
        }
    }

    return annee || anneeAccent || ''
}

const getLatestPosts = (posts = [], limit = 3) => {
    return [...posts]
        .sort((first, second) => getPostTimestamp(second) - getPostTimestamp(first))
        .slice(0, limit)
}



const getData=async()=>{//recuperaeation des donne au back

    try {
        
        const dataRealisation= await fetch("/api/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
             body:JSON.stringify({data:"accueil"}) 
        })

        const realisation =await  dataRealisation.json()

        if(!dataRealisation.ok) throw new Error(realisation.message);

        loadindingImg(getLatestPosts(Array.isArray(realisation) ? realisation : []))
        spinner?.remove()
        
    } catch (err) {
        console.error( "echec lor du chargement des donnes"+err)
        spinner?.show("Échec du chargement")
    }

}

getData()

const poste=(data_api,parent="",ClassName="item",info_div="active")=>{

    if(!parent)return alert(" erreur arrét 'affichage  parent manquant !")

    const { annee, anneé, localisation, titre, description, image }=data_api // on retire tout les donne du data 
    const yearValue = annee || anneé

    const div_cart =document.createElement("div") // le contenneur
    const div_info =document.createElement("div") // le contenneur
    const icon=document.createElement("i") // icon de l'oeil pour voir les details de la realisation
    const icon_2=document.createElement("i")
    const  titre_=document.createElement("h3")   // titre de la realisation
    const  descrp= document.createElement("p")// description sur la realisation
    const  image_ =document.createElement("img") // image de la realisation  
    const icon_desc=document.createElement("i") // icon de description

    // div_cart.id="image"

    icon_desc.className="fas fa-info-circle"
    div_info.className=info_div
    div_cart.className=ClassName


    titre_.textContent=titre
    image_.src=image||"image/logo.png"
    if (image) registerImageView(image)


    descrp.textContent=description||"aucune description pour le moment" 
    descrp.prepend(icon_desc)
    div_info.append(titre_,descrp)
    div_cart.append(image_,div_info)

    icon.className="fas fa-eye"
    icon_2.className="fas fa-map-marker-alt"

    // localisation icon 
    // date icon  
    
    if (yearValue || data_api.created_at) {
        const year = document.createElement("p")
        const icon = document.createElement("i")

        icon.className = "fas fa-calendar"

        year.textContent = ` date : ${getDisplayDate(data_api)}`
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



const loadindingImg=(data)=>{// on cree des poste en boucle

    const container = document.getElementById("realisation-container")
    if (!container) return

    container.innerHTML = ''

    if (!Array.isArray(data) || data.length === 0) {
        const empty = document.createElement('p')
        empty.className = 'muted'
        empty.textContent = 'Aucune réalisation à afficher pour le moment.'
        container.append(empty)
        return
    }

    data.forEach(realis => {
       poste(realis,"realisation-container") 
    });
}
