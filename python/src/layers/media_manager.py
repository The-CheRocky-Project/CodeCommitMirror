""" media_manager lambda layer

Il layer media manager si occupa di wrappare tutte le richieste
di media editing come conversione video, creazione di thumbnails,
framizzazione e montaggio

Contenuto:
    * create_thumbnail - crea thumbnail a partire da video
"""


def create_thumbnail(input_key, output_key, queue):
    """Funzione che avvia un job sulla coda "queue" transcoder per creare
    una thumbnail del video di chiave s3 "input_key" che verrà salvata in
    "output_queue"
    
    Args:
        input_key: la chiave S3 del video di origine
        output_key: la chiave S3 di destinazione della thumbnail
        queue: la coda desiderata per il transcoding job

    Returns:
        il job_id del lavoro creato o false se non è stato possibile avviarlo
    """
    return False
