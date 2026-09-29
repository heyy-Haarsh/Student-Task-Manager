pipeline {

    agent any

    tools {
        nodejs 'NodeJS'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }

    post {

        success {
            echo 'CI Pipeline SUCCESS: Build and tests passed.'
        }

        failure {
            echo 'CI Pipeline FAILED: Build or tests failed.'
        }

        always {
            echo 'Jenkins Pipeline execution completed.'
        }
    }
}