def getRepo(){
            String name = "${env.JOB_NAME}";
            String[] value = name.split('/');
            return value[0];
}

def gitCredentials = "JenkinsGithub"


pipeline {
    parameters {
          booleanParam(defaultValue: true, description: 'Execute pipeline?', name: 'shouldBuild')
       }

  agent any
  stages {
        stage("Check if should build"){
        steps{
        script {
            result = sh (script: "git log -1 | grep '.*Jenkins version bump.*'", returnStatus: true)
            if (result == 0) {
                echo ("'Version bump' spotted in git commit. Aborting.")
                env.shouldBuild = "false"
            }
        }
}
        }
        stage('Build, bump version, and Publish NPM Package') {
            when {
                branch 'master'
                expression {
                    return env.shouldBuild != "false"
                }


            }
          steps {

              withCredentials([string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')]) {
                              sshagent(credentials: ["${gitCredentials}"]){

                                sh '''
                                      PACKAGE_VERSION=$(npm version patch -m "Jenkins version bump" | awk '{print substr($1,2); }')
                                      npm install
                                      npm run-script build
                                      git add .
                                      git commit -m "Jenkins version bump" | true
                                      git push origin master
                                      git push origin --tags
                                      echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc
                                      npm publish
                                      wait-for-package-replication -v $PACKAGE_VERSION -p ''' + getRepo() + '''

                                '''
                                }
              }
          }
        }
        stage('Update Servicebot repo'){
          when {
              branch 'master'
              expression {
                  return env.shouldBuild != "false"
              }
          }
          steps{
            dir('servicebot'){
                  git(url: "git@github.com:service-bot/servicebot.git", branch: 'tiers', credentialsId: "${gitCredentials}")

                sshagent(credentials: ["${gitCredentials}"]){
                 sh '''
                    npm install ''' + getRepo() + '''@latest
                    git add .
                    git commit -m "Jenkins updating version of" ``` + getRepo() + ```
                    git push origin tiers
                    '''
              }
            }
        }
    }


        stage('Upload To S3') {
          when {
                branch 'master'
                expression {
                    return env.shouldBuild != "false"
                }

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
