def calculate_grade_points(total_marks):
    if total_marks >= 90:
        return 'O', 10.0
    elif total_marks >= 80:
        return 'A+', 9.0
    elif total_marks >= 70:
        return 'A', 8.0
    elif total_marks >= 60:
        return 'B+', 7.0
    elif total_marks >= 50:
        return 'B', 6.0
    elif total_marks >= 40:
        return 'C', 5.0
    else:
        return 'F', 0.0

def calculate_cgpa(marks_list):
    total_credit_points = 0
    total_credits = 0
    
    for mark in marks_list:
        credits = mark.subject.credits
        total_credits += credits
        total_credit_points += (mark.grade_points * credits)
        
    if total_credits == 0:
        return 0.0
        
    return round(total_credit_points / total_credits, 2)
