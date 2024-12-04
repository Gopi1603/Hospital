from flask import Flask, request, jsonify
import numpy as np
import joblib

app = Flask(__name__)

# Load pre-trained model
model = joblib.load('diagnostic_model.pkl')

@app.route('/diagnose', methods=['POST'])
def diagnose():
    data = request.json
    symptoms = np.array([data['symptoms']])  # Expecting array like [1, 0, 1]

    # Make prediction using the loaded model
    prediction = model.predict(symptoms)[0]
    diagnoses = {0: 'Flu', 1: 'COVID-19', 2: 'Migraine'}

    # Return diagnosis
    return jsonify({'diagnosis': diagnoses[prediction]})

if __name__ == '__main__':
    app.run(port=5001)
