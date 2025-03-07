import configparser

config = configparser.ConfigParser()

config.read('/home/ale1726/proyects/datalake/input/datalake.ini')

# conexiones
db_sims  =   {"NAME":config['sims']['name'],"USER":config['sims']['user'],"PSSWD":config['sims']['psswd'],"DSN":config['sims']['dsn'],'SCHEMA':config['sims']['schema'],'tab_clts':config['sims']['table_clts']}
db_gval  =   {"NAME":config['gval']['name'],'USER':config['gval']['user'],'PSSWD':config['gval']['psswd'],'DSN':config['gval']['dsn'],'SCHEMA':config['gval']['schema'],'tab_clts':config['gval']['table_clts']}
db_imrc  =   {"NAME":config['imrc']['name'],'USER':config['imrc']['user'],'PSSWD':config['imrc']['psswd'],'DSN':config['imrc']['dsn'],'SCHEMA':config['imrc']['schema'],'tab_clts':config['imrc']['table_clts']}
db_scaler=   {"NAME":config['ccbe']['name'],'USER':config['ccbe']['user'],'PSSWD':config['ccbe']['psswd'],'DSN':config['ccbe']['dsn'],'SCHEMA':config['ccbe']['schema'],'tab_clts':config['ccbe']['table_clts']}
db_scc   =    {"NAME":config['scc']['name'],'USER':config['scc']['user'],'PSSWD':config['scc']['psswd'],'DSN':config['scc']['dsn'],'SCHEMA':config['scc']['schema'],'tab_clts':config['scc']['table_clts']}
db_scaler= {"NAME":config['scaler']['name'],'USER':config['scaler']['user'],'PSSWD':config['scaler']['psswd'],'DSN':config['scaler']['dsn'],'SCHEMA':config['scaler']['schema'],'tab_clts':config['scaler']['table_clts']}
db_mdc=    {"NAME":config['mdc']['name'],'USER':config['mdc']['user'],'PSSWD':config['mdc']['psswd'],'DSN':config['mdc']['dsn'],'SCHEMA':config['mdc']['schema'],'tab_clts':config['mdc']['table_clts']}
db_sisec=  {"NAME":config['sisec']['name'],'USER':config['sisec']['user'],'PSSWD':config['sisec']['psswd'],'DSN':config['sisec']['dsn'],'SCHEMA':config['sisec']['schema'],'tab_clts':config['sisec']['table_clts']}
db_meca=   {"NAME":config['meca']['name'],'USER':config['meca']['user'],'PSSWD':config['meca']['psswd'],'DSN':config['meca']['dsn'],'SCHEMA':config['meca']['schema'],'tab_clts':config['meca']['table_clts']}
db_sipe=   {"NAME":config['sipe']['name'],'USER':config['sipe']['user'],'PSSWD':config['sipe']['psswd'],'DSN':config['sipe']['dsn'],'SCHEMA':config['sipe']['schema'],'tab_clts':config['sipe']['table_clts']}
db_tas=    {"NAME":config['tas']['name'],'USER':config['tas']['user'],'PSSWD':config['tas']['psswd'],'DSN':config['tas']['dsn'],'SCHEMA':config['tas']['schema'],'tab_clts':config['tas']['table_clts']}
db_siaf=   {"NAME":config['siaf']['name'],'USER':config['siaf']['user'],'PSSWD':config['siaf']['psswd'],'DSN':config['siaf']['dsn'],'SCHEMA':config['siaf']['schema'],'tab_clts':config['siaf']['table_clts']}
db_siag=   {"NAME":config['siag']['name'],'USER':config['siag']['user'],'PSSWD':config['siag']['psswd'],'DSN':config['siag']['dsn'],'SCHEMA':config['siag']['schema'],'tab_clts':config['siag']['table_clts']}
db_some=    {"NAME":config['bnc']['name'],'USER':config['bnc']['user'],'PSSWD':config['bnc']['psswd'],'DSN':config['bnc']['dsn'],'SCHEMA':config['bnc']['schema'],'tab_clts':config['bnc']['table_clts']}
db_some=   {'NAME':config['some']['name'],'USER':config['some']['user'],'PSSWD':config['some']['psswd'],'DSN':config['some']['dsn'],'SCHEMA':config['some']['schema'],'tab_clts':config['some']['table_clts']}
db_ffon=   {'NAME':config['ffon']['name'],'USER':config['ffon']['user'],'PSSWD':config['ffon']['psswd'],'DSN':config['ffon']['dsn'],'SCHEMA':config['ffon']['schema'],'tab_clts':config['ffon']['table_clts']}
db_sirac =  {'NAME':config['sirac']['name'],'USER':config['sirac']['user'],'PSSWD':config['sirac']['psswd'],'DSN':config['sirac']['dsn'],'SCHEMA':config['sirac']['schema'],'tab_clts':config['sirac']['table_clts']}
db_sori=   {'NAME':config['sori']['name'],'USER':config['sori']['user'],'PSSWD':config['sori']['psswd'],'DSN':config['sori']['dsn'],'SCHEMA':config['sori']['schema'],'tab_clts':config['sori']['table_clts']}
db_sirys=  {'NAME':config['sirys']['name'],'USER':config['sirys']['user'],'PSSWD':config['sirys']['psswd'],'DSN':config['sirys']['dsn'],'SCHEMA':config['sirys']['schema'],'tab_clts':config['sirys']['table_clts']}
db_soi =   {'NAME':config['soi']['name'],'USER':config['soi']['user'],'PSSWD':config['soi']['psswd'],'DSN':config['soi']['dsn'],'SCHEMA':config['soi']['schema'],'tab_clts':config['soi']['table_clts']}
db_sideca= {'NAME':config['sideca']['name'],'USER':config['sideca']['user'],'PSSWD':config['sideca']['psswd'],'DSN':config['sideca']['dsn'],'SCHEMA':config['sideca']['schema']}
db_sifc = {'NAME':config['sifc']['name'],'USER':config['sifc']['user'],'PSSWD':config['sifc']['psswd'],'DSN':config['sifc']['dsn'],'SCHEMA':config['sifc']['schema']}

NOMBRE_NO_VALIDOS = ["NO APLICA", "N/A"]