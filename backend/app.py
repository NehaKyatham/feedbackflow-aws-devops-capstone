from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pymysql
import re

app = Flask(__name__)
CORS(app)

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_NAME = os.getenv("DB_NAME", "petcare")

EMAIL_REGEX = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

def get_conn():
    return pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASS,
        database=DB_NAME,
        connect_timeout=5,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

@app.route("/health")
def health():
    return jsonify({"status":"ok"}), 200

@app.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    if not email or not re.match(EMAIL_REGEX, email):
        return jsonify({"error":"Valid email is required"}), 400

    conn = get_conn()
    with conn.cursor() as cur:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)
        try:
            cur.execute("INSERT INTO subscribers (email) VALUES (%s)", (email,))
        except pymysql.err.IntegrityError:
            return jsonify({"result":"already_subscribed","email":email}), 200

    conn.close()
    return jsonify({"result":"subscribed","email":email}), 201
EOF


# Pull DB secrets from SSM Parameter Store
DB_HOST=$(aws ssm get-parameter --name "/petcareflow/prod/db_host" --query "Parameter.Value" --output text --region us-east-1)
DB_USER=$(aws ssm get-parameter --name "/petcareflow/prod/db_user" --query "Parameter.Value" --output text --region us-east-1)
DB_PASS=$(aws ssm get-parameter --name "/petcareflow/prod/db_password" --with-decryption --query "Parameter.Value" --output text --region us-east-1)
