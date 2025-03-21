from multiprocessing import Pool
from fuzzywuzzy import fuzz
import pandas as pd
import re
import numpy as np


def normalizar_cadena(cadena):
    # Eliminación de caracteres especiales
    cadena_normalizada = re.sub(r'[^a-zA-Z0-9áéíóúÁÉÍÓÚ\s]', '', cadena)
    # Conversión a mayúsculas
    cadena_normalizada = cadena_normalizada.upper()
    # Eliminación de espacios en blanco
    cadena_normalizada = cadena_normalizada.replace(' ', '')
    return cadena_normalizada

def compara_filas(args):
    id1, num_cliente_1, clt1, df2, col_nom_2, id_cliente2, criterio_similitud = args
    resultados = [[], [], [], [], [], []]
    for id2, num_cliente_2, clt2 in zip(df2.index,df2[id_cliente2], df2[col_nom_2]):
        if fuzz.ratio(normalizar_cadena(clt1), normalizar_cadena(clt2)) >= criterio_similitud:
            resultados[0].append(clt1)
            resultados[1].append(clt2)
            resultados[2].append(id1)
            resultados[3].append(id2)
            resultados[4].append(num_cliente_1)
            resultados[5].append(num_cliente_2)
    return resultados

def find_transition(lista):
    for p1 in range(len(lista)):
        for p2 in range(p1 + 1, len(lista)):
            #print(lista[p1], lista[p2])
            if lista[p1][0] == lista[p2][0]:
                #print("paso 1")
                if (lista[p1][1], lista[p2][1]) in lista:
                    return (lista[p1][1], lista[p2][1])
                elif (lista[p2][1], lista[p1][1]) in lista:
                    return (lista[p2][1], lista[p1][1])
            elif lista[p1][1] == lista[p2][0]:
                #print("paso 2")
                if (lista[p1][0], lista[p2][1]) in lista:
                     return (lista[p1][0], lista[p2][1])
                elif (lista[p2][1], lista[p1][0]) in lista:
                    return (lista[p2][1], lista[p1][0])
            elif lista[p1][0] == lista[p2][1]:
                #print("paso 3")
                if (lista[p1][1], lista[p2][0]) in lista:
                    return (lista[p1][1], lista[p2][0])
                elif (lista[p2][0], lista[p1][1]) in lista:
                    return (lista[p2][0], lista[p1][1])
            elif lista[p1][1] == lista[p2][1]:
                #print("paso 4")
                if (lista[p1][0], lista[p2][0]) in lista:
                    return (lista[p1][0], lista[p2][0])
                elif (lista[p2][0], lista[p1][0]) in lista:
                    return (lista[p2][0], lista[p1][0])
    return []

def clean_transition_aux(lista):
    uz = find_transition(lista)
    if uz:
        lista.remove(uz)
    while uz:
        uz = find_transition(lista)
        if uz:
            lista.remove(uz)
    return lista

def clean_simetria(df, identificador1:str, identificador2:str):
    """
    
    Args:
       
    Returns:
        
    """
    df_temp = df[df["NUM_CLIENTE_1"] == df["NUM_CLIENTE_2"]]
    
    df = df[df["NUM_CLIENTE_1"] != df["NUM_CLIENTE_2"]]
    
    idx = [((id1,id2),(id2,id1)) for id1, id2 in zip(df[identificador1].to_list(), df[identificador2].to_list())]
    
    for i in idx:
        if (i[1], i[0]) in idx:
            idx.remove((i[1], i[0]))
  
    ix = [df.loc[(df[identificador1] == i[0][0]) & (df[identificador2] == i[0][1])].index for i in idx]

    ix = [x[0] for x in ix]
    df = df.loc[ix]
    df = pd.concat([df,df_temp],ignore_index=True)
    return df


def clean_transition(df, identificador1:str, identificador2:str):
    parejas = [(id1,id2) for id1, id2 in zip(df[identificador1].to_list(),df[identificador2].to_list())]
    idx_clean =  clean_transition_aux(parejas)
    ix_2 = [df.loc[(df[identificador1] == i[0]) & (df[identificador2] == i[1])].index for i in idx_clean]
    ix_2  = [x[0] for x in ix_2]
    clean_df = df.loc[ix_2]
    return clean_df
    

def compara_nombres(df1, df2, col_nom_1, col_nom_2, id_cliente1, id_cliente2, criterio_similitud, dfs_equal = False):
    """
    Compara los nombres de dos dataframe mediante un umbral de similitud.

    Args:
        df1 (pd.DataFrame): Primera tabla de clientes.
        df2 (pd.DataFrame): Segunda tabla de clientes.
        col_nom_1 (str): nombre de la columna que contiene los nombres del df1.
        col_nom_2 (str): nombre de la columna que contiene los nombres del df2.
        id_cliente1(str): id del cliente en la primera tabla.
        id_cliente2(str): id del cliente en la segunda tabla.     
        criterio_similitud (int): criterio de similitud.
        dfs_equal(bool): los dfs son iguales

    Returns:
        list: Listas de resultados con las coincidencias encontradas.
    """ 
    CR = [[], [], [], [], [], []]

    with Pool(processes=10) as pool:
        args = [(id1, num_cliente_1, clt1, df2, col_nom_2, id_cliente2, criterio_similitud) for id1, num_cliente_1, clt1 in zip(df1.index, df1[id_cliente1], df1[col_nom_1])]
        resultados = pool.map(compara_filas, args)
    
    for resultado in resultados:
        for i in range(6):
            CR[i].extend(resultado[i])
            
    df_comparacion = pd.DataFrame(
        {   "ID1": CR[2],
            "NUM_CLIENTE_1": CR[4],
            "CLIENTE_1" : CR[0],
            "ID2": CR[3],
            "NUM_CLIENTE_2": CR[5],
            "CLIENTE_2" : CR[1]
        }
    )
    if dfs_equal:
        df_aux = df_comparacion[ df_comparacion["NUM_CLIENTE_1"] != df_comparacion["NUM_CLIENTE_2"] ]
    else:
        df_aux = df_comparacion.copy()
        
    df_aux = clean_simetria(df_aux,"NUM_CLIENTE_1","NUM_CLIENTE_2")
    df_aux = clean_transition(df_aux,"NUM_CLIENTE_1","NUM_CLIENTE_2")
    return df_aux


def agregar_asociaciones_clientes(clt_repetidos, df):
    grouped_df_cts = clt_repetidos.groupby(["ID1","NUM_CLIENTE_1"]).agg(
    NUM_CLIENTES_ASOCIADOS=('NUM_CLIENTE_2', lambda x: list(x)),
    CLIENTES_ASOCIADOS = ('CLIENTE_2', lambda x: list(x)),
    IDS_ASOCIADOS = ('ID2', lambda x: list(x))
    ).reset_index()

    data = []
    for num_cliente in grouped_df_cts["NUM_CLIENTE_1"]:
        dict_temp = {}
        for columna in df.columns:
            if columna != "NUMERO_CLIENTE":
                lista_temp  = []; clts_asociados = grouped_df_cts["NUM_CLIENTES_ASOCIADOS"].loc[grouped_df_cts["NUM_CLIENTE_1"] == num_cliente].iloc[0]
                valor_cliente = df[columna].loc[df["NUMERO_CLIENTE"] == num_cliente].iloc[0]
                if pd.notna(valor_cliente) and "NO SE TIENE REGISTRADA LA INFORMACION" not in str(valor_cliente):
                    lista_temp.append(valor_cliente)
                else: 
                    lista_temp.append("-")
                for num_cliente_2 in clts_asociados:
                    if columna != "NOMBRE_O_RAZON_SOCIAL":
                        filtred_value = df[columna].loc[df["NUMERO_CLIENTE"] == num_cliente_2].iloc[0]
                        filtred_value = str(filtred_value) if pd.notna(filtred_value) else filtred_value
                        if not pd.isna(filtred_value) and "NO SE TIENE REGISTRADA LA INFORMACION" not in filtred_value:
                            lista_temp.append(filtred_value)   
                        else:
                            lista_temp.append("-") 
                    else: 
                        dict_temp[columna] = "".join(df[columna].loc[df["NUMERO_CLIENTE"] == num_cliente].iloc[0])  

                lista_temp = list(set(lista_temp))
                if len(lista_temp) > 1 and "-" in lista_temp:
                    lista_temp.remove("-")
                dict_temp[columna] = ", ".join([str(i) for i in lista_temp]) 
            else:
                numeros_de_clientes = [str(num_cliente)] + [str(cliente) for cliente in clts_asociados]
                dict_temp[columna] = ", ".join(numeros_de_clientes)
        data.append(dict_temp)

    df_resul = pd.DataFrame(data)
    df_resul = df_resul.replace("-", np.nan)
    drops_ids = grouped_df_cts["ID1"].to_list() + [item for sublist in grouped_df_cts["IDS_ASOCIADOS"] for item in sublist]
    return df_resul, drops_ids
    
