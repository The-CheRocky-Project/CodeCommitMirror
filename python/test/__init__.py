# -*- coding: utf-8 -*-
"""
Codice eseguito prima dei test per configurare
l'ambiente con delle credenziali AWS false
"""
import os

os.environ.setdefault("AWS_ACCESS_KEY_ID", "foobar_key")
os.environ.setdefault("AWS_SECRET_ACCESS_KEY", "foobar_secret")
os.environ.setdefault("AWS_DEFAULT_REGION", "us-east-2")
