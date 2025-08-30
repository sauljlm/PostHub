import Swal from 'sweetalert2';

class DBAccess {
	collectionsReducer;
	collectionReference;

	constructor() {
		this.url = 'https://posthub-server.up.railway.app';
		//this.url = 'http://localhost:8080';
	}

	updateLoggedUser = async (userdata) => {
		await window.sessionStorage.setItem('loggedUser', JSON.stringify(userdata));
	};

	getLoggedUser = async () => {
		const user = await JSON.parse(window.sessionStorage.getItem('loggedUser'));
		return user;
	};

	getUsers = async () => {
		try {
			const response = await fetch(`${this.url}/users/get-users`, {
			  headers: {
				'Cache-Control': 'no-cache'
			  },
			  method: 'GET',
			});
			const data = await response.json();
			
			if (data.status === 500) {
			  Swal.fire({
				icon: 'warning',
				title: `${data.error}`,
				confirmButtonText: 'Entendido'
			  });
			  return null;
			} else {
			  return data;
			}
		} catch (error) {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar obtener los usuarios. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
			return null;  
		}
	};	

	getUserByEmail = async (email) => {
		try {
			const response = await fetch(`${this.url}/users/get-user-by-email/${email}`);
			if (response.status === 404) {
				Swal.fire({
					icon: 'warning',
					title: 'Usuario no encontrado',
					confirmButtonText: 'Entendido'
				});
				return null;
			}
			if (!response.ok) {
				throw new Error('Error al obtener el usuario por correo electrónico');
			}
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	};

	getUserByUsername = async (userName) => {
		try {
			const response = await fetch(`${this.url}/users/get-user-by-username/${userName}`);
			if (response.status === 404) {
				Swal.fire({
					icon: 'warning',
					title: 'Usuario no encontrado',
					confirmButtonText: 'Entendido'
				});
				return null;
			}
			if (!response.ok) {
				throw new Error('Error al obtener el usuario por nombre de usuario');
			}
			return await response.json();
		} catch (error) {
			console.error(error);
		}
	};

	getAvailableEmail = async (email) => {
		try {
			const response = await fetch(`${this.url}/users/get-user-by-email/${email}`);
			if (response.ok) {
				Swal.fire({
					icon: 'warning',
					title: 'Correo electrónico ya registrado',
					confirmButtonText: 'Entendido'
				});
				return null;
			}
			return true;
		} catch (error) {
			console.error(error);
		}
	};


	getAvailableUserName = async (userName) => {
		try {
			const response = await fetch(`${this.url}/users/get-user-by-username/${userName}`);
			if (response.ok) {
				Swal.fire({
					icon: 'warning',
					title: 'Nombre de usuario ya registrado',
					confirmButtonText: 'Entendido'
				});
				return null;
			}
			return true;
		} catch (error) {
			console.error(error);
		}
	};

	logIn = async (userData) => {
		try {
			const responseRaw = await fetch(`${this.url}/users/log-in`, {
				method: 'POST',
				body: userData,
			});
			const response = await responseRaw.json();
	
			if (response.status === 500) {
				Swal.fire({
					icon: 'warning',
					title: `${response.error}`,
					confirmButtonText: 'Entendido'
				});
				return null;
			} else {
				await Swal.fire({
					icon: 'success',
					title: 'La sesión se realizó con éxito',
					confirmButtonText: 'Entendido'
				});
				this.updateLoggedUser(response);
				return response;
			}
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error en la conexión',
				text: 'Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.',
				confirmButtonText: 'Entendido'
			});
			return null;
		}
	};
	

	createNewUser = async (newUser) => {
		await fetch(`${this.url}/users/new-user`, {
			method: "POST",
			body: newUser
		})
		.then(response => response.json())
		.then(response => {
			if (response.status === 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'El usuario se publicó con éxito',
					'confirmButtonText': 'Entendido'
				})
			}
		}).catch(error => {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar registrar el usuario. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
		});
	};

	restorePassword = async (userEmail) => {
		await fetch(`${this.url}/users/restore-password`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: userEmail
			}),
		})
		.then(response => response.json())
		.then(response => {
			if (response.status === 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'Revisa tu email',
					'text': 'Te hemos enviado un email para recuperar tu contraseña, revisa tu bandeja de entrada',
					'confirmButtonText': 'Entendido'
				})
			}
		}).catch(error => {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar restablecr la contraseña. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
		});
	};

	resetPassword = async (newPassword) => {
		await fetch(`${this.url}/users/reset-password`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body:  newPassword
		})
		.then(response => response.json())
		.then(response => {
			if (response.status === 500) {
				Swal.fire({
					'icon': 'warning',
					'title': `${response.error}`,
					'confirmButtonText': 'Entendido'
				});
			} else {
				Swal.fire({
					'icon': 'success',
					'title': 'La contraseña se actualizó con éxito',
					'confirmButtonText': 'Entendido'
				})
			}
		}).catch(error => {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar restablecer. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
		});
	};

	getPosts = async () => {
		try {
			const response = await fetch(`${this.url}/posts/get-posts`, {
			  headers: {
				'Cache-Control': 'no-cache'
			  },
			  method: 'GET',
			});
			const data = await response.json();
			
			if (data.status === 500) {
			  Swal.fire({
				icon: 'warning',
				title: `${data.error}`,
				confirmButtonText: 'Entendido'
			  });
			  return null;
			} else {
			  return data;
			}
		} catch (error) {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar obtener los posts. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
			return null;  
		}
	};	

	getPostsByUserName = async (userName) => {
		try {
			const response = await fetch(`${this.url}/posts/get-posts/${userName}`, {
			  headers: {
				'Cache-Control': 'no-cache'
			  },
			  method: 'GET',
			});
			const data = await response.json();
			
			if (data.status === 500) {
			  Swal.fire({
				icon: 'warning',
				title: `${data.error}`,
				confirmButtonText: 'Entendido'
			  });
			  return null;
			} else {
			  return data;
			}
		} catch (error) {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar obtener los posts. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
			return null;  
		}
	};

	createNewPost = async (newPost) => {
		await fetch(`${this.url}/posts/new-post`, {
			method: "POST",
			body: newPost
		})
		.then(response => response.json())
		.then(response => {
			if (response.status === 500) {
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
		}).catch(error => {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar publicar. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
		});
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
			if (response.status === 500) {
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
		}).catch(error => {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar actualizar. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
		});
	};

	postLike = async (postId, userName) => {
		await fetch(`${this.url}/posts/toggle-like/${postId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ userName: userName })
		});
	}

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
			if (response.status === 500) {
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
		}).catch(error => {
			Swal.fire({
				'icon': 'error',
				'title': 'Error en la conexión',
				'text': 'Hubo un problema al intentar eliminar. Por favor, inténtalo de nuevo más tarde.',
				'confirmButtonText': 'Entendido'
			});
		});
	};
}

export default DBAccess;
