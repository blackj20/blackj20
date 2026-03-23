


const getData=async()=>{//recuperaeation des donne au back

    try {
        const dataRealisation= await fetch(" http://localhost:8080/api/get_actualites",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
             body:JSON.stringify({data:"actualites"}) 
        })

        const realisation= dataRealisation.json()

        if(!dataRealisation.ok) throw new Error(realisation.message);

        loadindingImg(realisation)
        
    } catch (err) {
        console.error( "echec lor du chargement des donnes")
    }

}

getData()