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
import { Request, Response } from 'express';

// Create express app
const app = express();

app.post('/api/v1/vacation', async (request: Request, response: Response) => {
  // Store body properties in variables
  const name = request.body.name;
  const color = request.body.color;
  const start = request.body.start;
  const ending = request.body.ending;

  // Validate all the properties
  if (!validator.isLength(name, {'min': 3, 'max': 255}) || !validator.isAscii(name)) {
    response.status(400);
    response.send(`Invalid 'name' property`);
    return;
  }

  if (!validator.isHexColor(color)) {
    response.status(400);
    response.send(`Invalid 'color' property`);
    return;
  }

  if (!validator.isDate(start, `MM/DD/YYYY`)) {
    response.status(400);
    response.send(`Invalid 'start' property`);
    return;
  }

  if (!validator.isDate(ending, `MM/DD/YYYY`)) {
    response.status(400);
    response.send(`Invalid 'ending' property`);
    return;
  }

  // Transform properties into one object
  const vacation = {
    name: name,
    color: color,
    start: start,
    ending: ending
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
  // Fetch the collection by name
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

exports.app = functions.https.onRequest(app);