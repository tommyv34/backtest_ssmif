import psycopg2

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="backtester_ssmif",
        user="postgres",
        password="MSE4290!"
    )