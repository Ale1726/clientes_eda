import csv
import random
import re
from faker import Faker

# Inicializar Faker con configuración regional en español (México)
fake = Faker('es_MX')

def generar_rfc(nombre_completo):
    """
    Genera un RFC ficticio basado en el nombre completo.
    Formato simplificado: 4 letras + 6 dígitos + 3 caracteres alfanuméricos.
    """
    # Extraer letras del nombre
    letras = ''.join(re.findall(r'[A-Z]', nombre_completo.upper()))
    letras = (letras + 'XXXX')[:4]  # Asegurar que tenga al menos 4 letras

    # Generar fecha de nacimiento aleatoria
    fecha_nacimiento = fake.date_of_birth(minimum_age=18, maximum_age=65)
    fecha_str = fecha_nacimiento.strftime('%y%m%d')

    # Generar homoclave aleatoria
    homoclave = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=3))

    return f"{letras}{fecha_str}{homoclave}"

def generar_datos_csv(cantidad, nombre_archivo='datos_ficticios.csv'):
    """
    Genera un archivo CSV con datos ficticios.
    """
    with open(nombre_archivo, mode='w', newline='', encoding='utf-8') as archivo_csv:
        campos = ['Nombre', 'Dirección', 'Teléfono', 'RFC']
        escritor = csv.DictWriter(archivo_csv, fieldnames=campos)
        escritor.writeheader()

        for _ in range(cantidad):
            nombre = fake.name()
            direccion = fake.address().replace('\n', ', ')
            telefono = fake.phone_number()
            rfc = generar_rfc(nombre)
            escritor.writerow({
                'Nombre': nombre,
                'Dirección': direccion,
                'Teléfono': telefono,
                'RFC': rfc
            })

    print(f"Archivo '{nombre_archivo}' creado con {cantidad} registros.")

if __name__ == "__main__":
    try:
        cantidad_registros = int(input("Ingrese la cantidad de registros a generar: "))
        generar_datos_csv(cantidad_registros)
    except ValueError:
        print("Por favor, ingrese un número entero válido.")
