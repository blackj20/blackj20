const form = document.getElementById('admin-login')
const feedback = document.getElementById('login-feedback')

feedback.textContent = 'Connexion réussie, redirection...'
feedback.classList.add('success')

form?.addEventListener('submit', async (e) => {
    e.preventDefault()

    feedback.textContent = ''
    feedback.className = 'feedback'
    const data = Object.fromEntries(new FormData(form).entries())

    alert(data)
    if (!data.identifian || !data.hash) {
        feedback.textContent = 'Veuillez remplir tous les champs.'
        feedback.classList.add('error')
        return
    }
    try {

        console.log(data)
        const res = await fetch('http://localhost:8080/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        const body = await res.json().catch(()=> ({}))
        if (!res.ok) throw new Error(body?.message || 'Connexion échouée')
        feedback.textContent = 'Connexion réussie, redirection...'
        feedback.classList.add('success')
        setTimeout(() => { window.location.href = '/admin' }, 600)
    } catch (err) {
        feedback.textContent = err.message
        feedback.classList.add('error')
    }
})


