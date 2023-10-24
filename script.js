document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("userForm");
    const userList = document.getElementById("userList");

    // Función para validar email
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }

    // Función para agregar un usuario a la lista
    function addUserToList(user) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${user.name} : ${user.address} : ${user.email} : <button class="edit" value="${user.id}">Editar</button> <button class="delete" value="${user.id}">Delete</button>`;
        userList.appendChild(listItem);
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
            const peticion = new XMLHttpRequest();
            peticion.open('POST','http://localhost:3000/users');
            peticion.setRequestHeader('Content-type','application/json');
            peticion.send(JSON.stringify(newUser));
            peticion.addEventListener('load', function() {
                addUserToList(newUser);
            })
        }
        else {
            alert('Alguno de los campos no es correcto');
        }
    })

    // Función para borrar un usuario de la lista
    function deleteUser(event){
        if (event.target.classList.contains("delete")) {
            let userId = event.target.getAttribute("value");
            const xhr = new XMLHttpRequest();
            xhr.open('DELETE',`http://localhost:3000/users/${userId}`);
            xhr.send();
        }
    }

    // Manejar clics en botones de borrar y editar
    userList.addEventListener("click", function (event) {
        deleteUser(event);
        // editUser(event);
    });
});