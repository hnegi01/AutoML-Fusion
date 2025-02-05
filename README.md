
# AutoML Fusion

## 1. Project Overview

**Project Name**: AutoML Fusion

**Description**:  
AutoML Fusion is a Node.js app that leverages Sisense APIs and AWS SageMaker Autopilot for automated machine learning (AutoML). The app allows users to select datasets from Sisense, train machine learning models via Auto-Sklearn or SageMaker Autopilot, and seamlessly deploy these models. The app also integrates dynamic Sisense dashboards for real-time predictions and insights.

**Purpose**:  
The primary goal of AutoML Fusion is to simplify the machine learning process by integrating Sisense's powerful integration capabilities with automated machine learning frameworks. Users can easily select datasets, train models without needing to write code, and view predictions directly in Sisense dashboards. This project helps bridge the gap between business intelligence and machine learning, enabling organizations to make data-driven decisions with minimal technical overhead.

## 2. Features

- **Dataset Selection via Sisense API**:
    - Users can browse and select datasets from Sisense Fusion's data models.
    - The app provides an intuitive interface for choosing relevant data for machine learning tasks without manual export or import.

- **Target Variable Selection**:
    - After selecting a dataset, users can specify the target variable (e.g., the column to predict), supporting both regression and classification tasks.

- **Automated Machine Learning (AutoML)**:
    - **Auto-Sklearn**: Train models locally, keeping data secure on-premises.
    - **AWS SageMaker Autopilot**: Utilize AWS for scalable model training and deployment.

- **Seamless Model Deployment**:
    - The app automates the deployment of models, whether trained locally or in the cloud, ensuring efficient model integration into workflows.

- **Dynamic Dashboard Creation**:
    - Dynamically generates Sisense dashboards and Blox widgets for real-time predictions based on the dataset’s features.

- **Real-Time Predictions**:
    - Users can make real-time predictions through Blox widgets and deploy models via Auto-Sklearn or SageMaker endpoints.

- **Version Control for Models**:
    - The app maintains version control for models, storing details like metrics, scores, and paths, allowing users to track model versions.

- **Batch and Online Prediction**:
    - Users can perform both batch predictions for large datasets and online predictions for individual records.

## 3. Installation

### Prerequisites

- **Node.js** (version 14.x or higher)  
- **npm** (Node Package Manager)  
- **Sisense URL, Username, and Password** for generating API tokens.  
- **AWS Credentials**:  
    - `aws_access_key`: Contains your AWS Access Key ID.  
    - `aws_secret_access_key`: Contains your AWS Secret Access Key.  
    - These files must be saved in Sisense’s file system storage within a specified directory:
      1. Go to **File Management** in Sisense.  
      2. Navigate to `notebooks/custom_code_notebooks/notebooks`.  
      3. Click **New Folder** and name it `aws`.  
      4. Inside the `aws` folder:
         - Click **New File**, name it `aws_access_key`, and paste your **AWS Access Key ID** in the editor.  
         - Click **New File**, name it `aws_secret_access_key`, and paste your **AWS Secret Access Key** in the editor.  

- **Custom Code Notebooks**:  
    To upload the required custom code notebooks:  
    1. Go to **File Management** in Sisense.  
    2. Navigate to `notebooks/custom_code_notebooks/notebooks`.  
    3. Upload each individual folder from [here](https://github.com/hnegi01/AutoML-Fusion/tree/main/customcode_notebooks).  
    4. For example, to upload `newNotebook17` from [here](https://github.com/hnegi01/AutoML-Fusion/tree/main/customcode_notebooks/training/sagemaker):  
       - Inside **File Management**, navigate to the `notebooks/custom_code_notebooks/notebooks` path.  
       - Click **New Folder**, name it `newNotebook17`, and upload all files from the `newNotebook17` folder into this newly created folder.  

    Repeat the above steps for each required notebook folder from the repository, ensuring the structure matches exactly.

### AutoML-Fusion Deployment Guide

### **1. Create a Linux VM**
Ensure you have a Linux server ready.

### **2. Install Node.js and npm**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

### **3. Install Python and Flask**
```bash
sudo apt install python3 python3-flask
```

### **4. Clone the Repository**
```bash
git clone https://github.com/hnegi01/AutoML-Fusion.git
cd AutoML-Fusion
```

### **5. Run Flask App**
```bash
cd flask_backend/
# Install Python Virtual Environment
sudo apt install python3.12-venv

# Create virtual environment
python3 -m venv automl
cd automl/
source automl/bin/activate
cd ..

# Install Dependencies
pip install -r requirements.txt

# Run Flask App
nohup python main.py > flask.log 2>&1 &
```

### **6. Update `config.json` file**
- Navigate to `/frontend/web_app`
- Update the `FLASK_API_URL` with your public IP or domain where the flask app will be hosted.
- Update the `SERVER_IP` with your public IP or domain where the web app will be hosted.

### **7. Install Dependencies for Node.js App**
```bash
cd frontend/
npm install
```

### **8. Start the Web App**
```bash
nohup node server.js > server.log 2>&1 &
```

### **9. AWS Credentials Setup**
- Log in to Sisense App or server.
- Create `aws_access_key` and `aws_secret_access_key` files and save them in the Sisense file system directory.
- During the custom code notebook setup in Sisense, provide the path to the AWS key directory.

### **10. Custom Code Notebook Setup**
- Ensure the custom code notebooks are uploaded to the Sisense environment and provide the AWS key directory path.

### **11. Run the Application**
```bash
npm start
```
The app will run on `http://<your_ip_or_domain>:3000`.

### **12. Access the Web App**
- Open a browser and navigate to:
  ```
  http://<your_ip_or_domain>:3000/templates/login.html
  ```

## 4. Usage

### How to Use

- **Login**:
    -  Navigate to `http://<your_ip_or_domain>:3000/templates/login.html`, enter your Sisense credentials, and hit Login.
    -  After login, the app automatically redirects you to `http://<your_ip_or_domain>:3000/templates/addData.html` and generates the API token in the background, saving it internally.
- **Dataset Selection**:
   - On the **Add Data** page, select the radio button for **Add Data**.
   - The app makes a GET request to Sisense using the generated API token and fetches available data models for selection.
- **Target Variable Selection**:
   - After selecting a dataset, choose the target variable (the column you want to predict), and specify whether the problem is a regression or classification task.

- **Model Training**:
   - Choose whether to train your model using **Auto-Sklearn** (for local training) or **AWS SageMaker Autopilot** (for cloud-based training).

- **Predictions**:
   - Once the model is trained and deployed, you can use the Sisense dashboard for batch or real-time predictions by entering new data.

### Example

![Screenshot 2024-10-14 at 6 03 55 PM](https://github.com/user-attachments/assets/63e21508-469f-4123-bf2e-d18b4bc1b7ce)

![Screenshot 2024-10-14 at 6 03 28 PM](https://github.com/user-attachments/assets/edf1de89-c295-4077-865b-30ab3ae2a69b)

![Screenshot 2024-10-14 at 6 05 54 PM](https://github.com/user-attachments/assets/30d50fa1-f1a3-4094-a1be-1fee6a127a7b)

![Screenshot 2024-10-14 at 6 06 04 PM](https://github.com/user-attachments/assets/8b41f7c8-2010-4755-bf16-1b95a2bddf86)

![Screenshot 2024-10-14 at 6 54 46 PM](https://github.com/user-attachments/assets/fc6ba65b-211a-48aa-9247-5ba44336ef1e)

![Screenshot 2024-10-14 at 6 06 21 PM](https://github.com/user-attachments/assets/fc02a02a-7a0f-4674-a74e-69823f67edfd)

- **Input**: Dataset with customer attributes, where the target variable is whether the customer churned (e.g., `Exited`).
- **Output**: The model returns either "Churned" or "Retained" .
  
![Screenshot 2024-10-14 at 6 07 58 PM](https://github.com/user-attachments/assets/41ea7af9-c4c1-42ce-801c-426e03527f96)


## 5. APIs and Dependencies

### Key APIs:

- **Sisense APIs**:
    - Authentication API: Generates tokens using user-provided credentials (URL, username, password).
    - Data Model API (/api/v2/datamodels/schema): Retrieves available data models from Sisense.
    - Dataset API (/api/v2/datamodels/{dataModel}/schema/datasets): Fetches datasets within the selected data model.
    - Elasticube API (/api/v2/ecm/): For adding Custom Code Table to Elasticubes/DataModel that run custom code (e.g., Jupyter notebooks) for data processing and model training.
    - Elasticube API (/api/v2/ecm/): Builds and manages Elasticubes/DataModel based on the selected DataModels.
    - Dashboard API: Manages dashboard creation.
    - Widget API: Dynamically generates blox widgets for user input and prediction results in real-time.
    - Blox Action API: Handles triggers for specific actions within Sisense blox widget.
    - JAQL API: Blox action calls the jaql api that takes input feature values and sends them to a custom code transformation notebook. In the notebook:
      - For Auto-Sklearn, it loads the pre-trained model to make a prediction.
      - For AWS SageMaker, it calls the SageMaker endpoint to make a prediction.
      - The resulting prediction is sent back as a response to the API.
      
- **AWS SageMaker APIs**:
    - S3 API and Autopilot API (`create_auto_ml_job_v2`).
- **Flask API**:
    - Communicates with the locally hosted Flask app via the `/run_eda` endpoint.

### JavaScript/Frontend Dependencies:

- **fetch**: Used for making HTTP requests to Sisense APIs.
- **auth.js**: Handles Sisense authentication and API token generation.
- **iframe**: Embeds dynamic Sisense dashboards for real-time predictions.

### Jupyter Notebook (Custom Code Table):

- **boto3**: AWS SDK for S3 and SageMaker.
- **pandas**: Data manipulation.
- **yaml**: For handling YAML configuration files.
- **sagemaker**: SageMaker API for job management.
- **tarfile**: Handling compressed files.
- **time**: For managing operations.

## 6. Configuration

No special configuration is required in the app. AWS credentials are stored externally within Sisense’s file system, not within the app itself.

- **Environment Variables**: None needed.
- **Where to Configure**: AWS credentials are stored in Sisense file storage, and the path is provided during custom code setup.

## 7. Running the App

### How to Start:

After installing dependencies, run the following command:
```bash
npm start
```

The server starts on port 3000 (or the specified port).

### Accessing the App:

Navigate to:
```bash
http://localhost:3000/templates/login.html
```

From there, you can log in with your Sisense credentials.

## 8. Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Clone your forked repository:
   ```bash
   git clone https://github.com/hnegi01/AutoML-Fusion.git
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes, then commit:
   ```bash
   git commit -m "Add new feature"
   ```
5. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Submit a pull request.

## 9. License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 10. Contact Information

For any questions or assistance, please feel free to reach out:

- GitHub: https://github.com/hnegi01
- Email: himanshu.negi.08@gmail.com
