const data_img = document.getElementById('img')
const data_realis =  document.getElementById('realosation')
const data_act = document.getElementById('actualite')
const data_annonce = document.getElementById('annonce')

const uploadImg = async () => {
  try {
    const formData = new FormData(data_img)

    console.log(formData)

    const req = await fetch('http://localhost:8080/admin/upload-image', {
      method: "POST",
      body: formData // ⚠️ PAS DE HEADERS
    })

    if (!req.ok) throw new Error(req.statusText)

    const res = await req.json()
    alert(res.message)

  } catch (err) {
    alert(err)
  }
} 

  


data_img.addEventListener("submit",(e)=>{
    e.preventDefault()
    uploadImg()
})

