
from datetime import datetime
import cx_Oracle
import pandas as pd
import os
from rapidfuzz import process, fuzz
import numpy as np
import json
import os


df = pd.read_csv("/home/ale1726/proyects/datalake/clientes/data/productos/TAS/data/26_02_2025/productos_clientes_TAS_T.dat", low_memory=False)
path_exit_agrupamiento = "/home/ale1726/proyects/datalake/clientes/data/productos/TAS/data/26_02_2025/agrupamientos"

df_filtred_2 = df[df["CPZO_A"]  < 50000 ]

col_subproductos = "IINSTR"

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
