const api_actualite=[// ------------------------- similation des donnés-------------------
    { titre:"maison de 5 etage a ngombe" ,img:"image/WhatsApp Image 2026-03-16 at 10.05.27(2).jpeg",data_description:"appartement meuble si tue a ..." },
    { titre:"hotel trois etoile" ,img:"image/WhatsApp Image 2026-03-16 at 10.05.26(1).jpeg",data_description:"des suite de luxe cliumatise avec ..." },
    { titre:" appartement de trois niveaux" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.52(1).jpeg",data_description:"appartement de haut quanlites dans des ..." },
      ]

const api_realisation=[

    { titre:"maisson de loisire" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.29(1).jpeg",data_description:"..." , anneé:"2011",localisation:"mongafula"},
    { titre:"salle de fete " ,img:"image/WhatsApp Image 2026-03-16 at 09.44.32.jpeg",data_description:"..." , anneé:"2013",localisation:"mitendi"},
    { titre:"eglise" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.41.jpeg",data_description:"..." , anneé:"2018",localisation:"ma campagne"}
]

const api_project=[

    { titre:"roject_numero_1" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.51(1).jpeg",data_description:"..." },
    { titre:"roject_numero_2" ,img:'image/WhatsApp Image 2026-03-16 at 09.44.36.jpeg',data_description:"..." },
    { titre:"roject_numero_3" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.41.jpeg",data_description:"..." }
]



const poste=(data_api,parent="",ClassName="item")=>{

    if(!parent)return alert("erreur arrét 'affichage  parent manquant !")

    const { titre ,img,data_description,anneé,localisation }=data_api // on retire tout les donne du data 

    const cart =document.createElement("div") // le contenneur
    const  titre_=document.createElement("h3")   // titre de la realisation
    const  image =document.createElement("img") // image de la realisation  
    const  descrp= document.createElement("p")// description sur la realisation
    
    cart.className=ClassName
    titre_.textContent=titre
    image.src=img||"image/logo.png"
    descrp.textContent=data_description
    cart.append(titre_,image,descrp)
    
    if(anneé){
        const year=document.createElement("p")
        year.textContent=` anné : ${anneé}`
        cart.append(year)
    }
    if(localisation){
        const loc=document.createElement("p")
        loc.textContent=`localisation : ${localisation}`
        cart.append(loc)
    }
     

    document.getElementById(parent).append(cart)
}


const loadindingImg=(data_actu,data_projt,data_realis)=>{// on cree des poste en boucle

    data_projt.forEach(project => {
        poste(project,"projects") 
    });

    data_actu.forEach(actu => {
        poste(actu,"actualite-container") 
    
    });
    data_realis.forEach(realis => {
       poste(realis,"realisation-container") 
       
    });
}

loadindingImg(api_actualite,api_project,api_realisation)

