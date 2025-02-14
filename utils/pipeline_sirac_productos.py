
from datetime import datetime
import cx_Oracle
import pandas as pd
import os
from rapidfuzz import process, fuzz
import numpy as np
import json
import os


df_productos = pd.read_csv("/home/ale1726/proyects/datalake/clientes/data/productos/SIRAC/data/06_02_2025/productos_clientes_SIRAC.dat", low_memory=False)


df_productos.loc[df_productos["AÑO_VENCIMIENTO"] == 2264, "FECHA_VENCIMIENTO"] = datetime(2031, 7, 31)
df_productos.loc[df_productos["AÑO_VENCIMIENTO"] == 2264, "MES_VENCIMIENTO"] = 7
df_productos.loc[df_productos["AÑO_VENCIMIENTO"] == 2264, "DIA_VENCIMIENTO"] = 31   
df_productos.loc[df_productos["AÑO_VENCIMIENTO"] == 2264, "AÑO_VENCIMIENTO"] = 2031


df_productos["NOMBRE_COMPLETO/RAZON_SOCIAL"] = df_productos.apply(
    lambda row: (
        f"{row['NOMBRES']} {row['PRIMER_APELLIDO']} {row['SEGUNDO_APELLIDO']}"
        if row["CODIGO_TIPO_IDENTIFICACION"] == 5 else row["RAZON_SOCIAL"]
    ),
    axis=1
)


path_exit_agrupados = "/home/ale1726/proyects/datalake/clientes/data/productos/SIRAC/data/06_02_2025/agrupados"

def formato_numero(valor):
    if valor >= 1_000_000_000:  # Billones
        return f"{valor / 1_000_000_000:.2f}B"
    elif valor >= 1_000_000:  # Millones
        return f"{valor / 1_000_000:.2f}M"
    elif valor >= 1_000:  # Miles
        return f"{valor / 1_000:.2f}K"
    else:  # Números menores a 1,000
        return f"{valor:.2f}"

#### data kpis 
data_kps = {
    "TotalClientes": df_productos["CODIGO_CLIENTE"].nunique(),
    "TFisicos": df_productos["CODIGO_CLIENTE"][df_productos["CODIGO_TIPO_IDENTIFICACION"] == 5].nunique(),
    "TMoral": df_productos["CODIGO_CLIENTE"][df_productos["CODIGO_TIPO_IDENTIFICACION"] == 7].nunique(),
    "ProdCliente":  round(df_productos["DESC_LINEA_FINANCIERA"].count()/df_productos["CODIGO_CLIENTE"].nunique(),2), 
    "ProdClienteFisico": round(df_productos["DESC_LINEA_FINANCIERA"][df_productos["CODIGO_TIPO_IDENTIFICACION"] == 5].count()/df_productos["CODIGO_CLIENTE"][df_productos["CODIGO_TIPO_IDENTIFICACION"] == 5].nunique(),2),
    "ProdClienteMoral": round(df_productos["DESC_LINEA_FINANCIERA"][df_productos["CODIGO_TIPO_IDENTIFICACION"] == 7].count()/df_productos["CODIGO_CLIENTE"][df_productos["CODIGO_TIPO_IDENTIFICACION"] == 7].nunique(),2),
    "PlazoMean":round(df_productos["PLAZO"].sum()/df_productos["PRODUCTO"].count(),2),
    "PlazoMin":int(df_productos.loc[df_productos["PLAZO"].idxmin(), "PLAZO"]),
    "PlazoMax":int(df_productos.loc[df_productos["PLAZO"].idxmax(), "PLAZO"]),
    "MontoPromedioMx":formato_numero(round(df_productos["MONTO_INICIAL"][df_productos["CODIGO_MONEDA"] == 1].sum()/df_productos["PRODUCTO"][df_productos["CODIGO_MONEDA"] == 1].count(),2)),
    "MontoPromedioUsd":formato_numero(round(df_productos["MONTO_INICIAL"][df_productos["CODIGO_MONEDA"] == 54].sum()/df_productos["PRODUCTO"][df_productos["CODIGO_MONEDA"] == 54].count(),2)),
    "MinMontoMx": formato_numero(df_productos.loc[df_productos["MONTO_INICIAL"][df_productos["CODIGO_MONEDA"] == 1].idxmin(), "MONTO_INICIAL"]),
    "MaxMontoMx": formato_numero(df_productos.loc[df_productos["MONTO_INICIAL"][df_productos["CODIGO_MONEDA"] == 1].idxmax(), "MONTO_INICIAL"]),
    "MinMontoUsd": formato_numero(df_productos.loc[df_productos["MONTO_INICIAL"][df_productos["CODIGO_MONEDA"] == 54].idxmin(), "MONTO_INICIAL"]),
    "MaxMontoUsd": formato_numero(df_productos.loc[df_productos["MONTO_INICIAL"][df_productos["CODIGO_MONEDA"] == 54].idxmax(), "MONTO_INICIAL"])
    }


output_path = "/home/ale1726/proyects/datalake/clientes/data/productos/SIRAC/data/06_02_2025/agrupados/data_kps.json" 
with open(output_path, "w", encoding="utf-8") as json_file:
    json.dump(data_kps, json_file, indent=4, ensure_ascii=False)
    

#### agrupado año de contratación contra contratos 
agrupado_año_contratos = (
    df_productos.groupby(["AÑO_REGISTRO"], as_index=False)
    .agg(
        numero_contratos = ("NUMERO_CONTRATO", "count"),
        suma_plazo = ("PLAZO", "sum"),
        plazo_promedio = ("PLAZO", lambda x: round(x.mean())),
        maximo = ("PLAZO", 'max'),
        minimo = ("PLAZO", 'min') 
    ).assign(plazo_promedio_ponderado = lambda df: round(df['suma_plazo'] / df['numero_contratos']))
).sort_values("AÑO_REGISTRO")
agrupado_año_contratos.to_csv(os.path.join(path_exit_agrupados,'agrupado_año_contratos.csv'), index=False)

#### agrupado año mes de contratación contra contratos
agrupado_año_mes_contratos = (
    df_productos.groupby(["AÑO_REGISTRO","MES_REGISTRO"], as_index=False)
    .agg(
        numero_contratos = ("NUMERO_CONTRATO", "count"),
        plazo_promedio = ("PLAZO", lambda x: round(x.mean()) if not x.isna().all() else 0 ),
        maximo = ("PLAZO", 'max'),
        minimo = ("PLAZO", 'min') 
    )
).sort_values(["AÑO_REGISTRO","MES_REGISTRO"])

agrupado_año_mes_contratos = agrupado_año_mes_contratos.dropna()
agrupado_año_mes_contratos.to_csv(os.path.join(path_exit_agrupados,'agrupado_año_mes_contratos.csv'), index=False)


#### agrupación año de vencimiento contra contratos
agrupado_año_vencimiento_contratos = (
    df_productos.groupby(["AÑO_VENCIMIENTO"], as_index=False)
    .agg(
        numero_contratos = ("NUMERO_CONTRATO", "count"),
    )
).sort_values("AÑO_VENCIMIENTO")

agrupado_año_vencimiento_contratos.to_csv(os.path.join(path_exit_agrupados,'agrupado_año_vencimiento_contratos.csv'), index=False)


#### agrupación año mes de vencimiento contra contratos
agrupado_año_mes_vencimiento_contratos =  (
    df_productos.groupby(["AÑO_VENCIMIENTO","MES_VENCIMIENTO"], as_index=False)
    .agg(
        numero_contratos = ("NUMERO_CONTRATO", "count"),
    )
).sort_values(["AÑO_VENCIMIENTO","MES_VENCIMIENTO"])

agrupado_año_mes_vencimiento_contratos.to_csv(os.path.join(path_exit_agrupados,'agrupado_año_mes_vencimiento_contratos.csv'), index=False)


col_producto = 'PRODUCTO' ## 'PRODUCTO', 'DESC_LINEA_FINANCIERA'


#### agrupación tiempo y productos

agrupado_producto_clts = (
    df_productos.groupby(["AÑO_REGISTRO"], as_index=False)
    .agg(
        cantidad_linea = (col_producto, "nunique"),
        lineas_financieras=(col_producto, lambda x: "--".join(list(x.unique())))
    )
).sort_values("AÑO_REGISTRO")

agrupado_producto_clts.to_csv(os.path.join(path_exit_agrupados,'agrupado_producto_clts.csv'), index=False)

agrupado_clts_producto = (
    df_productos.groupby([col_producto,"AÑO_REGISTRO"], as_index=False)
    .agg(
        cantidad_linea = (col_producto, "nunique"),
        contador = (col_producto, 'count')
    )
).sort_values("AÑO_REGISTRO")

agrupado_clts_producto = agrupado_clts_producto.rename(columns={col_producto: 'PRODUCTO'}) 
agrupado_clts_producto.to_csv(os.path.join(path_exit_agrupados,'agrupado_clts_producto.csv'), index=False)


#### agrupación clientes contra productos


####################################################################
agrupado_cliente_all_producto = (
    df_productos.groupby(col_producto, as_index=False)
    .agg(
        clientes_asociados = ('CODIGO_CLIENTE', 'nunique')
    )
).sort_values(by=['clientes_asociados'])

agrupado_cliente_all_producto = agrupado_cliente_all_producto.rename(columns={col_producto: 'PRODUCTO'}) 
agrupado_cliente_all_producto.to_csv(os.path.join(path_exit_agrupados,'agrupado_cliente_all_producto.csv'), index=False)


####################################################################

agrupado_cliente_fisicos_morales_producto = (
    df_productos.groupby(["CODIGO_TIPO_IDENTIFICACION", col_producto], as_index=False)
    .agg(
        clientes_asociados = ('CODIGO_CLIENTE', 'nunique')
    )
).sort_values(by=["CODIGO_TIPO_IDENTIFICACION",'clientes_asociados'])


agrupado_cliente_fisicos_morales_producto = agrupado_cliente_fisicos_morales_producto.rename(columns={col_producto: 'PRODUCTO'}) 
agrupado_cliente_fisicos_morales_producto.to_csv(os.path.join(path_exit_agrupados,'agrupado_cliente_fisicos_morales_producto.csv'), index=False)



####################################################################
agrupado_año_clientes_all_conteo_total_anual = (
    df_productos.groupby(["AÑO_REGISTRO"], as_index=False)
    .agg(
        numero_clientes_activos = ("NOMBRE_COMPLETO/RAZON_SOCIAL", 'nunique'),
        conteo_productos_año = (col_producto, "count"),
    ).assign(promeido_productos_x_cliente = lambda df: round(df['conteo_productos_año'] / df['numero_clientes_activos']))
).sort_values("AÑO_REGISTRO", ascending=True)

agrupado_año_clientes_all_conteo_total_anual.to_csv(os.path.join(path_exit_agrupados,'agrupado_año_clientes_all_conteo_total_anual.csv'), index=False)


####################################################################

agrupado_año_clientes_seg_conteo_total_anual = (
    df_productos.groupby(["CODIGO_TIPO_IDENTIFICACION", "AÑO_REGISTRO"], as_index=False)
    .agg(
        numero_clientes_activos = ("NOMBRE_COMPLETO/RAZON_SOCIAL", 'nunique'),
        conteo_productos_año = (col_producto, "count"),
    ).assign(promedio_productos_x_cliente = lambda df: round(df['conteo_productos_año'] / df['numero_clientes_activos']))
).sort_values("AÑO_REGISTRO", ascending=True)

agrupado_año_clientes_seg_conteo_total_anual.to_csv(os.path.join(path_exit_agrupados,'agrupado_año_clientes_seg_conteo_total_anual.csv'), index=False)

####################################################################

agrupado_producto_monto_all = (
    df_productos.groupby([col_producto], as_index=False)
    .agg(
        monto_aprobado_total = ('MONTO_APROBADO', 'sum'),
        cantidad_lineas = (col_producto,'count'),
        monto_maximo = ("MONTO_APROBADO", "max"),
        monto_minimo = ('MONTO_APROBADO','min'),
        numero_clientes_activos = ("NOMBRE_COMPLETO/RAZON_SOCIAL", 'nunique')
    ).assign(promedio_monto_total_x_producto = lambda df: round(df['monto_aprobado_total'] / df['cantidad_lineas']))
).sort_values(by=['monto_aprobado_total'])

agrupado_producto_monto_all = agrupado_producto_monto_all.rename(columns={col_producto: 'PRODUCTO'}) 
agrupado_producto_monto_all.to_csv(os.path.join(path_exit_agrupados,'agrupado_producto_monto_all.csv'), index=False)

####################################################################

agrupado_producto_monto_seg_moneda = (
    df_productos.groupby([col_producto, 'CODIGO_MONEDA'], as_index=False)
    .agg(
        monto_aprobado_total = ('MONTO_APROBADO', 'sum'),
        cantidad_lineas = (col_producto,'count'),
        monto_maximo = ("MONTO_APROBADO", "max"),
        monto_minimo = ('MONTO_APROBADO','min'),
        numero_clientes_activos = ("NOMBRE_COMPLETO/RAZON_SOCIAL", 'nunique')
    ).assign(promedio_monto_total_x_producto = lambda df: round(df['monto_aprobado_total'] / df['cantidad_lineas']))
).sort_values(by=['monto_aprobado_total'])


agrupado_producto_monto_seg_moneda = agrupado_producto_monto_seg_moneda.rename(columns={col_producto: 'PRODUCTO'}) 
agrupado_producto_monto_seg_moneda.to_csv(os.path.join(path_exit_agrupados,'agrupado_producto_monto_seg_moneda.csv'), index=False)

####################################################################

agrupado_producto_monto_seg_moneda_persona = (
    df_productos.groupby([col_producto, 'CODIGO_TIPO_IDENTIFICACION' ,'CODIGO_MONEDA'], as_index=False)
    .agg(
        monto_aprobado_total = ('MONTO_APROBADO', 'sum'),
        cantidad_lineas = (col_producto,'count'),
        monto_maximo = ("MONTO_APROBADO", "max"),
        monto_minimo = ('MONTO_APROBADO','min'),
        numero_clientes_activos = ("NOMBRE_COMPLETO/RAZON_SOCIAL", 'nunique')
    ).assign(promedio_monto_total_x_producto = lambda df: round(df['monto_aprobado_total'] / df['cantidad_lineas']))
).sort_values(by=['monto_aprobado_total'])


agrupado_producto_monto_seg_moneda_persona = agrupado_producto_monto_seg_moneda_persona.rename(columns={col_producto: 'PRODUCTO'}) 
agrupado_producto_monto_seg_moneda_persona.to_csv(os.path.join(path_exit_agrupados,'agrupado_producto_monto_seg_moneda_persona.csv'), index=False)