const table = document.querySelector(".table");


const buttonShowAll = document.querySelector("#buttonShowAll");
buttonShowAll.onclick = () => api.getAllCats().then(dataFromBack => createTable(dataFromBack.data));


const buttonShowById = document.querySelector("#buttonShowById");
const inputShowById = document.querySelector("#inputShowById");

buttonShowById.onclick = () => {
    api.getCatById(inputShowById.value).then((dataFromBack) => createTable(dataFromBack.data)) // [{}, {}] ==> {}
}

const raws = ["id", "name", "age", "description", "img_link", "rate", "favourite", "actions"];

function createTableHeader(raws) {
    const header = document.createElement("tr");

    raws.forEach(raw => {
        const ceil = document.createElement("th");
        ceil.innerText = raw;
        header.appendChild(ceil);
    });
    table.appendChild(header);
}

function createTableRaw(cat) {
    const tableRaw = document.createElement("tr");
    tableRaw.setAttribute("id", cat["id"])

    raws.forEach(raw => {
        const ceil = document.createElement("td");
        ceil.setAttribute("name", raw);

        if (raw === "img_link") {
            const img = document.createElement("img");
            img.setAttribute("src", cat[raw])
            ceil.appendChild(img);
        } else if (raw === "actions") {
            const button = document.createElement("button");
            button.innerText = "Delete";
            ceil.appendChild(button)

            button.onclick = () => {
                api.deleteCat(cat["id"]).then(() => api.getAllCats().then(dataFromBack => createTable(dataFromBack.data)))
            }


            const button2 = document.createElement("button");
            button2.innerText = "Update";
            ceil.appendChild(button2);

            button2.addEventListener("click", () => {
                const tr = document.getElementById(cat["id"])

                const td = tr.querySelectorAll("td")
                for (let i = 0; i < td.length - 1; i++) {
                    const new_ceil = td[i];
                    new_ceil.innerHTML = "";

                    console.log(new_ceil)
                    const name = new_ceil.getAttribute("name")
                    if (name === "favourite") {
                        const input = document.createElement("input")
                        input.setAttribute("type", "checkbox");
                        input.setAttribute("name", new_ceil.getAttribute("name"));
                        input.value = cat[name]
                        input.className = "input"
                        new_ceil.appendChild(input)
                    } else if (name === "id" || name === "rate" || name === "age") {
                        const input = document.createElement("input")
                        input.setAttribute("name", new_ceil.getAttribute("name"));
                        input.setAttribute("type", "number");
                        input.value = cat[name]
                        input.className = "input"
                        new_ceil.appendChild(input)
                    } else {
                        const input = document.createElement("input")
                        input.setAttribute("name", new_ceil.getAttribute("name"));
                        input.setAttribute("type", "text");
                        input.value = cat[name]
                        input.className = "input"
                        new_ceil.appendChild(input)
                    }
                }

                const actions = td[td.length - 1];
                actions.innerHTML = "";
                const buttonUpdate = document.createElement("button");
                buttonUpdate.innerText = "OK";
                actions.appendChild(buttonUpdate)


                buttonUpdate.onclick = () => {
                    const inputs = document.querySelectorAll(".input")

                    const bodyJSON = {};
                    inputs.forEach((input) => {
                        if (input.name === 'favourite') {
                            bodyJSON[input.name] = input.checked;
                        } else {
                            bodyJSON[input.name] = input.value;
                        }
                    })

                    console.log(cat["id"], bodyJSON)
                    api.updateCat(cat["id"], bodyJSON).then(() => api.getAllCats().then(dataFromBack => createTable(dataFromBack.data)))
                }

            })
        } else {
            ceil.innerText = cat[raw] ? cat[raw] : "";
        }

        tableRaw.appendChild(ceil);
    })
    table.appendChild(tableRaw);
}

function createTable(cats) {
    table.innerHTML = "";
    createTableHeader(raws);
    if (Array.isArray(cats)) {
        cats.sort((a, b) => a.id - b.id).forEach(cat => {
            createTableRaw(cat);
        })
    } else {
        createTableRaw(cats);
    }
}

function createCat() {
    const addCat = document.querySelector("#addCat");
    const inputs = addCat.querySelectorAll("input");

    addCat.addEventListener("submit", )
    addCat.onsubmit = (e) => {
        e.preventDefault();
        const bodyJSON = {};
        inputs.forEach((input) => {
            if (input.name === 'favourite') {
                bodyJSON[input.name] = input.checked;
            } else {
                bodyJSON[input.name] = input.value;
            }
        })

        api.addCat(bodyJSON).then(() => api.getAllCats().then(dataFromBack => createTable(dataFromBack.data)))
    }
}

const cats = api.getAllCats().then(dataFromBack => createTable(dataFromBack.data));