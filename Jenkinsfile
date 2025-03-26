pipeline {
  agent any

  environment {
    DOCKER_COMPOSE_FILE = "docker-compose.yml"
  }

  stages {
    stage('Checkout') {
      steps {
        // Récupère le code depuis votre dépôt Git
        checkout scm
        bat 'git clone https://github.com/eliastalagrand/gestion-tickets-devops.git'
      }
    }

    stage('Build') {
      steps {
        echo 'Construction des images Docker...'
        // Exécuter la commande Docker Compose (v2) pour construire les images
        sh 'docker compose build --no-cache'
      }
    }

    stage('Test') {
      steps {
        echo 'Exécution des tests (optionnel)...'
        // Exemple : sh 'npm test'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Déploiement de l\'application...'
        // Lancement des conteneurs en arrière-plan
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
