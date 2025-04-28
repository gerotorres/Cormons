# web/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

def login_view(request):
    # Si el usuario ya está autenticado, redirigir al buscador
    if request.user.is_authenticated:
        return redirect('buscador')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        remember_me = request.POST.get('remember', False)
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            
            # Si no quiere ser recordado, configurar la sesión para que expire al cerrar el navegador
            if not remember_me:
                request.session.set_expiry(0)
                
            # Redirigir a la página anterior si existe, o al buscador por defecto
            next_page = request.GET.get('next', 'buscador')
            return redirect(next_page)
        else:
            messages.error(request, 'Usuario o contraseña incorrectos')
    
    return render(request, 'web/login.html')

def logout_view(request):
    logout(request)
    messages.success(request, 'Has cerrado sesión correctamente')
    return redirect('login')

@login_required(login_url='login')
def buscador_view(request):
    return render(request, 'web/buscador.html')