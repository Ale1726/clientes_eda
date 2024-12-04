import re
from datetime import datetime

def verificar_rfc(rfc):
    rfc_persona_fisica_sin_homoclave = r'^[A-ZÑ&]{4}[0-9]{6}$'
    rfc_persona_fisica_con_homoclave = r'^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$'
    rfc_persona_moral_sin_homoclave = r'^[A-ZÑ&]{3}[0-9]{6}$'
    rfc_persona_moral_con_homoclave = r'^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$'
    try:
        if (re.match(rfc_persona_fisica_sin_homoclave, rfc) or 
            re.match(rfc_persona_fisica_con_homoclave, rfc) or 
            re.match(rfc_persona_moral_sin_homoclave, rfc) or 
            re.match(rfc_persona_moral_con_homoclave, rfc)):
            return True
        else:
            return False
    except:
        return False

def normalizar_RFC(rfc):
    #Eliminar caracteres especiales y convertir a mayúsculas
    cadena_limpia = re.sub(r'[^a-zA-Z0-9]', '', rfc)
    # Conversión a mayúsculas
    cadena_limpia = cadena_limpia.upper() 
    # Eliminación de espacios en blanco
    cadena_limpia = cadena_limpia.replace(' ', '')
    return cadena_limpia


def normalizar_cadena(cadena):
    # Eliminación de caracteres especiales
    cadena_normalizada = re.sub(r'[^a-zA-Z0-9áéíóúÁÉÍÓÚ\s]', '', cadena)
    # Conversión a mayúsculas
    cadena_normalizada = cadena_normalizada.upper()
    # Eliminación de espacios en blanco
    cadena_normalizada = cadena_normalizada.replace(' ', '')
    return cadena_normalizada

def fecha_de_nacimiento(cadena):
    try:
        cadena = "19" + re.sub(r'[a-zA-Z]', '', cadena)[0:6] 
        fecha = datetime.strptime(cadena, '%Y%m%d')
        return fecha
    except ValueError:
        return "-"

def limpiar_nombre(nombre):
    cadena_limpia = re.sub(r'[^a-zA-Z0-9áéíóúÁÉÍÓÚ\s]', '', nombre)
    cadena_limpia = cadena_limpia.upper()
    return cadena_limpia.upper()