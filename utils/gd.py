import cx_Oracle
import os
import csv



def get_table(path_exit: str, db: dict, name_archivo: str = None, name_table: str = None, query: str = None, batch_size: int = 10000):
    """
    Obtiene una tabla de una base de datos Oracle, ya sea mediante el nombre de la tabla o una consulta SQL. 
    Solo se debe elegir uno de los dos métodos (nombre de tabla o consulta).

    Args:
        path_exit (str): Ruta de salida para el archivo.
        db (dict): Diccionario con los detalles de la base de datos {"NAME":'name','USER':'user','PSSWD':'psswd','DSN':'dsn','SCHEMA':'schema'}.
        name_archivo (str, opcional): Nombre del archivo de salida. Si no se proporciona, se generará automáticamente.
        name_table (str, opcional): Nombre de la tabla a consultar.
        query (str, opcional): Consulta SQL a ejecutar.
        batch_size (int, opcional): Tamaño del lote para la extracción de datos. Por defecto es 10000.

    Returns:
        str: Ruta del archivo CSV o DAT generado.
    """
    
    # Validar que se haya proporcionado name_table o query, pero no ambos
    if not (name_table or query):
        raise ValueError("Debe proporcionar name_table o query.")
    if name_table and query:
        raise ValueError("Debe proporcionar solo uno: name_table o query.")
    
    # Conectar a la base de datos Oracle
    conn = cx_Oracle.connect(user=db['USER'], password=db["PSSWD"], dsn=db["DSN"])
    cursor = conn.cursor()

    # Determinar la extensión del archivo y construir la ruta del archivo
    if name_table:
        cursor.execute(f'SELECT COUNT(*) FROM {db["SCHEMA"]}.{name_table}')
        num_rows = cursor.fetchone()[0]
        extension = 'csv' if num_rows < 30000 else 'dat'
        if not name_archivo:
            name_archivo = name_table
    else:
        cursor.execute(query)
        extension = 'dat'
        if not name_archivo:
            name_archivo = 'tabla'
    
    ruta_archivo = os.path.join(path_exit, f'{name_archivo}.{extension}')

    # Ejecutar la consulta para obtener los datos
    if name_table:
        cursor.execute(f'SELECT * FROM {db["SCHEMA"]}.{name_table}')
    else:
        cursor.execute(query)
    
    # Obtener los nombres de las columnas de la tabla
    columnas = [columna[0] for columna in cursor.description]

    # Función generadora para obtener filas de la base de datos
    def fetch_rows(cursor, batch_size):
        while True:
            rows = cursor.fetchmany(batch_size)
            if not rows:
                break
            for row in rows:
                yield row

    # Escribir el encabezado del archivo
    with open(ruta_archivo, 'w', newline='') as file:
        writer = csv.writer(file, delimiter=',', lineterminator='\n', quoting=csv.QUOTE_NONNUMERIC)
        writer.writerow(columnas)

        # Escribir los datos de la tabla en el archivo usando el generador
        for row in fetch_rows(cursor, batch_size):
            writer.writerow(row)

    # Cerrar el cursor y la conexión a la base de datos Oracle
    cursor.close()
    conn.close()

    return ruta_archivo


def get_data_tas(database,path_exit, query, query2):
    conn = cx_Oracle.connect(user=database['USER'], password=database["PSSWD"], dsn=database["DSN"])
    cursor = conn.cursor()
    
    cursor.execute(query)
    columnas_clientes = [columna[0] for columna in cursor.description]
    tas_clientes = pd.DataFrame(cursor.fetchall(), columns=columnas_clientes)
    
    cursor.execute(query2)
    columnas_fapoderado = [columna[0] for columna in cursor.description]
    fapoderado =   pd.DataFrame(cursor.fetchall(), columns=columnas_fapoderado)

    representa_legal = fapoderado.groupby('CUENTA')['REPRESENTANTE_LEGAL'].apply(lambda x: ', '.join(x)).reset_index()
    
    resultado = pd.merge(tas_clientes, representa_legal, on="CUENTA", how="left")
    resultado.to_csv(os.path.join(path_exit,"Transformacion_clientes_TAS.dat"),index=False)
    
    cursor.close()
    conn.close()
    
def get_ope_sims(nombre, numero_de_cliente, fecha:str = '2022-01-01'):
    
    """
    fecha (YYYY-MM-DD) str: fecha de busqueda de operaciones 
    """
    query = f"""
    WITH CLIENTES_ACTIVOS AS (
        SELECT *
        FROM SIMS.SIMS_CONTRAPARTES 
        WHERE NOMBRE NOT LIKE '%INACTI%' AND NOMBRE NOT LIKE '%APLICA%'
    ), 
    CONTRAPARTE_OPERACIONES_2024 AS (
        SELECT *
        FROM SIMS.SIMS_MOVIMIENTOS
        WHERE FECHA_OPERACION > TO_DATE({fecha}, 'YYYY-MM-DD')
    ),
    CONTRAPARTE_TM AS (
        SELECT
            co.*,
            svm.DESCRIPCION AS DESCRIPCION_TIPO_MOVIMIENTO -- Alias explícito
        FROM CONTRAPARTE_OPERACIONES_2024 co
        INNER JOIN SIMS.SIMS_VARIANTES_MOVTOS svm
            ON co.TIPO_MOVTO = svm.TIPO AND co.VARIANTE_MOVTO = svm.CLAVE
    ),
    CONTRAPARTE_P AS (
        SELECT
            CT.*,
            stp.DESCRIPCION AS DESCRIPCION_TIPO_PORTAFOLIO -- Alias explícito
        FROM CONTRAPARTE_TM CT
        INNER JOIN SIMS.SIMS_TIPOS_PORTAFOLIOS stp
            ON CT.TIPO_PORTAFOLIO = stp.TIPO
    )
    SELECT 
        cp.CLAVE_CONTRAPARTE, ca.NOMBRE, ca.CVE_CIUDAD, ca.CVE_PAIS, ca.DIRECCION, ca.TELEFONO, cp.FOLIO, 
        cp.DESCRIPCION_TIPO_MOVIMIENTO, cp.DESCRIPCION_TIPO_PORTAFOLIO, ca.CLAVE, cp.FECHA_OPERACION, 
        cp.PRECIO, cp.VALOR_NOMINAL, cp.VALOR_NOMINAL_AMORTIZADO, cp.VALOR_COSTO, cp.INTERESES_ACUMULADOS, 
        cp.MONTO_MOVIMIENTO, cp.FECHA_LIQUIDACION
    FROM CLIENTES_ACTIVOS ca
    LEFT JOIN CONTRAPARTE_P cp ON ca.CLAVE = cp.CLAVE_CONTRAPARTE
    """