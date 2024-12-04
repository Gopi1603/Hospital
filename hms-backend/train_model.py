import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
from sklearn.metrics import classification_report
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GridSearchCV
from imblearn.over_sampling import SMOTE

# Sample data: Symptoms (fever, cough, headache) and diagnoses (0: Flu, 1: COVID, 2: Migraine)
# Expanded dataset (20 samples)
X = np.array([
    [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1],
    [0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 0],
    [1, 0, 1], [0, 1, 1], [1, 1, 0], [1, 1, 1],
    [1, 0, 1], [1, 0, 0], [0, 1, 0], [1, 1, 1],
    [0, 0, 1], [0, 0, 0], [1, 0, 1], [1, 1, 0]
])
y = np.array([0, 0, 1, 1, 2, 2, 0, 2, 0, 1, 1, 1, 0, 0, 2, 1, 2, 2, 0, 1])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Test model
predictions = model.predict(X_test)
print("Model Accuracy:", accuracy_score(y_test, predictions))

# Save model
joblib.dump(model, 'diagnostic_model.pkl')



smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)



model = LogisticRegression()
model.fit(X_train, y_train)


predictions = model.predict(X_test)
print(classification_report(y_test, predictions))

# Hyperparameter grid
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, None],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(RandomForestClassifier(random_state=42), param_grid, cv=5)
grid_search.fit(X_train, y_train)

# Get best model
best_model = grid_search.best_estimator_
