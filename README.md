
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
    - These files must be saved in Sisense’s file system storage within a specified directory.
- **Custom Code Notebooks**: Import into Sisense beforehand.

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/AutoML-Fusion.git
   cd AutoML-Fusion
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **AWS Credentials Setup**:
    - Create `aws_access_key` and `aws_secret_access_key` files, and save them in the Sisense file system directory.
    - During the custom code notebook setup in Sisense, provide the path to the AWS key directory.

4. **Custom Code Notebook Setup**:
    - Ensure the custom code notebooks are uploaded to the Sisense environment and provide the AWS key directory path.

5. **Run the Application**:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`.

6. **Access the Web App**:
   - Open a browser and navigate to `http://localhost:3000/templates/login.html`.
   - Enter your **Sisense URL**, **username**, and **password** to generate the API token.

## 4. Usage

### How to Use

- **Login**: Navigate to `http://localhost:3000/templates/login.html`, enter your Sisense credentials, and generate the API token.
- **Dataset Selection**: Select the dataset you want to train the machine learning model on.
- **Target Variable Selection**: Choose the target variable and select either a regression or classification problem.
- **Model Training**: Train your model using **Auto-Sklearn** or **AWS SageMaker Autopilot**.
- **Predictions**: Make predictions by entering new data into Sisense dashboards. 

### Example

- **Input**: Dataset with customer attributes, where the target variable is whether the customer churned (e.g., `Exited`).
- **Output**: The model returns either "Churn" (1) or "No Churn" (0).

## 5. APIs and Dependencies

### Key APIs:

- **Sisense APIs**:
    - Authentication API, Data Model API, Dataset API, Custom Code Table API, Dashboard API, Widget API, Blox Action API, Custom Code Transformation API, Elasticube API.
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
   git clone https://github.com/your-username/AutoML-Fusion.git
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
