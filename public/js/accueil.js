

const api_actualite=[
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
    { titre:"roject_numero_2" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.45(1).jpeg",data_description:"..." },
    { titre:"roject_numero_3" ,img:"image/WhatsApp Image 2026-03-16 at 09.44.41.jpeg",data_description:"..." }
]


const realisation=(data_api)=>{

    const { titre ,img,data_description,anneé,localisation }=data_api // on retire tout les donne du data 

    const data =document.createElement("div") // le contenneur
    const  titre_=document.createElement("h3")   // titre de la realisation
    const  image =document.createElement("img") // image de la realisation 
    const  anneé_=document.createElement("p")
    const  localisation_=document.createElement("p")
    const  descrp= document.createElement("p")// description sur la realisation
    
    data.className="item"

    titre_.textContent=titre
    image.src=img
    descrp.textContent=data_description
    anneé_.textContent=anneé
    localisation_.textContent=localisation
    data.append(titre_,image,descrp,anneé_,localisation_)
    document.getElementById("realisation-container").appendChild(data)

}

const actualité=(data_api)=>{

    const { titre ,img,data_description }=data_api // on retire tout les donne du data 

    const data =document.createElement("div") // le contenneur
    const  titre_=document.createElement("h3")   // titre de la realisation
    const  image =document.createElement("img") // image de la realisation  
    const  descrp= document.createElement("p")// description sur la realisation
    
    data.className="item"

    titre_.textContent=titre
    image.src=img
    descrp.textContent=data_description
    data.append(titre_,image,descrp)
    document.getElementById("actualite-container").appendChild(data)
}
const projects =(data_api)=>{

    const { titre ,img,data_description }=data_api // on retire tout les donne du data 

    const data =document.createElement("div") // le contenneur
    const  titre_=document.createElement("h3")   // titre de la realisation
    const  image =document.createElement("img") // image de la realisation  
    const  descrp= document.createElement("p")// description sur la realisation
    
    data.className="cart-item"

    titre_.textContent=titre
    image.src=img
    descrp.textContent=data_description
    data.append(titre_,image,descrp)
    document.getElementById("projects").appendChild(data)
}

const loadindingImg=(data_actu,data_projt,data_realis)=>{// on cree des poste en boucle

    data_projt.forEach(project => {
        projects(project) 
        console.log("projrct OK")
    });
    data_actu.forEach(actu => {
        actualité(actu) 
        console.log("actualité OK")
    });
    data_realis.forEach(realis => {
        realisation(realis) 
        console.log("realisation  OK")
    });
}

loadindingImg(api_actualite,api_project,api_realisation)