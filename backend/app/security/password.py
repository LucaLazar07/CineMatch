import bcrypt

def hash_password(password: str) -> str:
    salting = bcrypt.gensalt()
    password_bytes = password.encode("utf-8")

    hashed_password = bcrypt.hashpw(password_bytes, salting)
    
    return hashed_password.decode("utf-8")

def check_password(password: str, hashed_password: str) -> bool:    
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))
