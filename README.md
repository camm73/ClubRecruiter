# RecruitME
The following is the directory structure of RecruitMe:

## frontend/club-recruiter-ui
This is base directory for the RecruitMe React app.

### src
All of  the source code for the frontend is housed in this folder. It includes the boilerplate React files such as `index.jsx`and also includes `App.jsx` which is the top-level React component that handles all page routing using `react-router-dom`.

#### **api**
This folder contains all functions that are necessary for interacting with the Firebase backend.

#### **assets**
This folder contains images, icons, and other multimedia that is needed for the site.

#### **components**
This folder contains smaller, reusable components that are found on multiple pages of the website.

#### **hooks**
This folder contains and custom React hooks that are needed.

#### **pages**
Each of the React components in this folder represents a separate page that can be visited on the website.

#### **routers**
This folder contains routers for handling React Router sub-routing. For example, if a user tries to visit the `/event` route without providing an event ID, they should see a 404 page, however if they provide an event ID (i.e. `/event/ID`) then they should be routed to the EventOverview page.

#### **styles**
This folder contains CSS styling documents for various pages and React components.

### public
This contains public resources such as the website icon and `index.html` files.


## backend


## .github/workflows
This folder contains the CI configuration for our project. Each of the YAML files contained in this directory is used to configure a Github action that is run before a PR is merged into master. This allows us to perform linting and testing across the backend and frontend.
