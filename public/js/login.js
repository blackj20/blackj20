const form = document.getElementById('admin-login')
const feedback = document.getElementById('login-feedback')



form?.addEventListener('submit', async (e) => {
    // On empeche le rechargement HTML classique du formulaire.
    e.preventDefault()

    // On remet l'etat visuel a zero avant une nouvelle tentative.
    feedback.textContent = ''
    feedback.className = 'feedback'
    // On transforme les champs du formulaire en objet JS.
    const data = Object.fromEntries(new FormData(form).entries())

    // Si un champ est vide, on bloque tout de suite cote client.
    if (!data.username || !data.hash) {
        feedback.textContent = 'Veuillez remplir tous les champs.'
        feedback.classList.add('error')
        return
    }
    try {
        // Le POST de login recoit en retour un `Set-Cookie` envoye par le serveur.
        const res = await fetch('/admin/login', {
            method: 'POST',
            // Le navigateur garde puis renvoie le cookie automatiquement sur le meme domaine.
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        // On tente de lire la reponse JSON, meme en cas d'erreur.
        const body = await res.json().catch(()=> ({}))
        // Si le serveur refuse, on affiche son message.
        if (!res.ok) throw new Error(body?.message || 'Connexion échouée')
        // Si tout va bien, on affiche un succes court.
        feedback.textContent = 'Connexion réussie, redirection...'
        feedback.classList.add('success')
        // Puis on redirige vers `/admin`, protegee par le cookie qu'on vient de poser.
        setTimeout(() => { window.location.href = '/admin' }, 600)
    } catch (err) {
        // Toute erreur remonte ici pour affichage utilisateur.
        feedback.textContent = err.message
        feedback.classList.add('error')
    }
})
