from django.shortcuts import render

def evacuacion_view(request):
    return render(request, 'app_evacuacion_coderider/evacuacion.html')

def bienvenida(request):
    return render(request, 'index.html')