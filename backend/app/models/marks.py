from app import db
from datetime import datetime

class Marks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subject.id'), nullable=False)
    semester = db.Column(db.Integer, nullable=False)
    internal_marks = db.Column(db.Float, nullable=True, default=0)
    external_marks = db.Column(db.Float, nullable=True, default=0)
    total_marks = db.Column(db.Float, nullable=False)
    grade = db.Column(db.String(2), nullable=False)
    grade_points = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Ensure a student can't have duplicate marks for the same subject
    __table_args__ = (db.UniqueConstraint('student_id', 'subject_id', name='_student_subject_uc'),)

    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'subject_id': self.subject_id,
            'semester': self.semester,
            'internal_marks': self.internal_marks,
            'external_marks': self.external_marks,
            'total_marks': self.total_marks,
            'grade': self.grade,
            'grade_points': self.grade_points,
            'created_at': self.created_at.isoformat(),
            'subject': self.subject.to_dict() if self.subject else None
        }
