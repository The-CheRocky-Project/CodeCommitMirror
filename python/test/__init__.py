# -*- coding: utf-8 -*-
"""
Codice eseguito prima dei test per configurare l'ambiente di test
"""
import sys
import os

# Setto delle credenziali AWS false
os.environ.setdefault("AWS_ACCESS_KEY_ID", "foobar_key")
os.environ.setdefault("AWS_SECRET_ACCESS_KEY", "foobar_secret")
os.environ.setdefault("AWS_DEFAULT_REGION", "us-east-2")

# Setto la cartella src come punto da cui risolvere le dipendenze per simulare l'ambiente di AWS
absolute_path = os.path.dirname(os.path.abspath(__file__))
sys.path.append(absolute_path + "/../src")
