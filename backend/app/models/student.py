from app import db
from datetime import datetime

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    enrollment_number = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=True)
    department = db.Column(db.String(100), nullable=False)
    batch_year = db.Column(db.Integer, nullable=False)
    current_semester = db.Column(db.Integer, default=1)
    
    marks = db.relationship('Marks', backref='student', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'enrollment_number': self.enrollment_number,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'department': self.department,
            'batch_year': self.batch_year,
            'current_semester': self.current_semester,
            'user': self.user.to_dict() if self.user else None
        }
