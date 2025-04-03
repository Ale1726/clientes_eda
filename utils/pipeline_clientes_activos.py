
from tf import *
from db import *
from gd import * 
from clt_repetidos import *
from datetime import datetime
import cx_Oracle
import pandas as pd
import os
import plotly.express as px
import plotly.graph_objects as go
from clt_repetidos import *
import sys

if __name__ == "__main__":
    if len(sys.argv) < 2:
        path_dir_update = "/home/ale1726/proyects/datalake/clientes/data/ETL/19_03_2025"
    

path_dir_update = sys.argv[1]

df = pd.read_csv(os.path.join(path_dir_update,"CLientesT_FINAL_ACTIVOS.csv"))


mapping_pais = {
    "MEX": "MEXICO",
    "U.S.A.": "ESTADOS UNIDOS DE AMERICA",
    "ESTADOS UNIDOS": "ESTADOS UNIDOS DE AMERICA",
    "GRAN BRETA&A": "REINO UNIDO",
    "GRAN BRETA\A":"REINO UNIDO",
    "ISLAS GRAND CAYMAN": "REINO UNIDO",
    "ESPA\A": "ESPAÑA",
    "ESPANA": "ESPAÑA",
    "ESPA\u00d1A":"ESPAÑA",
    "NASSAU": "BAHAMAS"
}


def clean_pais(pais):
    if pd.isna(pais):
        return pais
    if len(pais.split(',')) == 1:
        return mapping_pais.get(pais, pais)
    else:
        cadena_limpia = list(set([clean_pais(p.strip()) for p in pais.split(",")])) 
        return ", ".join(cadena_limpia)
    
df["PAIS"] =  df["PAIS"].apply(clean_pais)


df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'B�SICA', 'BÁSICA', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'M�XICO', 'MÉXICO', regex=True)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'INVERSI�N', 'INVERSIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'INSTITUCI�N', 'INSTITUCIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'M�S', 'MÁS', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'PENSI�N', 'PENSIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'M�LTIPLE', 'MÚLTIPLE', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'CAR�CTER', 'CARÁCTER', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'D�LARES', 'DÓLARES', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'COMPA�IA', 'COMPAÑIA', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ECON�MICO', 'ECONÓMICO', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ART�CULO', 'ARTÍCULO', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ADMINISTRACI�N', 'ADMINISTRACIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'DIN�MICO ', 'DINÁMICO ', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'AUDITOR�A', 'AUDITORÍA', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'FEDERACI�N', 'FEDERACIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'UNI�N', 'UNIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'TRAV�S', 'TRAVÉS ', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ELECTR�NICO ', 'ELECTRÓNICO', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'C�MO', 'CÓMO', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'CR�DITO', 'CRÉDITO', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'C�MO', ' CÓMO', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'AN�NIMA', 'ANÓNIMA', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ESPA�OL', 'ESPAÑOL', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ASESOR�A', 'ASESORÍA', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'GARANT�AS', 'GARANTÍAS', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'GARANT�AS', 'GARANTÍAS', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'MODERNIZACI�N', 'MODERNIZACIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'RENOVACI�N', 'RENOVACIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ACCI�N', 'ACCIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'PARTICIPACI�N', 'PARTICIPACIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'P�RDIDAS2', 'PÉRDIDAS2', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'MU�OZ', 'MUÑOZ', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'EDUCACI�N', 'EDUCACIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'ENSE�AN', 'ENSEÑAN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'Negociaci�n', 'Negociación', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].str.replace(r'REPRESENTACI�N', 'REPRESENTACIÓN', regex=False)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].apply(lambda x: x.upper())


df["GENERO"] = df.apply(
    lambda row: "NO APLICA" if row["TIPO_PERSONA"] != "PF" and pd.isna(row["GENERO"]) 
    else row["GENERO"],
    axis=1
)

df["GENERO"] = df["GENERO"].apply(lambda x: "NO APLICA" if x=="NO_APLICA" else x)
df["NOMBRE_O_RAZON_SOCIAL"] = df["NOMBRE_O_RAZON_SOCIAL"].fillna("NO SE TIENE REGISTRADA LA INFORMACION")
df["TIPO_PERSONA"] = df["TIPO_PERSONA"].fillna("SIN INFO")
df["GENERO"] = df["GENERO"].fillna("SIN INFO")
df["RFC"] = df["RFC"].fillna("SIN INFO")
df["CURP"] = df["CURP"].fillna("SIN INFO")
df["FIEL"] = df["FIEL"].fillna("SIN INFO")
df["CALLE"] = df["CALLE"].fillna("NO SE TIENE REGISTRADA LA INFORMACION")
df["TELEFONO"] = df["TELEFONO"].fillna("NO SE TIENE REGISTRADA LA INFORMACION")
df["FECHA_NAC_O_CONST"] = df["FECHA_NAC_O_CONST"].fillna("NO SE TIENE REGISTRADA LA INFORMACION")
df["CORREO_ELECTRONICO"] = df["CORREO_ELECTRONICO"].fillna("NO SE TIENE REGISTRADA LA INFORMACION")
df["REPRESENTANTE_LEGAL"] = df["REPRESENTANTE_LEGAL"].fillna("NO SE TIENE REGISTRADA LA INFORMACION")
df = df.fillna("INF NO DISP")

df.to_csv(os.path.join(path_dir_update,"CLientesT_FINAL_ACTIVOS.csv"), index=False)
