""" labelAdder Lambda module

Questo modulo contiene l'handler che effettua l'aggiunta di una label
individuata dal modello di ML o indicata dall'utente
Contenuto:
    * lambda_handler - l'handler principale per la lambda
"""
# TODO resource out of template (@Gotta, va tolta?)
# imports url and media manager layer
import urllib.parse
import json
import boto3
from layers import media_manager

# definizione della risorsa s3
s3 = boto3.resource('s3')
sns = boto3.resource('sns')


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
    print('Executing :' + context.function_name)
    try:
        # Preleva bucket name e key da event
        # TODO da verificare che funzioni
        # bucket = event['Records'][0]['s3']['bucket']['name']
        # key = urllib.parse.unquote_plus(
        #     event['Records'][0]['s3']['object']['key'],
        #     encoding='utf-8')
        content = event["Records"][0]["Sns"]

        resume = s3.Object('ahlconsolebucket', 'tmp/modified-resume.json')
        resume_res = resume.get()
        resume_content = json.loads(resume_res['Body'].read().decode('utf-8'))

        # Preleva il messaggio ricevuto da SNS, e ne fa il parsing
        # TODO da verificare che funzioni
        message = content['Message']
        if message == "addRow":
            attributes = content['MessageAttributes']
            start = int(attributes['start']['Value'])
            end = int(attributes['end']['Value'])
            label = int(attributes['label']['Value'])
            index = 0
            while index < len(resume_content) and int(resume_content[index]['start']) <= start:
                index += 1
            resume_content.insert(index, {
                'frame_key': '',
                'accuracy': '0.0',
                'label': label,
                'start': start,
                'tfs': str(end - start),
                'type': 'user',
                'show': 'true'
            })
            b_to_write = json.dumps(resume_content)
            resume.put(Body=b_to_write)

            # notifies of addLabel done status
            topic = sns.publish(
                TopicArn='arn:aws:sns:us-east-2:693949087897:editLabels',
                Messge='update'
            )
            # # Tiene traccia se la chiave era già presente o meno
            # # nel file resume.json
            # founded = False
            #
            # # Destinazione del video spezzone di highlight
            # new_key = 'cuts/' + key
            #
            # # Se la label è già presente in resume.json, viene aggiornata
            # for reco in resume_content:
            #     if reco['FrameName'] == name:
            #         # Elimina il vecchio video spezzone di
            #         # highlight dal bucket S3 ahlvideos/cuts
            #         # TODO da verificare che funzioni
            #         bucket.delete_key(new_key[:-4] + 'mp4')
            #         # Aggiorna i dati del frame
            #         reco['Start'] = start
            #         reco['Duration'] = duration
            #         reco['Label'] = label
            #         reco['Accuracy'] = accuracy
            #         reco['Checked'] = checked
            #         founded = True
            # # se il frame non è presente in resume.json, viene aggiunto al file
            # if not founded:
            #     resume_content.append(
            #         dict(FrameName=name,
            #              Start=start,
            #              Duration=duration,
            #              Label=label,
            #              Accuracy=accuracy,
            #              Checked=checked)
            #     )
            #
            # # Sovrascrive il file resume.json aggiornandolo
            # b_to_write = json.dumps(resume_content)
            # resume.put(Body=b_to_write)
            #
            # # Avvia job di ritaglio con chiave numerica corrispondente
            # # all'indice all'interno del file resume.json
            # # TODO da verificare che funzioni
            # job_id = media_manager.cutter(name, start, duration)
            return True
        return False
    except Exception as err:
        print(err)
        print('Impossibile aggiungere la label ')
        raise err
