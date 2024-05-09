import Swal from 'sweetalert2';
class DBAccess {
  collectionsReducer;
  collectionReference;

  constructor() {
    this.url = 'http://localhost:8080';
  }

  getPosts = async () => {
    await this.updateData();
		const data = await JSON.parse(window.localStorage.getItem('postsData'));
		return data;
  };

  updateData = async () => {
    await fetch(`${this.url}/posts/get-posts`)
			.then(response => response.json())
			.then(data => window.localStorage.setItem('postsData', JSON.stringify(data)));
		await fetch(`${this.url}/users/get-users`)
			.then(response => response.json())
			.then(data => window.localStorage.setItem('usersData', JSON.stringify(data)));
  };

  updateLoggedUser = async (userdata) => {
    await window.sessionStorage.setItem('loggedUser', JSON.stringify(userdata));
  };

  getLoggedUser = async () => {
    const user = await JSON.parse(window.sessionStorage.getItem('loggedUser'));
		return user;
  };

  getUserByEmail = async (email) => {
    let currentUser = false;
		let usersData = await JSON.parse(window.localStorage.getItem('usersData'));
		usersData.forEach(element => {
			if (element.userEmail == email) {
				currentUser = element
			}
		});
	
		return currentUser;
  };

  logIn = async (userData) => {
    await fetch(`${this.url}/users/log-in`, {
			method: 'POST',
			body: userData
		})
		.then(response => response.json())
		.then(response => {
			if (response.status == 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'La sesión se realizó con éxito',
					'confirmButtonText': 'Entendido'
				}).then(() => {
					this.updateLoggedUser(response);
				})
			}
		})
  };

  createNewUser = async (newUser) => {
    await fetch(`${this.url}/users/new-user`, {
			method: "POST",
			body: newUser
		})
		.then(response => response.json())
		.then(response => {
			if (response.status == 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'El usuario se publico con éxito',
					'confirmButtonText': 'Entendido'
				})
			}
		})
  };

  createNewPost = async (newPost) => {
    await fetch(`${this.url}/posts/new-post`, {
			method: "POST",
			body: newPost
		})
		.then(response => response.json())
		.then(response => {
			if (response.status == 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'La post se publico con éxito',
					'confirmButtonText': 'Entendido'
				})
			}
		})
  };

  updatePost = async (id, postData) => {
    await fetch(`${this.url}/posts/update-post/${id}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			body: JSON.stringify(postData)
		})
		.then(response => response.json())
		.then(response => {
			if (response.status == 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'La post se actualizó con éxito',
					'confirmButtonText': 'Entendido'
				})
			}
		})
  };

  deletePost = async (id) => {
    await fetch(`${this.url}/posts/delete-post/${id}`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'DELETE'
		})
		.then(response => response.json())
		.then(response => {
			if (response.status == 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'El post se elimino con éxito',
					'confirmButtonText': 'Entendido'
				})
			}
		})
  };
}

export default DBAccess;
