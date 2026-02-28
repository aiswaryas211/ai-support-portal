from sqlalchemy.orm import declarative_base

Base = declarative_base()
from app.tickets.model import Ticket, TicketMessage, TicketAttachment
