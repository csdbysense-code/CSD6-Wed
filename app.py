from flask import Flask, render_template

app = Flask(__name__)

# 1. หน้าแรก (Home)
@app.route("/")
def index():
    # คำสั่งนี้จะไปเปิดไฟล์ templates/index.html 
    # และ index.html จะไปดึง layout.html มาประกอบร่างเองโดยอัตโนมัติ
    return render_template("index.html")

# 2. หน้าเกี่ยวกับเรา (About)
@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/success")
def success():
    return render_template("success.html")

@app.route("/advertise")
def advertise():
    return render_template("advertise.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/templates/login.html")
def login():
    return render_template("login.html")

if __name__ == "__main__":
    app.run(debug=True) # เปิดโหมด debug เพื่อให้เว็บอัปเดตอัตโนมัติเวลาเราแก้โค้ด