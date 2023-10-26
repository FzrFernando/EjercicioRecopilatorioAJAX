document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");

    // Función para validar email
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }

    // Función para agregar un usuario a la lista
    function addUserToListID(user) {
        const xhruser = new XMLHttpRequest();
        xhruser.open('GET',`http://localhost:3000/users?email=${user.email}`,true);
        xhruser.send();
        xhruser.onload = function () {
            if (xhruser.status === 200) {
                let tmpUser = JSON.parse(xhruser.responseText)[0];     
                const listItem = document.createElement("li");
                listItem.innerHTML = `${tmpUser.name} : ${tmpUser.address} : ${tmpUser.email} : <button class="edit" value="${tmpUser.id}">Editar</button> <button class="delete" value="${tmpUser.id}">Delete</button>`;
                userList.appendChild(listItem);
            }
        }
    }   


    function addUserToList(user) {
        if(user.id){
            const listItem = document.createElement("li");
            listItem.innerHTML = `${user.name} : ${user.address} : ${user.email} : <button class="edit" value="${user.id}">Editar</button> <button class="delete" value="${user.id}">Delete</button>`;
            userList.appendChild(listItem);

        }else{
            addUserToListID(user)
        }
    }   

    
    
    // Obtener la lista de usuarios de la API
    function getUsersFromAPI(){
        const xhr = new XMLHttpRequest();
        xhr.open('GET','http://localhost:3000/users',true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const users = JSON.parse(xhr.responseText);
                users.forEach(user => {
                    addUserToList(user);
                });
            }
        }
        xhr.send();
    }

    getUsersFromAPI();

    // Manejar el envío del formulario (Agregar o Editar usuario)
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newUser={
            name: document.getElementById("name").value,
            address: document.getElementById("address").value,
            email: document.getElementById("email").value
        }
        
        if (newUser.name && newUser.address && validateEmail(newUser.email)) {
            
            if (userForm.dataset.editing) {
                
            }else {
                const comprobarEmail = new XMLHttpRequest();
                comprobarEmail.open('GET',`http://localhost:3000/users?email=${newUser.email}`,true);
                comprobarEmail.onload = function () {
                    if(comprobarEmail.status === 200) {
                        const users = JSON.parse(comprobarEmail.responseText);
                        if (users.length > 0) {
                            alert("El email ya existe en el servidor")
                            return;
                        }
                        const peticion = new XMLHttpRequest();
                        peticion.open('POST','http://localhost:3000/users');
                        peticion.setRequestHeader('Content-type','application/json');
                        peticion.send(JSON.stringify(newUser));
                        peticion.addEventListener('load', function() {
                            addUserToList(newUser);
                        })
                    }
                }
                comprobarEmail.send();
            }
            userForm.reset();
        }
        else {
            alert('Alguno de los campos no es correcto');
        }
    })

    // Función para borrar un usuario de la lista
    function deleteUser(event){
        if (event.target.classList.contains("delete")) {
            const listItem = event.target.parentElement;
            let userId = event.target.getAttribute("value");
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE',`http://localhost:3000/users/${userId}`);
            xhr.send();
            listItem.remove();
        }
    }

    // Función para editar un usuario de la lista
    function editUser(event){
        if (event.target.classList.contains("edit")) {
            const listItem = event.target.parentElement;
            const userArray = listItem.textContent.split(" : ");
            const name = userArray[0];
            const address = userArray[1];
            const email = userArray[2];
            userForm.elements.name.value = name;
            userForm.elements.address.value = address;
            userForm.elements.email.value = email;
            userForm.dataset.editing = email;
            userForm.querySelector("button[type='submit']").textContent = "Editar Usuario";
            userForm.dataset.editingIndex = [...userList.children].indexOf(listItem);
        }

    }

    // Manejar clics en botones de borrar y editar
    userList.addEventListener("click", function (event) {
        deleteUser(event);
        editUser(event);
    });
});