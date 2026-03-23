const api_actualite=[// ------------------------- similation des donnés-------------------
    { titre:"maison de 5 etage a ngombe" ,  img:"image/WhatsApp Image 2026-03-16 at 10.05.27(2).jpeg",data_description:"appartement meuble si tue a ..." },
    { titre:"hotel trois etoile" ,          img:"image/WhatsApp Image 2026-03-16 at 10.05.26(1).jpeg",data_description:"des suite de luxe cliumatise avec ..." },
    { titre:" appartement de trois niveaux",img:"image/WhatsApp Image 2026-03-16 at 09.44.52(1).jpeg",data_description:"appartement de haut quanlites dans des ..." },
      ]

const api_realisation=[

    { titre:"maison de loisire" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.29(1).jpeg",data_description:"" , anneé:"2011",localisation:"mongafula"},
    { titre:"salle de fete " ,img:"image/WhatsApp Image 2026-03-16 at 09.44.32.jpeg",data_description:"un chetie de 2 ans " , anneé:"2013",localisation:"mitendi"},
    { titre:"eglise" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.41.jpeg",data_description:"une maison de 5 etages pour fammile nombreuse avec vu sur la nature" , anneé:"2018",localisation:"ma campagne"}
]

const api_project=[

    { titre:"roject_numero_1" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.51(1).jpeg",data_description:"" },
    { titre:"roject_numero_2" ,img:'image/WhatsApp Image 2026-03-16 at 09.44.36.jpeg',data_description:"une maison de 5 etages pour fammile nombreuse avec vu sur la nature" },
    { titre:"roject_numero_3" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.41.jpeg",data_description:"" }
]





const getData=async()=>{//recuperaeation des donne au back

    try {
        const dataRealisation= await fetch(" http://localhost:8080/api/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
             body:JSON.stringify({data:"accueil"}) 
        })

        const realisation= dataRealisation.json()

        if(!dataRealisation.ok) throw new Error(realisation.message);

        loadindingImg(realisation)
        
    } catch (err) {
        console.error( "echec lor du chargement des donnes")
    }

}

getData()

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

    // localisation icon 
    // date icon  

    

    
    if (anneé) {
    const year = document.createElement("p")
    const icon = document.createElement("i")

    icon.className = "fas fa-calendar"

    year.textContent = ` année : ${anneé}`
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

    
    api_realisation.forEach(realis => {
       poste(realis,"realisation-container") 
       
    });
}

loadindingImg(api_actualite,api_project,api_realisation)





