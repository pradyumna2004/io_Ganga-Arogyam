import gspread
from oauth2client.service_account import ServiceAccountCredentials
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import StandardScaler

# Define the scope and credentials
scope = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]
creds = ServiceAccountCredentials.from_json_keyfile_name(r"C:\Users\prady\Downloads\mlp-forecasting-project-1f2f855b3108.json", scope)

client = gspread.authorize(creds)

# Open the Google Sheet by URL
sheet_url = "https://docs.google.com/spreadsheets/d/1mLaEQiBuDV3A1on--e4O1HTrHu-Cp-n5QZOuUBy3Xcs/edit?usp=sharing"
sheet = client.open_by_url(sheet_url).sheet1

# Get all records from the sheet
data = sheet.get_all_records()

# Convert the data to a pandas DataFrame
df = pd.DataFrame(data)

# Take the last 100 data points
df = df.tail(100)

# Define the parameters to forecast
parameters = df.columns[1:]  # Assumes the first column is YY-MM-DD//H-M-S

def prepare_data(df, parameter):
    X = np.arange(len(df)).reshape(-1, 1)  # Time index as feature
    y = df[parameter].astype(float).values  # Convert to float explicitly
    return X, y

def forecast_values_mlp(X, y, num_forecasts, window_size):
    # Create the features for the MLP using a sliding window approach
    X_train = np.array([y[i:i+window_size] for i in range(len(y)-window_size)])
    y_train = y[window_size:]
    
    # Standardize the data
    scaler_X = StandardScaler()
    scaler_y = StandardScaler()
    
    X_train_scaled = scaler_X.fit_transform(X_train)
    y_train_scaled = scaler_y.fit_transform(y_train.reshape(-1, 1)).ravel()
    
    # Train the MLP model
    mlp = MLPRegressor(hidden_layer_sizes=(100,), activation='relu', solver='adam', max_iter=1000)
    mlp.fit(X_train_scaled, y_train_scaled)
    
    # Generate forecasts
    forecasts = []
    last_window = y[-window_size:]
    for _ in range(num_forecasts):
        last_window_scaled = scaler_X.transform([last_window])
        next_forecast_scaled = mlp.predict(last_window_scaled)
        next_forecast = scaler_y.inverse_transform(next_forecast_scaled.reshape(-1, 1)).ravel()[0]
        forecasts.append(next_forecast)
        last_window = np.append(last_window[1:], next_forecast)
    
    return np.array(forecasts)

num_forecasts = 50
window_size = 10  # Number of previous values to use for forecasting

# Open the new Google Sheet to store forecasted data
new_sheet_url = "https://docs.google.com/spreadsheets/d/1FxNXwMxwcjGFpoAmKOdc3qzlOgao5w5nJsU03A7d3MQ/edit?usp=sharing"
new_sheet = client.open_by_url(new_sheet_url).sheet1

# Prepare data for the new sheet
new_data = {'Time Index': list(range(len(df), len(df) + num_forecasts))}

plt.figure(figsize=(15, 5 * len(parameters)))  # Adjusted size for clarity

for i, parameter in enumerate(parameters, 1):
    # Prepare the data
    X, y = prepare_data(df, parameter)
    
    # Forecast using MLP
    forecast = forecast_values_mlp(X, y, num_forecasts, window_size)
    
    # Add forecasted data to the new data dictionary
    new_data[f'Forecasted {parameter}'] = forecast
    
    # Plot original values
    plt.subplot(len(parameters), 2, 2 * i - 1)
    plt.plot(range(len(y)), y, label=f'Original {parameter}', color='blue')
    plt.xlabel('Time Index')
    plt.legend()
    
    # Plot forecasted values
    plt.subplot(len(parameters), 2, 2 * i)
    plt.plot(range(len(y), len(y) + num_forecasts), forecast, label=f'Forecasted {parameter}', linestyle='--', color='red')
    plt.xlabel('Time Index')
    plt.legend()

plt.tight_layout()
plt.show()

# Convert new_data dictionary to DataFrame
new_df = pd.DataFrame(new_data)

# Update the new Google Sheet with the forecasted data
new_sheet.update([new_df.columns.values.tolist()] + new_df.values.tolist())