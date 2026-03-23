const db = require('../config/init')

const creeUnactualiter=(titre,description,image)=>{
    return new Promise((resolve, reject) => {
        const quary=` insert into actualite (titre,description,image) values(?,?,?)`
        db.run(quary,[titre,description,image],function (err) {
            if(err) return reject("une erreur se produit "+err)

            const post={
                titre:titre,
                description:description,
                image:image,
                index:this.lastID
            }
            resolve(post)
            
        })
    })
    
}
const creeUnrealisation=(anneé,titre,description,annee,localisation,image)=>{
    return new Promise((resolve, reject) => {
        const quary=` insert into actualite (anneé,titre,description,anneé,localisation,image) values(?,?,?,?,?,?)`
         db.run(quary,[anneé,titre,description,annee,localisation,image],function (err) {
            if(err) return reject("une erreur se produit "+err)

            const post={
                anneé:annee,
                titre:titre,
                description:description,
                anneé:anneé,
                localisation:localisation,
                image:image,
                index:this.lastID

            }
            resolve(post)
            
        })
       
        
    })

}
const creeUnannonce=(annee,titre,message)=>{
    return new Promise((resolve, reject) => {
        const quary=` insert into annonce (anneé,titre,message) values(?,?,?)`
        db.run(quary,[annee,titre,message],function (err) {
            if(err) return reject("une erreur se produit "+err)

            const post={
                titre:titre,
                annee:annee,
                message:message,
                index:this.lastID
            }
            resolve(post)
            
        })
        
    })
}
// =========================== les autre action admin ==========================

const getAllElement=(target)=>{
    const quary=`select * from ${target}`
    return new Promise((resolve, reject) => {
        db.all(quary,function(err,rows){

            if (err) return reject("une erreur se produit "+err)// si il-y-a une erreur 

            if(rows.length===0) resolve("pas encore d'element dans la base de donnés") //si la liste est vide

            reject(rows) //sinon on revois le donnes present 
        })
    })
    
}
//========================================== recupere par choix ===================

const getElement=(take,target)=>{
    const quary=`select * from ${take} where username=? or phone=? or email=? `
    db.get(quary,[target,target,target],function (err,row) {
            if (err) return reject("une erreur se produit "+err)// si il-y-a une erreur 

            if(row.length===0) resolve("pas encore d'annoce dans la base de donnés") //si la liste est vide

            reject(row) //sinon on revois le donnes present 
        
    })

}

// =========================== modifier ====================================

const editElem=(target ,element)=>{
    const { username,phone,email}=element
    const query=(`update from users set titre=? description=?  anne=? where=? `)
    return new Promise((resolve, reject) => {

        db.run(query,[username,phone,email,target],
            function (err) {
                if (err) return reject('une erreur se produit:  '+err)

               
                resolve()
                
            }
        )
    })
}
//=================================== le vu de la page =========================================

function logPageView(req, res, next) {
    const page = req.path
    const timestamp = new Date().toISOString()

    // Insérer la vue dans la base de données
    const query = 'INSERT INTO page_views (page, timestamp) VALUES (?, ?)'
    db.run(query, [page, timestamp], (err) => {
        if (err) {
            console.error('Error logging page view:', err)
        }
        // Continue to the next middleware/route handler
        next()
    })
}




module.exports={creeUnactualiter,creeUnrealisation,creeUnannonce,getAllElement,editElem,logPageView}