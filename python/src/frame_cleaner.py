# Funzione che dato in input un nomeFile e un estensione cancella tutti i file nomeFileX.estensione con X = 1,2,3... fermandosi quando non esiste
# il prossimo file nomeFileX+1.estensione

import boto3
import botocore

s3 = boto3.resource('s3')

bucket = 'provabucketaws'
nomeFile = 'NomeVideo'  # da prendere in input dalla funzione
estensione = 'json'  # da prendere in input dalla funzione
# Non so se sia questo il modo di prendere dei parametri in input con le lambda, leggendo in internet se si usa il metodo invoke() per richiamare
# questa lambda da un'altra lambda si può specificare dalla lambda chiamante un payload in cui si posso aggiungere dei campi custom al JSON
#nomeFile = event['nomeFile']
#estensione = event['estensione']

i = 1

hasNext = True

while hasNext:
    s3.Object(bucket, 'training/cut/'+nomeFile+str(i)+'.'+estensione).delete()
    i = i+1
    # Controllo se esiste il file nomeFile[i+1]
    try:
        s3.Object(bucket, 'training/cut/'+nomeFile+str(i)+'.'+estensione).load()
    except botocore.exceptions.ClientError as e:
        if e.response['Error']['Code'] == "404":
            # il file nomeFile[i+1] non esiste
            hasNext = False
        else:
            # Qualcosa è andato storto
            raise
