# Custom Face Recognition Pipeline

## 🔍 Project Overview
A simple face recognizer using your own dataset of celebrity images. The pipeline:
1. **Detect & Crop Faces**  
   - OpenCV Haar cascades (`haarcascade_frontalface_default.xml`, `haarcascade_eye.xml`)  
   - Keep only face regions with ≥2 eyes  
2. **Feature Extraction**  
   - Resize raw RGB face to 32×32  
   - Apply Discrete Wavelet Transform (`PyWavelets`, mode=`db1`, level=5) and resize detail image to 32×32  
   - Stack RGB pixels (32×32×3) + wavelet pixels (32×32) → 4,096-length feature vector  
3. **Model Training & Tuning**  
   - Assemble dataset **X** (187×4096) and labels **y** (five classes)  
   - Train/test split (`sklearn.model_selection.train_test_split`)  
   - Baseline SVM (RBF kernel, C=1) → ~76% accuracy  
   - Hyperparameter tuning with `GridSearchCV` over:  
     - **SVM** (`svc__C`, `svc__kernel`)  
     - **RandomForest** (`n_estimators`)  
     - **LogisticRegression** (`C`)  
4. **Evaluation & Artifacts**  
   - Classification report & confusion matrix (`sklearn.metrics`)  
   - Save best model → `saved_model.pkl`  
   - Save label map → `class_dictionary.json`

## ⚙️ Dependencies
- Python ≥3.7  
- OpenCV (`cv2`)  
- NumPy  
- PyWavelets  
- scikit-learn  
- matplotlib  
- joblib  

Install via:
```bash
pip install opencv-python numpy PyWavelets scikit-learn matplotlib joblib

