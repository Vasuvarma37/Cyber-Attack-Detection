# Explainable AI-Based DDoS Attack Detection Using Machine Learning and XGBoost

## Abstract

Distributed Denial of Service (DDoS) attacks are among the most common and damaging cyber threats affecting modern networks. Traditional signature-based detection systems often struggle to identify new and evolving attack patterns. This project presents a machine learning-based DDoS detection system using the CICIDS2017 dataset. Multiple machine learning models, including Logistic Regression, Random Forest, and XGBoost, were evaluated for attack detection. XGBoost was selected as the final model due to its high predictive performance and compatibility with Explainable AI techniques. The system achieved near-perfect classification performance while identifying the most influential network traffic features responsible for attack detection.

## Keywords

Cyber Security, DDoS Detection, Machine Learning, XGBoost, Network Intrusion Detection, Explainable AI, CICIDS2017

---

# 1. Introduction

The rapid growth of internet-connected systems has increased the frequency and complexity of cyber attacks. Among these threats, Distributed Denial of Service (DDoS) attacks attempt to overwhelm network resources, causing service disruption and financial loss.

Machine learning techniques have emerged as effective tools for detecting malicious traffic patterns. By learning from historical network traffic data, machine learning models can distinguish between normal and attack behavior with high accuracy.

This project develops a DDoS attack detection framework using the CICIDS2017 dataset and evaluates multiple machine learning algorithms to identify the most effective detection model.

---

# 2. Objectives

The main objectives of this project are:

1. Analyze and preprocess the CICIDS2017 DDoS dataset.
2. Remove invalid and inconsistent network traffic records.
3. Train multiple machine learning models.
4. Compare model performance.
5. Select the best-performing model.
6. Perform feature importance analysis.
7. Prepare the system for Explainable AI analysis.

---

# 3. Dataset Description

The project uses the CICIDS2017 dataset, a widely used benchmark dataset for intrusion detection research.

### Dataset Characteristics

* Dataset: CICIDS2017
* Attack Type: DDoS
* Features: 78 network traffic features
* Target Variable: Label
* Classes:

  * BENIGN
  * DDoS

### Initial Dataset

Rows: 223,082

Class Distribution:

* DDoS: 128,014
* BENIGN: 95,068

---

# 4. Data Preprocessing

Several preprocessing operations were performed before training the machine learning models.

### Steps Performed

1. Removal of duplicate records.
2. Handling of missing values.
3. Detection and removal of infinite values.
4. Standardization of column names.
5. Label encoding:

   * BENIGN → 0
   * DDoS → 1

### Handling Infinite Values

The features:

* Flow Bytes/s
* Flow Packets/s

contained infinite values caused by division-by-zero operations when network flow duration was zero.

These values were replaced with NaN and removed from the dataset before training.

---

# 5. Exploratory Data Analysis

Exploratory analysis was conducted to understand the characteristics of the dataset.

The analysis included:

* Dataset shape analysis
* Class distribution visualization
* Correlation analysis
* Feature inspection
* Missing value analysis

Results indicated that packet-size-related features and traffic-flow statistics have strong relationships with attack behavior.

---

# 6. Machine Learning Models

Three machine learning algorithms were trained and evaluated.

## 6.1 Logistic Regression

Logistic Regression was used as a baseline classification model.

Performance:

* Accuracy: 99.88%

Confusion Matrix:

TN = 8772

FP = 20

FN = 8

TP = 15129

---

## 6.2 Random Forest

Random Forest was trained as an ensemble learning approach.

Performance:

* Accuracy: 99.996%

Confusion Matrix:

TN = 8792

FP = 0

FN = 1

TP = 15136

---

## 6.3 XGBoost

XGBoost was trained as the final boosting-based classifier.

Performance:

* Accuracy: 99.99%+

Confusion Matrix:

TN = 3963

FP = 0

FN = 0

TP = 1800

The model demonstrated excellent classification capability and was selected for further analysis.

---

# 7. Model Comparison

| Model               | Accuracy |
| ------------------- | -------- |
| Logistic Regression | 99.88%   |
| Random Forest       | 99.996%  |
| XGBoost             | 99.99%+  |

Random Forest achieved the highest accuracy, while XGBoost provided excellent performance along with strong feature interpretability capabilities.

Therefore, XGBoost was selected as the final model for Explainable AI analysis.

---

# 8. Feature Importance Analysis

Feature importance was extracted from the trained XGBoost model.

Top Features:

| Rank | Feature                     | Importance |
| ---- | --------------------------- | ---------- |
| 1    | Bwd Packet Length Std       | 0.4149     |
| 2    | Average Packet Size         | 0.1897     |
| 3    | Fwd Packet Length Max       | 0.1672     |
| 4    | act_data_pkt_fwd            | 0.1316     |
| 5    | Total Length of Fwd Packets | 0.0762     |
| 6    | Fwd Packet Length Mean      | 0.0068     |
| 7    | Total Backward Packets      | 0.0038     |
| 8    | Init_Win_bytes_forward      | 0.0014     |
| 9    | Destination Port            | 0.0011     |
| 10   | Flow Bytes/s                | 0.0006     |

The results show that packet-size statistics and traffic-flow characteristics are the most influential indicators of DDoS activity.

---

# 9. Conclusion

This project successfully developed a machine learning-based DDoS attack detection system using the CICIDS2017 dataset.

Three machine learning models were evaluated. Logistic Regression provided strong baseline performance, while Random Forest and XGBoost achieved near-perfect detection accuracy.

XGBoost was selected as the final model because it combines high predictive performance with interpretability capabilities required for Explainable AI applications.

Future work includes integrating SHAP-based Explainable AI techniques and extending the system to detect multiple attack categories within the CICIDS2017 dataset.

---

# Author

Mallepalli Vasu

B.Tech AIML

Keshav Memorial College of Engineering
