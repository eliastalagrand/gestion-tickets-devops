pipeline {
  agent any

  environment {
    // Vous pouvez définir ici des variables d'environnement si nécessaire
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
        // Reconstruire les images Docker sans cache (ajustez la commande si nécessaire)
        sh 'docker-compose build --no-cache'
      }
    }

    stage('Test') {
      steps {
        echo 'Exécution des tests (optionnel)...'
        // Ajoutez ici vos commandes de tests, par exemple : sh 'npm test'
      }
    }

    stage('Deploy') {
      steps {
        echo 'Déploiement de l\'application...'
        sh 'docker-compose up -d'
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
