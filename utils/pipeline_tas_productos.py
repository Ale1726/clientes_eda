
from datetime import datetime
import cx_Oracle
import pandas as pd
import os
from rapidfuzz import process, fuzz
import numpy as np
import json
import os


########--- rutas --###########

path_data = "/home/ale1726/proyects/datalake/clientes/data/productos/TAS/data/26_02_2025"
path_exit_agrupamiento = "/home/ale1726/proyects/datalake/clientes/data/productos/TAS/data/26_02_2025/agrupamientos"

###############################

df= pd.read_csv(os.path.join(path_data,"productos_clientes_TAS.dat"), 
                engine="pyarrow",
                dtype_backend="pyarrow")

df.rename(columns=lambda x: x.replace("?", "Ñ"), inplace=True)

df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'B�SICA', 'BÁSICA', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'M�XICO', 'MÉXICO', regex=True)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'INVERSI�N', 'INVERSIÓN', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'INSTITUCI�N', 'INSTITUCIÓN', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'M�S', 'MÁS', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'PENSI�N', 'PENSIÓN', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'M�LTIPLE', 'MÚLTIPLE', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'CAR�CTER', 'CARÁCTER', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'D�LARES', 'DÓLARES', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'COMPA�IA', 'COMPAÑIA', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'ECON�MICO', 'ECONÓMICO', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'ART�CULO', 'ARTÍCULO', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'ADMINISTRACI�N', 'ADMINISTRACIÓN', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'DIN�MICO ', 'DINÁMICO ', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'AUDITOR�A', 'AUDITORÍA', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'FEDERACI�N', 'FEDERACIÓN', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'UNI�N', 'UNIÓN', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'TRAV�S ', 'TRAVÉS ', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'ELECTR�NICO ', 'ELECTRÓNICO', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'C�MO  ', 'CÓMO', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'CR�DITO', 'CRÉDITO', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'C�MO', ' CÓMO', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'AN�NIMA', 'ANÓNIMA', regex=False)
df["NOMLARGO"] = df["NOMLARGO"].str.replace(r'ESPA�OL', 'ESPAÑOL', regex=False)


df["NOMLARGO"] = df["NOMLARGO"].apply(lambda x: x.upper())

### Filtrar datos atípicos
df_filtred_2 = df[df["CPZO_A"]  < 50000 ]

### Eleccion de subproductos 
col_subproductos = "IINSTR"

### Datos para Kpis
monto_last_year = df_filtred_2["MONTO"][df_filtred_2["AÑO_OPE"] == 2023].mean()
monto_year_current = df_filtred_2["MONTO"][df_filtred_2["AÑO_OPE"] == 2024].mean()
kpsTas = {
    "dataUpdate":  "27-Feb-2025", 
    "cardClientes" : {
        "totalClientes":int( df_filtred_2["NUMERO_CLIENTE"].nunique()),
        "perCLientes": round((df["NUMERO_CLIENTE"].nunique()/numTotalClient)  * 100, 2)
    },
    "cardProd": {
        "numProduct": df_filtred_2["IINSTR"].nunique(),
        "meanClientProduct": round(df["NUMERO_CLIENTE"].count()/df_filtred_2["NUMERO_CLIENTE"].nunique(), 2),
        "crecimiento":  round( ((num_year_current - num_last_year) / num_last_year) * 100 , 1),
        "GraphcountProdFin": [[category, value] for category, value in zip(agrupado_año.tail(10)["AÑO_OPE"], agrupado_año.tail(10)["productos"])],
    },
    "cardPlazo":{
        "meanPlazo": round(df_filtred_2["CPZO_A"].mean(),2),
        "minPlazo": int(df_filtred_2["CPZO_A"].min()),
        "maxPlazo": int(df_filtred_2["CPZO_A"].max()),
        "GraphPlazo": [[category, value] for category, value in zip(agrupado_año.tail(10)["AÑO_OPE"], agrupado_año.tail(10)["plazo_promedio"])] },
    "cardMonto": {
        "meanMonto": round(df_filtred_2["MONTO"].mean()),
        "minMonto": int(df_filtred_2["MONTO"].min()),
        "maxMonto": int(df_filtred_2["MONTO"].max()),
        "crecimiento":  round( ((monto_year_current - monto_last_year) / monto_last_year) * 100 , 1)
    }
}

### agrupado fecha operaciones año mes vs contratos
agrupado_año = (
    df_filtred_2.groupby(["AÑO_OPE"], as_index=False)
    .agg(
        numero_contratos = ("ICONTRATO", "count"),
        productos = ("IINSTR", 'nunique'),        
        suma_plazo = ("CPZO_A", "sum"),
        plazo_promedio = ("CPZO_A", lambda x: round(x.mean()) if not x.isna().all() else 0 ),
        maximo = ("CPZO_A", 'max'),
        minimo = ("CPZO_A", 'min') 
    )
).sort_values(["AÑO_OPE"])

agrupado_año.to_csv(os.path.join(path_exit_agrupamiento,"agrupado_año.csv"), index = False)

agrupado_año_mes = (
    df_filtred_2.groupby(["AÑO_OPE","MES_OPE"], as_index=False)
    .agg(
        numero_contratos = ("ICONTRATO", "count"),
        productos = ("IINSTR", 'nunique'),
        suma_plazo = ("CPZO_A", "sum"),
        plazo_promedio = ("CPZO_A", lambda x: round(x.mean()) if not x.isna().all() else 0 ),
        maximo = ("CPZO_A", 'max'),
        minimo = ("CPZO_A", 'min') 
    )
).sort_values(["AÑO_OPE","MES_OPE"])

agrupado_año.to_csv(os.path.join(path_exit_agrupamiento,"agrupado_año_mes.csv"), index = False)

### agrupado fecha vencimiento año mes vs contratos

agrupado_año_venc = (
    df_filtred_2.groupby(["AÑO_FVENCE"], as_index=False)
    .agg(
        numero_contratos = ("ICONTRATO", "count"),
        plazo_promedio = ("CPZO_A", lambda x: round(x.mean()) if not x.isna().all() else 0 ),
        maximo = ("CPZO_A", 'max'),
        minimo = ("CPZO_A", 'min') 
    )
).sort_values(["AÑO_FVENCE"])

agrupado_año_venc.to_csv(os.path.join(path_exit_agrupamiento,"agrupado_año_venc.csv"), index=False)


agrupado_año_venc_mes = (
    df_filtred_2.groupby(["AÑO_FVENCE","MES_FVENCE"], as_index=False)
    .agg(
        numero_contratos = ("ICONTRATO", "count"),
        plazo_promedio = ("CPZO_A", lambda x: round(x.mean()) if not x.isna().all() else 0 ),
        maximo = ("CPZO_A", 'max'),
        minimo = ("CPZO_A", 'min') 
    )
).sort_values(["AÑO_FVENCE","MES_FVENCE"])

agrupado_año_venc_mes.to_csv(os.path.join(path_exit_agrupamiento,"agrupado_año_venc_mes.csv"), index=False)


### Agrupado 2 producto vs tiempo

agrupado_producto_año = (
    df_filtred_2.groupby(["AÑO_OPE"], as_index=False)
    .agg(
        cantidad_productos = (col_subproductos, "nunique"),
    )
).sort_values("AÑO_OPE", ascending=False)

agrupado_producto_año.to_csv(os.path.join(path_exit_agrupamiento,"agrupado_producto_año.csv"), index=False)

agrupado_producto_año_mes = (
    df_filtred_2.groupby(["AÑO_OPE","MES_OPE"], as_index=False)
    .agg(
        cantidad_productos = (col_subproductos, "nunique"),
    )
).sort_values(["AÑO_OPE","MES_OPE"], ascending=False)

agrupado_producto_año_mes.to_csv(os.path.join(path_exit_agrupamiento,"agrupado_producto_año_mes.csv"), index=False)

agrupado_prod_duracion = (
    df_filtred_2.groupby([col_subproductos], as_index=False)
    .agg(
        promedio_plazo=('CPZO_A', lambda x: round(x.mean()) if not x.isna().all() else 0),
        maximo_plazo = ("CPZO_A", 'max'),
        minimo_plazo = ("CPZO_A", 'min'),
        promedio_monto = ("MONTO",lambda x: round(x.mean()) if not x.isna().all() else 0), 
        minimo_monto = ("MONTO", 'min'),
        maximo_monto = ("MONTO", 'max')
    )
    .sort_values(col_subproductos, ascending=False)
)

agrupado_prod_duracion.to_csv(os.path.join(path_exit_agrupamiento,"agrupado_prod_duracion.csv"), index=False)



