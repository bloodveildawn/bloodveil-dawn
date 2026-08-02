async function loadComponent(id, file){

    try{

        const response = await fetch(file);

        if(!response.ok){

            throw new Error(file);

        }

        const html = await response.text();

        document.getElementById(id).innerHTML = html;

    }

    catch(error){

        console.error("Failed to load:", file);

    }

}

async function initializeWebsite(){

    await loadComponent(

        "header",
        "components/header.html"

    );

    await loadComponent(

        "footer",
        "components/footer.html"

    );

    initializeHeader();

}

initializeWebsite();