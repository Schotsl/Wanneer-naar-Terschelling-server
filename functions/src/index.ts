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
    return { id, ...data };
  });

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