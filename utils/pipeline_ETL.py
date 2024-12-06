import pandas as pd
import numpy as np
from datetime import datetime
from tf import * 
from clt_repetidos import * 
import os

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
    clt_repetidos = compara_nombres(df, df, "NOMBRE_O_RAZON_SOCIAL", "NOMBRE_O_RAZON_SOCIAL","NUMERO_CLIENTE","NUMERO_CLIENTE", 95)
    df_resul, drops_ids = agregar_asociaciones_clientes(clt_repetidos,df)
    df = df.drop(drops_ids)
    df = pd.concat([df, df_resul], ignore_index=True)
    df = df.sort_values("NOMBRE_O_RAZON_SOCIAL")
    name_archivo = os.path.join(ruta_exit,"CLientesT_MECA.csv")
    df.to_csv(name_archivo, index=False)
    return df


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
    name_archivo = os.path.join(ruta_exit,"CLientesT_SIMS.csv")
    df.to_csv(name_archivo, index=False)
    return df
    