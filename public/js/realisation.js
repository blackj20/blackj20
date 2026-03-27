


const getData=async()=>{//recuperaeation des donne au back

    try {
        const dataRealisation= await fetch(" http://localhost:8080/api/get_realisation",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
             body:JSON.stringify({data:"realisation"}) 
        })

        const realisation= dataRealisation.json()

        if(!dataRealisation.ok) throw new Error(realisation.message);

        loadindingImg(realisation)
        
    } catch (err) {
        console.error( "echec lor du chargement des donnes")
    }

}

getData()

const api_realisation=[// fake data 

    { titre:"maison de loisire",img:"image/WhatsApp Image 2026-03-16 at 10.05.27(2).jpeg",data_description:"" , anneé:"",localisation:"mongafula"},
    { titre:"salle de fete "   ,img:"image/WhatsApp Image 2026-03-16 at 10.05.26(1).jpeg",data_description:"un chetie de 2 ans " , anneé:"2013",localisation:"mitendi"},
    { titre:"maison de loisire",img:"image/WhatsApp Image 2026-03-16 at 09.44.52(1).jpeg",data_description:"" , anneé:"",localisation:"mongafula"},
    { titre:"salle de fete " ,  img:"image/WhatsApp Image 2026-03-16 at 09.44.32.jpeg",data_description:"un chetie de 2 ans " , anneé:"2013",localisation:"mitendi"},
    { titre:"maison de loisire",img:"image/WhatsApp Image 2026-03-16 at 09.44.29(1).jpeg",data_description:"" , anneé:"",localisation:"mongafula"},
    { titre:"salle de fete " ,  img:"image/WhatsApp Image 2026-03-16 at 09.44.32.jpeg",data_description:"un chetie de 2 ans " , anneé:"2013",localisation:"mitendi"},
    { titre:"maison de loisire",img:"image/WhatsApp Image 2026-03-16 at 09.44.29(1).jpeg",data_description:"" , anneé:"",localisation:"mongafula"},
    { titre:"salle de fete " ,  img:"image/WhatsApp Image 2026-03-16 at 09.44.32.jpeg",data_description:"un chetie de 2 ans " , anneé:"2013",localisation:"mitendi"},
    { titre:"maison de loisire",img:"image/WhatsApp Image 2026-03-16 at 09.44.29(1).jpeg",data_description:"" , anneé:"",localisation:"mongafula"},
    { titre:"salle de fete " ,  img:"image/WhatsApp Image 2026-03-16 at 09.44.51(1).jpeg",data_description:"un chetie de 2 ans " , anneé:"2013",localisation:"mitendi"},
    { titre:"maison de loisire",img:"image/WhatsApp Image 2026-03-16 at 09.44.51(1).jpeg",data_description:"" , anneé:"",localisation:"mongafula"},
    { titre:"salle de fete " ,  img:"image/WhatsApp Image 2026-03-16 at 09.44.36.jpeg",data_description:"un chetie de 2 ans " , anneé:"2013",localisation:"mitendi"},
    { titre:"eglise" ,          img:"image/WhatsApp Image 2026-03-16 at 09.44.41.jpeg",data_description:"une maison de 5 etages pour fammile nombreuse avec vu sur la nature" , anneé:"2020",localisation:"ma campagne"}
]




const poste=(data_api,parent="",ClassName="item",info_div="active")=>{

    if(!parent)return alert(" erreur arrét 'affichage  parent manquant !")

    const { titre ,img,data_description,anneé,localisation }=data_api // on retire tout les donne du data 

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
    image.src=img||"image/logo.png"


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


const loadindingImg=(data_realis)=>{// on cree des poste en boucle

    
   data_realis.forEach(realis => {
       poste(realis,"realisation-container") 
       
    });
}


loadindingImg(api_realisation)
