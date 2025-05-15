import os
import csv
import cx_Oracle

def conectar_oracle(db: dict):
    """Establece conexión con la base de datos Oracle."""
    return cx_Oracle.connect(user=db['USER'], password=db["PSSWD"], dsn=db["DSN"])

def construir_query(db: dict, name_table: str = None, query: str = None) -> str:
    """Construye y valida la consulta SQL."""
    if not (name_table or query):
        raise ValueError("Debes proporcionar `name_table` o `query`.")
    if name_table and query:
        raise ValueError("Proporciona solo uno: `name_table` o `query`.")
    
    if name_table:
        return f"SELECT * FROM {db['SCHEMA']}.{name_table}"
    return query

def obtener_columnas(cursor) -> list:
    """Obtiene nombres de columnas desde el cursor."""
    return [desc[0] for desc in cursor.description]

def fetch_rows(cursor, batch_size: int):
    """Generador para obtener filas en lotes desde el cursor."""
    while True:
        rows = cursor.fetchmany(batch_size)
        if not rows:
            break
        yield from rows

def escribir_archivo(path: str, columnas: list, datos, delimiter=','):
    """Escribe los datos y columnas en un archivo."""
    with open(path, 'w', newline='') as file:
        writer = csv.writer(file, delimiter=delimiter, lineterminator='\n', quoting=csv.QUOTE_NONNUMERIC)
        writer.writerow(columnas)
        for row in datos:
            writer.writerow(row)

def get_table(path_exit: str, db: dict, name_archivo: str = None, name_table: str = None,
              query: str = None, batch_size: int = 10000, extension: str = "csv") -> str:
    """
    Extrae datos desde Oracle y los guarda como archivo (por defecto .csv).
    Puedes elegir la extensión con el argumento `extension`.

    Args:
        path_exit (str): Carpeta donde se guarda el archivo.
        db (dict): Diccionario de conexión a la base de datos.
        name_archivo (str): Nombre base del archivo (sin extensión).
        name_table (str): Nombre de la tabla a consultar.
        query (str): Consulta SQL (si no se usa `name_table`).
        batch_size (int): Tamaño de lote al hacer fetch.
        extension (str): Extensión del archivo ("csv", "dat", etc).

    Returns:
        str: Ruta del archivo exportado.
    """
    conn = conectar_oracle(db)
    cursor = conn.cursor()

    sql = construir_query(db, name_table, query)
    if not name_archivo:
        name_archivo = name_table if name_table else "tabla"
    ruta_archivo = os.path.join(path_exit, f"{name_archivo}.{extension}")

    cursor.execute(sql)
    columnas = obtener_columnas(cursor)
    datos = fetch_rows(cursor, batch_size)
    escribir_archivo(ruta_archivo, columnas, datos)

    cursor.close()
    conn.close()

    return ruta_archivo
