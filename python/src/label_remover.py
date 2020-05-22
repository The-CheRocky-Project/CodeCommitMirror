""" labelAdder Lambda module

Questo modulo contiene l'handler che effettua la rimozione di una label
indicata dall'utente
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""

# imports url
import urllib.parse
import json
import boto3

# definizione della risorsa s3
s3 = boto3.resource('s3')

def lambda_handler(event, context):
    """
        Handler che riceve l'evento che fa scaturire l'esecuzione,
        e che contiene l'indice della label da rimuovere

        Args:
            event: L'evento che ha fatto scaturire l'avvio dell'handler
            context: Il dizionario rappresentante le variabili di contesto
                d'esecuzione

        Returns:
            True se l'operazione è andata a buon fine, False altrimenti

        """
    print('Executing :' + context.function_name)
    try:
        # Preleva bucket name e key da event
        # TODO da verificare che funzioni
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(
            event['Records'][0]['s3']['object']['key'],
            encoding='utf-8')
        resume = s3.Object(bucket, 'resume.json')
        resume_res = resume.get()
        resume_content = json.loads(resume_res['Body'].read().decode('utf-8'))

        # Preleva il messaggio ricevuto da SNS, e ne fa il parsing
        # TODO da verificare che funzioni (dovrebbe essere sufficiente l'indice del frame)
        message = event['Records'][0]['SNS']['Message']
        name = message[1]

        # Tiene traccia se la chiave era già presente o meno nel file resume.json
        founded = False

        # Destinazione del video spezzone di highlight
        new_key = 'cuts/' + key

        # Se la label è presente in resume.json, viene rimossa
        for reco in resume_content:
            if reco['FrameName'] == name:
                # Elimina il vecchio video spezzone di highlight dal bucket S3 ahlvideos/cuts
                #TODO da verificare che funzioni
                bucket.delete_key(new_key[:-4]+'mp4')
                # Elimina i dati del frame dal file resume.json
                #TODO da verificare che funzioni
                del reco['FrameName']
                # Sovrascrive il file resume.json aggiornandolo
                b_to_write = json.dumps(resume_content)
                resume.put(Body=b_to_write)
                founded = True

        # Se il frame non è presente in resume.json, ritorna false
        if not founded:
            return False
        return True
    except Exception as err:
        print(err)
        print('Impossibile rimuovere la label ' + name)
        raise err
