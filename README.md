# Project Description

Back-end API for event management. The API is developed in (Express, Nodejs and MongoDB). <br>
The API have different endpoints:

- User login/registration
- User can view and book an event,
- User can view avaliable foods.


<strong> The User Registration and Authentication API</strong> <br>
User registration/SingUp have some constraints e.g. valid Email, Password .

- post('/user/login');
- post('/user/registration');
- get('/user/:id');

<strong> Event API</strong> <br>
Login admin have some constraints 

- get('/events');
- get('/events/:eventType');
- post('/event');
- delete('/event/:id');

## Screenshots
<p>
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/home.PNG" width="400"/> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/services.PNG" width="400"/>
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/login.PNG" width="400"> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/signup.PNG" width="400">
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/logged.PNG" width="400"> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/detailView.PNG" width="400">
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/booking.PNG" width="400"> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/food%26Amount.PNG" width="400">
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/foods.PNG" width="400"> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/totalamount.PNG" width="400">
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/razorpay.PNG" width="400"> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/payment.PNG" width="400">
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/detailsbooking.PNG" width="400"> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/admin_addevent.PNG" width="400">
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/admin-foodlist.PNG" width="400"> <img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/eventedit.PNG" width="400">
<img src="https://github.com/JancyFabiya/fabiyabrothers/blob/main/ss/eventlist.PNG" width="400"> 




</p>

## Environment Variables

First, create a .env file in the project directory. Gives your own value for the fellowing variables

- MONGO_DB_CONNECTION="mongodb://localhost/your_database"
- JWT_PRIVATE_KEY="Define_your_key"

Open the .env.test file in the project directory and change the MONGO_DB_CONNECTION variable

- MONGO_DB_CONNECTION="mongodb://localhost/your_test_database"

## Available Scripts

In the project directory, you can run:

### `npm i`

This command will install all the dependency packages in the node_modules directory.

### `npm run dev`

Runs the app in the development mode with nodemon.<br />
Call the API with [http://localhost:8000](http://localhost:8000).

### `npm start`

Runs the app in the production mode.<br />
Call the API with [http://localhost:8000](http://localhost:8000).

### `npm test`

Runs the test and shows the test result. The result shows how many Test suites, how many tests are passed and how many tests are failed.<br />

### Open [Front-End Code](https://github.com/asadhameed/event-management-frontend)