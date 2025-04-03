import pandas as pd
import numpy as np
from datetime import datetime
from tf import * 
from clt_repetidos import * 
import os
from tf import *
from db import *
from clt_repetidos import *
from gd import * 
from datetime import datetime
import cx_Oracle
import subprocess
import sys



def transformacion_clientes_meca(df, ruta_exit):
    df = df.apply(lambda x: x.upper() if isinstance(x, str) else x)

    df["NACIONALIDAD"] = df["NACIONALIDAD"].apply(lambda x: "NO SE ENCONTRO INFORMACION" if pd.isna(x) else x)
    df["NACIONALIDAD"] = df["NACIONALIDAD"].apply(lambda x: "MEXICANA" if x == "MEX" else x)
    df["NACIONALIDAD"] = df["NACIONALIDAD"].apply(lambda x: "EXTRANJERA" if x == "EXT" else x)
    palabras_no_validas = ["PENDIENTE", "JHGJHG", "NINGUNA", "TEL"]

    df["CALLE"] = df["CALLE"].apply(
        lambda x: x if isinstance(x, str) and 
                   not any(palabra in x for palabra in palabras_no_validas) and \
                   x != 'P' and \
                   not x.replace(" ", "").isdigit() 
                   else np.nan
    )
    df["CLI_RFC_LETRAS"]= df["CLI_RFC_LETRAS"].apply(lambda x: x.upper() if pd.notna(x) else "XXX")
    df["CLI_RFC_FECHA"] = df["CLI_RFC_FECHA"].apply(lambda x: int(x) if pd.notna(x) else "XXXXXX") 
    df["CLI_RFC_HOMO"] = df["CLI_RFC_HOMO"].apply(lambda x: x.upper() if pd.notna(x) else "XXX") 
    df["RFC"] = df.apply(lambda row: f'{row["CLI_RFC_LETRAS"]}{row["CLI_RFC_FECHA"]}{row["CLI_RFC_HOMO"]}',axis=1)  
    df["RFC"] = df["RFC"].apply(lambda x: x if verificar_rfc(x) else "XXXXXXXXXXXXX")
    
    df["GENERO"] =  "N/A"
    df["PROFESION"] = "N/A"
    df['FECHA_DE_ACTUALIZACION'] = datetime.now().strftime('%d/%m/%y')
    
    col_final = ['NEGOCIO', 'NOMBRE_O_RAZON_SOCIAL', 'NUMERO_CLIENTE', 'ESTATUS',
       'NUMERO_CONTRATO', 'GENERO', 'FECHA_NAC_O_CONST',
       'ENTIDAD_FEDERATIVA_NACIMIENTO', 'PAIS_DE_NACIMIENTO', 'NACIONALIDAD',
       'PROFESION', 'CALLE', 'NUMERO_EXTERIOR', 'NUMERO_INTERIOR',
       'COLONIA_URBANIZACION', 'DELEGACION_MUNICIPIO', 'CIUDAD_POBLACION',
       'ENTIDAD_FEDERATIVA', 'CODIGO_POSTAL', 'PAIS', 'TELEFONO',
       'CORREO_ELECTRONICO', 'RFC', 'CURP', 'FIEL', 'REPRESENTANTE_LEGAL',
       'TIPO_PERSONA', 'PRODUCTO_CONTRATADO',
       'SISTEMA_ORIGEN', 'FECHA_DE_ACTUALIZACION']
    df = df[col_final]
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 95, True)
    if not clt_repetidos.empty:
        df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df)
        id_drop = clt_repetidos["ID1"].to_list() + clt_repetidos["ID2"].to_list()
        df = df.drop(id_drop)
        df = pd.concat([df, df_resul], ignore_index=True)
        df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_MECA.csv")
    df.to_csv(name_archivo, index=False)



def transformacion_clientes_sims(df, ruta_exit):
    df["RFC"] = df["RFC"].apply(lambda x: x if pd.notna(x) else "XXXXXXXXXXXXX")
    df["CORREO_ELECTRONICO"] = df["CORREO_ELECTRONICO"].astype(str).apply(lambda x: x if "@" in x else pd.NA)
    df["CIUDAD_POBLACION"] = df.apply(lambda row: "NEW YORK , N.Y." if row["CVE_CIUDAD"] == "N.Y" else row["CIUDAD_POBLACION"], axis= 1)
    df = df.drop(columns=['CVE_CIUDAD'])
    pais_a_nacionalidad = {
    "ESTADOS UNIDOS": "ESTADOUNIDENSE",
    "MEXICO": "MEXICANO",
    "GRAN BRETA&A": "BRITÁNICO",
    "FRANCIA": "FRANCÉS",
    "HONG KONG": "HONGKONÉS",
    "LUXEMBURGO": "LUXEMBURGUÉS"
    }
    df["NACIONALIDAD"] =  df["PAIS"].apply(lambda x: pais_a_nacionalidad[x] if x in pais_a_nacionalidad.keys() else pd.NA)
    df["TELEFONO"] = df["TELEFONO"].apply(lambda x: x.replace("-", "") if pd.notna(x) else x)
    df['FECHA_DE_ACTUALIZACION'] = datetime.now().strftime('%d/%m/%y')
    col_final = ['NEGOCIO', 'NOMBRE_O_RAZON_SOCIAL', 'NUMERO_CLIENTE', 'ESTATUS',
       'NUMERO_CONTRATO', 'GENERO', 'FECHA_NAC_O_CONST',
       'ENTIDAD_FEDERATIVA_NACIMIENTO', 'PAIS_DE_NACIMIENTO', 'NACIONALIDAD',
       'PROFESION', 'CALLE', 'NUMERO_EXTERIOR', 'NUMERO_INTERIOR',
       'COLONIA_URBANIZACION', 'DELEGACION_MUNICIPIO', 'CIUDAD_POBLACION',
       'ENTIDAD_FEDERATIVA', 'CODIGO_POSTAL', 'PAIS', 'TELEFONO',
       'CORREO_ELECTRONICO', 'RFC', 'CURP', 'FIEL', 'REPRESENTANTE_LEGAL',
       'TIPO_PERSONA', 'PRODUCTO_CONTRATADO',
       'SISTEMA_ORIGEN', 'FECHA_DE_ACTUALIZACION']
    df = df[col_final]
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 95, True)
    if not clt_repetidos.empty:
        df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df)
        id_drop = clt_repetidos["ID1"].to_list() + clt_repetidos["ID2"].to_list()
        df = df.drop(id_drop)
        df = pd.concat([df, df_resul], ignore_index=True)
        df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_SIMS.csv")
    df.to_csv(name_archivo, index=False)

    
def transformacion_clientes_sipe(df, ruta_exit):
    df["RFC"] = df["RFC"].apply(lambda x: x if pd.notna(x) else "XXXXXXXXXXXXX")
    df["RFC"] = df["RFC"].apply(lambda x:  normalizar_cadena(x) if verificar_rfc(normalizar_cadena(x)) else "XXXXXXXXXXXXX")
    df['FECHA_DE_ACTUALIZACION'] = datetime.now().strftime('%d/%m/%y')
    col_final = ['NEGOCIO', 'NOMBRE_O_RAZON_SOCIAL', 'NUMERO_CLIENTE', 'ESTATUS',
       'NUMERO_CONTRATO', 'GENERO', 'FECHA_NAC_O_CONST',
       'ENTIDAD_FEDERATIVA_NACIMIENTO', 'PAIS_DE_NACIMIENTO', 'NACIONALIDAD',
       'PROFESION', 'CALLE', 'NUMERO_EXTERIOR', 'NUMERO_INTERIOR',
       'COLONIA_URBANIZACION', 'DELEGACION_MUNICIPIO', 'CIUDAD_POBLACION',
       'ENTIDAD_FEDERATIVA', 'CODIGO_POSTAL', 'PAIS', 'TELEFONO',
       'CORREO_ELECTRONICO', 'RFC', 'CURP', 'FIEL', 'REPRESENTANTE_LEGAL',
       'TIPO_PERSONA', 'PRODUCTO_CONTRATADO',
       'SISTEMA_ORIGEN', 'FECHA_DE_ACTUALIZACION']
    df = df[col_final]
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 95, True)
    if not clt_repetidos.empty:
        df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df)
        id_drop = clt_repetidos["ID1"].to_list() + clt_repetidos["ID2"].to_list()
        df = df.drop(id_drop)
        df = pd.concat([df, df_resul], ignore_index=True)
        df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_SIPE.csv")
    df.to_csv(name_archivo, index=False)
    
    
def limpiar_calle(calle):
    if pd.isna(calle):
        return pd.NA
    calle = str(calle)
    if "--" in calle:
        return " -- ".join(sorted(set(c.strip() for c in calle.split("--") if c.strip() != 'NA')))
    return calle.strip() 


def transformacion_clientes_soi(df, ruta_exit):
    df["CALLE"] = df["CALLE"].apply(lambda x: limpiar_calle(x))
    df["NUMERO_EXTERIOR"] = df["NUMERO_EXTERIOR"].apply(lambda x: " -- ".join(sorted(set(c.strip() for c in x.split("--") if c.strip() != 'NA'))) if "--" in str(x) else x)
    df["CIUDAD_POBLACION"] = df["CIUDAD_POBLACION"].apply(lambda x: " -- ".join(sorted(set(c.strip() for c in x.split("--") if c.strip() != 'NA'))) if "--" in str(x) else x)
    df["ENTIDAD_FEDERATIVA"] = df["ENTIDAD_FEDERATIVA"].apply(lambda x: " -- ".join(sorted(set(c.strip() for c in x.split("--") if c.strip() != 'NA'))) if "--" in str(x) else x)
    df["CODIGO_POSTAL"] = df["CODIGO_POSTAL"].apply(lambda x: " -- ".join(sorted(set(c.strip() for c in x.split("--") if c.strip() != 'NA'))) if "--" in str(x) else x)
    df["RFC"] = df["RFC"].apply(lambda x: normalizar_RFC(x) if pd.notna(x) and verificar_rfc(normalizar_RFC(x)) else "XXXXXXXXXXXXX")
    df['FECHA_DE_ACTUALIZACION'] = datetime.now().strftime('%d/%m/%y')
    col_final = ['NEGOCIO', 'NOMBRE_O_RAZON_SOCIAL', 'NUMERO_CLIENTE', 'ESTATUS',
       'NUMERO_CONTRATO', 'GENERO', 'FECHA_NAC_O_CONST',
       'ENTIDAD_FEDERATIVA_NACIMIENTO', 'PAIS_DE_NACIMIENTO', 'NACIONALIDAD',
       'PROFESION', 'CALLE', 'NUMERO_EXTERIOR', 'NUMERO_INTERIOR',
       'COLONIA_URBANIZACION', 'DELEGACION_MUNICIPIO', 'CIUDAD_POBLACION',
       'ENTIDAD_FEDERATIVA', 'CODIGO_POSTAL', 'PAIS', 'TELEFONO',
       'CORREO_ELECTRONICO', 'RFC', 'CURP', 'FIEL', 'REPRESENTANTE_LEGAL',
       'TIPO_PERSONA', 'PRODUCTO_CONTRATADO',
       'SISTEMA_ORIGEN', 'FECHA_DE_ACTUALIZACION']
    df = df[col_final]
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 95, True)
    if not clt_repetidos.empty:
        df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df)
        id_drop = clt_repetidos["ID1"].to_list() + clt_repetidos["ID2"].to_list()
        df = df.drop(id_drop)
        df = pd.concat([df, df_resul], ignore_index=True)
        df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_SOI.csv")
    df.to_csv(name_archivo, index=False)


    
def transformacion_clientes_sirac(df, ruta_exit):
    df["NOMBRE_O_RAZON_SOCIAL"] = df.apply(lambda row:(
                                                    row["RAZON_SOCIAL"] if row["TIPO_PERSONA"] == 7
                                                    else f'{row["NOMBRES"]} {row["PRIMER_APELLIDO"]} {row["SEGUNDO_APELLIDO"]}'
                                                    ),axis=1)
    map_genero = {"F": "FEMENINO", "M": "MASCULINO", "N/A": "NO APLICA"}
    df["GENERO"] = df["GENERO"].apply(lambda x: map_genero.get(x,"NO_APLICA"))
    df["RFC"] = df["RFC"].apply(lambda x: normalizar_RFC(x) if pd.notna(x) and verificar_rfc(normalizar_RFC(x)) else "XXXXXXXXXXXXX")
    df["TIPO_PERSONA"] =df["TIPO_PERSONA"].apply(lambda x: "PM" if x == 7 else "PF")
    df['FECHA_DE_ACTUALIZACION'] = datetime.now().strftime('%d/%m/%y')
    col_final = ['NEGOCIO', 'NOMBRE_O_RAZON_SOCIAL', 'NUMERO_CLIENTE', 'ESTATUS',
       'NUMERO_CONTRATO', 'GENERO', 'FECHA_NAC_O_CONST',
       'ENTIDAD_FEDERATIVA_NACIMIENTO', 'PAIS_DE_NACIMIENTO', 'NACIONALIDAD',
       'PROFESION', 'CALLE', 'NUMERO_EXTERIOR', 'NUMERO_INTERIOR',
       'COLONIA_URBANIZACION', 'DELEGACION_MUNICIPIO', 'CIUDAD_POBLACION',
       'ENTIDAD_FEDERATIVA', 'CODIGO_POSTAL', 'PAIS', 'TELEFONO',
       'CORREO_ELECTRONICO', 'RFC', 'CURP', 'FIEL', 'REPRESENTANTE_LEGAL',
       'TIPO_PERSONA', 'PRODUCTO_CONTRATADO',
       'SISTEMA_ORIGEN', 'FECHA_DE_ACTUALIZACION']
    df = df[col_final]
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 95, True)

    if not clt_repetidos.empty:
        df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df)
        id_drop = clt_repetidos["ID1"].to_list() + clt_repetidos["ID2"].to_list()
        df = df.drop(id_drop)
        df = pd.concat([df, df_resul], ignore_index=True)
        df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_SIRAC.csv")
    df.to_csv(name_archivo, index=False)    


def limpiar_telefono(col1, col2):
    if col1 == col2:
        return col1
    elif not col1.strip() and col2:
        return col2
    elif col1 and not col2.strip():
        return col1
    elif col1.strip() and col2.strip() and col1 != col2:
        return f"{col1}, {col2}"
    else:
        return ""
        
def transformacion_clientes_tas(tas_clientes, ruta_exit, db_tas=db_tas):
    query2 = "SELECT CUENTA NUMERO_CLIENTE, APE_PAT || ' ' || APE_MAT || ' ' || NOMBRE AS REPRESENTANTE_LEGAL FROM TAS.FAPODERADO"
    conn = cx_Oracle.connect(user=db_tas['USER'], password=db_tas["PSSWD"], dsn=db_tas["DSN"])
    cursor = conn.cursor()
    cursor.execute(query2)
    columnas_fapoderado = [columna[0] for columna in cursor.description]
    fapoderado = pd.DataFrame(cursor.fetchall(), columns=columnas_fapoderado)
    cursor.close()
    conn.close()
    
    representa_legal = fapoderado.groupby('NUMERO_CLIENTE')['REPRESENTANTE_LEGAL'].apply(lambda x: ', '.join(x)).reset_index()
    
    df = pd.merge(tas_clientes, representa_legal, on="NUMERO_CLIENTE", how="left")
    
    df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMLARGO"]
    df["REPRESENTANTE_LEGAL"] = df["REPRESENTANTE_LEGAL_y"]
    df["REPRESENTANTE_LEGAL"] = df["REPRESENTANTE_LEGAL"].apply(lambda x: " -- ".join(sorted(set(c.strip() for c in x.split(",") if c.strip() != 'NA' and c.strip()  != "Datos de la Escritura"))) if "," in str(x) else x)
    df["RFC"] = df["RFC"].apply(lambda x: normalizar_RFC(x) if pd.notna(x) and verificar_rfc(normalizar_RFC(x)) else "XXXXXXXXXXXXX")
    df["TELEFONO"] = df.apply(lambda row:( limpiar_telefono(row["TELEFONO1"],row["TELEFONO2"])
                                ),axis=1)
    df['FECHA_DE_ACTUALIZACION'] = datetime.now().strftime('%d/%m/%y')
    col_final = ['NEGOCIO', 'NOMBRE_O_RAZON_SOCIAL', 'NUMERO_CLIENTE', 'ESTATUS',
           'NUMERO_CONTRATO', 'GENERO', 'FECHA_NAC_O_CONST',
           'ENTIDAD_FEDERATIVA_NACIMIENTO', 'PAIS_DE_NACIMIENTO', 'NACIONALIDAD',
           'PROFESION', 'CALLE', 'NUMERO_EXTERIOR', 'NUMERO_INTERIOR',
           'COLONIA_URBANIZACION', 'DELEGACION_MUNICIPIO', 'CIUDAD_POBLACION',
           'ENTIDAD_FEDERATIVA', 'CODIGO_POSTAL', 'PAIS', 'TELEFONO',
           'CORREO_ELECTRONICO', 'RFC', 'CURP', 'FIEL', 'REPRESENTANTE_LEGAL',
           'TIPO_PERSONA', 'PRODUCTO_CONTRATADO',
           'SISTEMA_ORIGEN', 'FECHA_DE_ACTUALIZACION']
    df = df[col_final]
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 100, True)
    if not clt_repetidos.empty:
        df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df)
        id_drop = clt_repetidos["ID1"].to_list() + clt_repetidos["ID2"].to_list()
        df = df.drop(id_drop)
        df = pd.concat([df, df_resul], ignore_index=True)
        df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_TAS.csv")
    df.to_csv(name_archivo, index=False)    
    
    

def transformacion_clientes_siag(df, ruta_exit):
    tipo_financiera_sirac = {
    1: 'BANCOS',
    2: 'UNIONES DE CREDITO',
    3: 'ENTIDADES DE FOMENTO',
    4: 'EMP. DE FACTORAJE BANCARIAS',
    5: 'EMP. DE FACTORAJE NO BANCARIAS',
    6: 'ARRENDADORAS BANCARIAS',
    7: 'ARRENDADORAS NO BANCARIAS',
    8: 'AFIANZADORAS',
    9: 'FIDEICOMISO AAA',
    10: 'SOCIEDADES DE OBJETO LIMITADO',
    11: 'EMP. FACT. NO BANCARIAS PLUS',
    12: 'ARRENDAD. NO BANCARIAS PLUS',
    13: 'SOC. DE OBJETO LIMITADO PLUS',
    14: 'BANCOS 1ER. PISO',
    15: 'EMP FACT BANCARI C/CTA SOBGIRO',
    16: 'ORG. AUX. DE CREDITO 1ER. PISO',
    17: 'EMP. FACTORAJE 1ER. PISO',
    18: 'MANDATOS 1ER. PISO',
    19: 'SOC FIN OBJETO MULT 1PISO PLUS',
    20: 'FIDEICOMISOS 1ER. PISO',
    21: 'IFNB ESPECIALES',
    22: 'SOCIEDAD FINANCIERA POPULAR',
    23: 'SOC. FINAN. DE OBJETO MULTIPLE',
    24: 'FIDEICOMISO',
    25: 'ALMACENADORAS',
    26: 'DIRECTOS',
    27: 'COMISIONISTA',
    28: 'SINDICATO BANCARIO',
    29: 'SOC. COOPERATIVAS AHORRO PREST',
    30: 'SOCIEDAD ANONIMA PROMOTORA INV'
    }
    df["TELEFONO"] = df["TELEFONO"].apply(lambda x: " -- ".join(sorted(set(c.strip() for c in x.split("--") if c.strip() != 'NA'))) if "--" in str(x) else x)
    df["RFC"] = df["RFC"].apply(lambda x: normalizar_RFC(x) if pd.notna(x) and verificar_rfc(normalizar_RFC(x)) else "XXXXXXXXXXXXX")
    df["TIPO_PERSONA"] = df["TIPO_PERSONA"].apply(lambda x: tipo_financiera_sirac.get(x,x))
    df['FECHA_DE_ACTUALIZACION'] = datetime.now().strftime('%d/%m/%y')
    col_final = ['NEGOCIO', 'NOMBRE_O_RAZON_SOCIAL', 'NUMERO_CLIENTE', 'ESTATUS',
               'NUMERO_CONTRATO', 'GENERO', 'FECHA_NAC_O_CONST',
               'ENTIDAD_FEDERATIVA_NACIMIENTO', 'PAIS_DE_NACIMIENTO', 'NACIONALIDAD',
               'PROFESION', 'CALLE', 'NUMERO_EXTERIOR', 'NUMERO_INTERIOR',
               'COLONIA_URBANIZACION', 'DELEGACION_MUNICIPIO', 'CIUDAD_POBLACION',
               'ENTIDAD_FEDERATIVA', 'CODIGO_POSTAL', 'PAIS', 'TELEFONO',
               'CORREO_ELECTRONICO', 'RFC', 'CURP', 'FIEL', 'REPRESENTANTE_LEGAL',
               'TIPO_PERSONA', 'PRODUCTO_CONTRATADO',
               'SISTEMA_ORIGEN', 'FECHA_DE_ACTUALIZACION']
    df = df[col_final]
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 95, True)
    if not clt_repetidos.empty:
        df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df)
        id_drop = clt_repetidos["ID1"].to_list() + clt_repetidos["ID2"].to_list()
        df = df.drop(id_drop)
        df = pd.concat([df, df_resul], ignore_index=True)
        df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_SIAG.csv")
    df.to_csv(name_archivo, index=False)    
    
    
def union_tablas_clientes(dataframes, nombre_col, num_col, umbral, ruta_exit):
    df_combinado = dataframes[0].copy()
    for df in dataframes[1:]:
        clt_repetidos = compara_nombres(df_combinado, df, nombre_col, nombre_col, num_col, num_col, umbral)
        
        df_aux = df_combinado.copy()
        
        df_combinado = pd.concat([df_combinado, df], ignore_index=True)
        
        if not clt_repetidos.empty:
            df_resul, _ = agregar_asociaciones_clientes(clt_repetidos, df_combinado)
            
            id_drop_1 = clt_repetidos["ID1"].to_list()
            id_drop_2 = clt_repetidos["ID2"].to_list()
            
            df_aux = df_aux.drop(id_drop_1)
            
            df = df.drop(id_drop_2) 
            
            df_combinado =  pd.concat([df_aux, df], ignore_index=True)
            
            df_combinado = pd.concat([df_combinado, df_resul], ignore_index=True)
        
        df_combinado = df_combinado.sort_values(nombre_col)
    columnas  = ["ID_DL"] + df_combinado.columns.tolist()
    df_combinado["ID_DL"] = df_combinado.index + 1
    df_combinado = df_combinado[columnas] 
    name_archivo = os.path.join(ruta_exit,"CLientesT_FINAL_ACTIVOS.csv")  
    df_combinado.to_csv(name_archivo, index=False)    
    
"""    
def union_tablas_clientes(dataframes, nombre_col, num_col, umbral, ruta_exit):
    df_combinado = dataframes[0]
    
    for df in dataframes[1:]:
        clt_repetidos = compara_nombres(df_combinado, df, nombre_col, nombre_col, num_col, num_col, umbral)
        df_combinado = pd.concat([df_combinado, df], ignore_index=True)
        
        if not clt_repetidos.empty:
            df_resul, drops_ids = agregar_asociaciones_clientes(clt_repetidos, df_combinado)
            df_combinado = df_combinado.drop(drops_ids)
            df_combinado = pd.concat([df_combinado, df_resul], ignore_index=True)
        
        df_combinado = df_combinado.sort_values(nombre_col)
        
    columnas  = ["ID_DL"] + df_combinado.columns.tolist()
    df_combinado["ID_DL"] = df_combinado.index + 1
    df_combinado = df_combinado[columnas]
    name_archivo = os.path.join(ruta_exit,"CLientesT_FINAL_ACTIVOS.csv")  
    df_combinado.to_csv(name_archivo, index=False) """ 
    
def limpieza():
    print()     
    
   
if __name__ == "__main__":
    
    if len(sys.argv) < 2:
        path_dfs = "/home/ale1726/proyects/datalake/clientes/data/clientes_activos/19_03_2025" 
    
    path_dfs = sys.argv[1]
    
    print(path_dfs)

    
    ruta_exit = "/home/ale1726/proyects/datalake/clientes/data/ETL"
    
    date_now = datetime.now().strftime("%d_%m_%Y") 
    path_exit_date_now =  os.path.join(ruta_exit, date_now)
    os.makedirs(path_exit_date_now, exist_ok=True)
    
    df_meca = pd.read_csv (os.path.join(path_dfs,"Clientes_activos_MECA.dat" ))
    df_siag = pd.read_csv (os.path.join(path_dfs,"Clientes_activos_SIAG.dat" ))
    df_sims = pd.read_csv (os.path.join(path_dfs,"Clientes_activos_SIMS.dat" ))
    df_sipe = pd.read_csv (os.path.join(path_dfs,"Clientes_activos_SIPE.dat" ))
    df_sirac = pd.read_csv(os.path.join(path_dfs,"Clientes_activos_SIRAC.dat"))
    df_soi = pd.read_csv  (os.path.join(path_dfs,"Clientes_activos_SOI.dat"  ))
    df_tas = pd.read_csv  (os.path.join(path_dfs,"Clientes_activos_TAS.dat"  ))
    
    
    transformacion_clientes_meca(df_meca,path_exit_date_now)
    transformacion_clientes_siag(df_siag,path_exit_date_now)
    transformacion_clientes_sims(df_sims,path_exit_date_now)
    transformacion_clientes_sipe(df_sipe,path_exit_date_now)
    transformacion_clientes_sirac(df_sirac,path_exit_date_now)
    transformacion_clientes_soi(df_soi,path_exit_date_now)
    transformacion_clientes_tas(df_tas,path_exit_date_now)

    df_mecaT = pd.read_csv(os.path.join(path_exit_date_now,"CLientesT_MECA.csv"))
    df_siagT = pd.read_csv(os.path.join(path_exit_date_now,"CLientesT_SIAG.csv"))
    df_simsT = pd.read_csv(os.path.join(path_exit_date_now,"CLientesT_SIMS.csv"))
    df_sipeT = pd.read_csv(os.path.join(path_exit_date_now,"CLientesT_SIPE.csv"))
    df_siracT = pd.read_csv(os.path.join(path_exit_date_now,"CLientesT_SIRAC.csv"))
    df_soiT = pd.read_csv(os.path.join(path_exit_date_now,"CLientesT_SOI.csv"))
    df_tasT = pd.read_csv(os.path.join(path_exit_date_now,"CLientesT_TAS.csv"))
    dataframes = [df_mecaT, df_simsT, df_sipeT, df_siracT, df_soiT, df_tasT, df_siagT] 
    
    union_tablas_clientes(dataframes, "NOMBRE_O_RAZON_SOCIAL", "NUMERO_CLIENTE", 95, path_exit_date_now)
    
                
    
    subprocess.run([
        "python",
        "/home/ale1726/proyects/datalake/clientes/clientes_eda/utils/pipeline_clientes_activos.py",
        path_exit_date_now
    ])
    
    
    
    
    
    
    
    
    