
from datetime import datetime
import cx_Oracle
import pandas as pd
import os
from rapidfuzz import process, fuzz
import numpy as np
import json
import os


df = pd.read_csv("/home/ale1726/proyects/datalake/clientes/data/productos/TAS/data/26_02_2025/productos_clientes_TAS_T.dat", low_memory=False)

### agrupado año mes vs contratos
agrupado_año = (
    df.groupby(["AÑO_OPE"], as_index=False)
    .agg(
        numero_contratos = ("ICONTRATO", "count"),
        plazo_promedio = ("CPZO_A", lambda x: round(x.mean()) if not x.isna().all() else 0 ),
        maximo = ("CPZO_A", 'max'),
        minimo = ("CPZO_A", 'min') 
    )
).sort_values(["AÑO_OPE"])