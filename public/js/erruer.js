// cette page vas juste lire les erreur serveur et interpreter pour le clien 


const statuts=document.getElementById('satut') 
const statuts_message=document.getElementById('message_satut') 

// cette foction vas lire les statut de errur et les  message du statut

const readError= async()=>{
    // l'inconnu actuelle   @ comment lie une routr a cette page et en lire le contenue 
    
    try {
        const res= await fetch("http://localhost:8080/admin/erreur",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        const erreur= await res.json()// on vas juste lire l'erreur et sont satut 

        statuts.textContent=erreur.statuts
        statuts_message.textContent=erreur.message 



    } catch (error) {
        // le message d'errur si due ala connection
        statuts.textContent=error.message  
        // la taille du police et trop gros donc on reduit a 40px   
        statuts.style.fontSize="40px"
        // pour eviter le footer colle au texte  
        statuts.style.margin="200px 0"
        statuts_message.textContent="error"

    }
    

}

readError()