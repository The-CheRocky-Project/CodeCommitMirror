""" elaboration lambda layer

Il layer elaboration contiene tutte le funzioni ausiliarie
utilizzate per l'elaborazione dei dati

Contenuto:
    #TODO sistemare contenuto
    * create_thumbnail - crea thumbnail a partire da video
"""

# Import boto3 sdk

import boto3

s3R = boto3.resource('s3')

def find_trasholder(frame_list, frame, frame_number, how_much, n_frames):
    """Funzione che si occupa di individuare i candidati adatti per
        l'inserimento all'interno del resume file. Si basa su accuratezza
        media di un numero di secondi dettato dalla variabile how_much
        "
        Args:
            frame_list: lista con tutti i frame
            frame: dati del frame vero e proprio in esame
            frame_number: numero del frame in esame
            how_much: quanto guardare a destra e sinistra del frame dato
            n_frames: numero totale di frames

        Returns:
            True se il frame va tenuto in considerazione, False altrimenti
        """

    limit = 0.70
    amount = 0
    total = (how_much * 2) - 1
    for i in range(1, how_much):
        if (frame_number - i) >= 0 and (frame_number + i) < n_frames:
            if (frame_list[frame_number - i]['label'] == frame['label'] and
                frame_list[frame_number + i]['label'] == frame['label']):
                amount = frame_list[frame_number - i]['accuracy'] + frame_list[frame_number + i]['accuracy'] + amount
        if (frame_number - i) < 0 and (frame_number + i) < n_frames:
            if frame_list[frame_number + i]['label'] == frame['label']:
                amount = frame_list[frame_number + i]['accuracy'] + amount
        if (frame_number - i) >= 0 and (frame_number + i) >= n_frames:
            if frame_list[frame_number - i]['label'] == frame['label']:
                amount = frame_list[frame_number - i]['accuracy'] + amount
    if (amount / total) >= limit:
        return True
    else:
        return False

def compress_time(resume):
    """Funzione che si occupa di comprimere il tempo nel caso vengano individuati
        più frame in sequenza. Finchè essi appunto appartengono ad una sequenza,
        viene utilizzato l'utlimo frame della serie al quale viene aggiunto un campo start
        che indica l'inizio della sequenza in millisecondi
        "
        Args:
            resume: array contenente i dati elaborati dalla funzione findTrashOlder

        Returns:
            Array modificato contenente i dati ridotti e tempo compresso
        """

    compressed = []
    counter = 0

    for i in range(len(resume) - 1):
        splitted = resume[i]['frame_key'].split('.')
        number = int(splitted[len(splitted) - 2])
        splitted = resume[i + 1]['frame_key'].split('.')
        next_number = int(splitted[len(splitted) - 2])
        if number == (next_number - 1):
            counter += 1
        else:
            resume[i]['start'] = resume[i]['tfs'] - (500 * counter)
            compressed.append(resume[i])
            counter = 0

    return compressed

def remove(to_remove, all_frames):
    """Funzione che si occupa di rimuovere un elemento dall'array
    "
    Args:
        to_remove: indice dell'elemento da rimuovere
        all_frames:array degli elementi

    Returns:
        Array con elemento rimosso
    """

    if type(to_remove) is int:
        all_frames.pop(to_remove)
    else:
        for i in range(len(to_remove)):
            all_frames.pop(to_remove[i])
    return all_frames

def check_time(frames):
    """Funzione che si occupa controllare se l'array di elementi
        rispetta il tempo massimo di 5 minuti
        "
        Args:
            frames: array di elementi

        Returns:
            True se il tempo è rispettato False altrimenti
        """
    limit = 300000

    counter = 0

    # controllo durata totale del resume file
    for i in range(len(frames)):
        counter = counter + (frames[i]['tfs'] - frames[i]['start'])

    if counter <= limit:
        return True
    else:
        return False

def prioritize(frames):
    """Funzione che si occupa di controllare quale elemento
        rimuovere in base alla priorità definita dalla logica
        della funzione
        "
        Args:
            frames: array di elementi

        Returns:
            Indice dell'elemento da rimuovere
        """

    to_remove = check_for_esult(frames)

    if to_remove == -1:
        to_remove = check_for_puniz(frames)
    if to_remove == -1:
        to_remove = check_for_rigore(frames)
    if to_remove == -1:
        to_remove = check_for_yellow(frames)
    if to_remove == -1:
        to_remove = check_for_red(frames)
    if to_remove == -1:
        to_remove = check_for_goal(frames)

    return to_remove

def remove_useless(all_frames):
    """Funzione che si occupa di rimuovere tutti gli elementi che
        fanno parte delle label considerate inutili per il riconoscimento,
        non considerate nella priorità
        "
        Args:
            all_frames: array di elementi

        Returns:
            Array di indici di elementi da rimuovere
        """

    to_remove = []
    for i in range(len(all_frames)):
        if all_frames[len(all_frames) - (1 + i)]['label'] == 0 or all_frames[len(all_frames) - (1 + i)]['label'] == 1:
            to_remove.append(len(all_frames) - (1 + i))
        if all_frames[len(all_frames) - (1 + i)]['label'] == 4 or all_frames[len(all_frames) - (1 + i)]['label'] == 5:
            to_remove.append(len(all_frames) - (1 + i))
        if all_frames[len(all_frames) - (1 + i)]['label'] == 9:
            to_remove.append(len(all_frames) - (1 + i))
    return to_remove

def check_for_esult(frames):
    """Funzione che si occupa controllare se ci sono elementi corrispondenti
        alla label 'esultanza'
        "
        Args:
            frames: array di elementi

        Returns:
            Indice dell'ultimo elemento corrispondente alla label 'esultanza'
            da rimuovere
        """

    find = False
    counter = len(frames) - 1
    while find == False and counter >= 0:
        if frames[counter]['label'] == 2:
            find = True
        else:
            counter = counter - 1
    return counter

def check_for_puniz(frames):
    """Funzione che si occupa controllare se ci sono elementi corrispondenti
        alla label 'punizione'
        "
        Args:
            frames: array di elementi

        Returns:
            Indice dell'ultimo elemento corrispondente alla label 'punizione'
            da rimuovere
        """

    find = False
    counter = len(frames) - 1
    while find == False and counter >= 0:
        if frames[counter]['label'] == 2:
            find = True
        else:
            counter = counter - 1
    return counter

def check_for_rigore(frames):
    """Funzione che si occupa controllare se ci sono elementi corrispondenti
        alla label 'rigore'
        "
        Args:
            frames: array di elementi

        Returns:
            Indice dell'ultimo elemento corrispondente alla label 'rigore'
            da rimuovere
        """

    find = False
    counter = len(frames) - 1
    while find == False and counter >= 0:
        if frames[counter]['label'] == 2:
            find = True
        else:
            counter = counter - 1
    return counter

def check_for_yellow(frames):
    """Funzione che si occupa controllare se ci sono elementi corrispondenti
        alla label 'yellowcard'
        "
        Args:
            frames: array di elementi

        Returns:
            Indice dell'ultimo elemento corrispondente alla label 'yellowcard'
            da rimuovere
        """

    find = False
    counter = len(frames) - 1
    while find == False and counter >= 0:
        if frames[counter]['label'] == 2:
            find = True
        else:
            counter = counter - 1
    return counter

def check_for_red(frames):
    """Funzione che si occupa controllare se ci sono elementi corrispondenti
        alla label 'redcard'
        "
        Args:
            frames: array di elementi

        Returns:
            Indice dell'ultimo elemento corrispondente alla label 'redcard'
            da rimuovere
        """

    find = False
    counter = len(frames) - 1
    while find == False and counter >= 0:
        if frames[counter]['label'] == 2:
            find = True
        else:
            counter = counter - 1
    return counter

def check_for_goal(frames):
    """Funzione che si occupa controllare se ci sono elementi corrispondenti
        alla label 'goal'
        "
        Args:
            frames: array di elementi

        Returns:
            Indice dell'ultimo elemento corrispondente alla label 'goal'
            da rimuovere
        """

    find = False
    counter = len(frames) - 1
    while find == False and counter >= 0:
        if frames[counter]['label'] == 2:
            find = True
        else:
            counter = counter - 1
    return counter


def prepare_for_serialize(frames):
    """Funzione che si occupa di trasformare il campo 'accuracy' del dizionario in stringa
        in modo da permettere la corretta serializzazione del makeResume.json
        "
        Args:
            frames: array di elementi

        Returns:
            Array con il campo 'accuracy' sotto forma di stringa invece di Decimal
        """

    for i in range(len(frames) - 1):
        str(frames[i]['accuracy'])
    return frames