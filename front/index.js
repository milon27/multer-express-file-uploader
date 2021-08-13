console.log("pkkkkkkk");
const form = document.getElementById("form")
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log("pkkkkkkk222");

    const img = document.getElementById("img")
    const title = document.getElementById("title")

    if (img.files.length == 0) {
        document.write("Select one or more files.")
    } else {

        const ob = new FormData()
        ob.append('img', img.files[0], img.files[0].name)
        ob.append('title', title.value)

        axios.defaults.baseURL = 'http://localhost:2727/';

        axios.post('upload', ob).then(res => {
            console.log(res);
        }).catch(e => {
            console.log(e);
        })
    }

})
