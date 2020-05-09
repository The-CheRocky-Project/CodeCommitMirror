""" labelAdder Lambda module

Questo modulo contiene l'handler che effettua l'aggiunta di una label
individuata dal modello di ML o indicata dall'utente
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""

#imports url and media manager layer
import json
import boto3
import urllib.parse
import media_manager

#definizione della risorsa s3
s3 = boto3.resource('s3')

def lambda_handler(event, context):
    """
        Handler che riceve l'evento che fa scaturire l'esecuzione,
        e che contiene l'indice della label da aggiungere

        Args:
            event: L'evento che ha fatto scaturire l'avvio dell'handler
            context: Il dizionario rappresentante le variabili di contesto
                d'esecuzione

        Returns:
            id del job Elemental Media Convert, False altrimenti

        """
    try:
        # Preleva bucket name e key da event
        #TODO da verificare che funzioni
        bucket = event['Records'][0]['s3']['bucket']['name']
        key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')

        resume = s3.Object(bucket, 'resume.json')
        resume_res = resume.get();
        resume_content = json.loads(resume_res['Body'].read().decode('utf-8'))

        # Preleva il messaggio ricevuto da SNS, e ne fa il parsing
        #TODO da verificare che funzioni
        message = event['Records'][0]['SNS']['Message']
        name = message[1]
        start = message[2]
        duration = message[3]
        label = message[4]
        accuracy = message[5]
        checked = message[6]

        # Tiene traccia se la chiave era già presente o meno nel file resume.json
        founded = False

        # Destinazione del video spezzone di highlight
        new_key = 'cuts/' + key

        # Se la label è già presente in resume.json, viene aggiornata
        for reco in resume_content:
            if reco['FrameName'] == name:
                # Elimina il vecchio video spezzone di highlight dal bucket S3 ahlvideos/cuts
                #TODO da verificare che funzioni
                bucket.delete_key(new_key[:-4]+'mp4')
                # Aggiorna i dati del frame
                reco['Start'] = start
                reco['Duration'] = duration
                reco['Label'] = label
                reco['Accuracy'] = accuracy
                reco['Checked'] = checked
                founded = True
        # se il frame non è presente in resume.json, viene aggiunto al file
        if founded == False:
            resume_content.append(
                {
    		        "FrameName": name,
    		        "Start": start,
    		        "Duration": duration,
    		        "Label": label,
    		        "Accuracy": accuracy,
    		        "Checked": checked
    		    }
            )

        # Sovrascrive il file resume.json aggiornandolo
        b_to_write = json.dumps(resume_content)
        resume.put(Body=b_to_write)

        # Avvia job di ritaglio con chiave numerica corrispondente all'indice all'interno del file resume.json
        #TODO da verificare che funzioni
        job_id = media_manager.cutter(name,start,duration)
        return job_id
    except Exception as e:
        print(e)
        print('Impossibile aggiungere la label ' + name)
        raise e
