import pandas as pd
import json
from ydata_profiling import ProfileReport
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from datetime import datetime
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

app = Flask(__name__)
CORS(app, resources={r"/run_eda": {"origins": "*"}})


def create_eda(columns, row):
    df = pd.DataFrame(row, columns=columns)
    try:
        profile = ProfileReport(df,
                                title="Exploratory Data Analysis",
                                explorative=True,
                                correlations={
                                    "auto": {"calculate": True},
                                    "pearson": {"calculate": True},
                                    "spearman": {"calculate": True},
                                    "kendall": {"calculate": True},
                                    "phi_k": {"calculate": True},
                                    "cramers": {"calculate": True},
                                })
        html_content = profile.to_html()


        return html_content
    except Exception as e:
        return f'Error creating EDA report: {e}'

@app.route('/')
def home():
    return 'Welcome to the test page!'


@app.route('/run_eda', methods=['POST'])
def run_eda():
    try:
        data = request.get_json()
        columns = data.get('columns', [])
        rows = data.get('rows', [])

        result = create_eda(columns, rows)

        
        return result
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    
