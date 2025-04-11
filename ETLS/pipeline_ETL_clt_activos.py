import os
import sys
import cx_Oracle
from datetime import datetime
import subprocess

modulo =  os.path.abspath("/home/ale1726/proyects/datalake/clientes/clientes_eda/utils")
if modulo not in sys.path:
    sys.path.append(modulo)

from tf import *
from db import *
from gd import * 


list_dbs_clt_activos = [db_siag, db_soi, db_meca, db_sims, db_sipe, db_tas, db_sirac]
path_exit = "/home/ale1726/proyects/datalake/clientes/data/clientes_activos"
path_logs = "/home/ale1726/proyects/datalake/clientes/data/logs"

date_now = datetime.now().strftime("%d_%m_%Y") 

repositorio_data_clt =  os.path.join(path_exit,date_now)

os.makedirs(repositorio_data_clt, exist_ok=True)

for database in list_dbs_clt_activos:
    try:
       print(database["NAME"])
       get_table(path_exit = repositorio_data_clt  , db = database, name_archivo = f"Clientes_activos_{database['NAME']}" , query  = querys_ctls_activos[database["NAME"]])  
    except Exception as error:
        repositorio_log = os.path.join(path_logs, date_now)
        os.makedirs(repositorio_log, exist_ok=True)
        log_file =  os.path.join(repositorio_log,f"errors_clts_{database['NAME']}_{date_now}.log")
        with open(log_file, 'a') as archivo:
            archivo.write(str(error))
