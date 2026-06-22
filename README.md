# AI Travel Planner

## Project Overview

AI Travel Planner is a full-stack MERN application that helps users generate personalized travel itineraries using Google's Gemini AI.

Users can create trips by providing destination, duration, budget preferences, and interests. The AI generates:

* Day-wise travel itinerary
* Budget estimation
* Hotel recommendations

Users can further customize trips by editing trip details, adding activities, deleting activities, and regenerating specific itinerary days with custom instructions.



# Features

## Authentication & Authorization

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* User-specific data isolation
* Secure access to trip management features


## AI Trip Generation

Generate travel plans based on:

* Destination
* Number of Days
* Budget Tier (Low / Medium / High)
* Interests :

    Example -

    * Food
    * Culture
    * Shopping
    * Adventure
    * Nature


## AI Generated Itinerary

Produces:

* Day-wise itinerary
* Activity descriptions
* Activity costs

Example:

### Day 1

* Visit Senso-ji Temple
* Explore Asakusa Street Food

### Day 2

* Tokyo Skytree
* Akihabara Shopping


## Budget Estimation

Automatically estimates:

* Flight Cost
* Hotel Cost
* Food Cost
* Activity Cost
* Total Cost


## Hotel Recommendations

AI suggests hotels based on:

* Destination
* Budget Preference
* Traveler Ratings

Example:

* Hotel Sakura Tokyo
* Shinjuku Grand Hotel
* Tokyo Imperial Palace Hotel


## Trip Management

Users can:

* View Trips
* Search Trips
* Delete Trips
* Regenerate Entire Trip


## Editable Itinerary

Users can:

### Add Activity

Add custom activities to any day.

### Delete Activity

Remove unwanted activities.

### Regenerate Specific Day

Provide custom instructions such as:

* More outdoor activities
* Replace museums with shopping
* Add adventure activities

The AI regenerates only the selected day without affecting the rest of the trip.

## Final result

Displays:

* Total Trips
* Total Destinations
* Total Budget

# Custom Feature

## Dynamic AI Trip Editing

Unlike traditional itinerary generators, users can continuously improve their trip after generation.

Features include:

* Editing trip information
* AI-powered trip regeneration
* Activity management
* Day-specific AI regeneration

This creates a flexible and personalized travel planning experience.

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS


## Backend

* Node.js
* Express.js


## Database

* MongoDB
* Mongoose


## AI

* Google Gemini 2.5 Flash


## Authentication

* JWT (JSON Web Token)
* bcryptjs

 
# 

# High-Level Architecture

Frontend (React + Tailwind)

↓

Axios API Calls

↓

Backend (Node.js + Express)

↓

Authentication Middleware (JWT)

↓

Controllers

↓

Gemini AI Service

↓

MongoDB Database

↓

Response Returned to Frontend


# Authentication & Authorization Approach

## Authentication

1. User registers an account.
2. Password is hashed using bcrypt.
3. User logs in.
4. JWT token is generated.
5. Token is stored on client side.
6. Protected API requests include token.


## Authorization

Every trip is linked to:

```js
user: req.user._id
```

All trip operations validate ownership:

```js
Trip.findOne({
    _id: req.params.tripId,
    user: req.user._id
});
```

This prevents users from accessing or modifying other users' data.



# AI Agent Design

## Purpose

Generate personalized travel plans.

### Inputs

* Destination
* Duration
* Budget Tier
* Interests

### Outputs

* Day-wise itinerary
* Budget estimation
* Hotel recommendations


## Day Regeneration Agent

Generates only a specific day based on:

* Existing trip information
* User instructions

Example:

```text
Regenerate Day 3 with more outdoor activities
```

This minimizes AI cost while preserving the rest of the itinerary.



# Setup Instructions

## Local Setup

### Clone Repository

```bash
git clone <this-repo-url>
```

### Backend Setup

```bash
cd backend
npm install
```

Create:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

Run:

```bash
npm start
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

---

# Deployed Setup

Frontend:

```text
Deploy on Vercel
```

Backend:

```text
Deploy on Render
```

Database:

```text
MongoDB Atlas
```

Environment variables should be configured in the deployment platform.

---

# Key Design Decisions

## MongoDB Embedded Structure

Stored itinerary inside Trip document:

Benefits:

* Faster reads
* Simpler queries
* Easier updates

Trade-off:

* Larger document size for long trips

---

## JWT Authentication

Benefits:

* Stateless authentication
* Easy frontend integration

Trade-off:

* Requires token management on client side

---

## AI Day Regeneration

Benefits:

* Lower AI usage cost
* Faster responses

Trade-off:

* Requires additional prompt engineering

---

# Known Limitations

* Hotel recommendations are AI-generated and not live booking data.
* Budget estimates are approximate.
* Activity costs depend on AI-generated values.
* Gemini API may occasionally return rate-limit or high-demand errors.
* Real-time flight pricing is not integrated.
* Weather-aware itinerary generation is not implemented.

---


AI Travel Planner - MERN + Gemini AI