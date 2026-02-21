import pandas as pd
import os
import pickle
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report

DATA_PATH = "../data/spam_ham_india.csv"
df = pd.read_csv(DATA_PATH)
print("Dataset loaded successfully.")
print(df.head())

df.columns = df.columns.str.strip()

df["Label"] = df["Label"].map({"spam": 1, "ham": 0})

df = df.dropna()

X = df["Msg"]
y = df["Label"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=5000
)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


model = LogisticRegression()
model.fit(X_train_tfidf, y_train)


y_pred = model.predict(X_test_tfidf)

print("\nModel Evaluation:")
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))


MODEL_DIR = "./"

with open(os.path.join(MODEL_DIR, "spam_model.pkl"), "wb") as f:
    pickle.dump(model, f)

with open(os.path.join(MODEL_DIR, "vectorizer.pkl"), "wb") as f:
    pickle.dump(vectorizer, f)

print("\nModel and vectorizer saved successfully.")