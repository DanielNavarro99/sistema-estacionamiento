// js/login.js

// Función para mostrar/ocultar contraseña (se mantiene igual)
function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.querySelector('.btn-toggle-password i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

$(document).ready(function() {
    $('#formLogin').on('submit', function(e) {
        e.preventDefault(); // Evita que la página se recargue

        // Elementos visuales (Spinner y Alertas)
        const btnLogin = $('.btn-login');
        const spinner = $('#spinnerLogin');
        const alertaError = $('#alertaError');
        const mensajeError = $('#mensajeError');

        // Activamos estado de carga
        btnLogin.prop('disabled', true);
        spinner.removeClass('d-none');
        alertaError.addClass('d-none');

        // Datos a enviar
        const datos = {
            email: $('#email').val(),
            password: $('#password').val()
        };

        // Petición al Servidor (usando jQuery AJAX)
        $.ajax({
            // Nota: Aquí estamos usando una URL relativa, el servidor Node la resolverá
            url: '/api/auth/login', 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            
            success: function(response) {
                // Asumiendo que el servidor devuelve { message: 'Login exitoso', user: {...} } y status 200
                
                // 1. Guardamos los datos del usuario en el navegador (si aplica)
                localStorage.setItem('usuario', JSON.stringify(response.user)); // Cambiado de response.usuario a response.user
                
                // 2. Alerta de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Ingresando al sistema...',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    
                    // --- LÓGICA DE REDIRECCIÓN FINAL ---
                    const rol = response.user.rol; // **CAMBIO CLAVE: Obtenemos el rol de response.user.rol**

                    if (rol === 'admin') {
                        // Si es Admin, va a su vista especial
                        window.location.href = 'VistaAdmin.html';
                    } else {
                        // Si es Usuario normal ('usuario'), va a la vista de Ticket/Entrada
                        window.location.href = 'vistaUsuario2.html'; 
                    }
                    // ------------------------------------
                });
            },
            error: function(xhr) {
                // Si falla (contraseña mal o error 500):
                btnLogin.prop('disabled', false);
                spinner.addClass('d-none');
                
                // Intentamos obtener el mensaje de error del JSON
                const responseData = xhr.responseJSON || {};
                const msg = responseData.error || 'Error al conectar con el servidor o credenciales incorrectas.';
                
                mensajeError.text(msg);
                alertaError.removeClass('d-none');
            },
            // Aseguramos que el spinner se oculte incluso si hay un error
            complete: function() {
                btnLogin.prop('disabled', false);
                spinner.addClass('d-none');
            }
        });
    });
});