
# Assignment 6: Jenkins Pipeline with Automated Testing

## Aim
To integrate automated testing into a Jenkins pipeline so that the Student Task Manager application is built and tested automatically, with failed tests causing the pipeline to fail.

## Objectives
- Configure a Jenkins Pipeline using a `Jenkinsfile`.
- Retrieve application source code from GitHub.
- Install application dependencies using npm.
- Automate the application build process.
- Execute automated tests in Jenkins.
- Verify successful and failed pipeline executions.

## Tools Used
- Jenkins
- Git and GitHub
- Node.js
- npm
- Visual Studio Code

## Procedure
1. Prepared the Student Task Manager application for automated testing.
2. Created a `test.js` file to validate required application files.
3. Configured the `package.json` scripts for starting, building, and testing the application.
4. Created a `Jenkinsfile` defining the pipeline stages.
5. Configured Jenkins to retrieve the project from GitHub.
6. Added pipeline stages for checkout, dependency installation, build, and automated testing.
7. Committed and pushed the pipeline configuration and test files to GitHub.
8. Executed the Jenkins pipeline and checked the console output.
9. Verified the successful build and test results.
10. Tested the pipeline's failure handling by temporarily removing a required file, then restored it and reran the pipeline.

## Commands Used

```bash
npm install
npm run build
npm test

git add .
git commit -m "Add Jenkins pipeline and automated tests"
git push origin main
```

## Pipeline Stages
1. **Checkout:** Retrieves the source code from the configured repository.
2. **Install Dependencies:** Executes `npm install`.
3. **Build:** Executes `npm run build`.
4. **Automated Testing:** Executes `npm test`.

## Expected Outcome
Successful execution of the Jenkins pipeline with automated build and test stages. The pipeline should report failure when a required file or test condition is invalid and succeed after the issue is corrected.

## Screenshots
Add screenshots demonstrating:
- Jenkins Pipeline job configuration.
- `Jenkinsfile` and automated test script.
- Pipeline stage execution.
- Successful pipeline build.
- Failed pipeline build during failure testing.
- Successful pipeline run after fixing the issue.

