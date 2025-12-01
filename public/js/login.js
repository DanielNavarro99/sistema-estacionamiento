// Función para mostrar/ocultar contraseña
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

        // Petición al Servidor
        $.ajax({
            url: '/api/auth/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            success: function(response) {
                // Si el login es correcto:
                if (response.success) {
                    localStorage.setItem('usuario', JSON.stringify(response.usuario));
                    
                    Swal.fire({
                        icon: 'success',
                        title: '¡Bienvenido!',
                        text: 'Ingresando al sistema...',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // AQUÍ CAMBIAS LA REDIRECCIÓN
                        // Como tus compañeros harán lo demás, mándalo a una página temporal o dashboard
                        window.location.href = 'paginaPrincipal.html'; 
                    });
                }
            },
            error: function(xhr) {
                // Si falla (contraseña mal):
                btnLogin.prop('disabled', false);
                spinner.addClass('d-none');
                
                const msg = xhr.responseJSON ? xhr.responseJSON.message : 'Error al conectar con el servidor';
                mensajeError.text(msg);
                alertaError.removeClass('d-none');
            }
        });
    });
});