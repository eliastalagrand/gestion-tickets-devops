pipeline {
  agent any

  environment {
    DOCKER_COMPOSE_FILE = 'docker-compose.yml'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        echo 'Construction des images Docker...'
        // Utilisez "docker compose" avec un espace pour Docker Compose v2
        sh 'docker compose build --no-cache'
      }
    }

    stage('Test') {
      steps {
        echo 'Exécution des tests (optionnel)...'
        // Par exemple, sh 'npm test'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Déploiement de l\'application...'
        sh 'docker compose up -d'
      }
    }
  }

  post {
    always {
      echo 'Pipeline terminé.'
    }
    failure {
      echo 'La pipeline a échoué.'
    }
  }
}
