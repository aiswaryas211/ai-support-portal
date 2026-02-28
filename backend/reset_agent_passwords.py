from app.database.session import SessionLocal
from app.users.model import User
from app.core.security import hash_password

db = SessionLocal()

agents = db.query(User).filter(User.role == "agent").all()

for agent in agents:
    if agent.name == "Agent1":
        continue

    new_password = f"agent{agent.id:03}"
    agent.hashed_password = hash_password(new_password)
    print(agent.name, "→", new_password)

db.commit()
print("Passwords reset (Agent1 unchanged)")