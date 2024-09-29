from flask import Flask, jsonify
from flask_cors import CORS
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)  # Allow Cross-Origin requests for React frontend

# Google Sheets Setup
scope = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name(r"C:\Users\prady\Downloads\mlp-forecasting-project-1f2f855b3108.json", scope)
client = gspread.authorize(creds)

# Fetch the data from Google Sheets
def fetch_data():
    sheet_url = "https://docs.google.com/spreadsheets/d/1mLaEQiBuDV3A1on--e4O1HTrHu-Cp-n5QZOuUBy3Xcs/edit?usp=sharing"
    sheet = client.open_by_url(sheet_url).sheet1
    data = sheet.get_all_records()
    df = pd.DataFrame(data).tail(100)
    return df

# Prepare the data
def prepare_data(df, parameter):
    X = np.arange(len(df)).reshape(-1, 1)
    y = df[parameter].astype(float).values
    return X, y

# Perform forecasting using Random Forest
def forecast_values_rf(X, y, num_forecasts=50, window_size=10):
    X_train = np.array([y[i:i+window_size] for i in range(len(y)-window_size)])
    y_train = y[window_size:]

    scaler_X = StandardScaler()
    scaler_y = StandardScaler()

    X_train_scaled = scaler_X.fit_transform(X_train)
    y_train_scaled = scaler_y.fit_transform(y_train.reshape(-1, 1)).ravel()

    rf = RandomForestRegressor(n_estimators=100)
    rf.fit(X_train_scaled, y_train_scaled)

    forecasts = []
    last_window = y[-window_size:]
    for _ in range(num_forecasts):
        last_window_scaled = scaler_X.transform([last_window])
        next_forecast_scaled = rf.predict(last_window_scaled)
        next_forecast = scaler_y.inverse_transform(next_forecast_scaled.reshape(-1, 1)).ravel()[0]
        forecasts.append(next_forecast)
        last_window = np.append(last_window[1:], next_forecast)

    return np.array(forecasts)

# Define API endpoint to return forecast data
@app.route('/forecast', methods=['GET'])
def forecast():
    df = fetch_data()
    parameters = df.columns[1:]  # Assuming first column is timestamp
    forecast_results = {}

    # Perform forecasting for each parameter
    for parameter in parameters:
        X, y = prepare_data(df, parameter)
        forecasts = forecast_values_rf(X, y)
        forecast_results[parameter] = forecasts.tolist()

    return jsonify(forecast_results)

if __name__ == '__main__':
    app.run(debug=True)
