pipeline {
  agent any
  stages {
        stage('NPM Install') {
          steps {
            sh 'npm install'
          }
        }
        stage('Build Bundle') {
          steps {
            sh 'npm run-script build'
          }
        }

        stage('Upload To S3') {
          when {
              branch 'master'
          }
          steps {
            withAWS(credentials: 'aws', region: 'us-east-1') {
              s3Upload(bucket: 'servicebot.io', acl: 'PublicRead', workingDir: 'public/build/', path:'js/', includePathPattern: '**/*')
              cfInvalidate(distribution: 'E9S44VPPPCDMC', paths: ['/*'])
            }
          }
        }

  }
}
