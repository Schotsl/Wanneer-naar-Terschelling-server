const bodyparser = require('body-parser');
const functions = require('firebase-functions');
const validator = require('validator');
const express = require('express');
const dotenv = require('dotenv');
const admin = require('firebase-admin');

dotenv.config();

// Initialize app using local credentials 
admin.initializeApp();

// Create firestore database
const database = admin.firestore();

// Import types
import { Request, Response, NextFunction } from 'express';

// Create express app
const app = express();

function generateString(day: number, month: number, year: number) {
  const offset = month + 1;

  const dayString = day.toString().padStart(2, `0`);
  const monthString = offset.toString().padStart(2, `0`);

  return `${dayString}-${monthString}-${year}`;
}

// Cors fix
app.use(bodyparser.json());
app.use(function (request: Request, response: Response, next: NextFunction) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", "*");
  response.header("Access-Control-Allow-Headers", "*");
  next();
});

app.post('/api/v1/vacation', async (request: Request, response: Response) => {
  // Store body properties in variables
  const end = request.body.end;
  const title = request.body.title;
  const color = request.body.color;
  const start = request.body.start;

  const holst = request.body.family.holst;
  const other = request.body.family.other;
  const hartman = request.body.family.hartman;
  const steenmeijer = request.body.family.steenmeijer;

  // Validate all the properties
  if (
    holst === undefined ||
    other === undefined ||
    hartman === undefined ||
    steenmeijer === undefined ||
    typeof (holst) !== `boolean` ||
    typeof (other) !== `boolean` ||
    typeof (hartman) !== `boolean` ||
    typeof (steenmeijer) !== `boolean`
  ) {
    response.status(400);
    response.send(`Invalid 'family' property`);
    return;
  }

  if (!title || !validator.isLength(title, { 'min': 3, 'max': 255 }) || !validator.isAscii(title)) {
    response.status(400);
    response.send(`Invalid 'title' property`);
    return;
  }

  if (!color || !validator.isHexColor(color)) {
    response.status(400);
    response.send(`Invalid 'color' property`);
    return;
  }

  if (!start || !validator.isDate(start, `DD-MM-YYYY`)) {
    response.status(400);
    response.send(`Invalid 'start' property`);
    return;
  }

  if (!end || !validator.isDate(end, `DD-MM-YYYY`)) {
    response.status(400);
    response.send(`Invalid 'end' property`);
    return;
  }

  // Transform properties into one object
  const vacation = {
    end: end,
    title: title,
    color: color,
    start: start,
    family: {
      holst,
      other,
      hartman,
      steenmeijer
    }
  }

  // Save the object in the database
  const document = await database.collection('vacation').add(vacation);

  // Return the object with an ID to the user
  const id = document.id;
  response.status(200)
  response.send({ id, ...vacation });
  return;
});

app.get('/api/v1/vacation', async (request: Request, response: Response) => {
  // Fetch the collection
  const collection = await database.collection('vacation').get();

  // Fetch every document and create an array
  const documents = collection.docs.map((document: any) => {
    const data = document.data();
    const id = document.id;

    const color = data.color;
    const start = data.start;
    const title = data.title;
    const end = data.end;

    return { id, color, start, title, end };
  });

  // START OF TEST
  const upcomingArray = [];

  for (let i = 0; i < 3; i ++) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const modifiedMonth = currentDate.setMonth(currentMonth + i);
    
    upcomingArray.push(new Date(modifiedMonth));
  }

  const trashArray = [
    {
      title: "Restafval",
      dates: [[2, 16, 30], [13, 27], [12, 26], [9, 23], [7, 23], [4, 18], [2, 16, 30], [13, 27], [10, 24], [8, 22], [5, 19], [3, 17, 31]]
    },
    {
      title: "Tuinafval",
      dates: [[13, 27], [10, 24], [9, 23], [6, 20, 11, 25], [4, 18, 30, 11, 25], [15, 29, 8, 22], [13, 27, 6, 20], [10, 24, 3, 17, 31], [7, 21, 14, 28], [5, 19, 12, 26], [2, 16, 30], [14, 28]]
    },
    {
      title: "Papier",
      dates: [[4, 29], [26], [25], [22], [20], [17], [15], [12], [9], [7], [4], [2, 30]]
    }
  ];

  upcomingArray.forEach((upcomingDate) => {
    const yearNumber = upcomingDate.getFullYear();
    const monthNumber = upcomingDate.getMonth();

    trashArray.forEach((trashObject) => {
      const dateArray = trashObject.dates;

      dateArray[monthNumber].forEach((dayNumber) => {
        documents.push({
          'id': null,
          'color': '#fffff',
          'title': trashObject.title,
          'end': generateString(dayNumber, monthNumber, yearNumber),
          'start': generateString(dayNumber, monthNumber, yearNumber),
        });
      });
    });
  });
  // END OF TEST

  // Return the object to the user
  response.status(200)
  response.send(documents);
  return;
});

app.get('/api/v1/vacation/:id', async (request: Request, response: Response) => {
  // Fetch the document ID
  const id = request.params.id;

  // Fetch the object and existance
  const document = await database.collection('vacation').doc(id);
  const snapshot = await document.get();

  // Check if snapshot exists
  if (!snapshot.exists) {
    response.status(404);
    response.send();
    return;
  }

  // Return the object with an ID to the user
  response.status(200)
  response.send({ id, ...snapshot.data() });
  return;
});

app.put('/api/v1/vacation/:id', async (request: Request, response: Response) => {
  // Store body properties in variables
  const id = request.params.id;
  const end = request.body.end;
  const title = request.body.title;
  const color = request.body.color;
  const start = request.body.start;

  const holst = request.body.family.holst;
  const other = request.body.family.other;
  const hartman = request.body.family.hartman;
  const steenmeijer = request.body.family.steenmeijer;

  // Validate all the properties
  if (
    holst === undefined ||
    other === undefined ||
    hartman === undefined ||
    steenmeijer === undefined ||
    typeof (holst) !== `boolean` ||
    typeof (other) !== `boolean` ||
    typeof (hartman) !== `boolean` ||
    typeof (steenmeijer) !== `boolean`
  ) {
    response.status(400);
    response.send(`Invalid 'family' property`);
    return;
  }

  if (!title || !validator.isLength(title, { 'min': 3, 'max': 255 }) || !validator.isAscii(title)) {
    response.status(400);
    response.send(`Invalid 'title' property`);
    return;
  }

  if (!color || !validator.isHexColor(color)) {
    response.status(400);
    response.send(`Invalid 'color' property`);
    return;
  }

  if (!start || !validator.isDate(start, `DD-MM-YYYY`)) {
    response.status(400);
    response.send(`Invalid 'start' property`);
    return;
  }

  if (!end || !validator.isDate(end, `DD-MM-YYYY`)) {
    response.status(400);
    response.send(`Invalid 'end' property`);
    return;
  }

  // Transform properties into one object
  const vacation = {
    end: end,
    title: title,
    color: color,
    start: start,
    family: {
      holst,
      other,
      hartman,
      steenmeijer
    }
  }

  // Update the object
  const document = await database.collection('vacation').doc(id);
  await document.update(vacation);

  // Return the object with an ID to the user
  response.status(200)
  response.send({ id, ...vacation });
  return;
});

app.delete('/api/v1/vacation/:id', async (request: Request, response: Response) => {
  // Fetch the document ID
  const id = request.params.id;

  // Fetch the object and existance
  const document = await database.collection('vacation').doc(id);
  const snapshot = await document.get();

  // Check if snapshot exists
  if (!snapshot.exists) {
    response.status(404);
    response.send();
    return;
  }

  // If the object exists delete it
  await document.delete();

  // Return 204 No content after deletion
  response.status(204)
  response.send();
  return;
});

exports.app = functions.https.onRequest(app);